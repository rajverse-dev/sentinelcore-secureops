import { useMemo, useState } from 'react';
import { Alert, Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import { assetData, AssetRecord } from '../data/assets';

export default function AssetsPage() {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading] = useState(false);
  const [error] = useState('');

  const filteredAssets = useMemo(() => {
    return assetData.filter((asset) => {
      const searchTerm = query.toLowerCase();
      const matchesQuery = !searchTerm || [asset.id, asset.name, asset.ip, asset.environment].some((value) => value.toLowerCase().includes(searchTerm));
      const matchesType = typeFilter === 'All' || asset.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [query, typeFilter, statusFilter]);

  const renderStatus = (status: AssetRecord['status']) => {
    const severityMap = {
      Healthy: 'success',
      Warning: 'warning',
      Critical: 'error'
    } as const;
    return <StatusChip label={status} severity={severityMap[status]} />;
  };

  return (
    <>
      <PageHeader title="Asset Inventory" subtitle="Infrastructure asset monitoring inventory" />

      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Search assets" value={query} onChange={(e) => setQuery(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Asset type</InputLabel>
              <Select value={typeFilter} label="Asset type" onChange={(e) => setTypeFilter(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Server">Server</MenuItem>
                <MenuItem value="Cloud">Cloud</MenuItem>
                <MenuItem value="Network">Network</MenuItem>
                <MenuItem value="Storage">Storage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Healthy">Healthy</MenuItem>
                <MenuItem value="Warning">Warning</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && filteredAssets.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">No assets match the current filters.</Typography>
        </Paper>
      )}

      {!loading && !error && filteredAssets.length > 0 && (
        <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Asset ID</TableCell>
                <TableCell>Asset Name</TableCell>
                <TableCell>Asset Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Environment</TableCell>
                <TableCell>CPU</TableCell>
                <TableCell>Memory</TableCell>
                <TableCell>Disk</TableCell>
                <TableCell>Network</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell>{asset.id}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{renderStatus(asset.status)}</TableCell>
                  <TableCell>{asset.ip}</TableCell>
                  <TableCell>{asset.environment}</TableCell>
                  <TableCell>{asset.cpu}</TableCell>
                  <TableCell>{asset.memory}</TableCell>
                  <TableCell>{asset.disk}</TableCell>
                  <TableCell>{asset.network}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
