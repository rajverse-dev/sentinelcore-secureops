import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { assetApi } from '../services/api';
import { AssetRecord } from '../data/assets';

const formatEnum = (value: string) => value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (character: string) => character.toUpperCase());

const statusSeverity = (status: string) => {
  if (status === 'ACTIVE') return 'success';
  if (status === 'PENDING') return 'warning';
  return 'error';
};

type AssetForm = Omit<AssetRecord, 'id' | 'createdAt'>;

const emptyForm: AssetForm = {
  name: '',
  type: 'EC2',
  provider: 'AWS',
  region: '',
  environment: 'PRODUCTION',
  identifier: '',
  status: 'ACTIVE',
  riskLevel: 'LOW',
  owner: ''
};

export default function AssetsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<AssetForm>(emptyForm);
  const [editingAsset, setEditingAsset] = useState<AssetRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAssets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await assetApi.getAssets();
      setAssets(response.data as AssetRecord[]);
    } catch {
      setError('Unable to load assets. Check that the asset service is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAssets();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchTerm = query.toLowerCase();
      const matchesQuery = !searchTerm || [asset.id, asset.name, asset.identifier, asset.region, asset.owner ?? ''].some((value) => value.toLowerCase().includes(searchTerm));
      const matchesType = typeFilter === 'All' || asset.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
      return matchesQuery && matchesType && matchesStatus;
    });
  }, [assets, query, typeFilter, statusFilter]);

  const renderStatus = (status: AssetRecord['status']) => {
    return <StatusChip label={formatEnum(status)} severity={statusSeverity(status) as 'success' | 'warning' | 'error'} />;
  };

  const openCreateForm = () => {
    setEditingAsset(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (asset: AssetRecord) => {
    setEditingAsset(asset);
    setForm({
      name: asset.name,
      type: asset.type,
      provider: asset.provider,
      region: asset.region,
      environment: asset.environment,
      identifier: asset.identifier,
      status: asset.status,
      riskLevel: asset.riskLevel,
      owner: asset.owner ?? ''
    });
    setFormOpen(true);
  };

  const updateForm = (field: keyof AssetForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveAsset = async () => {
    setSaving(true);
    setError('');
    try {
      const identifier = form.identifier.trim();
      const duplicateIdentifier = assets.some((asset) =>
        asset.identifier.trim().toLowerCase() === identifier.toLowerCase() && asset.id !== editingAsset?.id
      );

      if (duplicateIdentifier) {
        setError('An asset with this identifier already exists. Use a unique identifier.');
        return;
      }

      const payload = {
        ...form,
        name: form.name.trim(),
        region: form.region.trim(),
        identifier,
        owner: form.owner?.trim() ?? ''
      };

      if (editingAsset) {
        await assetApi.updateAsset(editingAsset.id, payload);
      } else {
        await assetApi.createAsset(payload);
      }
      setFormOpen(false);
      await loadAssets();
    } catch (saveError: unknown) {
      const responseData = (saveError as { response?: { data?: { message?: string; error?: string } | string } }).response?.data;
      const responseMessage = typeof responseData === 'string'
        ? responseData
        : responseData?.message ?? responseData?.error;
      setError(responseMessage ?? 'Unable to save the asset. Check the required fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteAsset = async (asset: AssetRecord) => {
    if (!window.confirm(`Delete asset "${asset.name}"?`)) return;
    setError('');
    try {
      await assetApi.deleteAsset(asset.id);
      setAssets((current) => current.filter((item) => item.id !== asset.id));
    } catch {
      setError('Unable to delete the asset.');
    }
  };

  return (
    <>
      <PageHeader title="Asset Inventory" subtitle="Infrastructure asset monitoring inventory" />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Total Assets" value={assets.length} subtitle="Registered infrastructure" color="#38BDF8" icon={<StorageIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Active" value={assets.filter((asset) => asset.status === 'ACTIVE').length} subtitle="Currently monitored" color="#22C55E" icon={<CheckCircleIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Pending" value={assets.filter((asset) => asset.status === 'PENDING').length} subtitle="Awaiting onboarding" color="#F59E0B" icon={<WarningAmberIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Critical Risk" value={assets.filter((asset) => asset.riskLevel === 'CRITICAL').length} subtitle="Requires review" color="#EF4444" icon={<ErrorIcon />} /></Grid>
      </Grid>

      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateForm}>Add asset</Button>
        <Button variant="outlined" onClick={() => void loadAssets()} disabled={loading}>Refresh assets</Button>
      </Stack>

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
                <MenuItem value="EC2">EC2</MenuItem>
                <MenuItem value="S3">S3</MenuItem>
                <MenuItem value="RDS">RDS</MenuItem>
                <MenuItem value="VIRTUAL_MACHINE">Virtual machine</MenuItem>
                <MenuItem value="STORAGE">Storage</MenuItem>
                <MenuItem value="DATABASE">Database</MenuItem>
                <MenuItem value="NETWORK">Network</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
                <MenuItem value="DECOMMISSIONED">Decommissioned</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
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
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', borderColor: '#334155' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#101827' }}>
                <TableCell>Asset ID</TableCell>
                <TableCell>Asset Name</TableCell>
                <TableCell>Asset Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Environment</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell>{asset.id}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{formatEnum(asset.type)}</TableCell>
                  <TableCell>{renderStatus(asset.status)}</TableCell>
                  <TableCell>{formatEnum(asset.provider)}</TableCell>
                  <TableCell>{asset.region}</TableCell>
                  <TableCell>{formatEnum(asset.environment)}</TableCell>
                  <TableCell>{formatEnum(asset.riskLevel)}</TableCell>
                  <TableCell>{asset.owner || 'Unassigned'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Run Security Scan">
                      <IconButton aria-label={`Scan ${asset.name}`} onClick={() => navigate(`/assets/${asset.id}`)} size="small" sx={{ color: '#38bdf8' }}><SecurityIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="View asset details">
                      <IconButton aria-label={`View ${asset.name}`} onClick={() => navigate(`/assets/${asset.id}`)} size="small"><VisibilityIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Edit asset">
                      <IconButton aria-label={`Edit ${asset.name}`} onClick={() => openEditForm(asset)} size="small"><EditIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete asset">
                      <IconButton aria-label={`Delete ${asset.name}`} onClick={() => void deleteAsset(asset)} size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            background: '#151C2C',
            border: '1px solid #475569',
            borderRadius: 2,
            boxShadow: '0 24px 80px rgba(2, 6, 23, 0.65)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              display: 'block',
              height: 4,
              background: 'linear-gradient(90deg, #38BDF8 0%, #8B5CF6 55%, #22D3EE 100%)'
            }
          }
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5, borderBottom: '1px solid #263244' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ display: 'grid', placeItems: 'center', width: 38, height: 38, borderRadius: 1.5, color: '#38BDF8', bgcolor: 'rgba(56, 189, 248, 0.14)' }}>
              <SecurityIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                {editingAsset ? 'Edit asset' : 'Add asset'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Register infrastructure context for monitoring and risk assessment
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField required fullWidth label="Name" value={form.name} onChange={(event) => updateForm('name', event.target.value)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField required fullWidth label="Identifier" value={form.identifier} onChange={(event) => updateForm('identifier', event.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required><InputLabel>Type</InputLabel><Select value={form.type} label="Type" onChange={(event) => updateForm('type', event.target.value)}>
                {['EC2', 'S3', 'RDS', 'VIRTUAL_MACHINE', 'STORAGE', 'DATABASE', 'NETWORK', 'OTHER'].map((value) => <MenuItem key={value} value={value}>{formatEnum(value)}</MenuItem>)}
              </Select></FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required><InputLabel>Provider</InputLabel><Select value={form.provider} label="Provider" onChange={(event) => updateForm('provider', event.target.value)}>
                {['AWS', 'AZURE', 'GCP', 'OTHER'].map((value) => <MenuItem key={value} value={value}>{value}</MenuItem>)}
              </Select></FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField required fullWidth label="Region" value={form.region} onChange={(event) => updateForm('region', event.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required><InputLabel>Environment</InputLabel><Select value={form.environment} label="Environment" onChange={(event) => updateForm('environment', event.target.value)}>
                {['PRODUCTION', 'DEVELOPMENT', 'STAGING', 'TESTING', 'OTHER'].map((value) => <MenuItem key={value} value={value}>{formatEnum(value)}</MenuItem>)}
              </Select></FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth><InputLabel>Status</InputLabel><Select value={form.status} label="Status" onChange={(event) => updateForm('status', event.target.value)}>
                {['ACTIVE', 'INACTIVE', 'DECOMMISSIONED', 'PENDING', 'OTHER'].map((value) => <MenuItem key={value} value={value}>{formatEnum(value)}</MenuItem>)}
              </Select></FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth><InputLabel>Risk level</InputLabel><Select value={form.riskLevel} label="Risk level" onChange={(event) => updateForm('riskLevel', event.target.value)}>
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((value) => <MenuItem key={value} value={value}>{formatEnum(value)}</MenuItem>)}
              </Select></FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Owner" value={form.owner} onChange={(event) => updateForm('owner', event.target.value)} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #263244', bgcolor: '#101827' }}>
          <Button onClick={() => setFormOpen(false)} disabled={saving} sx={{ color: '#A7B0C0' }}>Cancel</Button>
          <Button variant="contained" onClick={() => void saveAsset()} disabled={saving || !form.name || !form.identifier || !form.region} sx={{ px: 2.5, bgcolor: '#7C3AED', '&:hover': { bgcolor: '#6D28D9' } }}>
            {saving ? 'Saving...' : editingAsset ? 'Save changes' : 'Create asset'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
