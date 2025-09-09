using Microsoft.AspNetCore.Mvc;
using FootballTeamSearch.Services;
using FootballTeamSearch.Models;

namespace FootballTeamSearch.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FootballTeamsController : ControllerBase
    {
        private readonly SearchService _searchService;
        private readonly ILogger<FootballTeamsController> _logger;

        public FootballTeamsController(SearchService searchService, ILogger<FootballTeamsController> logger)
        {
            _searchService = searchService;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<FootballTeam>>> Search(
            [FromQuery] string searchTerm = "",
            [FromQuery] string? column = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(searchTerm))
                {
                    return BadRequest("Search term is required");
                }

                var results = await _searchService.SearchTeamsAsync(searchTerm, column);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching teams");
                return StatusCode(500, "Internal server error occurred while searching");
            }
        }

        [HttpGet("columns")]
        public async Task<ActionResult<IEnumerable<string>>> GetColumns()
        {
            try
            {
                var columns = await _searchService.GetAvailableColumnsAsync();
                return Ok(columns);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting columns");
                return StatusCode(500, "Internal server error occurred while getting columns");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FootballTeam>>> GetAll()
        {
            try
            {
                var results = await _searchService.SearchTeamsAsync("", null);
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all teams");
                return StatusCode(500, "Internal server error occurred while getting teams");
            }
        }
    }
}