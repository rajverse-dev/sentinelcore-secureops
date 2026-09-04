import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';

interface ResourceConsumer {
  id: string;
  name: string;
  resource: string;
  usage: string;
}

interface TopResourceConsumersProps {
  consumers: ResourceConsumer[];
  onAssetClick?: (asset: ResourceConsumer) => void;
}

export default function TopResourceConsumers({
  consumers,
  onAssetClick,
}: TopResourceConsumersProps) {
  const parseUsage = (usage: string): number => {
    return parseInt(usage) || 0;
  };

  const getResourceColor = (resource: string): string => {
    switch (resource.toLowerCase()) {
      case 'cpu':
        return '#7C3AED';
      case 'memory':
        return '#4F46E5';
      case 'disk':
        return '#22D3EE';
      case 'network':
        return '#F59E0B';
      default:
        return '#A7B0C0';
    }
  };

  const getResourceIcon = (resource: string): string => {
    switch (resource.toLowerCase()) {
      case 'cpu':
        return '⚙️';
      case 'memory':
        return '🧠';
      case 'disk':
        return '💾';
      case 'network':
        return '🌐';
      default:
        return '📊';
    }
  };

  return (
    <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Stack spacing={2.5}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Top Resource Consumers
          </Typography>

          <Stack spacing={2}>
            {consumers.slice(0, 5).map((consumer, index) => {
              const usageValue = parseUsage(consumer.usage);
              const color = getResourceColor(consumer.resource);

              return (
                <Tooltip
                  key={consumer.id}
                  title={`Click to view ${consumer.name} details`}
                  arrow
                  placement="right"
                >
                  <Box
                    onClick={() => onAssetClick?.(consumer)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid #334155',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(124, 58, 237, 0.1)',
                        borderColor: color,
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    {/* Rank and Asset */}
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: `${color}20`,
                            border: `1px solid ${color}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color,
                            }}
                          >
                            {index + 1}
                          </Typography>
                        </Box>

                        <Stack spacing={0} flex={1} minWidth={0}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 700,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {consumer.name}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              {getResourceIcon(consumer.resource)}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {consumer.resource}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontWeight: 700,
                            color,
                            textAlign: 'right',
                            minWidth: '3rem',
                            flexShrink: 0,
                          }}
                        >
                          {consumer.usage}
                        </Typography>
                      </Stack>

                      {/* Usage bar */}
                      <LinearProgress
                        variant="determinate"
                        value={usageValue}
                        sx={{
                          height: 3,
                          borderRadius: 1.5,
                          background: 'rgba(52, 211, 153, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: color,
                            borderRadius: 1.5,
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                </Tooltip>
              );
            })}
          </Stack>

          {consumers.length === 0 && (
            <Box
              sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 1.5,
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22C55E',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                No resource data available
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
