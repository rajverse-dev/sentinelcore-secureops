import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import { healthChecks } from '../data/mockData';

export default function HealthChecksPage() {
  return (
    <>
      <PageHeader title="Health Checks" subtitle="Synthetic checks and service validation across the environment" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Successful</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>3</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Warnings</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>1</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Failed</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>1</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Avg Response</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>186 ms</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell>Check Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Response Time</TableCell>
              <TableCell>Last Checked</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {healthChecks.map((check) => (
              <TableRow key={`${check.asset}-${check.checkType}`} hover>
                <TableCell>{check.asset}</TableCell>
                <TableCell>{check.checkType}</TableCell>
                <TableCell><StatusChip label={check.status} severity={check.status === 'Failed' ? 'error' : check.status === 'Warning' ? 'warning' : 'success'} /></TableCell>
                <TableCell>{check.responseTime}</TableCell>
                <TableCell>{check.lastChecked}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Monitoring Notes</Typography>
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">- Synthetic checks are running across the production edge and core fleet.</Typography>
            <Typography variant="body2" color="text.secondary">- DB-SRV-12 CPU health check failed and is being investigated by the platform team.</Typography>
            <Typography variant="body2" color="text.secondary">- Router packet loss is elevated but remains below the automatic outage threshold.</Typography>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
