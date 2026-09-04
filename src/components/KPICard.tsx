import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface KPICardProps {
  title: string;
  value: string;
  trend?: string;
  trendTime?: string;
  icon?: string;
  onClick?: () => void;
  status?: 'healthy' | 'warning' | 'critical';
}

export default function KPICard({
  title,
  value,
  trend,
  trendTime,
  icon,
  onClick,
  status,
}: KPICardProps) {
  const isTrendPositive = trend?.startsWith('+');
  const trendColor = isTrendPositive ? '#22C55E' : isTrendPositive === false ? '#EF4444' : '#A7B0C0';

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        background: '#151C2C',
        border: '1px solid #334155',
        borderRadius: 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background:
            status === 'critical'
              ? '#EF4444'
              : status === 'warning'
              ? '#F59E0B'
              : status === 'healthy'
              ? '#22C55E'
              : '#7C3AED',
          transition: 'all 0.3s ease',
        },
        '&:hover': {
          borderColor: '#7C3AED',
          boxShadow: '0px 12px 48px rgba(124, 58, 237, 0.2)',
          transform: 'translateY(-4px)',
          '&::before': {
            height: '4px',
          },
        },
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography
              variant="body2"
              sx={{
                color: '#A7B0C0',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              {title}
            </Typography>
            {icon && (
              <Typography variant="h5" sx={{ opacity: 0.7 }}>
                {icon}
              </Typography>
            )}
          </Stack>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#F8FAFC',
              fontSize: '1.875rem',
              letterSpacing: '-0.5px',
            }}
          >
            {value}
          </Typography>

          {trend && (
            <Tooltip title={trendTime || 'Trend'}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  color: trendColor,
                  cursor: 'help',
                  fontSize: '0.75rem',
                }}
              >
                {isTrendPositive ? (
                  <TrendingUpIcon sx={{ fontSize: '1rem' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: '1rem' }} />
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: trendColor,
                    fontWeight: 600,
                  }}
                >
                  {trend} {trendTime}
                </Typography>
              </Stack>
            </Tooltip>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
