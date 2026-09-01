import { Card, CardContent, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';

const metrics = [
  { label: 'CPU Monitoring', value: 23, status: 'Healthy', color: 'success' },
  { label: 'Memory Monitoring', value: 47, status: 'Healthy', color: 'success' },
  { label: 'Disk Monitoring', value: 67, status: 'Warning', color: 'warning' },
  { label: 'Network Monitoring', value: 12, status: 'Healthy', color: 'success' }
];

export default function MonitoringPage() {
  return (
    <>
      <PageHeader title="Infrastructure Monitoring" subtitle="Real-time platform and network telemetry" />

      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} md={6} key={metric.label}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{metric.label}</Typography>
                    <StatusChip label={metric.status} severity={metric.color as 'success' | 'warning' | 'error' | 'info'} />
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>{metric.value}%</Typography>
                  <LinearProgress variant="determinate" value={metric.value} color={metric.color as 'success' | 'warning' | 'error' | 'info'} sx={{ height: 10, borderRadius: 5 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Asset Health Status</Typography>
          <Stack spacing={2}>
            {[
              { label: 'Servers', value: 96, status: 'Healthy' },
              { label: 'Cloud resources', value: 94, status: 'Healthy' },
              { label: 'Network devices', value: 82, status: 'Warning' },
              { label: 'Critical assets', value: 12, status: 'Critical' }
            ].map((item) => (
              <Stack key={item.label} direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={1}>
                <Typography sx={{ minWidth: 180 }}>{item.label}</Typography>
                <LinearProgress variant="determinate" value={item.value} color={item.status === 'Critical' ? 'error' : item.status === 'Warning' ? 'warning' : 'success'} sx={{ flexGrow: 1, height: 10, borderRadius: 5 }} />
                <StatusChip label={item.status} severity={item.status === 'Critical' ? 'error' : item.status === 'Warning' ? 'warning' : 'success'} />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
