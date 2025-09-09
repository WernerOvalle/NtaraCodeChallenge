using Microsoft.EntityFrameworkCore;
using FootballTeamSearch.Models;

namespace FootballTeamSearch.Data
{
    public class FootballContext : DbContext
    {
        public FootballContext(DbContextOptions<FootballContext> options) : base(options) { }

        public DbSet<FootballTeam> FootballTeams { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FootballTeam>()
                .HasIndex(t => t.Team);
            
            modelBuilder.Entity<FootballTeam>()
                .HasIndex(t => t.Mascot);
        }
    }
}