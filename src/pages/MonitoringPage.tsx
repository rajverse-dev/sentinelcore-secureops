import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  Switch,
  FormControlLabel,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import LiveInfrastructureEvents from '../components/LiveInfrastructureEvents';
import AtRiskAssets from '../components/AtRiskAssets';
import {
  liveInfrastructureEvents,
  atRiskAssets,
} from '../data/dashboard';

const metrics = [
  { label: 'CPU Monitoring', value: 23, status: 'Healthy', color: 'success' },
  { label: 'Memory Monitoring', value: 47, status: 'Healthy', color: 'success' },
  { label: 'Disk Monitoring', value: 67, status: 'Warning', color: 'warning' },
  { label: 'Network Monitoring', value: 12, status: 'Healthy', color: 'success' },
];

export default function MonitoringPage() {
  const navigate = useNavigate();
  const [liveMonitoring, setLiveMonitoring] = useState(true);

  return (
    <>
      <PageHeader
        title="Infrastructure Monitoring"
        subtitle="Monitor server, cloud and network health in real time"
      />

      {/* Live Monitoring Toggle */}
      <Paper
        sx={{
          p: 2.5,
          mb: 4,
          background: '#151C2C',
          border: '1px solid #334155',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="body1" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            Real-Time Monitoring
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {liveMonitoring
              ? 'Live monitoring is active. Data updates every 5 seconds.'
              : 'Live monitoring paused. View snapshot data only.'}
          </Typography>
        </Stack>
        <FormControlLabel
          control={
            <Switch
              checked={liveMonitoring}
              onChange={(e) => setLiveMonitoring(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#7C3AED',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#7C3AED',
                },
              }}
            />
          }
          label={liveMonitoring ? '● Online' : '○ Paused'}
          sx={{
            m: 0,
            '& .MuiFormControlLabel-label': {
              fontWeight: 600,
              fontSize: '0.875rem',
              color: liveMonitoring ? '#22C55E' : '#94A3B8',
              ml: 1,
            },
          }}
        />
      </Paper>

      {/* Monitoring Metrics */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#F8FAFC' }}>
        Resource Health Status
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric) => (
          <Grid item xs={12} md={6} key={metric.label}>
            <Card sx={{ bgcolor: '#0B1020' }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">{metric.label}</Typography>
                    <StatusChip
                      label={metric.status}
                      severity={
                        metric.color as 'success' | 'warning' | 'error' | 'info'
                      }
                    />
                  </Stack>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: '#F8FAFC' }}
                  >
                    {metric.value}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={metric.value}
                    color={metric.color as 'success' | 'warning' | 'error' | 'info'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Live Events + At-Risk Assets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={5}>
          <LiveInfrastructureEvents
            events={liveInfrastructureEvents}
            onViewAll={() => navigate('/alerts')}
            onEventClick={() => navigate('/alerts')}
          />
        </Grid>
        <Grid item xs={12} lg={7}>
          <AtRiskAssets
            assets={atRiskAssets}
            onAssetClick={() => navigate('/assets')}
          />
        </Grid>
      </Grid>

      {/* Infrastructure Status Summary */}
      <Card sx={{ bgcolor: '#0B1020' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#F8FAFC' }}>
            Infrastructure Summary
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Typography sx={{ minWidth: 180, color: '#F8FAFC', fontWeight: 600 }}>
                  Servers
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={96}
                  color="success"
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4, mx: 2 }}
                />
                <StatusChip label="Healthy" severity="success" />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                1,235 healthy · 10 warning · 2 critical
              </Typography>
            </Box>

            <Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Typography sx={{ minWidth: 180, color: '#F8FAFC', fontWeight: 600 }}>
                  Cloud Resources
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={94}
                  color="success"
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4, mx: 2 }}
                />
                <StatusChip label="Healthy" severity="success" />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                820 healthy · 15 warning · 12 critical
              </Typography>
            </Box>

            <Box>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Typography sx={{ minWidth: 180, color: '#F8FAFC', fontWeight: 600 }}>
                  Network Devices
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={82}
                  color="warning"
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4, mx: 2 }}
                />
                <StatusChip label="Warning" severity="warning" />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                730 healthy · 15 warning · 8 critical
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
