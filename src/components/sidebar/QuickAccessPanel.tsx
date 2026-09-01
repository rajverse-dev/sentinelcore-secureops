import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { NavLink } from 'react-router-dom';

interface QuickAccessPanelProps {
  isCollapsed: boolean;
  criticalAlertsCount?: number;
  atRiskAssetsCount?: number;
}

export default function QuickAccessPanel({
  isCollapsed,
  criticalAlertsCount = 3,
  atRiskAssetsCount = 22,
}: QuickAccessPanelProps) {
  const quickAccessItems = [
    {
      label: 'Critical Alerts',
      to: '/alerts',
      icon: <ErrorIcon />,
      count: criticalAlertsCount,
      color: '#EF4444',
    },
    {
      label: 'At-Risk Assets',
      to: '/assets',
      icon: <WarningIcon />,
      count: atRiskAssetsCount,
      color: '#F59E0B',
    },
    {
      label: 'Infrastructure Health',
      to: '/monitoring',
      icon: <HealthAndSafetyIcon />,
      count: null,
      color: '#22C55E',
    },
  ];

  if (isCollapsed) {
    return null;
  }

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        background: 'rgba(124, 58, 237, 0.05)',
        borderTop: '1px solid #263244',
        borderBottom: '1px solid #263244',
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
          ml: 1,
        }}
      >
        QUICK ACCESS
      </Typography>

      <List sx={{ p: 0 }}>
        {quickAccessItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.to}
              sx={{
                borderRadius: 1.5,
                color: 'text.primary',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pl: 1.5,
                pr: 1,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(124, 58, 237, 0.08)',
                  '& .MuiListItemIcon-root': {
                    color: item.color,
                    transform: 'scale(1.1)',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 32,
                  color: item.color,
                  transition: 'all 0.3s ease',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: {
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  },
                }}
              />
              {item.count !== null && (
                <Box
                  sx={{
                    background: item.color + '30',
                    color: item.color,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {item.count}
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
