import { Card, CardContent, Stack, Typography } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export default function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>{value}</Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
