import { Alert, Box, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
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

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
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
