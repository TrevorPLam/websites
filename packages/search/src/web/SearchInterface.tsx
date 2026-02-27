import React, { useState, useEffect } from "react";
import { RepositorySearchService } from "../search-service";
import { SearchQuery, SearchResult } from "../types";

export const SearchInterface: React.FC = ({ className = "" }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [options, setOptions] = useState<SearchOptions>({
    top: 10,
    threshold: 0.5,
    includeContext: false
  });

  const searchService = new RepositorySearchService();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    try {
      const searchResults = await searchService.search({
        query,
        filters,
        options
      });
      
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`search-interface ${className}`}>
      <div className="search-header">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repository..."
            className="search-input"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="search-button"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="fileTypeFilter">File Type:</label>
            <select
              id="fileTypeFilter"
              value={filters.fileTypes?.[0] || ""}
              onChange={(e) => setFilters({
                ...filters,
                fileTypes: e.target.value ? [e.target.value] : []
              })}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="*.ts">TypeScript</option>
              <option value="*.tsx">TypeScript React</option>
              <option value="*.js">JavaScript</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="packageFilter">Packages:</label>
            <input
              type="text"
              value={filters.packages?.join(", ") || ""}
              onChange={(e) => setFilters({
                ...filters,
                packages: e.target.value ? e.target.value.split(",") : []
              })}
              placeholder="Comma-separated packages"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="typeFilter">Types:</label>
            <select
              id="typeFilter"
              value={filters.types?.join(", ") || ""}
              onChange={(e) => setFilters({
                ...filters,
                types: e.target.value ? e.target.value.split(",") : []
              })}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="function">Functions</option>
              <option value="class">Classes</option>
              <option value="interface">Interfaces</option>
              <option value="variable">Variables</option>
            </select>
          </div>
        </div>
        
        <div className="search-options">
          <div className="option-group">
            <label htmlFor="topResults">Results:</label>
            <input
              type="number"
              value={options.top}
              onChange={(e) => setOptions({
                ...options,
                top: parseInt(e.target.value)
              })}
              min="1"
              max="100"
              className="option-input"
            />
          </div>
          
          <div className="option-group">
            <label htmlFor="threshold">Threshold:</label>
            <input
              type="number"
              value={options.threshold}
              onChange={(e) => setOptions({
                ...options,
                threshold: parseFloat(e.target.value)
              })}
              min="0"
              max="1"
              step="0.1"
              className="option-input"
            />
          </div>
          
          <div className="option-group">
            <label htmlFor="includeContext">Context:</label>
            <input
              type="checkbox"
              checked={options.includeContext}
              onChange={(e) => setOptions({
                ...options,
                includeContext: e.target.checked
              })}
              className="option-checkbox"
            />
          </div>
        </div>
      </div>
      
      <div className="search-results">
        {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching repository...</p>
        </div>
        )}
        
        {!loading && results.length === 0 && query && (
          <div className="no-results">
            <p>No results found for "{query}"</p>
            <p>Try different keywords or adjust filters</p>
          </div>
        )}
        
        {!loading && results.length > 0 && (
          <div className="results-list">
            {results.map((result, index) => (
              <div
                key={result.id}
                className="search-result"
                onClick={() => console.log("Navigate to:", result.filePath, ":", result.startLine)}
              >
                <div className="result-header">
                  <h3>{result.filePath}</h3>
                  <span className="line-numbers">
                    Lines {result.startLine}-{result.endLine}
                  </span>
                  <span className="score">
                    Score: {result.score.toFixed(3)}
                  </span>
                </div>
                <div className="result-content">
                  <pre>{result.snippet}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
