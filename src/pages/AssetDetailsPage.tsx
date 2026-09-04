import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import { assetData } from '../data/mockData';
import { LineChart } from '../components/Charts';

export default function AssetDetailsPage() {
  const { colors } = useTheme();
  const { id } = useParams();
  const asset = useMemo(() => assetData.find((item) => item.id === id) ?? assetData[0], [id]);

  const metrics = [
    { label: 'CPU', value: Number.parseInt(asset.cpu, 10) },
    { label: 'Memory', value: Number.parseInt(asset.memory === 'N/A' ? '0' : asset.memory, 10) },
    { label: 'Disk', value: Number.parseInt(asset.disk === 'N/A' ? '0' : asset.disk, 10) },
    { label: 'Network', value: Number.parseInt(asset.network, 10) }
  ];

  return (
    <>
      <PageHeader title={`Asset Details - ${asset.name}`} subtitle="Detailed telemetry and health investigation" />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Asset Information</Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">Asset ID: <strong>{asset.id}</strong></Typography>
                <Typography variant="body2" color="text.secondary">Name: <strong>{asset.name}</strong></Typography>
                <Typography variant="body2" color="text.secondary">Type: <strong>{asset.type}</strong></Typography>
                <Typography variant="body2" color="text.secondary">IP: <strong>{asset.ip}</strong></Typography>
                <Typography variant="body2" color="text.secondary">Environment: <strong>{asset.environment}</strong></Typography>
                <Typography variant="body2" color="text.secondary">Status: <StatusChip label={asset.status} severity={asset.status === 'Critical' ? 'error' : asset.status === 'Warning' ? 'warning' : 'success'} /></Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Resource Metrics</Typography>
              <Stack spacing={2}>
                {metrics.map((metric) => (
                  <Box key={metric.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.7 }}>
                      <Typography variant="subtitle2">{metric.label}</Typography>
                      <Typography variant="body2" color="text.secondary">{metric.value}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={metric.value} sx={{ height: 10, borderRadius: 999 }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Usage Trend</Typography>
          <LineChart data={[23, 31, 28, 36, 44, 49, 52, 41, 43, 48, 52, 49]} color={colors.secondary} height={240} />
        </CardContent>
      </Card>
    </>
  );
}
