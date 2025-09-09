using CsvHelper;
using CsvHelper.Configuration;
using FootballTeamSearch.Data;
using FootballTeamSearch.Models;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace FootballTeamSearch.Services
{
    public class DataSeedService
    {
        private readonly FootballContext _context;
        private readonly ILogger<DataSeedService> _logger;

        public DataSeedService(FootballContext context, ILogger<DataSeedService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task SeedDataAsync()
        {
            if (await _context.FootballTeams.AnyAsync())
            {
                _logger.LogInformation("Data already seeded");
                return;
            }

            try
            {
                var csvPath = Path.Combine(Directory.GetCurrentDirectory(), "CollegeFootballTeamWinsWithMascots.csv");
                
                if (!File.Exists(csvPath))
                {
                    _logger.LogError("CSV file not found at: {Path}", csvPath);
                    return;
                }

                using var reader = new StreamReader(csvPath);
                using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);

                var config = new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    HeaderValidated = null,
                    MissingFieldFound = null
                };
                csv.Context.RegisterClassMap<FootballTeamMap>();

                var records = csv.GetRecords<FootballTeamCsv>().ToList();
                
                var teams = new List<FootballTeam>();
                foreach (var record in records)
                {
                    if (string.IsNullOrEmpty(record.Team)) continue;

                    var team = new FootballTeam
                    {
                        Rank = record.Rank,
                        Team = record.Team.Trim(),
                        Mascot = record.Mascot?.Trim() ?? string.Empty,
                        DateOfLastWin = record.DateOfLastWin?.Trim(),
                        WinningPercentage = ParseDoubleOrNull(record.WinningPercentage),
                        Wins = ParseIntOrNull(record.Wins),
                        Losses = ParseIntOrNull(record.Losses),
                        Ties = ParseIntOrNull(record.Ties),
                        Games = ParseIntOrNull(record.Games)
                    };
                    
                    teams.Add(team);
                }

                await _context.FootballTeams.AddRangeAsync(teams);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully seeded {Count} football teams", teams.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error seeding data");
                throw;
            }
        }

        private static double? ParseDoubleOrNull(string? value)
        {
            if (string.IsNullOrWhiteSpace(value) || value == "NULL" || value == "??") return null;
            if (double.TryParse(value, out var result))
            {
                // The CSV contains percentages in decimal format (0.73663), so return as is
                return result;
            }
            return null;
        }

        private static int? ParseIntOrNull(string? value)
        {
            if (string.IsNullOrWhiteSpace(value) || value == "NULL" || value == "??") return null;
            return int.TryParse(value, out var result) ? result : null;
        }
    }

    public class FootballTeamCsv
    {
        public int Rank { get; set; }
        public string Team { get; set; } = string.Empty;
        public string? Mascot { get; set; }
        public string? DateOfLastWin { get; set; }
        public string? WinningPercentage { get; set; }
        public string? Wins { get; set; }
        public string? Losses { get; set; }
        public string? Ties { get; set; }
        public string? Games { get; set; }
    }

    public class FootballTeamMap : ClassMap<FootballTeamCsv>
    {
        public FootballTeamMap()
        {
            Map(m => m.Rank).Name("Rank");
            Map(m => m.Team).Name("Team");
            Map(m => m.Mascot).Name("Mascot");
            Map(m => m.DateOfLastWin).Name("Date of Last Win");
            Map(m => m.WinningPercentage).Name("Winning Percetnage"); // Note: keeping original typo from CSV
            Map(m => m.Wins).Name("Wins");
            Map(m => m.Losses).Name("Losses");
            Map(m => m.Ties).Name("Ties");
            Map(m => m.Games).Name("Games");
        }
    }
}