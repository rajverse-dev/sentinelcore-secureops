import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  severity: 'Critical' | 'Warning' | 'Info';
}

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAsRead?: (notificationId: string) => void;
  onClearAll?: () => void;
  onMarkAllAsRead?: () => void;
}

export default function NotificationCenter({
  notifications,
  onNotificationClick,
  onMarkAsRead,
  onClearAll,
  onMarkAllAsRead,
}: NotificationCenterProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'Critical':
        return '🔴';
      case 'Warning':
        return '🟡';
      case 'Info':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'Critical':
        return '#EF4444';
      case 'Warning':
        return '#F59E0B';
      case 'Info':
        return '#22D3EE';
      default:
        return '#A7B0C0';
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <Tooltip title={`${unreadCount} unread notifications`}>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleOpen}
            sx={{
              color: unreadCount > 0 ? '#EF4444' : '#A7B0C0',
              transition: 'all 0.3s ease',
              '&:hover': {
                color: '#7C3AED',
              },
            }}
          >
            {unreadCount > 0 ? (
              <NotificationsActiveIcon sx={{ fontSize: '1.5rem' }} />
            ) : (
              <NotificationsIcon sx={{ fontSize: '1.5rem' }} />
            )}
          </IconButton>

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)',
              }}
            >
              {unreadCount}
            </Box>
          )}
        </Box>
      </Tooltip>

      {/* Notification Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            background: '#151C2C',
            border: '1px solid #334155',
            borderRadius: 2,
            boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.5)',
            maxWidth: 400,
            width: '100%',
          },
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Stack spacing={0}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Notifications
              </Typography>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            <Divider sx={{ borderColor: '#334155' }} />

            {/* Notification List */}
            {notifications.length > 0 ? (
              <List sx={{ maxHeight: 400, overflow: 'auto', p: 0 }}>
                {notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <ListItem
                      disablePadding
                      secondaryAction={
                        notification.unread && (
                          <Tooltip title="Mark as read">
                            <IconButton
                              edge="end"
                              size="small"
                              onClick={() => onMarkAsRead?.(notification.id)}
                              sx={{
                                color: '#7C3AED',
                              }}
                            >
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#7C3AED' }} />
                            </IconButton>
                          </Tooltip>
                        )
                      }
                      sx={{
                        background: notification.unread ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                        borderLeft: `3px solid ${getSeverityColor(notification.severity)}`,
                        p: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(124, 58, 237, 0.1)',
                        },
                      }}
                      onClick={() => {
                        onNotificationClick?.(notification);
                        handleClose();
                      }}
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              {getSeverityIcon(notification.severity)}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                opacity: notification.unread ? 1 : 0.7,
                              }}
                            >
                              {notification.title}
                            </Typography>
                            <Chip
                              label={notification.severity}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                background: getSeverityColor(notification.severity),
                                color: '#FFFFFF',
                                fontWeight: 600,
                              }}
                            />
                          </Stack>
                        }
                        secondary={
                          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              {notification.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#A7B0C0', fontSize: '0.7rem' }}>
                              {notification.time}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                    {index < notifications.length - 1 && (
                      <Divider sx={{ borderColor: '#334155' }} />
                    )}
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">No notifications</Typography>
              </Box>
            )}

            {notifications.length > 0 && (
              <>
                <Divider sx={{ borderColor: '#334155' }} />

                {/* Action Buttons */}
                <Stack direction="row" spacing={1} sx={{ p: 2 }}>
                  {unreadCount > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DoneAllIcon />}
                      onClick={() => {
                        onMarkAllAsRead?.();
                      }}
                      sx={{
                        flex: 1,
                        borderColor: '#7C3AED',
                        color: '#7C3AED',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        '&:hover': {
                          backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        },
                      }}
                    >
                      Mark All
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ClearAllIcon />}
                    onClick={() => {
                      onClearAll?.();
                      handleClose();
                    }}
                    sx={{
                      flex: 1,
                      borderColor: '#334155',
                      color: '#A7B0C0',
                      textTransform: 'capitalize',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      '&:hover': {
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderColor: '#EF4444',
                        color: '#EF4444',
                      },
                    }}
                  >
                    Clear
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </CardContent>
      </Popover>
    </>
  );
}
