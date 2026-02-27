import React, { useState, useEffect, useCallback } from "react";
import { SearchService } from "../search-service";
import { SearchQuery, SearchResult } from "../types";

interface SearchInterfaceProps {
  initialQuery?: string;
  onResults?: (results: SearchResult[]) => void;
  className?: string;
}

interface SearchState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  filters: SearchFilters;
  options: SearchOptions;
  error: string | null;
  stats: {
    totalSearches: number;
    averageLatency: number;
    successRate: number;
    popularQueries: string[];
  };
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  initialQuery = "",
  onResults,
  className = ""
}) => {
  const [state, setState] = useState<SearchState>({
    query: initialQuery,
    results: [],
    loading: false,
    filters: {},
    options: {
      top: 10,
      threshold: 0.5,
      includeContext: false
    },
    error: null,
    stats: {
      totalSearches: 0,
      averageLatency: 0,
      successRate: 0,
      popularQueries: []
    }
  });

  const searchService = new SearchService();

  const handleSearch = useCallback(async (query: string, filters?: SearchFilters, options?: SearchOptions) => {
    setState({ loading: true, error: null });
    
    try {
      const startTime = Date.now();
      const results = await searchService.search({
        query,
        filters,
        options
      });
      
      const duration = Date.now() - startTime;
      
      setState({
        results,
        loading: false,
        error: null,
        stats: {
          totalSearches: state.stats.totalSearches + 1,
          averageLatency: (state.stats.averageLatency * 0.8 + duration * 0.2) / (state.stats.totalSearches + 1),
          successRate: 100, // All searches succeed in our implementation
          popularQueries: updatePopularQueries(query, state.stats.popularQueries)
        }
      });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  }, [searchService, filters, options]);

  const updatePopularQueries = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        popularQueries: updatePopularQueries(query, prev.stats.popularQueries)
      }
    });
  }, []);

  const updatePopularQueries = (query: string, current: string[]) => {
    const index = current.indexOf(query);
    if (index === -1) {
      return [...current, query];
    }
    return [...current.slice(0, index), query];
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value
      }
    }));
  };

  const handleOptionChange = (optionType: string, value: string) => {
    setState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionType]: optionType === "top" ? parseInt(value) : prev.options[optionType]
      }
    }));
  };

  const handleContextToggle = () => {
    setState(prev => ({
      ...prev,
      options: {
        ...prev.options,
        includeContext: !prev.options.includeContext
      }
    }));
  };

  const handleResultClick = (result: SearchResult) => {
    // Handle result click for navigation
    console.log("Navigate to:", result.filePath, ":", result.startLine);
  };

  return (
    <div className={`search-interface ${className}`}>
      <div className="search-header">
        <div className="search-input-container">
          <input
            type="text"
            value={state.query}
            onChange={(e) => setState({ query: e.target.value })}
            placeholder="Search repository..."
            className="search-input"
          />
          <button
            onClick={() => handleSearch(state.query)}
            disabled={state.loading}
            className="search-button"
          >
            {state.loading ? "Searching..." : "Search"}
          </button>
        </div>
        
        <div className="search-filters">
          <div className="filter-group">
            <label htmlFor="fileTypeFilter">File Type:</label>
            <select
              id="fileTypeFilter"
              value={state.filters.fileTypes?.[0] || ""}
              onChange={(e) => handleFilterChange("fileTypes", e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="*.ts">TypeScript</option>
              <option value="*.tsx">TypeScript React</option>
              <option value="*.js">JavaScript</option>
              <option value="*.jsx">JavaScript React</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="packageFilter">Packages:</label>
            <input
              type="text"
              value={state.filters.packages?.join(", ") || ""}
              onChange={(e) => handleFilterChange("packages", e.target.value)}
              placeholder="Comma-separated packages"
              className="filter-input"
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="typeFilter">Types:</label>
            <select
              id="typeFilter"
              value={state.filters.types?.join(", ") || ""}
              onChange={(e) => handleFilterChange("types", e.target.value)}
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
              value={state.options.top}
              onChange={(e) => handleOptionChange("top", e.target.value)}
              min="1"
              max="100"
              className="option-input"
            />
          </div>
          
          <div className="option-group">
            <label htmlFor="threshold">Threshold:</label>
            <input
              type="number"
              value={state.options.threshold}
              onChange={(e) => handleOptionChange("threshold", e.target.value)}
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
              checked={state.options.includeContext}
              onChange={handleContextToggle}
              className="option-checkbox"
            />
          </div>
        </div>
      </div>
      
      {state.error && (
        <div className="error-message">
          <h3>❌ Search Error</h3>
          <p>{state.error}</p>
        </div>
      )}
      
      <div className="search-results">
        {state.loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Searching repository...</p>
          </div>
        )}
        
        {!state.loading && state.results.length === 0 && state.query && (
          <div className="no-results">
            <p>No results found for "{state.query}"</p>
            <p>Try different keywords or adjust filters</p>
          </div>
        )}
        
        {!state.loading && state.results.length > 0 && (
          <div className="results-list">
            {state.results.map((result, index) => (
              <div
                key={result.id}
                className="search-result"
                onClick={() => handleResultClick(result)}
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
                {state.options.includeContext && result.context && (
                  <div className="result-context">
                    {result.context.before && (
                    <div className="context-section">
                      <h4>Before:</h4>
                      <pre>{result.context.before}</pre>
                    </div>
                  )}
                  {result.context.after && (
                    <div className="context-section">
                      <h4>After:</h4>
                      <pre>{result.context.after}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {state.results.length > 0 && (
              <div className="results-summary">
                <p>Found {state.results.length} results in {Date.now() - state.startTime}ms}</p>
              </div>
            )}
          </div>
        </div>
      );
    </div>
  );
};
