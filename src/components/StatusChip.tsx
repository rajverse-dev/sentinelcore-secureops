import { Chip } from '@mui/material';

interface StatusChipProps {
  label: string;
  severity?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

export default function StatusChip({ label, severity = 'default' }: StatusChipProps) {
  const colorMap = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
    default: 'default'
  } as const;

  return <Chip label={label} color={colorMap[severity]} size="small" variant="outlined" />;
}
