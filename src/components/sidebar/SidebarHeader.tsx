import React from 'react';
import { Box, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarHeader({ isCollapsed, onToggleCollapse }: SidebarHeaderProps) {
  return (
    <Box
      sx={{
        p: 2,
        background: '#101827',
        borderBottom: '1px solid #263244',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: 80,
      }}
    >
      {!isCollapsed && (
        <Stack spacing={0.5} flex={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <SecurityIcon
              sx={{
                color: '#7C3AED',
                fontSize: '1.5rem',
              }}
            />
            <Stack spacing={0}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: '#F8FAFC',
                  fontSize: '0.95rem',
                  lineHeight: 1,
                }}
              >
                SentinelCore
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#7C3AED',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  letterSpacing: '0.5px',
                }}
              >
                SecureOps
              </Typography>
            </Stack>
          </Stack>
          <Typography
            variant="caption"
            sx={{
              color: '#94A3B8',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '1px',
              ml: 3.5,
            }}
          >
            SECURITY OPERATIONS
          </Typography>
        </Stack>
      )}

      {isCollapsed && (
        <Tooltip title="SentinelCore SecureOps">
          <SecurityIcon
            sx={{
              color: '#7C3AED',
              fontSize: '2rem',
              transition: 'all 0.3s ease',
            }}
          />
        </Tooltip>
      )}

      <Tooltip title={isCollapsed ? 'Expand' : 'Collapse'}>
        <IconButton
          onClick={onToggleCollapse}
          size="small"
          sx={{
            color: '#94A3B8',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#7C3AED',
              background: 'rgba(124, 58, 237, 0.1)',
            },
          }}
        >
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
