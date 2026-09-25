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
  InputAdornment,
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
  Typography,
  Chip,
  Divider
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
import CloseIcon from '@mui/icons-material/Close';
import TagIcon from '@mui/icons-material/Tag';
import TitleIcon from '@mui/icons-material/Title';
import DnsIcon from '@mui/icons-material/Dns';
import LayersIcon from '@mui/icons-material/Layers';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BuildIcon from '@mui/icons-material/Build';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
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
    setForm({
      ...emptyForm,
      assetId: assetFilter === 'All' ? (assets[0]?.id ?? '') : assetFilter,
      vulnerabilityIdentifier: `CVE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      detectedAt: new Date().toISOString().slice(0, 16)
    });
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
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => void loadData()} disabled={loading} sx={{ textTransform: 'none' }}>
          Refresh
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateForm}
          sx={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #6D28D9 0%, #4F46E5 100%)'
            }
          }}
        >
          Add vulnerability
        </Button>
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
      {!loading && !error && filteredVulnerabilities.length > 0 && <TableContainer component={Card} sx={{ overflowX: 'auto' }}><Table sx={{ minWidth: 1050 }}><TableHead><TableRow><TableCell>Vulnerability</TableCell><TableCell>Title</TableCell><TableCell>Asset</TableCell><TableCell>Severity</TableCell><TableCell>Status</TableCell><TableCell>Component</TableCell><TableCell>Detected</TableCell><TableCell>Due date</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{filteredVulnerabilities.map((vulnerability) => <TableRow hover key={vulnerability.id}><TableCell><Typography fontWeight={700} sx={{ color: '#38BDF8' }}>{vulnerability.vulnerabilityIdentifier}</Typography></TableCell><TableCell>{vulnerability.title}</TableCell><TableCell>{vulnerability.assetName}<Typography variant="caption" display="block" color="text.secondary">{vulnerability.assetIdentifier}</Typography></TableCell><TableCell><StatusChip label={formatEnum(vulnerability.severity)} severity={severityColor(vulnerability.severity)} /></TableCell><TableCell><Select size="small" value={vulnerability.status} onChange={(event) => void changeStatus(vulnerability, event.target.value as VulnerabilityStatus)} sx={{ minWidth: 125 }}><MenuItem value="OPEN">Open</MenuItem><MenuItem value="IN_PROGRESS">In progress</MenuItem><MenuItem value="RESOLVED">Resolved</MenuItem><MenuItem value="ACCEPTED">Accepted</MenuItem></Select></TableCell><TableCell>{vulnerability.affectedComponent}</TableCell><TableCell>{formatDate(vulnerability.detectedAt)}</TableCell><TableCell>{formatDate(vulnerability.dueDate)}</TableCell><TableCell align="right"><Tooltip title="View vulnerability"><IconButton size="small" onClick={() => navigate(`/vulnerabilities/${vulnerability.id}`)}><VisibilityIcon /></IconButton></Tooltip><Tooltip title="Edit vulnerability"><IconButton size="small" onClick={() => openEditForm(vulnerability)}><EditIcon /></IconButton></Tooltip><Tooltip title="Delete vulnerability"><IconButton size="small" color="error" onClick={() => void deleteVulnerability(vulnerability)}><DeleteIcon /></IconButton></Tooltip></TableCell></TableRow>)}</TableBody></Table></TableContainer>}

      {/* Modern High-End Vulnerability Modal */}
      <Dialog
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: '#0B1020',
            backgroundImage: 'radial-gradient(ellipse at top right, rgba(56, 189, 248, 0.12) 0%, transparent 60%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 3,
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.18)',
            overflow: 'hidden'
          }
        }}
      >
        {/* Modal Header */}
        <DialogTitle
          sx={{
            p: 3,
            pb: 2,
            borderBottom: '1px solid rgba(51, 65, 85, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)'
              }}
            >
              <BugReportIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                  {editing ? 'Edit Security Vulnerability' : 'Add Security Vulnerability'}
                </Typography>
                <Chip
                  label="Vulnerability Intel"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(56, 189, 248, 0.15)',
                    color: '#7DD3FC',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    border: '1px solid rgba(56, 189, 248, 0.35)'
                  }}
                />
              </Stack>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.825rem', mt: 0.25 }}>
                Log identified CVEs, assign affected target infrastructure, classify severity, and specify remediation.
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={() => setFormOpen(false)}
            disabled={saving}
            sx={{
              color: '#94A3B8',
              '&:hover': { color: '#F8FAFC', bgcolor: 'rgba(255, 255, 255, 0.08)' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Modal Content */}
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Stack spacing={3}>
            {/* Section 1: Target Scope & Vulnerability ID */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <TagIcon sx={{ fontSize: 18, color: '#38BDF8' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                  Target Scope & Finding Identity
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  >
                    <InputLabel>Target Asset</InputLabel>
                    <Select
                      value={form.assetId}
                      label="Target Asset"
                      onChange={(event) => updateForm('assetId', event.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <DnsIcon sx={{ color: '#64748B', fontSize: 20, ml: 1, mr: -0.5 }} />
                        </InputAdornment>
                      }
                    >
                      {assets.map((asset) => (
                        <MenuItem key={asset.id} value={asset.id}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography sx={{ fontWeight: 600 }}>{asset.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>({asset.identifier})</Typography>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    required
                    fullWidth
                    label="Vulnerability Identifier (CVE / Custom)"
                    value={form.vulnerabilityIdentifier}
                    onChange={(event) => updateForm('vulnerabilityIdentifier', event.target.value)}
                    placeholder="e.g. CVE-2026-38491"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TagIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Vulnerability Title"
                    value={form.title}
                    onChange={(event) => updateForm('title', event.target.value)}
                    placeholder="e.g. Remote Code Execution vulnerability via unpatched OpenSSL library"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TitleIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    minRows={3}
                    label="Vulnerability Description & Impact"
                    value={form.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                    placeholder="Provide full technical context, CVSS vector notes, root cause, or reproduction steps..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: 'rgba(51, 65, 85, 0.5)' }} />

            {/* Section 2: Severity & Triage Status */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <LocalFireDepartmentIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                  Risk Classification & Status
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  >
                    <InputLabel>Severity</InputLabel>
                    <Select
                      value={form.severity}
                      label="Severity"
                      onChange={(event) => updateForm('severity', event.target.value as VulnerabilitySeverity)}
                    >
                      <MenuItem value="CRITICAL">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
                          <Typography sx={{ fontWeight: 600, color: '#EF4444' }}>Critical</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="HIGH">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
                          <Typography sx={{ fontWeight: 600, color: '#F59E0B' }}>High</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="MEDIUM">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#38BDF8', boxShadow: '0 0 8px #38BDF8' }} />
                          <Typography sx={{ fontWeight: 600, color: '#38BDF8' }}>Medium</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="LOW">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
                          <Typography sx={{ fontWeight: 600, color: '#22C55E' }}>Low</Typography>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  >
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={form.status}
                      label="Status"
                      onChange={(event) => updateForm('status', event.target.value as VulnerabilityStatus)}
                    >
                      {vulnerabilityStatuses.map((value) => (
                        <MenuItem key={value} value={value}>
                          {formatEnum(value)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    required
                    fullWidth
                    label="Affected Component / Package"
                    value={form.affectedComponent}
                    onChange={(event) => updateForm('affectedComponent', event.target.value)}
                    placeholder="e.g. openssl:1.1.1u"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LayersIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: 'rgba(51, 65, 85, 0.5)' }} />

            {/* Section 3: Timeline & Remediation Guidance */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <BuildIcon sx={{ fontSize: 18, color: '#22C55E' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                  Timeline & Remediation Actions
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Detected At"
                    InputLabelProps={{ shrink: true }}
                    value={form.detectedAt}
                    onChange={(event) => updateForm('detectedAt', event.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Remediation Due Date"
                    InputLabelProps={{ shrink: true }}
                    value={form.dueDate}
                    onChange={(event) => updateForm('dueDate', event.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonthIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Remediation Recommendation & Patch Guidance"
                    value={form.remediation}
                    onChange={(event) => updateForm('remediation', event.target.value)}
                    placeholder="e.g. Upgrade package to openssl-3.0.12 or apply hotfix patch HF-884..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(56, 189, 248, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#38BDF8' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </DialogContent>

        {/* Modal Actions Footer */}
        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            borderTop: '1px solid rgba(51, 65, 85, 0.6)',
            bgcolor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            * Required fields must be completed
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              onClick={() => setFormOpen(false)}
              disabled={saving}
              sx={{
                color: '#94A3B8',
                borderColor: 'rgba(148, 163, 184, 0.2)',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)', color: '#F8FAFC' }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => void saveVulnerability()}
              disabled={saving || !form.assetId || !form.vulnerabilityIdentifier || !form.title || !form.description || !form.affectedComponent}
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : (editing ? <EditIcon /> : <AddIcon />)}
              sx={{
                background: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
                color: '#F8FAFC',
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0284C7 0%, #4F46E5 100%)',
                  boxShadow: '0 6px 20px rgba(14, 165, 233, 0.6)'
                },
                '&.Mui-disabled': {
                  background: 'rgba(14, 165, 233, 0.2)',
                  color: 'rgba(248, 250, 252, 0.4)'
                }
              }}
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Vulnerability'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

