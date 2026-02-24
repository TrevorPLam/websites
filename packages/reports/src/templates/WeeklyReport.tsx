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

export function WeeklyReportDocument(props: WeeklyReportProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ borderLeft: 4, borderColor: props.primaryColor, paddingLeft: 10 }}>
          <Text style={styles.heading}>{props.businessName}</Text>
          <Text style={styles.subtitle}>Weekly Lead Report · {props.reportPeriod}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.cardRow}>
            <View style={styles.card}>
              <Text style={styles.statValue}>{props.stats.totalLeads}</Text>
              <Text style={styles.statLabel}>Total leads</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.statValue}>{props.stats.totalBookings}</Text>
              <Text style={styles.statLabel}>Total bookings</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.statValue}>{props.stats.avgScore}</Text>
              <Text style={styles.statLabel}>Average lead score</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Leads</Text>
          {props.topLeads.slice(0, 8).map((lead) => (
            <View key={`${lead.email}-${lead.date}`} style={styles.row}>
              <Text>{lead.name}</Text>
              <Text>{lead.score}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Source Breakdown</Text>
          {props.sourceBreakdown.map((source) => (
            <View key={source.source} style={styles.row}>
              <Text>{source.source}</Text>
              <Text>
                {source.count} ({source.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
