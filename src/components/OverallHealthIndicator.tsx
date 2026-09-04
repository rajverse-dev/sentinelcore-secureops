import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Chip,
} from '@mui/material';

interface OverallHealthIndicatorProps {
  healthPercentage: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  details?: {
    healthy: number;
    warning: number;
    critical: number;
  };
  onClick?: () => void;
}

export default function OverallHealthIndicator({
  healthPercentage,
  status,
  details,
  onClick,
}: OverallHealthIndicatorProps) {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Healthy':
        return '#22C55E';
      case 'Warning':
        return '#F59E0B';
      case 'Critical':
        return '#EF4444';
      default:
        return '#7C3AED';
    }
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthPercentage / 100) * circumference;
  const statusColor = getStatusColor(status);

  return (
    <Card
      onClick={onClick}
      sx={{
        background: '#151C2C',
        border: '1px solid #334155',
        borderRadius: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: onClick ? '#7C3AED' : '#334155',
          transform: onClick ? 'translateY(-4px)' : 'none',
        },
      }}
    >
      <CardContent>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Infrastructure Health
          </Typography>

          {/* Circular Progress Indicator */}
          <Box sx={{ position: 'relative', width: 180, height: 180 }}>
            <svg
              width={180}
              height={180}
              style={{ transform: 'rotate(-90deg)' }}
              role="img"
              aria-label="Overall infrastructure health indicator"
            >
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#334155"
                strokeWidth="8"
              />

              {/* Progress circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={statusColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{
                  transition: 'all 0.5s ease',
                  filter: `drop-shadow(0 0 12px ${statusColor}40)`,
                }}
              />
            </svg>

            {/* Center content */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 1,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: statusColor,
                  fontSize: '2.5rem',
                  lineHeight: 1,
                }}
              >
                {healthPercentage}
                <Typography
                  component="span"
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  %
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                System Health
              </Typography>
            </Box>
          </Box>

          {/* Status */}
          <Chip
            label={status}
            sx={{
              background: statusColor,
              color: '#FFFFFF',
              fontWeight: 700,
              height: 32,
              fontSize: '0.9rem',
            }}
          />

          {/* Details */}
          {details && (
            <Stack spacing={1.5} width="100%">
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid #22C55E',
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Healthy Assets
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: '#22C55E',
                    }}
                  >
                    {details.healthy}
                  </Typography>
                </Stack>
              </Box>

              {details.warning > 0 && (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid #F59E0B',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Warning Assets
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: '#F59E0B',
                      }}
                    >
                      {details.warning}
                    </Typography>
                  </Stack>
                </Box>
              )}

              {details.critical > 0 && (
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #EF4444',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Critical Assets
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: '#EF4444',
                      }}
                    >
                      {details.critical}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
