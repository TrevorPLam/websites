import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Row,
  Column,
  Img,
  Link,
  Font,
} from '@react-email/components';
import type { LeadNotificationProps } from '../types';

const scoreColor = (score: number) => {
  if (score >= 70) return '#16a34a'; // Green: qualified
  if (score >= 40) return '#ca8a04'; // Yellow: warm
  return '#6b7280'; // Gray: cold
};

const scoreLabel = (score: number) => {
  if (score >= 70) return '⭐ Qualified';
  if (score >= 40) return '🔥 Warm';
  return '❄️ Cold';
};

export function LeadNotificationEmail({ lead }: LeadNotificationProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body
        style={{ backgroundColor: '#f9fafb', fontFamily: 'Inter, Helvetica, Arial, sans-serif' }}
      >
        <Container
          style={{
            maxWidth: '560px',
            margin: '40px auto',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Score badge header */}
          <Section style={{ backgroundColor: scoreColor(lead.score), padding: '16px 24px' }}>
            <Text style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '16px' }}>
              {scoreLabel(lead.score)} Lead — Score: {lead.score}/100
            </Text>
          </Section>

          <Section style={{ padding: '28px 32px' }}>
            <Heading
              as="h1"
              style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}
            >
              {lead.name}
            </Heading>
            <Text style={{ color: '#6b7280', margin: '0 0 24px', fontSize: '15px' }}>
              Just submitted a contact form on your website
            </Text>

            {/* Contact details */}
            <Section
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '16px 20px',
                marginBottom: '20px',
              }}
            >
              <Row style={{ marginBottom: '10px' }}>
                <Column>
                  <Text
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#9ca3af',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Email
                  </Text>
                </Column>
                <Column align="right">
                  <Link
                    href={`mailto:${lead.email}`}
                    style={{ color: '#2563eb', fontSize: '14px', fontWeight: 500 }}
                  >
                    {lead.email}
                  </Link>
                </Column>
              </Row>
              {lead.phone && (
                <Row style={{ marginBottom: '10px' }}>
                  <Column>
                    <Text
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#9ca3af',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Phone
                    </Text>
                  </Column>
                  <Column align="right">
                    <Link
                      href={`tel:${lead.phone}`}
                      style={{ color: '#2563eb', fontSize: '14px', fontWeight: 500 }}
                    >
                      {lead.phone}
                    </Link>
                  </Column>
                </Row>
              )}
              {lead.utmSource && (
                <Row>
                  <Column>
                    <Text
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        color: '#9ca3af',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Source
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
                      {lead.utmSource}
                      {lead.utmCampaign ? ` / ${lead.utmCampaign}` : ''}
                    </Text>
                  </Column>
                </Row>
              )}
            </Section>

            {/* Message */}
            <Text
              style={{
                fontSize: '13px',
                color: '#9ca3af',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                margin: '0 0 8px',
              }}
            >
              Their Message
            </Text>
            <Section
              style={{
                backgroundColor: '#f0fdf4',
                borderLeft: '3px solid #16a34a',
                padding: '12px 16px',
                borderRadius: '0 6px 6px 0',
                marginBottom: '28px',
              }}
            >
              <Text style={{ margin: 0, color: '#111827', fontSize: '15px', lineHeight: '1.5' }}>
                {lead.message}
              </Text>
            </Section>

            {/* CTA */}
            <Button
              href={`mailto:${lead.email}?subject=Re: Your inquiry`}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: '15px',
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Reply to {lead.name.split(' ')[0]}
            </Button>

            {lead.landingPage && (
              <Text
                style={{
                  color: '#9ca3af',
                  fontSize: '12px',
                  textAlign: 'center',
                  marginTop: '16px',
                }}
              >
                Submitted from:{' '}
                <Link href={lead.landingPage} style={{ color: '#9ca3af' }}>
                  {lead.landingPage}
                </Link>
              </Text>
            )}
          </Section>

          <Hr style={{ borderColor: '#e5e7eb', margin: 0 }} />

          {/* Footer */}
          <Section style={{ padding: '16px 32px', backgroundColor: '#f9fafb' }}>
            <Text style={{ color: '#9ca3af', fontSize: '12px', margin: 0, textAlign: 'center' }}>
              You're receiving this because you have lead notifications enabled.{' '}
              <Link href="{{{unsubscribe}}}" style={{ color: '#9ca3af' }}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default LeadNotificationEmail;
