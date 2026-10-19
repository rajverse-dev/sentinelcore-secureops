import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
  Box,
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import OverallHealthIndicator from '../components/OverallHealthIndicator';
import AssetHealthDistribution from '../components/AssetHealthDistribution';
import { healthChecks, healthOverview } from '../data/mockData';
import {
  infrastructureHealthStats,
  assetHealthDistribution,
  quickSnapshotMetrics,
} from '../data/dashboard';
import { assetApi } from '../services/api';
import { AssetRecord } from '../data/assets';

type HealthStats = typeof infrastructureHealthStats;

const emptyHealthStats: HealthStats = {
  servers: { total: 0, healthy: 0, warning: 0, critical: 0 },
  cloud: { total: 0, healthy: 0, warning: 0, critical: 0 },
  network: { total: 0, healthy: 0, warning: 0, critical: 0 }
};

export default function InfrastructureHealthPage() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetApi.getAssets()
      .then((response) => setAssets(response.data as AssetRecord[]))
      .catch(() => setAssets([]))
      .finally(() => setLoading(false));
  }, []);

  const healthStats = useMemo<HealthStats>(() => {
    if (loading) return emptyHealthStats;
    return assets.reduce((stats, asset) => {
      const category = asset.type === 'NETWORK' ? 'network' : ['EC2', 'S3', 'RDS'].includes(asset.type) ? 'cloud' : 'servers';
      const categoryStats = stats[category];
      categoryStats.total += 1;
      if (asset.riskLevel === 'CRITICAL') categoryStats.critical += 1;
      else if (asset.status === 'ACTIVE' && asset.riskLevel === 'LOW') categoryStats.healthy += 1;
      else categoryStats.warning += 1;
      return stats;
    }, structuredClone(emptyHealthStats));
  }, [assets, loading]);

  const healthDistribution = useMemo(() => ({
    healthy: assets.filter((asset) => asset.status === 'ACTIVE' && asset.riskLevel === 'LOW').length,
    warning: assets.filter((asset) => asset.riskLevel !== 'CRITICAL' && !(asset.status === 'ACTIVE' && asset.riskLevel === 'LOW')).length,
    critical: assets.filter((asset) => asset.riskLevel === 'CRITICAL').length
  }), [assets]);

  const calculateHealthPercentage = (): number => {
    const totalAssets =
      healthStats.servers.total +
      healthStats.cloud.total +
      healthStats.network.total;
    const healthyAssets =
      healthStats.servers.healthy +
      healthStats.cloud.healthy +
      healthStats.network.healthy;
    return totalAssets ? Math.round((healthyAssets / totalAssets) * 100) : 0;
  };

  const getHealthStatus = (): 'Healthy' | 'Warning' | 'Critical' => {
    const healthPercentage = calculateHealthPercentage();
    if (healthPercentage >= 95) return 'Healthy';
    if (healthPercentage >= 85) return 'Warning';
    return 'Critical';
  };

  return (
    <>
      <PageHeader
        title="Infrastructure Health"
        subtitle="Comprehensive health analysis of your infrastructure"
      />

      {/* Overall Health Indicator + Health Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={4}>
          <OverallHealthIndicator
            healthPercentage={calculateHealthPercentage()}
            status={getHealthStatus()}
            details={healthDistribution}
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <AssetHealthDistribution
            data={healthDistribution}
            onStatusClick={() => navigate('/assets')}
          />
        </Grid>
      </Grid>

      {/* Infrastructure Health Breakdown */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#F8FAFC' }}>
        Infrastructure Component Health
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: 'Servers',
            data: healthStats.servers,
          },
          {
            label: 'Cloud Resources',
            data: healthStats.cloud,
          },
          {
            label: 'Network Devices',
            data: healthStats.network,
          },
        ].map((component) => {
          const total = component.data.total;
          const healthy = component.data.healthy;
          const healthPercent = Math.round((healthy / total) * 100);

          return (
            <Grid item xs={12} md={4} key={component.label}>
              <Card sx={{ bgcolor: '#0B1020', h: '100%' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: '#F8FAFC' }}
                      >
                        {component.label}
                      </Typography>
                      <StatusChip
                        label={
                          healthPercent >= 95
                            ? 'Healthy'
                            : healthPercent >= 85
                            ? 'Warning'
                            : 'Critical'
                        }
                        severity={
                          healthPercent >= 95
                            ? 'success'
                            : healthPercent >= 85
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Stack>

                    <Box>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ color: '#F8FAFC', fontWeight: 600 }}
                        >
                          Total: {component.data.total}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: '#22C55E' }}
                        >
                          {healthPercent}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={healthPercent}
                        sx={{ height: 8, borderRadius: 4, mb: 2 }}
                      />
                    </Box>

                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          bgcolor: 'rgba(34, 197, 94, 0.1)',
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600 }}
                        >
                          Healthy
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#22C55E', fontWeight: 700 }}
                        >
                          {component.data.healthy}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          bgcolor: 'rgba(245, 158, 11, 0.1)',
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600 }}
                        >
                          Warning
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#F59E0B', fontWeight: 700 }}
                        >
                          {component.data.warning}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600 }}
                        >
                          Critical
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: '#EF4444', fontWeight: 700 }}
                        >
                          {component.data.critical}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick Health Snapshot */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#F8FAFC' }}>
        Health Check Summary
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickSnapshotMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={metric.label}>
            <Card sx={{ bgcolor: '#0B1020', textAlign: 'center' }}>
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: '#22C55E', mb: 1 }}
                >
                  {metric.value}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: '0.8rem' }}
                >
                  {metric.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Health Checks Table */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#F8FAFC' }}>
        Health Check Results
      </Typography>
      <TableContainer component={Card} sx={{ bgcolor: '#0B1020' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#101827' }}>
              <TableCell sx={{ fontWeight: 700, color: '#94A3B8' }}>
                Check Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94A3B8' }}>
                Target Asset
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94A3B8' }}>
                Check Type
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94A3B8' }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94A3B8' }}>
                Response Time
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#94A3B8' }}>
                Last Checked
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {healthChecks.map((check) => (
              <TableRow key={`${check.asset}-${check.checkType}`} hover>
                <TableCell sx={{ color: '#F8FAFC', fontWeight: 500 }}>
                  {check.checkType}
                </TableCell>
                <TableCell sx={{ color: '#F8FAFC' }}>{check.asset}</TableCell>
                <TableCell sx={{ color: '#94A3B8' }}>
                  {check.checkType}
                </TableCell>
                <TableCell>
                  <StatusChip
                    label={check.status}
                    severity={
                      check.status === 'Failed'
                        ? 'error'
                        : check.status === 'Warning'
                        ? 'warning'
                        : 'success'
                    }
                  />
                </TableCell>
                <TableCell sx={{ color: '#F8FAFC' }}>
                  {check.responseTime}
                </TableCell>
                <TableCell sx={{ color: '#94A3B8' }}>
                  {check.lastChecked}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Health Notes */}
      <Card sx={{ mt: 4, bgcolor: '#0B1020' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#F8FAFC' }}>
            Health Assessment Notes
          </Typography>
          <Stack spacing={1.5}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, color: '#22C55E' }}
            >
              ✓ Overall infrastructure health is excellent (98%)
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, color: '#F59E0B' }}
            >
              ⚠ Network devices show minor latency variations but remain operational
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, color: '#22C55E' }}
            >
              ✓ Cloud resources across all regions healthy with no degradation
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, color: '#22C55E' }}
            >
              ✓ All synthetic health checks passing
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
