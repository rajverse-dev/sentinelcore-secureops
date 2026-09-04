import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Button,
} from '@mui/material';

interface AssetHealthDistributionProps {
  data: {
    healthy: number;
    warning: number;
    critical: number;
  };
  onStatusClick?: (status: string) => void;
}

export default function AssetHealthDistribution({
  data,
  onStatusClick,
}: AssetHealthDistributionProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const total = data.healthy + data.warning + data.critical;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { label: 'Healthy', value: data.healthy, color: '#22C55E', percentage: (data.healthy / total) * 100 },
    { label: 'Warning', value: data.warning, color: '#F59E0B', percentage: (data.warning / total) * 100 },
    { label: 'Critical', value: data.critical, color: '#EF4444', percentage: (data.critical / total) * 100 },
  ];

  let offset = 0;
  const donutSegments = segments.map((segment) => {
    const dash = (segment.value / total) * circumference;
    const circle = (
      <circle
        key={segment.label}
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={segment.color}
        strokeWidth={hoveredSegment === segment.label ? '22' : '18'}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeDashoffset={-offset}
        transform="rotate(-90 90 90)"
        strokeLinecap="round"
        style={{
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          filter: hoveredSegment && hoveredSegment !== segment.label ? 'opacity(0.6)' : 'opacity(1)',
        }}
        onMouseEnter={() => setHoveredSegment(segment.label)}
        onMouseLeave={() => setHoveredSegment(null)}
        onClick={() => onStatusClick?.(segment.label.toLowerCase())}
      />
    );
    offset += dash;
    return circle;
  });

  return (
    <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Asset Health Distribution
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" justifyContent="center">
            {/* Donut Chart */}
            <Box sx={{ position: 'relative', flex: '0 0 auto' }}>
              <svg width={200} height={200} viewBox="0 0 180 180" role="img" aria-label="asset health distribution">
                <circle cx="90" cy="90" r={radius} fill="none" stroke="#334155" strokeWidth="18" />
                {donutSegments}
                <text
                  x="90"
                  y="82"
                  textAnchor="middle"
                  fill="#F8FAFC"
                  fontSize="32"
                  fontWeight="700"
                >
                  {total}
                </text>
                <text
                  x="90"
                  y="102"
                  textAnchor="middle"
                  fill="#A7B0C0"
                  fontSize="12"
                >
                  assets
                </text>
              </svg>
            </Box>

            {/* Legend and Stats */}
            <Stack spacing={2} flex={1}>
              {segments.map((segment) => (
                <Box
                  key={segment.label}
                  onClick={() => onStatusClick?.(segment.label.toLowerCase())}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    background: hoveredSegment === segment.label ? 'rgba(124, 58, 237, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${segment.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.15)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: segment.color,
                          boxShadow: hoveredSegment === segment.label ? `0 0 12px ${segment.color}` : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      />
                      <Stack spacing={0}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {segment.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {segment.percentage.toFixed(1)}%
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        color: segment.color,
                        minWidth: '3rem',
                        textAlign: 'right',
                      }}
                    >
                      {segment.value}
                    </Typography>
                  </Stack>
                </Box>
              ))}

              <Button
                variant="outlined"
                fullWidth
                onClick={() => onStatusClick?.('all')}
                sx={{
                  mt: 1,
                  borderColor: '#7C3AED',
                  color: '#7C3AED',
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                  },
                }}
              >
                View All Assets
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
