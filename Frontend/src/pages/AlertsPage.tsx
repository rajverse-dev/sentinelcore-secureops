import { Alert, Box, CircularProgress, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { alertData } from '../data/alerts';

export default function AlertsPage() {
  const loading = false;
  const error = '';

  const severityColor = {
    Critical: 'error',
    Warning: 'warning',
    Info: 'info',
    Resolved: 'success'
  } as const;

  return (
    <>
      <PageHeader title="Alerts" subtitle="Current security and infrastructure alerts" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Total Alerts" value={alertData.length} subtitle="Current alert stream" color="#38BDF8" icon={<NotificationsActiveIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Critical" value={alertData.filter((item) => item.severity === 'Critical').length} subtitle="Immediate attention" color="#EF4444" icon={<ErrorIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Warnings" value={alertData.filter((item) => item.severity === 'Warning').length} subtitle="Needs investigation" color="#F59E0B" icon={<WarningAmberIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Resolved" value={alertData.filter((item) => item.status === 'Resolved').length} subtitle="Closed alert records" color="#22C55E" icon={<CheckCircleIcon />} /></Grid>
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', borderColor: '#334155' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#101827' }}>
                <TableCell>Alert ID</TableCell>
                <TableCell>Asset</TableCell>
                <TableCell>Alert type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alertData.map((alert) => (
                <TableRow key={alert.id} hover>
                  <TableCell>{alert.id}</TableCell>
                  <TableCell>{alert.asset}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>
                    <StatusChip label={alert.severity} severity={severityColor[alert.severity]} />
                  </TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={alert.status}
                      severity={alert.status === 'Open' ? 'error' : alert.status === 'Investigating' ? 'warning' : 'success'}
                    />
                  </TableCell>
                  <TableCell>{new Date(alert.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
