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

  const validateAndFormat = {
    date: (value: any) => {
      if (!value) return 'No data';
      const str = value.toString();
      if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(str) || !isNaN(Date.parse(str))) {
        return str;
      }
      return 'Invalid date';
    },
    
    number: (value: any) => {
      if (value === null || value === undefined) return 'No data';
      if (isNaN(Number(value))) return 'Invalid number';
      return value;
    },
    
    percentage: (value: any) => {
      if (!value) return 'No data';
      if (isNaN(Number(value))) return 'Invalid %';
      return (value / 1000).toFixed(1) + '%';
    },
    
    text: (value: any) => {
      if (!value || value.toString().trim() === '') return 'No data';
      return value;
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
                    <td>{validateAndFormat.number(team.rank)}</td>
                    <td className="team-name">{validateAndFormat.text(team.team)}</td>
                    <td>{validateAndFormat.text(team.mascot)}</td>
                    <td>{validateAndFormat.date(team.dateOfLastWin)}</td>
                    <td>{validateAndFormat.percentage(team.winningPercentage)}</td>
                    <td>{validateAndFormat.number(team.wins)}</td>
                    <td>{validateAndFormat.number(team.losses)}</td>
                    <td>{validateAndFormat.number(team.ties)}</td>
                    <td>{validateAndFormat.number(team.games)}</td>
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