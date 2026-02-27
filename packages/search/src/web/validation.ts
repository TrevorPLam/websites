import React from "react";
import { z } from "zod";
import { RepositorySearchService } from "../search-service";
import { SearchQuery, SearchResult } from "../types";

// Schema for search parameters
const searchQuerySchema = z.object({
  query: z.string().min(1).max(500),
  filters: z.object({
    fileTypes: z.array(z.string()).optional(),
    packages: z.array(z.string()).optional(),
    types: z.array(z.enum(["function", "class", "interface", "variable"])).optional()
  }).optional(),
  options: z.object({
    top: z.number().min(1).max(100),
    threshold: z.number().min(0).max(1.0),
    includeContext: z.boolean().default(false)
  }).optional()
});

// Schema for filter parameters
const searchFiltersSchema = z.object({
  fileTypes: z.array(z.string()).optional(),
  packages: z.array(z.string()).optional(),
  types: z.array(z.enum(["function", "class", "interface", "variable"])).optional()
}).optional()
}).optional());

// Schema for search options
const searchOptionsSchema = z.object({
  top: z.number().min(1).max(100),
  threshold: z.number().min(0).max(1.0),
  includeContext: z.boolean().default(false),
}).optional()
}).optional();

export const validateSearchQuery = (query: unknown): SearchQuery => {
  try {
    return searchQuerySchema.parse(query);
  } catch (error) {
    throw new Error(`Invalid search query: ${error.message}`);
  }
};

export const validateSearchFilters = (filters: unknown): SearchFilters => {
  try {
    return searchFiltersSchema.parse(filters);
  } catch (error) {
    throw new Error(`Invalid filters: ${error.message}`);
  }
};

export const validateSearchOptions = (options: unknown): SearchOptions => {
  try {
    return searchOptionsSchema.parse(options);
  } catch (error) {
    throw new Error(`Invalid search options: ${error.message}`);
  }
};

export const validateUserAuth = (auth: unknown): UserAuth => {
  try {
    return UserAuthSchema.parse(auth);
  } catch (error) {
    throw new Error(`Invalid auth: ${error.message}`);
  }
};

export const validateSearchPageState = (state: unknown): SearchPageState => {
  const errors: string[] = [];
  
  if (!state.query.trim()) {
    errors.push("Query cannot be empty");
  }
  
  if (!validateSearchQuery(state.query)) {
    errors.push("Invalid query format");
  }
  
  if (!validateSearchOptions(state.options)) {
    errors.push("Invalid options configuration");
  }
  
  if (!validateSearchFilters(state.filters)) {
    errors.push("Invalid filter configuration");
  }
  
  return errors.length === 0;
};
