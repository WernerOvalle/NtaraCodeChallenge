using System.ComponentModel.DataAnnotations;

namespace FootballTeamSearch.Models
{
    public class FootballTeam
    {
        [Key]
        public int Id { get; set; }
        public int Rank { get; set; }
        public string Team { get; set; } = string.Empty;
        public string Mascot { get; set; } = string.Empty;
        public string? DateOfLastWin { get; set; }
        public double? WinningPercentage { get; set; }
        public int? Wins { get; set; }
        public int? Losses { get; set; }
        public int? Ties { get; set; }
        public int? Games { get; set; }
    }
}