import React from 'react';
import {
  Box,
  Typography,
  Stack,
} from '@mui/material';

interface SystemStatusItem {
  label: string;
  status: 'operational' | 'warning' | 'critical';
}

interface SystemStatusPanelProps {
  isCollapsed: boolean;
  items?: SystemStatusItem[];
}

export default function SystemStatusPanel({
  isCollapsed,
  items = [
    { label: 'API', status: 'operational' },
    { label: 'Infrastructure', status: 'operational' },
    { label: 'Network', status: 'operational' },
  ],
}: SystemStatusPanelProps) {
  const statusColors = {
    operational: '#22C55E',
    warning: '#F59E0B',
    critical: '#EF4444',
  };

  const statusLabels = {
    operational: 'Operational',
    warning: 'Warning',
    critical: 'Critical',
  };

  if (isCollapsed) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderTop: '1px solid #263244',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          color: '#94A3B8',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '1px',
          mb: 1.5,
        }}
      >
        SYSTEM STATUS
      </Typography>

      <Stack spacing={1}>
        {items.map((item) => (
          <Stack
            key={item.label}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              p: 1,
              borderRadius: 1,
              background: 'rgba(0, 0, 0, 0.2)',
              border: `1px solid ${statusColors[item.status]}30`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(124, 58, 237, 0.08)',
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: statusColors[item.status],
                  boxShadow: `0 0 6px ${statusColors[item.status]}`,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  color: '#F8FAFC',
                }}
              >
                {item.label}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '0.7rem',
                color: statusColors[item.status],
              }}
            >
              {statusLabels[item.status]}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
