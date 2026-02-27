import React, { useState, useEffect } from "react";
import { LineChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SearchService } from "../search-service";
import { SearchResult } from "../types";

interface SearchAnalyticsProps {
  className?: string;
}

interface AnalyticsData {
  totalSearches: number;
  averageLatency: number;
  successRate: number;
  popularQueries: string[];
  trends: Array<{
    date: string;
    searches: number;
    averageLatency: number;
  }>;
}

export const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({ className = "" }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalSearches: 0,
    averageLatency: 0,
    successRate: 100,
    popularQueries: [],
    trends: []
  });

  const searchService = new SearchService();

  useEffect(() => {
    // Simulate analytics data collection
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        totalSearches: prev.totalSearches + Math.floor(Math.random() * 5),
        averageLatency: Math.max(100, Math.random() * 500),
        popularQueries: updatePopularQueries(prev.popularQueries)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    trend?: "up" | "down" | "stable";
    details?: string;
  }> = ({ title, value, trend, details }) => (
    <div className={`metric-card ${trend}`}>
      <div className="metric-header">
        <h4>{title}</h4>
        <span className={`trend-indicator ${trend}`}>
          {trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️"}
        </span>
      </div>
      <div className="metric-value">
        {value}
      </div>
      {details && (
        <div className="metric-details">
          {details}
        </div>
      )}
    </div>
  );

  const SearchTrends: React.FC = () => {
    const data = analyticsData.trends;
    
    return (
      <div className="search-trends">
        <h3>Search Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, bottom: 40 }}>
            <CartesianGrid strokeDasharray="#e0e0f" />
            <XAxis dataKey="date" />
            <YAxis dataKey="searches" />
            <Tooltip />
            <Legend />
            <LineChart type="monotone" dataKey="searches" stroke="#8884d8" />
            <LineChart type="monotone" dataKey="latency" stroke="#82c91e" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

  return (
    <div className={`search-analytics ${className}`}>
      <h2>Search Analytics</h2>
      <div className="metrics-grid">
        <MetricCard title="Total Searches" value={analyticsData.totalSearches} />
        <MetricCard title="Average Latency" value={`${analyticsData.averageLatency}ms`} />
        <MetricCard title="Success Rate" value={`${analyticsData.successRate}%`} />
        <MetricCard title="Popular Queries" value={analyticsData.popularQueries.length} />
      </div>
      <SearchTrends />
    </div>
  );
};
