'use client';

import React from 'react';
import { SystemMetrics } from '../model/system.model';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface MetricsChartProps {
  metrics: SystemMetrics[];
  color: string;
  unit: string;
  loading?: boolean;
}

export function MetricsChart({
  metrics,
  color,
  unit,
  loading = false,
}: MetricsChartProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  // Simple chart implementation using SVG
  const width = 400;
  const height = 200;
  const padding = 40;
  
  const maxValue = Math.max(...metrics.map(m => m.value));
  const minValue = Math.min(...metrics.map(m => m.value));
  const range = maxValue - minValue || 1;
  
  const points = metrics.map((metric, index) => {
    const x = padding + (index / (metrics.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((metric.value - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative">
      <svg width={width} height={height} className="w-full h-auto">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = height - padding - (percent / 100) * (height - 2 * padding);
          return (
            <g key={percent}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {percent}%
              </text>
            </g>
          );
        })}
        
        {/* Chart line */}
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Data points */}
        {metrics.map((metric, index) => {
          const x = padding + (index / (metrics.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((metric.value - minValue) / range) * (height - 2 * padding);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              className="hover:r-4 transition-all"
            />
          );
        })}
        
        {/* Axes */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#374151"
          strokeWidth="2"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#374151"
          strokeWidth="2"
        />
      </svg>
      
      {/* Current value */}
      {metrics.length > 0 && (
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded border border-gray-200">
          <span className="text-sm font-medium" style={{ color }}>
            {metrics[metrics.length - 1].value.toFixed(1)} {unit}
          </span>
        </div>
      )}
    </div>
  );
}
