import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';

interface SidebarBadgeProps {
  count: number;
  variant?: 'alert' | 'info' | 'success';
  size?: 'small' | 'medium';
}

export default function SidebarBadge({ count, variant = 'info', size = 'small' }: SidebarBadgeProps) {
  const colors = {
    alert: { bg: '#EF4444', text: '#FFFFFF' },
    info: { bg: 'rgba(34, 211, 238, 0.2)', text: '#22D3EE' },
    success: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22C55E' },
  };

  const colors_obj = colors[variant];
  const fontSize = size === 'small' ? '0.7rem' : '0.8rem';

  return (
    <Chip
      label={count.toString()}
      size="small"
      sx={{
        height: size === 'small' ? 18 : 22,
        background: colors_obj.bg,
        color: colors_obj.text,
        fontWeight: 700,
        fontSize,
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
}
