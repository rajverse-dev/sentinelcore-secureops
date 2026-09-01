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
import {
  dashboardStats,
  quickSnapshotMetrics,
  topResourceConsumers,
  resourceUsageTrendLast24h,
  resourceUsageTrendLast7d,
  resourceUsageTrendLast30d,
} from '../data/dashboard';

type TimeRange = 'last24h' | 'last7d' | 'last30d';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>('last24h');
  const [dynamicStats, setDynamicStats] = useState(dashboardStats);

  // Update stats periodically for live effect
  useEffect(() => {
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
        title="Security Overview"
        subtitle="Monitor your cloud infrastructure and security posture"
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
            consumers={topResourceConsumers}
            onAssetClick={() => navigate('/assets')}
          />
        </Grid>
      </Grid>

      {/* Quick Infrastructure Snapshot */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <QuickInfrastructureSnapshot
            metrics={quickSnapshotMetrics}
            onMetricClick={() => navigate('/infrastructure-health')}
          />
        </Grid>
      </Grid>
    </>
  );
}
