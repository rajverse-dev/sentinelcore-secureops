import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';
import RouterIcon from '@mui/icons-material/Router';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { assetApi } from '../services/api';

interface NetworkAsset {
  id: string;
  name: string;
  identifier: string;
  type: string;
  region: string;
  status: string;
  riskLevel: string;
  provider: string;
  environment: string;
  createdAt?: string;
}

function getDeviceStatus(asset: NetworkAsset): 'Healthy' | 'Warning' | 'Critical' {
  if (asset.riskLevel === 'CRITICAL') return 'Critical';
  if (asset.status !== 'ACTIVE' || asset.riskLevel === 'HIGH' || asset.riskLevel === 'MEDIUM') return 'Warning';
  return 'Healthy';
}

export default function NetworkMonitoringPage() {
  const [devices, setDevices] = useState<NetworkAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetApi.getAssets()
      .then((response) => {
        const all = response.data as NetworkAsset[];
        setDevices(all.filter(a => a.type === 'NETWORK'));
      })
      .catch(() => setDevices([]))
      .finally(() => setLoading(false));
  }, []);

  const healthy = devices.filter(d => getDeviceStatus(d) === 'Healthy').length;
  const warning = devices.filter(d => getDeviceStatus(d) === 'Warning').length;
  const critical = devices.filter(d => getDeviceStatus(d) === 'Critical').length;

  return (
    <>
      <PageHeader title="Network Monitoring" subtitle="Network devices, traffic flow and latency health" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard label="Network Devices" value={loading ? '…' : String(devices.length)} subtitle="Monitored endpoints" color="#38BDF8" icon={<RouterIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard label="Healthy Devices" value={loading ? '…' : String(healthy)} subtitle="Operational now" color="#22C55E" icon={<CheckCircleIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard label="Warning Devices" value={loading ? '…' : String(warning)} subtitle="Needs attention" color="#F59E0B" icon={<WarningAmberIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard label="Critical Devices" value={loading ? '…' : String(critical)} subtitle="Immediate review" color="#EF4444" icon={<ErrorIcon />} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderColor: '#38BDF866' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Network Usage</Typography>
              <Stack spacing={2}>
                <Box>
                  {devices.length === 0 && !loading && (
                    <Typography variant="body2" color="text.secondary">No network assets found.</Typography>
                  )}
                  {devices.map(d => (
                    <Box key={d.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#F8FAFC' }}>{d.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{d.environment}</Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderColor: '#8B5CF666' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Bandwidth & Latency</Typography>
              <Stack spacing={2}>
                <Box>
                  {devices.map(d => (
                    <Box key={d.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#F8FAFC' }}>{d.identifier}</Typography>
                      <Typography variant="body2" color="text.secondary">{d.region}</Typography>
                    </Box>
                  ))}
                </Box>
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
              <TableCell>Identifier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Environment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
            {!loading && devices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: '#94A3B8', py: 4 }}>
                  No network devices found. Add assets with type NETWORK to see data here.
                </TableCell>
              </TableRow>
            )}
            {devices.map((device) => {
              const devStatus = getDeviceStatus(device);
              return (
                <TableRow key={device.id} hover>
                  <TableCell sx={{ color: '#F8FAFC', fontWeight: 500 }}>{device.name}</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{device.type}</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{device.identifier}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={devStatus}
                      severity={devStatus === 'Critical' ? 'error' : devStatus === 'Warning' ? 'warning' : 'success'}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={device.riskLevel}
                      severity={device.riskLevel === 'CRITICAL' ? 'error' : (device.riskLevel === 'HIGH' || device.riskLevel === 'MEDIUM') ? 'warning' : 'success'}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{device.region}</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{device.environment}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
