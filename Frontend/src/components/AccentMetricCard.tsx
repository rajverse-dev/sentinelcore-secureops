import { ReactNode } from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';

interface AccentMetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
  icon?: ReactNode;
}

export default function AccentMetricCard({ label, value, subtitle, color, icon }: AccentMetricCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        border: `1px solid ${color}66`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': { content: '""', position: 'absolute', inset: '0 0 auto', height: 3, bgcolor: color },
        '&:hover': { borderColor: color, boxShadow: `0 12px 34px ${color}26` }
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.35 }}>
              {label}
            </Typography>
            {icon && <Stack sx={{ color, bgcolor: `${color}1A`, p: 0.7, borderRadius: 1 }}>{icon}</Stack>}
          </Stack>
          <Typography variant="h4" sx={{ color: '#F8FAFC', fontWeight: 800 }}>{value}</Typography>
          {subtitle && <Typography variant="caption" sx={{ color: '#94A3B8' }}>{subtitle}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}
