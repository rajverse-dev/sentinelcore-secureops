import { Grid, Paper, Stack, Typography } from '@mui/material';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import { alertExamples, dashboardStats, healthSummary } from '../data/dashboard';

export default function DashboardPage() {
  const statCards = dashboardStats;

  return (
    <>
      <PageHeader
        title="Servers, Cloud, Network Health"
        subtitle="Milestone 1 infrastructure monitoring overview"
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={stat.label}>
            <MetricCard title={stat.label} value={stat.value} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Infrastructure Health</Typography>
            <Stack spacing={3}>
              {healthSummary.map((row) => (
                <Stack key={row.label} direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle1" sx={{ minWidth: 180 }}>{row.label}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <StatusChip label={`Healthy ${row.healthy}`} severity="success" />
                    <StatusChip label={`Warning ${row.warning}`} severity="warning" />
                    <StatusChip label={`Critical ${row.critical}`} severity="error" />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Alerts</Typography>
            <Stack spacing={2}>
              {alertExamples.map((alert) => (
                <Paper key={alert.id} sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(15,23,42,0.8)' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{alert.id}</Typography>
                    <StatusChip
                      label={alert.severity}
                      severity={alert.severity === 'Critical' ? 'error' : alert.severity === 'Warning' ? 'warning' : 'info'}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {alert.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                    Status: {alert.status}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
