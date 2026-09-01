import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';

interface SnapshotMetric {
  label: string;
  value: string;
  status: string;
  icon: string;
}

interface QuickInfrastructureSnapshotProps {
  metrics: SnapshotMetric[];
  onMetricClick?: (metric: string) => void;
}

export default function QuickInfrastructureSnapshot({
  metrics,
  onMetricClick,
}: QuickInfrastructureSnapshotProps) {
  const getValueAsNumber = (value: string): number => {
    return parseInt(value) || 0;
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return '#22C55E';
      case 'warning':
        return '#F59E0B';
      case 'critical':
        return '#EF4444';
      default:
        return '#7C3AED';
    }
  };

  return (
    <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Quick Infrastructure Snapshot
          </Typography>

          <Stack spacing={2}>
            {metrics.map((metric, index) => {
              const numValue = getValueAsNumber(metric.value);
              const statusColor = getStatusColor(metric.status);

              return (
                <Box
                  key={metric.label}
                  onClick={() => onMetricClick?.(metric.label)}
                  sx={{
                    p: 2,
                    borderRadius: 1.5,
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid #334155',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.1)',
                      borderColor: '#7C3AED',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack direction="row" spacing={1} alignItems="center" flex={1}>
                        <Typography variant="h6" sx={{ opacity: 0.7 }}>
                          {metric.icon}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {metric.label}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: statusColor,
                            boxShadow: `0 0 8px ${statusColor}`,
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 700, color: statusColor }}>
                          {metric.value}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Progress bar */}
                    <LinearProgress
                      variant="determinate"
                      value={numValue}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        background: 'rgba(52, 211, 153, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: statusColor,
                          transition: 'all 0.3s ease',
                          borderRadius: 2,
                        },
                      }}
                    />

                    <Typography variant="caption" color="text.secondary">
                      Status: <span style={{ color: statusColor, fontWeight: 600 }}>{metric.status}</span>
                    </Typography>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
