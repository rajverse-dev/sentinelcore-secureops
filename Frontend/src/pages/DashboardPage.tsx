import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Stack,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import KPICard from '../components/KPICard';
import ResourceUsageTrendChart from '../components/ResourceUsageTrendChart';
import TopResourceConsumers from '../components/TopResourceConsumers';
import QuickInfrastructureSnapshot from '../components/QuickInfrastructureSnapshot';
import { assetApi, vulnerabilityApi } from '../services/api';
import { AssetRecord } from '../data/assets';
import { VulnerabilityRecord } from '../data/vulnerabilities';
import { DonutChart } from '../components/Charts';
import {
  dashboardStats,
  quickSnapshotMetrics,
  topResourceConsumers,
  resourceUsageTrendLast24h,
  resourceUsageTrendLast7d,
  resourceUsageTrendLast30d,
} from '../data/dashboard';

type TimeRange = 'last24h' | 'last7d' | 'last30d';

type SecurityStats = {
  vulnerabilities: VulnerabilityRecord[];
  providerCounts: Record<string, number>;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('last24h');
  const [dynamicStats, setDynamicStats] = useState(dashboardStats);
  const [assetConsumers, setAssetConsumers] = useState(topResourceConsumers);
  const [assetSnapshot, setAssetSnapshot] = useState(quickSnapshotMetrics);
  const [securityStats, setSecurityStats] = useState<SecurityStats>({ vulnerabilities: [], providerCounts: {} });

  // Update stats periodically for live effect
  useEffect(() => {
    const loadAssetCount = async () => {
      try {
        const response = await assetApi.getAssets();
        const assets = response.data as AssetRecord[];
        const totalAssets = assets.length || 1;
        const activeAssets = assets.filter((asset) => asset.status === 'ACTIVE').length;
        const criticalAssets = assets.filter((asset) => asset.riskLevel === 'CRITICAL').length;
        const riskScore = (riskLevel: string) => ({ CRITICAL: 100, HIGH: 80, MEDIUM: 60, LOW: 20 }[riskLevel] ?? 0);
        const sortedByRisk = [...assets].sort((left, right) => riskScore(right.riskLevel) - riskScore(left.riskLevel));
        setAssetConsumers(sortedByRisk.slice(0, 5).map((asset) => ({
          id: asset.id,
          name: asset.name,
          resource: 'Risk level',
          usage: `${riskScore(asset.riskLevel)}%`
        })));
        setAssetSnapshot([
          { label: 'Asset Health', value: `${Math.round((activeAssets / totalAssets) * 100)}%`, status: activeAssets === assets.length ? 'Healthy' : 'Warning', icon: '🛡️' },
          { label: 'Active Assets', value: String(activeAssets), status: activeAssets ? 'Healthy' : 'Warning', icon: '📦' },
          { label: 'Critical Risk', value: `${Math.round((criticalAssets / totalAssets) * 100)}%`, status: criticalAssets ? 'Critical' : 'Healthy', icon: '⚠️' },
          ...quickSnapshotMetrics.slice(0, 2)
        ]);
        const assetCounts: Record<string, number> = {
          'Assets Monitored': assets.length,
          'Healthy Assets': assets.filter((asset) => asset.status === 'ACTIVE').length,
          'Warning Assets': assets.filter((asset) => asset.status === 'PENDING' || asset.riskLevel === 'MEDIUM' || asset.riskLevel === 'HIGH').length,
          'Critical Assets': assets.filter((asset) => asset.riskLevel === 'CRITICAL').length
        };
        setDynamicStats((currentStats) => currentStats.map((stat) => assetCounts[stat.label] === undefined
          ? stat
          : { ...stat, value: String(assetCounts[stat.label]) }));
      } catch {
        // Keep the dashboard available when the asset service is offline.
      }
    };

    void loadAssetCount();

    const loadSecurityStats = async () => {
      try {
        const [vulnerabilityResponse, assetResponse] = await Promise.all([
          vulnerabilityApi.getVulnerabilities(),
          assetApi.getAssets()
        ]);
        const assets = assetResponse.data as AssetRecord[];
        const providerCounts = assets.reduce<Record<string, number>>((counts, asset) => {
          counts[asset.provider] = (counts[asset.provider] ?? 0) + 1;
          return counts;
        }, {});
        setSecurityStats({
          vulnerabilities: vulnerabilityResponse.data as VulnerabilityRecord[],
          providerCounts
        });
      } catch {
        // Keep the dashboard usable when security data is unavailable.
      }
    };

    void loadSecurityStats();

    const interval = setInterval(() => {
      setDynamicStats((prevStats) =>
        prevStats.map((stat) => {
          if (stat.label.includes('%')) {
            const currentValue = parseInt(stat.value);
            const variation = Math.random() * 4 - 2;
            const newValue = Math.max(0, Math.min(100, currentValue + variation));
            return {
              ...stat,
              value: Math.round(newValue) + '%',
            };
          }
          return stat;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getResourceTrendData = () => {
    switch (timeRange) {
      case 'last7d':
        return resourceUsageTrendLast7d;
      case 'last30d':
        return resourceUsageTrendLast30d;
      default:
        return resourceUsageTrendLast24h;
    }
  };

  return (
    <>
      <PageHeader
        title="Security Overview & Operations Dashboard"
        subtitle="Real-time infrastructure monitoring, asset risk posture, and security telemetry"
      />

      {/* Quick Navigation Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: '#0B1020',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#151C2C',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => navigate('/monitoring')}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                🔴 Real-Time Monitoring
              </Typography>
              <Typography variant="body2" color="text.primary">
                Live events & alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: '#0B1020',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#151C2C',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => navigate('/infrastructure-health')}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                💚 Infrastructure Health
              </Typography>
              <Typography variant="body2" color="text.primary">
                Health analysis
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: '#0B1020',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#151C2C',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => navigate('/assets')}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                📦 Asset Inventory
              </Typography>
              <Typography variant="body2" color="text.primary">
                All monitored assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: '#0B1020',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#151C2C',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => navigate('/alerts')}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ⚠️ Alert Management
              </Typography>
              <Typography variant="body2" color="text.primary">
                Active alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#F8FAFC' }}>
        Security Findings
      </Typography>
      <Grid container spacing={3} alignItems="stretch" sx={{ mb: 4 }}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ height: '100%' }}><Typography variant="h6" sx={{ mb: 2 }}>Vulnerability severity</Typography><DonutChart centerLabel="findings" segments={[{ label: 'Critical', value: securityStats.vulnerabilities.filter((item) => item.severity === 'CRITICAL').length, color: '#EF4444' }, { label: 'High', value: securityStats.vulnerabilities.filter((item) => item.severity === 'HIGH').length, color: '#F59E0B' }, { label: 'Medium', value: securityStats.vulnerabilities.filter((item) => item.severity === 'MEDIUM').length, color: '#38BDF8' }, { label: 'Low', value: securityStats.vulnerabilities.filter((item) => item.severity === 'LOW').length, color: '#22C55E' }]} /></CardContent></Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ height: '100%' }}><Typography variant="h6" sx={{ mb: 2 }}>Vulnerability status</Typography><DonutChart centerLabel="findings" segments={[{ label: 'Open', value: securityStats.vulnerabilities.filter((item) => item.status === 'OPEN').length, color: '#EF4444' }, { label: 'In progress', value: securityStats.vulnerabilities.filter((item) => item.status === 'IN_PROGRESS').length, color: '#F59E0B' }, { label: 'Resolved', value: securityStats.vulnerabilities.filter((item) => item.status === 'RESOLVED').length, color: '#22C55E' }, { label: 'Accepted', value: securityStats.vulnerabilities.filter((item) => item.status === 'ACCEPTED').length, color: '#38BDF8' }]} /></CardContent></Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}><CardContent sx={{ height: '100%' }}><Typography variant="h6" sx={{ mb: 2 }}>Asset providers</Typography><DonutChart centerLabel="assets" segments={['AWS', 'AZURE', 'GCP'].map((provider, index) => ({ label: provider, value: securityStats.providerCounts[provider] ?? 0, color: ['#F59E0B', '#38BDF8', '#22C55E'][index] }))} /></CardContent></Card>
        </Grid>
      </Grid>

      {/* KPI Cards - Summary Metrics */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#F8FAFC' }}>
        Infrastructure Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dynamicStats.map((stat) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={stat.label}>
            <KPICard
              title={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendTime={stat.trendTime}
              icon={stat.icon}
            />
          </Grid>
        ))}
      </Grid>

      {/* Resource Usage Trend + Top Resource Consumers */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <ResourceUsageTrendChart
            data={getResourceTrendData()}
            onMetricChange={() => {}}
          />
        </Grid>
        <Grid item xs={12} lg={5}>
          <TopResourceConsumers
            consumers={assetConsumers}
            onAssetClick={() => navigate('/assets')}
          />
        </Grid>
      </Grid>

      {/* Quick Infrastructure Snapshot */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <QuickInfrastructureSnapshot
            metrics={assetSnapshot}
            onMetricClick={() => navigate('/infrastructure-health')}
          />
        </Grid>
      </Grid>
    </>
  );
}
