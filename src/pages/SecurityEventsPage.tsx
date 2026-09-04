import React from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  AlertTitle,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import PageHeader from '../components/PageHeader';
import { useTheme } from '../context/ThemeContext';

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  source: string;
  status: 'new' | 'investigating' | 'resolved';
}

export default function SecurityEventsPage() {
  const { colors } = useTheme();

  const events: SecurityEvent[] = [
    {
      id: 'EVT-2026-0847',
      timestamp: '2026-09-01 14:32:21',
      eventType: 'Suspicious Login',
      severity: 'high',
      description: 'Multiple failed authentication attempts detected',
      source: 'auth-server-01',
      status: 'investigating',
    },
    {
      id: 'EVT-2026-0846',
      timestamp: '2026-09-01 13:15:42',
      eventType: 'Port Scan Detected',
      severity: 'medium',
      description: 'Network port scanning activity detected from external IP',
      source: 'network-monitor-02',
      status: 'investigating',
    },
    {
      id: 'EVT-2026-0845',
      timestamp: '2026-09-01 11:47:18',
      eventType: 'Firewall Anomaly',
      severity: 'critical',
      description: 'Unusual firewall rule modification detected',
      source: 'firewall-primary',
      status: 'new',
    },
    {
      id: 'EVT-2026-0844',
      timestamp: '2026-09-01 10:22:55',
      eventType: 'Data Access',
      severity: 'medium',
      description: 'Unusual data access pattern from service account',
      source: 'database-01',
      status: 'resolved',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#EF4444';
      case 'high':
        return '#F59E0B';
      case 'medium':
        return '#3B82F6';
      case 'low':
        return '#10B981';
      default:
        return '#94A3B8';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return '#EF4444';
      case 'investigating':
        return '#F59E0B';
      case 'resolved':
        return '#10B981';
      default:
        return '#94A3B8';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <PageHeader
        title="Security Events"
        subtitle="Real-time security incidents and threat events"
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Key Metrics */}
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    New Events
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#EF4444' }}
                  >
                    3
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Investigating
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#F59E0B' }}
                  >
                    2
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Resolved
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#10B981' }}
                  >
                    24
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Total Today
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#22D3EE' }}
                  >
                    29
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Info Alert */}
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <AlertTitle>Security Events Monitoring</AlertTitle>
            Security events are collected from across your infrastructure and displayed
            here in real-time. Each event is categorized by severity and type for quick
            assessment and response.
          </Alert>

          {/* Events Table */}
          <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#101827', borderBottom: '1px solid #263244' }}>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Event ID
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Timestamp
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Event Type
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Severity
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>
                      Source
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow
                      key={event.id}
                      sx={{
                        borderBottom: '1px solid #263244',
                        '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.05)' },
                      }}
                    >
                      <TableCell sx={{ color: '#7C3AED', fontWeight: 600 }}>
                        {event.id}
                      </TableCell>
                      <TableCell sx={{ color: '#F8FAFC' }}>
                        {event.timestamp}
                      </TableCell>
                      <TableCell sx={{ color: '#F8FAFC' }}>
                        {event.eventType}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.severity.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: `${getSeverityColor(event.severity)}20`,
                            color: getSeverityColor(event.severity),
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.status.replace(/^\w/, (c) => c.toUpperCase())}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(event.status)}20`,
                            color: getStatusColor(event.status),
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: '#94A3B8' }}>
                        {event.source}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Feature Info */}
          <Card sx={{ bgcolor: '#0B1020', borderColor: '#263244', border: '1px solid' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#F8FAFC' }}>
                Event Monitoring Features
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#7C3AED', mb: 0.5 }}
                  >
                    ✓ Real-time Event Collection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Events are collected and displayed in real-time from all monitored systems
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#7C3AED', mb: 0.5 }}
                  >
                    ✓ Severity Classification
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Events are categorized by severity level for quick risk assessment
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: '#7C3AED', mb: 0.5 }}
                  >
                    ✓ Incident Response Tracking
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track the status of each event from discovery through resolution
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
