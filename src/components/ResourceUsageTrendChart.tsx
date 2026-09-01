import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  ButtonGroup,
  Button,
  Tooltip,
} from '@mui/material';

interface DataPoint {
  label: string;
  value: number;
}

interface ResourceUsageTrendChartProps {
  data: Record<string, DataPoint[]>;
  height?: number;
  onMetricChange?: (metric: string) => void;
}

export default function ResourceUsageTrendChart({
  data,
  height = 280,
  onMetricChange,
}: ResourceUsageTrendChartProps) {
  const metrics = Object.keys(data);
  const [selectedMetric, setSelectedMetric] = useState(metrics[0] || 'CPU');

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
    onMetricChange?.(metric);
  };

  const currentData = data[selectedMetric] || [];
  const maxValue = Math.max(...currentData.map((d) => d.value), 100);
  const minValue = Math.min(...currentData.map((d) => d.value), 0);
  const range = maxValue - minValue || 1;

  const width = 100; // percentage
  const padding = 3; // percentage
  const chartWidth = width - padding * 2;

  const points = currentData
    .map((point, index) => {
      const x = padding + (index / Math.max(currentData.length - 1, 1)) * chartWidth;
      const y = 100 - ((point.value - minValue) / range) * 90;
      return { x, y, value: point.value, label: point.label };
    });

  const polylinePoints = points.map((p) => `${p.x}% ${p.y}%`).join(' ');

  const getMetricColor = (metric: string): string => {
    const colors: Record<string, string> = {
      CPU: '#7C3AED',
      Memory: '#4F46E5',
      Disk: '#22D3EE',
      Network: '#F59E0B',
    };
    return colors[metric] || '#7C3AED';
  };

  const metricColor = getMetricColor(selectedMetric);

  return (
    <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start">
            <Stack spacing={1}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Resource Usage Trend
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 24 hours
              </Typography>
            </Stack>

            <ButtonGroup size="small" variant="outlined">
              {metrics.map((metric) => (
                <Tooltip key={metric} title={`View ${metric} usage trend`}>
                  <Button
                    onClick={() => handleMetricChange(metric)}
                    sx={{
                      color: selectedMetric === metric ? '#FFFFFF' : '#A7B0C0',
                      borderColor: '#334155',
                      backgroundColor: selectedMetric === metric ? metricColor : 'transparent',
                      '&:hover': {
                        backgroundColor:
                          selectedMetric === metric
                            ? metricColor
                            : 'rgba(124, 58, 237, 0.1)',
                      },
                      textTransform: 'capitalize',
                      fontWeight: 600,
                    }}
                  >
                    {metric}
                  </Button>
                </Tooltip>
              ))}
            </ButtonGroup>
          </Stack>

          {/* Chart */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingBottom: `${(height / window.innerWidth) * 100}%`,
              minHeight: height,
            }}
          >
            <svg
              viewBox="0 0 100 100"
              width="100%"
              height={height}
              style={{ position: 'absolute', top: 0, left: 0 }}
              role="img"
              aria-label={`${selectedMetric} usage trend chart`}
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((step) => {
                const y = padding + (step * (100 - padding * 2)) / 4;
                return (
                  <line
                    key={`grid-${step}`}
                    x1={padding}
                    x2={100 - padding}
                    y1={y}
                    y2={y}
                    stroke="#334155"
                    strokeWidth="0.1"
                    opacity="0.5"
                  />
                );
              })}

              {/* X-axis */}
              <line
                x1={padding}
                x2={100 - padding}
                y1={100 - padding}
                y2={100 - padding}
                stroke="#334155"
                strokeWidth="0.2"
              />

              {/* Y-axis */}
              <line
                x1={padding}
                x2={padding}
                y1={padding}
                y2={100 - padding}
                stroke="#334155"
                strokeWidth="0.2"
              />

              {/* Data line */}
              <polyline
                fill="none"
                stroke={metricColor}
                strokeWidth="0.5"
                points={polylinePoints}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />

              {/* Data points */}
              {points.map((point, index) => (
                <circle
                  key={`point-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="0.3"
                  fill={metricColor}
                  opacity="0.8"
                />
              ))}
            </svg>
          </Box>

          {/* Axis labels */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Min: {minValue.toFixed(0)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Max: {maxValue.toFixed(0)}%
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2}>
              {points.slice(0, 1).length > 0 && (
                <Stack spacing={0.5} alignItems="flex-end">
                  <Typography variant="caption" color="text.secondary">
                    {points[0]?.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: metricColor }}>
                    {points[0]?.value}%
                  </Typography>
                </Stack>
              )}
              {points.slice(-1).length > 0 && (
                <Stack spacing={0.5} alignItems="flex-end">
                  <Typography variant="caption" color="text.secondary">
                    {points[points.length - 1]?.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: metricColor }}>
                    {points[points.length - 1]?.value}%
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>

          {/* Legend */}
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {metrics.map((metric) => (
              <Stack
                key={metric}
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  p: 1,
                  borderRadius: 1,
                  background: selectedMetric === metric ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => handleMetricChange(metric)}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: getMetricColor(metric),
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {metric}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
