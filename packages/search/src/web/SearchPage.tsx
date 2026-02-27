import React, { useState, useEffect } from "react";
import { z } from "zod";
import { RepositorySearchService } from "../search-service";
import { SearchQuery, SearchResult } from "../types";

interface SearchPageProps {
  className?: string;
}

interface SearchPageState {
  query: string;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  options: SearchOptions;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export const SearchPage: React.FC<SearchPageProps> = ({ className = "" }) => {
  const [state, setState] = useState<SearchPageState>({
    query: "",
    results: [],
    loading: false,
    error: null,
    filters: {},
    options: {
      top: 10,
      threshold: 0.5,
      includeContext: false
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      hasPrevious: false,
      hasNext: false
    }
  });

  const searchService = new RepositorySearchService();

  const handleSearch = useCallback(async () => {
    if (!state.query.trim()) return;
    
    setState({ loading: true, error: null });
    
    try {
      const results = await searchService.search({
        query: state.query,
        filters: state.filters,
        options: state.options
      });
      
      const totalPages = Math.ceil(results.length / state.options.top);
      
      setState({
        results,
        loading: false,
        error: null,
        pagination: {
          currentPage: 1,
          totalPages,
          hasPrevious: false,
          hasNext: totalPages > 1
        }
      });
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  }, [state.query, state.filters, state.options]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > state.pagination.totalPages) return;
    
    setState(prev => ({
      ...prev,
      pagination: {
        currentPage: newPage,
        hasPrevious: newPage > 1,
        hasNext: newPage < state.pagination.totalPages
      }
    }));
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value ? [value] : prev.filters[filterType] || []
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

  const handleExport = async () => {
    const exportData = {
      query: state.query,
      filters: state.filters,
      options: state.options,
      results: state.results,
      pagination: state.pagination,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json"
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "search-export.json";
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div className={`search-page ${className}`}>
      <div className="search-header">
        <h1>Repository Search</h1>
        <p>Search across {1,668 code files with AI-powered semantic search</p>
      </div>
      
      <div className="search-filters">
        <div className="filter-group">
          <label htmlFor="fileTypeFilter">File Type:</label>
          <select
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
      
      <div className="results-container">
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
              <ResultCard
                key={result.id}
                result={result}
                onClick={() => {
                  console.log("Navigate to:", result.filePath, ":", result.startLine);
                }}
              />
            ))}
          </div>
        )}
        
        {state.results.length > 0 && (
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(state.pagination.currentPage - 1)}
              disabled={!state.pagination.hasPrevious}
            >
              Previous
            </button>
            <span className="page-info">
              Page {state.pagination.currentPage} of {state.pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(state.pagination.currentPage + 1)}
              disabled={!state.pagination.hasNext}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
