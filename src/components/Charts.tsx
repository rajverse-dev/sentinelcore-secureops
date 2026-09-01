import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

interface LineChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export function LineChart({ data, color = '#8B5CF6', height = 220 }: LineChartProps) {
  const { colors } = useTheme();
  const width = 520;
  const padding = 18;
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="resource usage chart">
      {[0, 1, 2, 3].map((step) => {
        const y = padding + (step * (height - padding * 2)) / 3;
        return <line key={step} x1={padding} x2={width - padding} y1={y} y2={y} stroke={colors.border} strokeWidth={1} />;
      })}
      <polyline fill="none" stroke={color} strokeWidth={3} points={points} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((value, index) => {
        const x = padding + (index * (width - padding * 2)) / Math.max(data.length - 1, 1);
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return <circle key={`${color}-${index}`} cx={x} cy={y} r={3.5} fill={color} />;
      })}
    </svg>
  );
}

interface DonutChartProps {
  segments: Array<{ label: string; value: number; color: string }>; 
}

export function DonutChart({ segments }: DonutChartProps) {
  const { colors } = useTheme();
  const total = segments.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
      <svg width={180} height={180} viewBox="0 0 180 180" role="img" aria-label="asset health distribution">
        <circle cx="90" cy="90" r={radius} fill="none" stroke={colors.border} strokeWidth="18" />
        {segments.map((segment) => {
          const dash = (segment.value / total) * circumference;
          const circle = (
            <circle
              key={segment.label}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="18"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 90 90)"
              strokeLinecap="round"
            />
          );
          offset += dash;
          return circle;
        })}
        <text x="90" y="82" textAnchor="middle" fill={colors.primaryText} fontSize="24" fontWeight="700">{total}</text>
        <text x="90" y="102" textAnchor="middle" fill={colors.secondaryText} fontSize="12">assets</text>
      </svg>
      <Box>
        {segments.map((segment) => (
          <Box key={segment.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ width: 10, height: 10, bgcolor: segment.color, borderRadius: '50%' }} />
            <Typography variant="body2" sx={{ minWidth: 84 }}>{segment.label}</Typography>
            <Typography variant="body2" color="text.secondary">{segment.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
