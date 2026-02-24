/**
 * @file packages/reports/src/templates/WeeklyReport.tsx
 * @summary Configuration and implementation for WeeklyReport.
 * @description Module providing specific functionality within the monorepo architecture.
 * @security none
 * @adr none
 * @requirements none
 */

import React from 'react';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [{ src: 'Helvetica' }],
});

export interface WeeklyReportProps {
  businessName: string;
  logoUrl?: string;
  primaryColor: string;
  reportPeriod: string;
  stats: {
    totalLeads: number;
    qualifiedLeads: number;
    warmLeads: number;
    coldLeads: number;
    totalBookings: number;
    completedBookings: number;
    newThisWeek: number;
    avgScore: number;
  };
  topLeads: Array<{
    name: string;
    email: string;
    score: number;
    source: string;
    date: string;
  }>;
  sourceBreakdown: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  weeklyTrend: Array<{
    day: string;
    count: number;
  }>;
}

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, color: '#111827' },
  heading: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#6b7280', marginBottom: 14 },
  section: { marginTop: 14 },
  sectionTitle: { fontSize: 12, fontWeight: 700, marginBottom: 6 },
  cardRow: { flexDirection: 'row', gap: 8 },
  card: { flex: 1, border: 1, borderColor: '#e5e7eb', borderRadius: 6, padding: 10 },
  statValue: { fontSize: 20, fontWeight: 700 },
  statLabel: { fontSize: 9, color: '#6b7280' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottom: 1,
    borderColor: '#f3f4f6',
  },
});

// Type assertion to bypass TypeScript JSX issues with @react-pdf/renderer
const PDFDocument = Document as any;
const PDFPage = Page as any;
const PDFView = View as any;
const PDFText = Text as any;

export const WeeklyReportDocument: React.FC<WeeklyReportProps> = (props) => {
  return React.createElement(
    PDFDocument,
    {},
    React.createElement(
      PDFPage,
      { size: 'A4', style: styles.page },
      React.createElement(
        PDFView,
        { style: { borderLeft: 4, borderColor: props.primaryColor, paddingLeft: 10 } },
        React.createElement(PDFText, { style: styles.heading }, props.businessName),
        React.createElement(
          PDFText,
          { style: styles.subtitle },
          `Weekly Lead Report · ${props.reportPeriod}`
        )
      ),
      React.createElement(
        PDFView,
        { style: styles.section },
        React.createElement(PDFText, { style: styles.sectionTitle }, 'Overview'),
        React.createElement(
          PDFView,
          { style: styles.cardRow },
          React.createElement(
            PDFView,
            { style: styles.card },
            React.createElement(
              PDFText,
              { style: styles.statValue },
              props.stats.totalLeads.toString()
            ),
            React.createElement(PDFText, { style: styles.statLabel }, 'Total leads')
          ),
          React.createElement(
            PDFView,
            { style: styles.card },
            React.createElement(
              PDFText,
              { style: styles.statValue },
              props.stats.totalBookings.toString()
            ),
            React.createElement(PDFText, { style: styles.statLabel }, 'Total bookings')
          ),
          React.createElement(
            PDFView,
            { style: styles.card },
            React.createElement(
              PDFText,
              { style: styles.statValue },
              props.stats.avgScore.toString()
            ),
            React.createElement(PDFText, { style: styles.statLabel }, 'Average lead score')
          )
        )
      ),
      React.createElement(
        PDFView,
        { style: styles.section },
        React.createElement(PDFText, { style: styles.sectionTitle }, 'Top Leads'),
        ...props.topLeads
          .slice(0, 8)
          .map((lead, index) =>
            React.createElement(
              PDFView,
              { key: `lead-${index}`, style: styles.row },
              React.createElement(PDFText, {}, lead.name),
              React.createElement(PDFText, {}, lead.score.toString())
            )
          )
      ),
      React.createElement(
        PDFView,
        { style: styles.section },
        React.createElement(PDFText, { style: styles.sectionTitle }, 'Source Breakdown'),
        ...props.sourceBreakdown.map((source, index) =>
          React.createElement(
            PDFView,
            { key: `source-${index}`, style: styles.row },
            React.createElement(PDFText, {}, source.source),
            React.createElement(PDFText, {}, `${source.count} (${source.percentage}%)`)
          )
        )
      )
    )
  );
};
