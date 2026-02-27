import React, { useState, useEffect } from "react";
import { z } from "zod";
import { RepositorySearchService } from "../search-service";
import { SearchQuery, SearchResult } from "../types";

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, className = "" }) => {
  const handleFilterChange = (filterType: string, value: string) => {
    onFiltersChange(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value ? [value] : prev.filters[filterType] || []
      }
    });
  };

  return (
    <div className={`filter-panel ${className}`}>
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label htmlFor="fileTypeFilter">File Type:</label>
        <select
          id="fileTypeFilter"
          value={filters.fileTypes?.[0] || ""}
          onChange={(e) => handleFilterChange("fileType", e.target.value)}
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
          onChange={(e) => handleFilterChange("packages", e.target.value)}
          className="filter-input"
        />
      </div>
      
      <div className="filter-group">
        <label htmlFor="typeFilter">Types:</label>
        <select
          id="typeFilter"
          value={filters.types?.join(", ") || ""}
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
  );
};

const SearchFilters = z.object({
  fileTypes: z.array(z.string()).optional(),
  packages: z.array(z.string()).optional(),
  types: z.array(z.enum(["function", "class", "interface", "variable"])).optional()
});

export defaultFilterPanel: FilterPanel = React.FC<FilterPanelProps> = ({
  filters: defaultFilters,
  onFiltersChange,
  className: ""
});

export defaultSearchPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="search-page">
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        className="filter-panel"
      />
      
      <SearchInterface
        query={query}
        results={results}
        loading={loading}
        filters={filters}
        options={options}
        className="search-interface"
      />
    </FilterPanel>
  );
};
