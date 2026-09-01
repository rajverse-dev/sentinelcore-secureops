import React, { useState } from 'react';
import {
  Box,
  Stack,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { storage } from '../../utils/storage';

interface UserProfilePanelProps {
  isCollapsed: boolean;
  userName?: string;
  userRole?: string;
}

export default function UserProfilePanel({
  isCollapsed,
  userName = 'Ops Admin',
  userRole = 'SOC Console',
}: UserProfilePanelProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    storage.clear();
    window.location.href = '/login';
  };

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (isCollapsed) {
    return (
      <Box
        onClick={handleClick}
        sx={{
          p: 1.5,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(124, 58, 237, 0.1)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: '#7C3AED',
            fontWeight: 700,
            fontSize: '0.9rem',
            margin: '0 auto',
          }}
        >
          {initials}
        </Avatar>
      </Box>
    );
  }

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          p: 2,
          borderTop: '1px solid #263244',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: open ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
          '&:hover': {
            background: 'rgba(124, 58, 237, 0.12)',
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: '#7C3AED',
              fontWeight: 700,
              fontSize: '0.9rem',
              flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>

          <Stack spacing={0} flex={1} minWidth={0}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: '#F8FAFC',
                fontSize: '0.9rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#94A3B8',
                fontSize: '0.8rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userRole}
            </Typography>
          </Stack>

          <Box
            sx={{
              fontSize: '1.2rem',
              color: '#7C3AED',
              transition: 'transform 0.3s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ▼
          </Box>
        </Stack>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: '#1B2435',
            border: '1px solid #263244',
            borderRadius: 2,
            mt: 1,
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose} sx={{ py: 1 }}>
          <ListItemIcon>
            <PersonIcon sx={{ color: '#7C3AED' }} />
          </ListItemIcon>
          <ListItemText
            primary="Profile"
            primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 600 } }}
          />
        </MenuItem>
        <MenuItem onClick={handleClose} sx={{ py: 1 }}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: '#7C3AED' }} />
          </ListItemIcon>
          <ListItemText
            primary="Settings"
            primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 600 } }}
          />
        </MenuItem>
        <Divider sx={{ my: 0.5, borderColor: '#263244' }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#EF4444' }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 600, color: '#EF4444' } }}
          />
        </MenuItem>
      </Menu>
    </>
  );
}
