import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';

interface AtRiskAsset {
  id: string;
  name: string;
  type: string;
  cpu: string;
  memory: string;
  disk: string;
  network: string;
  status: 'Critical' | 'Warning' | 'Healthy';
}

type SortField = 'cpu' | 'memory' | 'disk' | 'network' | 'status' | 'name';

interface AtRiskAssetsProps {
  assets: AtRiskAsset[];
  onAssetClick?: (asset: AtRiskAsset) => void;
}

export default function AtRiskAssets({ assets, onAssetClick }: AtRiskAssetsProps) {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [sortField, setSortField] = useState<SortField>('cpu');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const parsePercentage = (value: string): number => {
    return parseInt(value) || 0;
  };

  const sortedAssets = [...assets].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField !== 'status' && sortField !== 'name') {
      aVal = parsePercentage(aVal);
      bVal = parsePercentage(bVal);
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Critical':
        return '#EF4444';
      case 'Warning':
        return '#F59E0B';
      case 'Healthy':
        return '#22C55E';
      default:
        return '#7C3AED';
    }
  };

  const getUsageColor = (value: string): string => {
    const percentage = parsePercentage(value);
    if (percentage >= 85) return '#EF4444';
    if (percentage >= 70) return '#F59E0B';
    return '#22C55E';
  };

  const SortableCell = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableCell
      onClick={() => handleSort(field)}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'rgba(124, 58, 237, 0.1)',
        },
      }}
    >
      <TableSortLabel
        active={sortField === field}
        direction={sortField === field ? sortOrder : 'asc'}
        onClick={() => handleSort(field)}
      >
        {children}
      </TableSortLabel>
    </TableCell>
  );

  if (isMobile) {
    return (
      <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            At-Risk Assets
          </Typography>
          <Stack spacing={2}>
            {sortedAssets.map((asset) => (
              <Box
                key={asset.id}
                onClick={() => onAssetClick?.(asset)}
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${getStatusColor(asset.status)}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    borderColor: '#7C3AED',
                  },
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack spacing={0}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {asset.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {asset.id}
                      </Typography>
                    </Stack>
                    <Chip
                      label={asset.status}
                      size="small"
                      sx={{
                        background: getStatusColor(asset.status),
                        color: '#FFFFFF',
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Typography variant="caption">
                      CPU: <span style={{ color: getUsageColor(asset.cpu), fontWeight: 600 }}>{asset.cpu}</span>
                    </Typography>
                    <Typography variant="caption">
                      Memory: <span style={{ color: getUsageColor(asset.memory), fontWeight: 600 }}>{asset.memory}</span>
                    </Typography>
                    <Typography variant="caption">
                      Disk: <span style={{ color: getUsageColor(asset.disk), fontWeight: 600 }}>{asset.disk}</span>
                    </Typography>
                    <Typography variant="caption">
                      Network: <span style={{ color: getUsageColor(asset.network), fontWeight: 600 }}>{asset.network}</span>
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          At-Risk Assets
        </Typography>
        <TableContainer sx={{ borderRadius: 1.5, background: '#0B1020' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: 'rgba(124, 58, 237, 0.1)' }}>
                <TableCell sx={{ fontWeight: 700 }}>Asset</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                <SortableCell field="cpu">CPU</SortableCell>
                <SortableCell field="memory">Memory</SortableCell>
                <SortableCell field="disk">Disk</SortableCell>
                <SortableCell field="network">Network</SortableCell>
                <SortableCell field="status">Status</SortableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAssets.map((asset, index) => (
                <TableRow
                  key={asset.id}
                  onClick={() => onAssetClick?.(asset)}
                  sx={{
                    cursor: 'pointer',
                    background: index % 2 === 0 ? 'transparent' : 'rgba(124, 58, 237, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.1)',
                      '& td': {
                        color: '#F8FAFC',
                      },
                    },
                  }}
                >
                  <TableCell>
                    <Stack spacing={0}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {asset.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {asset.id}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip label={asset.type} size="small" variant="outlined" sx={{ borderColor: '#334155' }} />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: getUsageColor(asset.cpu),
                      }}
                    >
                      {asset.cpu}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: getUsageColor(asset.memory),
                      }}
                    >
                      {asset.memory}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: getUsageColor(asset.disk),
                      }}
                    >
                      {asset.disk}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: getUsageColor(asset.network),
                      }}
                    >
                      {asset.network}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={asset.status}
                      size="small"
                      sx={{
                        background: getStatusColor(asset.status),
                        color: '#FFFFFF',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
