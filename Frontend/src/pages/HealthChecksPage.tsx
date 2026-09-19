import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import SpeedIcon from '@mui/icons-material/Speed';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { healthChecks } from '../data/mockData';

export default function HealthChecksPage() {
  return (
    <>
      <PageHeader title="Health Checks" subtitle="Synthetic checks and service validation across the environment" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Successful" value="3" subtitle="Checks passing" color="#22C55E" icon={<CheckCircleIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Warnings" value="1" subtitle="Needs attention" color="#F59E0B" icon={<WarningAmberIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Failed" value="1" subtitle="Investigation required" color="#EF4444" icon={<ErrorIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Avg Response" value="186 ms" subtitle="Across current checks" color="#38BDF8" icon={<SpeedIcon />} /></Grid>
      </Grid>

      <TableContainer component={Card} sx={{ overflow: 'hidden', borderColor: '#334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#101827' }}>
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
