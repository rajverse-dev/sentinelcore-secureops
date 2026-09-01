import { Box, Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import { networkDevices } from '../data/mockData';

export default function NetworkMonitoringPage() {
  return (
    <>
      <PageHeader title="Network Monitoring" subtitle="Network devices, traffic flow and latency health" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Network Devices</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>4</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Healthy Devices</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>2</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Warning Devices</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>1</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Critical Devices</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>1</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Network Usage</Typography>
              <Stack spacing={2}>
                <Box>…</Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Bandwidth & Latency</Typography>
              <Stack spacing={2}>
                <Box>…</Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Card} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
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
