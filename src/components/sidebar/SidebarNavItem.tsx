import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import { NavLink } from 'react-router-dom';

interface SidebarNavItemProps {
  label: string;
  to: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  status?: 'operational' | 'warning' | 'critical';
  isCollapsed?: boolean;
}

export default function SidebarNavItem({
  label,
  to,
  icon,
  badge,
  status,
  isCollapsed = false,
}: SidebarNavItemProps) {
  const statusColors = {
    operational: '#22C55E',
    warning: '#F59E0B',
    critical: '#EF4444',
  };

  const statusColor = status ? statusColors[status] : undefined;

  const content = (
    <ListItemButton
      component={NavLink}
      to={to}
      sx={{
        borderRadius: 2,
        color: 'text.primary',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        pl: isCollapsed ? 1.5 : 2,
        pr: isCollapsed ? 1.5 : 2,
        py: isCollapsed ? 1.5 : 1.25,
        gap: isCollapsed ? 0 : 2,
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 3,
          height: '60%',
          background: '#7C3AED',
          borderRadius: '0 2px 2px 0',
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&.active': {
          backgroundColor: 'rgba(124, 58, 237, 0.12)',
          color: '#7C3AED',
          '& .MuiListItemIcon-root': {
            color: '#7C3AED',
          },
          '&::before': {
            opacity: 1,
          },
        },
        '&:hover': {
          backgroundColor: 'rgba(124, 58, 237, 0.08)',
          '& .MuiListItemIcon-root': {
            transform: 'scale(1.1)',
          },
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: isCollapsed ? 0 : 40,
          color: 'inherit',
          transition: 'transform 0.3s ease',
          display: 'flex',
          justifyContent: 'center',
          fontSize: isCollapsed ? '1.5rem' : 'inherit',
        }}
      >
        {icon}
      </ListItemIcon>

      {!isCollapsed && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flex={1}
          spacing={1}
        >
          <Stack direction="row" alignItems="center" spacing={1} flex={1}>
            <ListItemText
              primary={label}
              primaryTypographyProps={{
                variant: 'body2',
                sx: {
                  fontWeight: 600,
                  fontSize: '0.9rem',
                },
              }}
            />
            {status && (
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: statusColor,
                  flexShrink: 0,
                }}
              />
            )}
          </Stack>

          {badge && <Box sx={{ ml: 'auto', flexShrink: 0 }}>{badge}</Box>}
        </Stack>
      )}
    </ListItemButton>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={label} arrow placement="right">
        <ListItem disablePadding sx={{ mb: 1 }}>
          {content}
        </ListItem>
      </Tooltip>
    );
  }

  return (
    <ListItem disablePadding sx={{ mb: 1 }}>
      {content}
    </ListItem>
  );
}
