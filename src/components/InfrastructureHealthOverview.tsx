import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  LinearProgress,
  Box,
  Grid,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import RouterIcon from '@mui/icons-material/Router';

interface HealthCategory {
  label: string;
  total: number;
  healthy: number;
  warning: number;
  critical: number;
  icon: React.ReactNode;
}

interface InfrastructureHealthOverviewProps {
  data: {
    servers: { total: number; healthy: number; warning: number; critical: number };
    cloud: { total: number; healthy: number; warning: number; critical: number };
    network: { total: number; healthy: number; warning: number; critical: number };
  };
  onCategoryClick?: (category: string) => void;
}

export default function InfrastructureHealthOverview({
  data,
  onCategoryClick,
}: InfrastructureHealthOverviewProps) {
  const categories: HealthCategory[] = [
    {
      label: 'Servers',
      total: data.servers.total,
      healthy: data.servers.healthy,
      warning: data.servers.warning,
      critical: data.servers.critical,
      icon: <StorageIcon sx={{ fontSize: '2rem', color: '#22C55E' }} />,
    },
    {
      label: 'Cloud',
      total: data.cloud.total,
      healthy: data.cloud.healthy,
      warning: data.cloud.warning,
      critical: data.cloud.critical,
      icon: <CloudIcon sx={{ fontSize: '2rem', color: '#22D3EE' }} />,
    },
    {
      label: 'Network',
      total: data.network.total,
      healthy: data.network.healthy,
      warning: data.network.warning,
      critical: data.network.critical,
      icon: <RouterIcon sx={{ fontSize: '2rem', color: '#7C3AED' }} />,
    },
  ];

  return (
    <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          Infrastructure Health Overview
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category) => {
            const healthPercentage = (category.healthy / category.total) * 100;
            const warningPercentage = (category.warning / category.total) * 100;
            const criticalPercentage = (category.critical / category.total) * 100;

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={category.label}
                onClick={() => onCategoryClick?.(category.label)}
                sx={{
                  cursor: onCategoryClick ? 'pointer' : 'default',
                  p: 2,
                  borderRadius: 2,
                  background: '#0B1020',
                  border: '1px solid #334155',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    background: '#1B2435',
                  },
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {category.icon}
                    <Stack spacing={0}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {category.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.total} total
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Health percentage bar */}
                  <Box sx={{ position: 'relative', height: 6, borderRadius: 3, overflow: 'hidden', background: '#0B1020' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        height: '100%',
                        background: '#22C55E',
                        width: `${healthPercentage}%`,
                        transition: 'width 0.3s ease',
                      }}
                    />
                    {warningPercentage > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          height: '100%',
                          background: '#F59E0B',
                          left: `${healthPercentage}%`,
                          width: `${warningPercentage}%`,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    )}
                    {criticalPercentage > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          height: '100%',
                          background: '#EF4444',
                          left: `${healthPercentage + warningPercentage}%`,
                          width: `${criticalPercentage}%`,
                          transition: 'width 0.3s ease',
                        }}
                      />
                    )}
                  </Box>

                  {/* Status badges */}
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#22C55E',
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {category.healthy} Healthy
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#F59E0B',
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {category.warning} Warning
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#EF4444',
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {category.critical} Critical
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}
