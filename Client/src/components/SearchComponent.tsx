import React, { useState, useEffect } from 'react';
import './SearchComponent.css';

interface FootballTeam {
  id: number;
  rank: number;
  team: string;
  mascot: string;
  dateOfLastWin?: string;
  winningPercentage?: number;
  wins?: number;
  losses?: number;
  ties?: number;
  games?: number;
}

const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColumn, setSelectedColumn] = useState<string>('All Columns');
  const [searchResults, setSearchResults] = useState<FootballTeam[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5260/api' 
    : '/api';

  useEffect(() => {
    fetchAvailableColumns();
    fetchAllTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAvailableColumns = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/footballteams/columns`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const columns = await response.json();
      setAvailableColumns(columns);
    } catch (err) {
      console.error('Error fetching columns:', err);
      setError('Failed to load search columns');
    }
  };

  const fetchAllTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/footballteams`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const teams = await response.json();
      setSearchResults(teams);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const columnParam = selectedColumn === 'All Columns' ? '' : `&column=${encodeURIComponent(selectedColumn.toLowerCase().replace(/\s+/g, ''))}`;
      const response = await fetch(`${API_BASE_URL}/footballteams/search?searchTerm=${encodeURIComponent(searchTerm)}${columnParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const results = await response.json();
      setSearchResults(results);
      
      if (results.length === 0) {
        setError('No results found for your search');
      }
    } catch (err) {
      console.error('Error searching:', err);
      setError('Failed to search teams. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <h1>Football Team Search</h1>
      <p className="subtitle">Search college football teams and their statistical records</p>
      
      <div className="search-controls">
        <div className="input-group">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter search term..."
            className="search-input"
            disabled={isLoading}
          />
          <button 
            onClick={handleSearch} 
            className="search-button"
            disabled={isLoading || !searchTerm.trim()}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <div className="column-selector">
          <label htmlFor="column-select">Search in:</label>
          <select
            id="column-select"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="column-select"
            disabled={isLoading}
          >
            {availableColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading && <div className="loading-message">Loading...</div>}

      {!isLoading && searchResults.length > 0 && (
        <div className="results-container">
          <h2>Search Results ({searchResults.length} teams found)</h2>
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Mascot</th>
                  <th>Date of Last Win</th>
                  <th>Winning %</th>
                  <th>Wins</th>
                  <th>Losses</th>
                  <th>Ties</th>
                  <th>Games</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((team) => (
                  <tr key={team.id}>
                    <td>{team.rank}</td>
                    <td className="team-name">{team.team}</td>
                    <td>{team.mascot}</td>
                    <td>{team.dateOfLastWin || 'N/A'}</td>
                    <td>{team.winningPercentage ? (team.winningPercentage * 100).toFixed(2) + '%' : 'N/A'}</td>
                    <td>{team.wins ?? 'N/A'}</td>
                    <td>{team.losses ?? 'N/A'}</td>
                    <td>{team.ties ?? 'N/A'}</td>
                    <td>{team.games ?? 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;