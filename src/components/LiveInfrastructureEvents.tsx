import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

interface InfrastructureEvent {
  id: string;
  asset: string;
  assetType: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: string;
}

interface LiveInfrastructureEventsProps {
  events: InfrastructureEvent[];
  onViewAll?: () => void;
  onEventClick?: (event: InfrastructureEvent) => void;
}

export default function LiveInfrastructureEvents({
  events,
  onViewAll,
  onEventClick,
}: LiveInfrastructureEventsProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <ErrorIcon sx={{ fontSize: '1.25rem', color: '#EF4444' }} />;
      case 'Warning':
        return <WarningIcon sx={{ fontSize: '1.25rem', color: '#F59E0B' }} />;
      case 'Info':
        return <InfoIcon sx={{ fontSize: '1.25rem', color: '#22D3EE' }} />;
      default:
        return <CheckCircleIcon sx={{ fontSize: '1.25rem', color: '#22C55E' }} />;
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
        return '#22C55E';
    }
  };

  const getSeverityBgColor = (severity: string): string => {
    switch (severity) {
      case 'Critical':
        return 'rgba(239, 68, 68, 0.1)';
      case 'Warning':
        return 'rgba(245, 158, 11, 0.1)';
      case 'Info':
        return 'rgba(34, 211, 238, 0.1)';
      default:
        return 'rgba(34, 197, 94, 0.1)';
    }
  };

  return (
    <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Live Infrastructure Events
            </Typography>
            {events.length > 0 && (
              <Chip
                label={events.length}
                size="small"
                sx={{
                  background: 'rgba(124, 58, 237, 0.2)',
                  color: '#7C3AED',
                  fontWeight: 600,
                }}
              />
            )}
          </Stack>

          <Stack spacing={1.5}>
            {events.slice(0, 5).map((event) => (
              <Box
                key={event.id}
                onClick={() => onEventClick?.(event)}
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  background: getSeverityBgColor(event.severity),
                  border: `1px solid ${getSeverityColor(event.severity)}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    borderColor: '#7C3AED',
                    background: 'rgba(124, 58, 237, 0.1)',
                  },
                }}
              >
                <Stack spacing={1}>
                  {/* Header */}
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ pt: 0.3 }}>{getSeverityIcon(event.severity)}</Box>

                    <Stack spacing={0.5} flex={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {event.asset}
                        </Typography>
                        <Chip
                          label={event.assetType}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            borderColor: '#334155',
                            color: '#A7B0C0',
                          }}
                        />
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        {event.message}
                      </Typography>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {event.timestamp}
                        </Typography>
                        <Chip
                          label={event.severity}
                          size="small"
                          sx={{
                            background: getSeverityColor(event.severity),
                            color: '#FFFFFF',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: 20,
                          }}
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            ))}

            {events.length === 0 && (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid #22C55E',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: '2.5rem', color: '#22C55E', mb: 1 }} />
                <Typography color="text.secondary">
                  No events detected
                </Typography>
              </Box>
            )}
          </Stack>

          {events.length > 0 && (
            <Button
              fullWidth
              variant="outlined"
              onClick={onViewAll}
              sx={{
                borderColor: '#7C3AED',
                color: '#7C3AED',
                textTransform: 'capitalize',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(124, 58, 237, 0.1)',
                },
                mt: 1,
              }}
            >
              View All Events
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
