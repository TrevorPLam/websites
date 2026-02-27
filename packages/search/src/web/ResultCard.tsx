import React, { useState, useEffect } from "react";
import { SearchResult } from "../types";

interface ResultCardProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
  className?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onClick, className = "" }) => {
  const handleClick = () => {
    onClick(result);
  };

  return (
    <div className={`result-card ${className}`}>
      <div className="result-header">
        <h4>{result.filePath}</h4>
        <span className="line-numbers">
          Lines {result.startLine}-{result.endLine}
        </span>
        <span className="score">
          Score: {result.score.toFixed(3)}
        </span>
        <span className="type-badge">
          {result.metadata.type}
        </span>
      </div>
      
      <div className="result-content">
        <pre className="code-snippet">{result.snippet}</pre>
      </div>
      
      <div className="result-metadata">
        {result.metadata.name && (
          <span className="metadata-item">
            🏷️ {result.metadata.name}
          </span>
        )}
        {result.metadata.complexity && (
          <span className="metadata-item">
            🧮 {result.metadata.complexity} complexity
          </span>
        )}
        {result.metadata.dependencies && result.metadata.dependencies.length > 0 && (
          <span className="metadata-item">
            🔗 {result.metadata.dependencies.length} deps
          </span>
        )}
      </div>
    </div>
  );
};
