using FootballTeamSearch.Data;
using FootballTeamSearch.Models;
using Microsoft.EntityFrameworkCore;

namespace FootballTeamSearch.Services
{
    public class SearchService
    {
        private readonly FootballContext _context;

        public SearchService(FootballContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FootballTeam>> SearchTeamsAsync(string searchTerm, string? searchColumn = null)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await _context.FootballTeams.Take(20).ToListAsync();
            }

            var query = _context.FootballTeams.AsQueryable();
            var lowerSearchTerm = searchTerm.ToLower();

            if (!string.IsNullOrEmpty(searchColumn))
            {
                query = searchColumn.ToLower() switch
                {
                    "rank" => query.Where(t => t.Rank.ToString().Contains(lowerSearchTerm)),
                    "team" => query.Where(t => t.Team.ToLower().Contains(lowerSearchTerm)),
                    "mascot" => query.Where(t => t.Mascot.ToLower().Contains(lowerSearchTerm)),
                    "dateoflastwin" => query.Where(t => t.DateOfLastWin != null && t.DateOfLastWin.ToLower().Contains(lowerSearchTerm)),
                    "winningpercentage" => query.Where(t => t.WinningPercentage.HasValue && t.WinningPercentage.ToString().Contains(lowerSearchTerm)),
                    "wins" => query.Where(t => t.Wins.HasValue && t.Wins.ToString().Contains(lowerSearchTerm)),
                    "losses" => query.Where(t => t.Losses.HasValue && t.Losses.ToString().Contains(lowerSearchTerm)),
                    "ties" => query.Where(t => t.Ties.HasValue && t.Ties.ToString().Contains(lowerSearchTerm)),
                    "games" => query.Where(t => t.Games.HasValue && t.Games.ToString().Contains(lowerSearchTerm)),
                    _ => SearchAllColumns(query, lowerSearchTerm)
                };
            }
            else
            {
                query = SearchAllColumns(query, lowerSearchTerm);
            }

            return await query.OrderBy(t => t.Rank).ToListAsync();
        }

        private static IQueryable<FootballTeam> SearchAllColumns(IQueryable<FootballTeam> query, string searchTerm)
        {
            return query.Where(t => 
                t.Rank.ToString().Contains(searchTerm) ||
                t.Team.ToLower().Contains(searchTerm) ||
                t.Mascot.ToLower().Contains(searchTerm) ||
                (t.DateOfLastWin != null && t.DateOfLastWin.ToLower().Contains(searchTerm)) ||
                (t.WinningPercentage.HasValue && t.WinningPercentage.ToString().Contains(searchTerm)) ||
                (t.Wins.HasValue && t.Wins.ToString().Contains(searchTerm)) ||
                (t.Losses.HasValue && t.Losses.ToString().Contains(searchTerm)) ||
                (t.Ties.HasValue && t.Ties.ToString().Contains(searchTerm)) ||
                (t.Games.HasValue && t.Games.ToString().Contains(searchTerm))
            );
        }

        public Task<IEnumerable<string>> GetAvailableColumnsAsync()
        {
            var columns = new List<string>
            {
                "All Columns",
                "Rank",
                "Team",
                "Mascot",
                "Date of Last Win",
                "Winning Percentage",
                "Wins",
                "Losses",
                "Ties",
                "Games"
            };
            return Task.FromResult<IEnumerable<string>>(columns);
        }
    }
}