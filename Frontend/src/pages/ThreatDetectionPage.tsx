import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import BugReportIcon from '@mui/icons-material/BugReport';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { assetApi, vulnerabilityApi } from '../services/api';
import { AssetRecord } from '../data/assets';
import {
  VulnerabilityRecord,
  VulnerabilitySeverity,
  VulnerabilityStatus,
  vulnerabilitySeverities,
  vulnerabilityStatuses
} from '../data/vulnerabilities';

type VulnerabilityForm = {
  assetId: string;
  vulnerabilityIdentifier: string;
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  status: VulnerabilityStatus;
  affectedComponent: string;
  detectedAt: string;
  dueDate: string;
  remediation: string;
};

const emptyForm: VulnerabilityForm = {
  assetId: '',
  vulnerabilityIdentifier: '',
  title: '',
  description: '',
  severity: 'MEDIUM',
  status: 'OPEN',
  affectedComponent: '',
  detectedAt: '',
  dueDate: '',
  remediation: ''
};

const formatEnum = (value: string) => value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : 'Not set';

const severityColor = (severity: VulnerabilitySeverity): 'error' | 'warning' | 'info' | 'success' => {
  if (severity === 'CRITICAL') return 'error';
  if (severity === 'HIGH') return 'warning';
  if (severity === 'MEDIUM') return 'info';
  return 'success';
};

const errorMessage = (error: unknown, fallback: string) => {
  const response = (error as { response?: { data?: { message?: string } } }).response;
  return response?.data?.message ?? fallback;
};

export default function ThreatDetectionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialAssetFilter = searchParams.get('asset') ?? 'All';
  const [allVulnerabilities, setAllVulnerabilities] = useState<VulnerabilityRecord[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityRecord[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [query, setQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assetFilter, setAssetFilter] = useState(initialAssetFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<VulnerabilityRecord | null>(null);
  const [form, setForm] = useState<VulnerabilityForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const filteredRequest = assetFilter !== 'All'
        ? vulnerabilityApi.getVulnerabilitiesByAsset(assetFilter)
        : severityFilter !== 'All'
          ? vulnerabilityApi.getVulnerabilitiesBySeverity(severityFilter)
          : statusFilter !== 'All'
            ? vulnerabilityApi.getVulnerabilitiesByStatus(statusFilter)
            : vulnerabilityApi.getVulnerabilities();
      const [allVulnerabilityResponse, vulnerabilityResponse, assetResponse] = await Promise.all([
        vulnerabilityApi.getVulnerabilities(),
        filteredRequest,
        assetApi.getAssets()
      ]);
      setAllVulnerabilities(allVulnerabilityResponse.data as VulnerabilityRecord[]);
      setVulnerabilities(vulnerabilityResponse.data as VulnerabilityRecord[]);
      setAssets(assetResponse.data as AssetRecord[]);
    } catch (loadError) {
      setError(errorMessage(loadError, 'Unable to load vulnerabilities. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [assetFilter, severityFilter, statusFilter]);

  const filteredVulnerabilities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return vulnerabilities.filter((vulnerability) => {
      const matchesQuery = !normalizedQuery || [
        vulnerability.vulnerabilityIdentifier,
        vulnerability.title,
        vulnerability.assetName,
        vulnerability.assetIdentifier,
        vulnerability.affectedComponent
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesSeverity = severityFilter === 'All' || vulnerability.severity === severityFilter;
      const matchesStatus = statusFilter === 'All' || vulnerability.status === statusFilter;
      const matchesAsset = assetFilter === 'All' || vulnerability.assetId === assetFilter;
      return matchesQuery && matchesSeverity && matchesStatus && matchesAsset;
    });
  }, [assetFilter, query, severityFilter, statusFilter, vulnerabilities]);

  const counts = useMemo(() => ({
    total: allVulnerabilities.length,
    critical: allVulnerabilities.filter((item) => item.severity === 'CRITICAL').length,
    high: allVulnerabilities.filter((item) => item.severity === 'HIGH').length,
    medium: allVulnerabilities.filter((item) => item.severity === 'MEDIUM').length,
    low: allVulnerabilities.filter((item) => item.severity === 'LOW').length,
    open: allVulnerabilities.filter((item) => item.status === 'OPEN').length,
    resolved: allVulnerabilities.filter((item) => item.status === 'RESOLVED').length
  }), [allVulnerabilities]);

  const updateForm = (field: keyof VulnerabilityForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreateForm = () => {
    setEditing(null);
    setForm({ ...emptyForm, assetId: assetFilter === 'All' ? '' : assetFilter });
    setFeedback('');
    setFormOpen(true);
  };

  const openEditForm = (vulnerability: VulnerabilityRecord) => {
    setEditing(vulnerability);
    setForm({
      assetId: vulnerability.assetId,
      vulnerabilityIdentifier: vulnerability.vulnerabilityIdentifier,
      title: vulnerability.title,
      description: vulnerability.description,
      severity: vulnerability.severity,
      status: vulnerability.status,
      affectedComponent: vulnerability.affectedComponent,
      detectedAt: vulnerability.detectedAt?.slice(0, 16) ?? '',
      dueDate: vulnerability.dueDate ?? '',
      remediation: vulnerability.remediation ?? ''
    });
    setFeedback('');
    setFormOpen(true);
  };

  const saveVulnerability = async () => {
    setSaving(true);
    setError('');
    setFeedback('');
    const payload: Record<string, unknown> = {
      assetId: form.assetId,
      vulnerabilityIdentifier: form.vulnerabilityIdentifier,
      title: form.title,
      description: form.description,
      severity: form.severity,
      status: form.status,
      affectedComponent: form.affectedComponent,
      ...(form.detectedAt ? { detectedAt: form.detectedAt } : {}),
      ...(form.dueDate ? { dueDate: form.dueDate } : {}),
      ...(form.remediation ? { remediation: form.remediation } : {})
    };

    try {
      if (editing) {
        await vulnerabilityApi.updateVulnerability(editing.id, payload);
        setFeedback('Vulnerability updated successfully.');
      } else {
        await vulnerabilityApi.createVulnerability(payload);
        setFeedback('Vulnerability created successfully.');
      }
      setFormOpen(false);
      await loadData();
    } catch (saveError) {
      setError(errorMessage(saveError, 'Unable to save the vulnerability. Check the required fields and try again.'));
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (vulnerability: VulnerabilityRecord, status: VulnerabilityStatus) => {
    setError('');
    try {
      await vulnerabilityApi.updateStatus(vulnerability.id, status);
      const updateStatus = (items: VulnerabilityRecord[]) => items.map((item) => item.id === vulnerability.id ? { ...item, status } : item);
      setVulnerabilities(updateStatus);
      setAllVulnerabilities(updateStatus);
      setFeedback('Vulnerability status updated.');
    } catch (statusError) {
      setError(errorMessage(statusError, 'Unable to update vulnerability status.'));
    }
  };

  const deleteVulnerability = async (vulnerability: VulnerabilityRecord) => {
    if (!window.confirm(`Delete vulnerability "${vulnerability.vulnerabilityIdentifier}"?`)) return;
    setError('');
    try {
      await vulnerabilityApi.deleteVulnerability(vulnerability.id);
      setVulnerabilities((current) => current.filter((item) => item.id !== vulnerability.id));
      setAllVulnerabilities((current) => current.filter((item) => item.id !== vulnerability.id));
      setFeedback('Vulnerability deleted.');
    } catch (deleteError) {
      setError(errorMessage(deleteError, 'Unable to delete the vulnerability.'));
    }
  };

  const summaryCards = [
    ['Total vulnerabilities', counts.total, 'info'],
    ['Critical', counts.critical, 'error'],
    ['High', counts.high, 'warning'],
    ['Medium', counts.medium, 'info'],
    ['Low', counts.low, 'success'],
    ['Open', counts.open, 'error'],
    ['Resolved', counts.resolved, 'success']
  ] as const;

  return (
    <>
      <PageHeader title="Vulnerability Management" subtitle="Track, prioritize, and remediate asset vulnerabilities" />

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={1} sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => void loadData()} disabled={loading}>Refresh</Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateForm}>Add vulnerability</Button>
      </Stack>

      {feedback && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setFeedback('')}>{feedback}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summaryCards.map(([label, value, color]) => (
          <Grid item xs={6} sm={4} md={3} lg={12 / 7} key={label}>
            <AccentMetricCard
              label={label}
              value={value}
              subtitle="Vulnerability registry"
              color={color === 'error' ? '#EF4444' : color === 'warning' ? '#F59E0B' : color === 'success' ? '#22C55E' : '#38BDF8'}
              icon={label === 'Critical' || label === 'Open' ? <ErrorIcon /> : label === 'High' ? <WarningAmberIcon /> : label === 'Resolved' ? <CheckCircleIcon /> : <BugReportIcon />}
            />
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}><CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}><TextField fullWidth label="Search CVE, title, asset, component" value={query} onChange={(event) => setQuery(event.target.value)} /></Grid>
          <Grid item xs={12} sm={6} md={2}><FormControl fullWidth><InputLabel>Severity</InputLabel><Select value={severityFilter} label="Severity" onChange={(event) => setSeverityFilter(event.target.value)}><MenuItem value="All">All</MenuItem>{vulnerabilitySeverities.map((value) => <MenuItem key={value} value={value}>{formatEnum(value)}</MenuItem>)}</Select></FormControl></Grid>
          <Grid item xs={12} sm={6} md={2}><FormControl fullWidth><InputLabel>Status</InputLabel><Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}><MenuItem value="All">All</MenuItem>{vulnerabilityStatuses.map((value) => <MenuItem key={value} value={value}>{formatEnum(value)}</MenuItem>)}</Select></FormControl></Grid>
          <Grid item xs={12} md={3}><FormControl fullWidth><InputLabel>Asset</InputLabel><Select value={assetFilter} label="Asset" onChange={(event) => setAssetFilter(event.target.value)}><MenuItem value="All">All assets</MenuItem>{assets.map((asset) => <MenuItem key={asset.id} value={asset.id}>{asset.name} ({asset.identifier})</MenuItem>)}</Select></FormControl></Grid>
          <Grid item xs={12} md={1}><Button fullWidth onClick={() => { setQuery(''); setSeverityFilter('All'); setStatusFilter('All'); setAssetFilter('All'); }}>Clear</Button></Grid>
        </Grid>
      </CardContent></Card>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
      {!loading && !error && filteredVulnerabilities.length === 0 && <Card><CardContent sx={{ textAlign: 'center', py: 6 }}><Typography variant="h6">No vulnerabilities match the current filters.</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Create a finding or clear the filters to view all records.</Typography></CardContent></Card>}
      {!loading && !error && filteredVulnerabilities.length > 0 && <TableContainer component={Card} sx={{ overflowX: 'auto' }}><Table sx={{ minWidth: 1050 }}><TableHead><TableRow><TableCell>Vulnerability</TableCell><TableCell>Title</TableCell><TableCell>Asset</TableCell><TableCell>Severity</TableCell><TableCell>Status</TableCell><TableCell>Component</TableCell><TableCell>Detected</TableCell><TableCell>Due date</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{filteredVulnerabilities.map((vulnerability) => <TableRow hover key={vulnerability.id}><TableCell><Typography fontWeight={700}>{vulnerability.vulnerabilityIdentifier}</Typography></TableCell><TableCell>{vulnerability.title}</TableCell><TableCell>{vulnerability.assetName}<Typography variant="caption" display="block" color="text.secondary">{vulnerability.assetIdentifier}</Typography></TableCell><TableCell><StatusChip label={formatEnum(vulnerability.severity)} severity={severityColor(vulnerability.severity)} /></TableCell><TableCell><Select size="small" value={vulnerability.status} onChange={(event) => void changeStatus(vulnerability, event.target.value as VulnerabilityStatus)} sx={{ minWidth: 125 }}><MenuItem value="OPEN">Open</MenuItem><MenuItem value="IN_PROGRESS">In progress</MenuItem><MenuItem value="RESOLVED">Resolved</MenuItem><MenuItem value="ACCEPTED">Accepted</MenuItem></Select></TableCell><TableCell>{vulnerability.affectedComponent}</TableCell><TableCell>{formatDate(vulnerability.detectedAt)}</TableCell><TableCell>{formatDate(vulnerability.dueDate)}</TableCell><TableCell align="right"><Tooltip title="View vulnerability"><IconButton size="small" onClick={() => navigate(`/vulnerabilities/${vulnerability.id}`)}><VisibilityIcon /></IconButton></Tooltip><Tooltip title="Edit vulnerability"><IconButton size="small" onClick={() => openEditForm(vulnerability)}><EditIcon /></IconButton></Tooltip><Tooltip title="Delete vulnerability"><IconButton size="small" color="error" onClick={() => void deleteVulnerability(vulnerability)}><DeleteIcon /></IconButton></Tooltip></TableCell></TableRow>)}</TableBody></Table></TableContainer>}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="md"><DialogTitle>{editing ? 'Edit vulnerability' : 'Add vulnerability'}</DialogTitle><DialogContent><Grid container spacing={2} sx={{ pt: 1 }}><Grid item xs={12} md={6}><FormControl fullWidth required><InputLabel>Asset</InputLabel><Select value={form.assetId} label="Asset" onChange={(event) => updateForm('assetId', event.target.value)}>{assets.map((asset) => <MenuItem key={asset.id} value={asset.id}>{asset.name} ({asset.identifier})</MenuItem>)}</Select></FormControl></Grid><Grid item xs={12} md={6}><TextField required fullWidth label="Vulnerability identifier" value={form.vulnerabilityIdentifier} onChange={(event) => updateForm('vulnerabilityIdentifier', event.target.value)} /></Grid><Grid item xs={12}><TextField required fullWidth label="Title" value={form.title} onChange={(event) => updateForm('title', event.target.value)} /></Grid><Grid item xs={12}><TextField required fullWidth multiline minRows={3} label="Description" value={form.description} onChange={(event) => updateForm('description', event.target.value)} /></Grid><Grid item xs={12} sm={4}><FormControl fullWidth required><InputLabel>Severity</InputLabel><Select value={form.severity} label="Severity" onChange={(event) => updateForm('severity', event.target.value)}>{vulnerabilitySeverities.map((value) => <MenuItem key={value} value={value}>{formatEnum(value)}</MenuItem>)}</Select></FormControl></Grid><Grid item xs={12} sm={4}><FormControl fullWidth><InputLabel>Status</InputLabel><Select value={form.status} label="Status" onChange={(event) => updateForm('status', event.target.value)}>{vulnerabilityStatuses.map((value) => <MenuItem key={value} value={value}>{formatEnum(value)}</MenuItem>)}</Select></FormControl></Grid><Grid item xs={12} sm={4}><TextField required fullWidth label="Affected component" value={form.affectedComponent} onChange={(event) => updateForm('affectedComponent', event.target.value)} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth type="datetime-local" label="Detected at" InputLabelProps={{ shrink: true }} value={form.detectedAt} onChange={(event) => updateForm('detectedAt', event.target.value)} /></Grid><Grid item xs={12} sm={6}><TextField fullWidth type="date" label="Due date" InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={(event) => updateForm('dueDate', event.target.value)} /></Grid><Grid item xs={12}><TextField fullWidth multiline minRows={2} label="Remediation" value={form.remediation} onChange={(event) => updateForm('remediation', event.target.value)} /></Grid></Grid></DialogContent><DialogActions><Button onClick={() => setFormOpen(false)}>Cancel</Button><Button variant="contained" onClick={() => void saveVulnerability()} disabled={saving || !form.assetId || !form.vulnerabilityIdentifier || !form.title || !form.description || !form.affectedComponent}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Create vulnerability'}</Button></DialogActions></Dialog>
    </>
  );
}
