import { Box, Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { networkDevices } from '../data/mockData';

export default function NetworkMonitoringPage() {
  return (
    <>
      <PageHeader title="Network Monitoring" subtitle="Network devices, traffic flow and latency health" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Network Devices" value="4" subtitle="Monitored endpoints" color="#38BDF8" icon={<RouterIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Healthy Devices" value="2" subtitle="Operational now" color="#22C55E" icon={<CheckCircleIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Warning Devices" value="1" subtitle="Needs attention" color="#F59E0B" icon={<WarningAmberIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Critical Devices" value="1" subtitle="Immediate review" color="#EF4444" icon={<ErrorIcon />} /></Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderColor: '#38BDF866' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Network Usage</Typography>
              <Stack spacing={2}>
                <Box>…</Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderColor: '#8B5CF666' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Bandwidth & Latency</Typography>
              <Stack spacing={2}>
                <Box>…</Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Card} sx={{ mt: 4, overflow: 'hidden', borderColor: '#334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#101827' }}>
              <TableCell>Device</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>IP</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Bandwidth</TableCell>
              <TableCell>Latency</TableCell>
              <TableCell>Last Check</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {networkDevices.map((device) => (
              <TableRow key={device.device} hover>
                <TableCell>{device.device}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.ip}</TableCell>
                <TableCell><StatusChip label={device.status} severity={device.status === 'Critical' ? 'error' : device.status === 'Warning' ? 'warning' : 'success'} /></TableCell>
                <TableCell>{device.bandwidth}</TableCell>
                <TableCell>{device.latency}</TableCell>
                <TableCell>{device.lastCheck}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
