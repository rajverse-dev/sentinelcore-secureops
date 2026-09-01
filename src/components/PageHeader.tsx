import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  ButtonGroup,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onTimeRangeChange?: (range: 'last24h' | 'last7d' | 'last30d') => void;
  onSettingsClick?: () => void;
  showTimeRange?: boolean;
  showSettings?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  onTimeRangeChange,
  onSettingsClick,
  showTimeRange = true,
  showSettings = true,
}: PageHeaderProps) {
  const [timeRange, setTimeRange] = useState<'last24h' | 'last7d' | 'last30d'>('last24h');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleTimeRangeChange = (range: 'last24h' | 'last7d' | 'last30d') => {
    setTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const timeRangeLabels = {
    last24h: 'Last 24 Hours',
    last7d: 'Last 7 Days',
    last30d: 'Last 30 Days',
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Stack spacing={1} flex={1}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
          {showTimeRange && (
            <Tooltip title="Select time range for data display">
              <ButtonGroup size="small" variant="outlined">
                {(
                  [
                    { key: 'last24h', label: 'Last 24H' },
                    { key: 'last7d', label: 'Last 7D' },
                    { key: 'last30d', label: 'Last 30D' },
                  ] as const
                ).map((option) => (
                  <Button
                    key={option.key}
                    onClick={() => handleTimeRangeChange(option.key)}
                    sx={{
                      color: timeRange === option.key ? '#FFFFFF' : '#A7B0C0',
                      borderColor: '#334155',
                      backgroundColor: timeRange === option.key ? '#7C3AED' : 'transparent',
                      textTransform: 'capitalize',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor:
                          timeRange === option.key
                            ? '#7C3AED'
                            : 'rgba(124, 58, 237, 0.1)',
                      },
                    }}
                  >
                    {option.label}
                  </Button>
                ))}
              </ButtonGroup>
            </Tooltip>
          )}

          {showSettings && (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Settings">
                <IconButton
                  size="small"
                  onClick={onSettingsClick}
                  sx={{
                    color: '#A7B0C0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#7C3AED',
                      background: 'rgba(124, 58, 237, 0.1)',
                    },
                  }}
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="User Profile">
                <IconButton
                  size="small"
                  onClick={handleUserMenuOpen}
                  sx={{
                    color: '#A7B0C0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#7C3AED',
                      background: 'rgba(124, 58, 237, 0.1)',
                    },
                  }}
                >
                  <PersonIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>
      </Stack>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            background: '#151C2C',
            border: '1px solid #334155',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
          <PersonIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#7C3AED' }} />
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.5 }}>
          <SettingsIcon sx={{ mr: 1, fontSize: '1.2rem', color: '#7C3AED' }} />
          <Typography variant="body2">Settings</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
