import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
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
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import LinkIcon from '@mui/icons-material/Link';
import BuildIcon from '@mui/icons-material/Build';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';

import StatusChip from '../components/StatusChip';
import { cveApi } from '../services/api';
import { CveRecord } from '../data/risk';
import { VulnerabilityRecord, VulnerabilitySeverity } from '../data/vulnerabilities';

const severityColors: Record<VulnerabilitySeverity, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F59E0B',
  MEDIUM: '#38BDF8',
  LOW: '#22C55E'
};

const initialForm: Partial<CveRecord> = {
  cveId: '',
  cvssScore: 0,
  severity: 'MEDIUM',
  description: '',
  affectedSoftware: '',
  affectedVersion: '',
  remediation: '',
  references: '',
  publishedAt: '',
  lastModifiedAt: ''
};

export default function CveManagementPage() {
  const [cves, setCves] = useState<CveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('cvss_desc');

  // Modal States
  const [formOpen, setFormOpen] = useState(false);
  const [editingCve, setEditingCve] = useState<CveRecord | null>(null);
  const [formData, setFormData] = useState<Partial<CveRecord>>(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Details Modal
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedCve, setSelectedCve] = useState<CveRecord | null>(null);
  const [associatedVulns, setAssociatedVulns] = useState<VulnerabilityRecord[]>([]);
  const [loadingVulns, setLoadingVulns] = useState(false);

  // Delete Confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cveToDelete, setCveToDelete] = useState<CveRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCves = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cveApi.getCves();
      setCves(response.data as CveRecord[]);
    } catch (err: any) {
      console.error('Failed to load CVE records:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load CVE catalog.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCves();
  }, []);

  // Compute severity automatically from CVSS score if desired
  const computeSeverityFromCvss = (cvss: number): VulnerabilitySeverity => {
    if (cvss >= 9.0) return 'CRITICAL';
    if (cvss >= 7.0) return 'HIGH';
    if (cvss >= 4.0) return 'MEDIUM';
    return 'LOW';
  };

  const handleCvssChange = (valStr: string) => {
    const val = parseFloat(valStr);
    const validVal = isNaN(val) ? 0 : Math.min(10.0, Math.max(0.0, val));
    setFormData((prev) => ({
      ...prev,
      cvssScore: validVal,
      severity: computeSeverityFromCvss(validVal)
    }));
  };

  // KPIs
  const stats = useMemo(() => {
    const total = cves.length;
    const critical = cves.filter((c) => c.severity === 'CRITICAL').length;
    const high = cves.filter((c) => c.severity === 'HIGH').length;
    const medium = cves.filter((c) => c.severity === 'MEDIUM').length;
    const low = cves.filter((c) => c.severity === 'LOW').length;

    const cvssSum = cves.reduce((sum, c) => sum + (Number(c.cvssScore) || 0), 0);
    const avgCvss = total > 0 ? (cvssSum / total).toFixed(1) : '0.0';

    return { total, critical, high, medium, low, avgCvss };
  }, [cves]);

  // Filtered and sorted CVEs
  const filteredCves = useMemo(() => {
    return cves
      .filter((c) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          c.cveId.toLowerCase().includes(query) ||
          c.affectedSoftware.toLowerCase().includes(query) ||
          (c.description && c.description.toLowerCase().includes(query)) ||
          (c.remediation && c.remediation.toLowerCase().includes(query));

        const matchesSeverity =
          severityFilter === 'ALL' || c.severity.toUpperCase() === severityFilter.toUpperCase();

        return matchesQuery && matchesSeverity;
      })
      .sort((a, b) => {
        if (sortBy === 'cvss_desc') return (Number(b.cvssScore) || 0) - (Number(a.cvssScore) || 0);
        if (sortBy === 'cvss_asc') return (Number(a.cvssScore) || 0) - (Number(b.cvssScore) || 0);
        if (sortBy === 'cve_id_asc') return a.cveId.localeCompare(b.cveId);
        if (sortBy === 'cve_id_desc') return b.cveId.localeCompare(a.cveId);
        return 0;
      });
  }, [cves, searchQuery, severityFilter, sortBy]);

  // Form open for create
  const handleOpenCreate = () => {
    setEditingCve(null);
    setFormData({
      ...initialForm,
      publishedAt: new Date().toISOString().slice(0, 10),
      lastModifiedAt: new Date().toISOString().slice(0, 10)
    });
    setFormErrors({});
    setFormOpen(true);
  };

  // Form open for edit
  const handleOpenEdit = (cve: CveRecord) => {
    setEditingCve(cve);
    setFormData({
      cveId: cve.cveId,
      cvssScore: Number(cve.cvssScore) || 0,
      severity: cve.severity,
      description: cve.description,
      affectedSoftware: cve.affectedSoftware,
      affectedVersion: cve.affectedVersion || '',
      remediation: cve.remediation || '',
      references: cve.references || '',
      publishedAt: cve.publishedAt ? cve.publishedAt.slice(0, 10) : '',
      lastModifiedAt: cve.lastModifiedAt ? cve.lastModifiedAt.slice(0, 10) : ''
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const cvePattern = /^CVE-[0-9]{4}-[0-9]{4,}$/i;

    if (!formData.cveId || !formData.cveId.trim()) {
      errors.cveId = 'CVE ID is required';
    } else if (!cvePattern.test(formData.cveId.trim())) {
      errors.cveId = 'CVE ID must follow format CVE-YYYY-NNNN (e.g. CVE-2024-3094)';
    }

    if (formData.cvssScore === undefined || formData.cvssScore === null || isNaN(Number(formData.cvssScore))) {
      errors.cvssScore = 'CVSS score is required';
    } else if (Number(formData.cvssScore) < 0 || Number(formData.cvssScore) > 10) {
      errors.cvssScore = 'CVSS score must be between 0.0 and 10.0';
    }

    if (!formData.description || !formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.affectedSoftware || !formData.affectedSoftware.trim()) {
      errors.affectedSoftware = 'Affected software is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCve = async () => {
    if (!validateForm()) return;
    setSaving(true);
    setError(null);

    const payload = {
      cveId: formData.cveId?.trim().toUpperCase(),
      cvssScore: Number(formData.cvssScore),
      severity: formData.severity,
      description: formData.description?.trim(),
      affectedSoftware: formData.affectedSoftware?.trim(),
      affectedVersion: formData.affectedVersion?.trim() || null,
      remediation: formData.remediation?.trim() || null,
      references: formData.references?.trim() || null,
      publishedAt: formData.publishedAt || null,
      lastModifiedAt: formData.lastModifiedAt || null
    };

    try {
      if (editingCve) {
        await cveApi.updateCve(editingCve.id, payload);
      } else {
        await cveApi.createCve(payload);
      }
      setFormOpen(false);
      await loadCves();
    } catch (err: any) {
      console.error('Failed to save CVE:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to save CVE record.';
      setFormErrors((prev) => ({ ...prev, general: msg }));
    } finally {
      setSaving(false);
    }
  };

  // View Details
  const handleOpenDetails = async (cve: CveRecord) => {
    setSelectedCve(cve);
    setDetailsOpen(true);
    setLoadingVulns(true);
    setAssociatedVulns([]);
    try {
      const res = await cveApi.getVulnerabilitiesForCve(cve.id);
      setAssociatedVulns(res.data as VulnerabilityRecord[]);
    } catch (err) {
      console.error('Failed to load linked vulnerabilities:', err);
    } finally {
      setLoadingVulns(false);
    }
  };

  // Delete
  const handleOpenDelete = (cve: CveRecord) => {
    setCveToDelete(cve);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!cveToDelete) return;
    setDeleting(true);
    setError(null);
    try {
      await cveApi.deleteCve(cveToDelete.id);
      setDeleteDialogOpen(false);
      setCveToDelete(null);
      await loadCves();
    } catch (err: any) {
      console.error('Failed to delete CVE:', err);
      const msg = err.response?.data?.message || err.message || 'Unable to delete CVE record. It may be in use by existing vulnerabilities.';
      setError(msg);
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            CVE Management & Vulnerability Registry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Standardized Common Vulnerabilities and Exposures database, CVSS metrics, affected software packages, and remediation repository
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadCves}
            disabled={loading}
            sx={{
              borderColor: '#334155',
              color: '#F8FAFC',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: '#8B5CF6', bgcolor: 'rgba(139, 92, 246, 0.05)' }
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              color: '#FFFFFF',
              fontWeight: 600,
              textTransform: 'none',
              px: 2.5,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)'
              }
            }}
          >
            Add CVE Record
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <IconButton color="inherit" size="small" onClick={() => setError(null)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* KPI Metrics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ color: '#A7B0C0', fontWeight: 600, textTransform: 'uppercase' }}>
                    Total CVEs
                  </Typography>
                  <BugReportIcon sx={{ color: '#8B5CF6', fontSize: 20 }} />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                  {stats.total}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Registered security definitions
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ background: '#151C2C', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600, textTransform: 'uppercase' }}>
                    Critical
                  </Typography>
                  <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 20 }} />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#EF4444' }}>
                  {stats.critical}
                </Typography>
                <Typography variant="caption" sx={{ color: '#EF4444', opacity: 0.8 }}>
                  CVSS 9.0 - 10.0
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ background: '#151C2C', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600, textTransform: 'uppercase' }}>
                    High Severity
                  </Typography>
                  <WarningAmberIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                  {stats.high}
                </Typography>
                <Typography variant="caption" sx={{ color: '#F59E0B', opacity: 0.8 }}>
                  CVSS 7.0 - 8.9
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ background: '#151C2C', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ color: '#38BDF8', fontWeight: 600, textTransform: 'uppercase' }}>
                    Medium
                  </Typography>
                  <ShieldIcon sx={{ color: '#38BDF8', fontSize: 20 }} />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#38BDF8' }}>
                  {stats.medium}
                </Typography>
                <Typography variant="caption" sx={{ color: '#38BDF8', opacity: 0.8 }}>
                  CVSS 4.0 - 6.9
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ background: '#151C2C', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 600, textTransform: 'uppercase' }}>
                    Low Severity
                  </Typography>
                  <ShieldIcon sx={{ color: '#22C55E', fontSize: 20 }} />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#22C55E' }}>
                  {stats.low}
                </Typography>
                <Typography variant="caption" sx={{ color: '#22C55E', opacity: 0.8 }}>
                  CVSS 0.1 - 3.9
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2}>
          <Card sx={{ background: '#151C2C', border: '1px solid #8B5CF6', borderRadius: 2 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack spacing={0.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" sx={{ color: '#8B5CF6', fontWeight: 600, textTransform: 'uppercase' }}>
                    Average CVSS
                  </Typography>
                  <SpeedIcon sx={{ color: '#8B5CF6', fontSize: 20 }} />
                </Stack>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#8B5CF6' }}>
                  {stats.avgCvss}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Across registered CVEs
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
      <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by CVE ID, software name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#8B5CF6' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
                sx={{
                  bgcolor: '#0B1020',
                  borderRadius: 1.5,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#94A3B8' }}>Severity Filter</InputLabel>
                <Select
                  value={severityFilter}
                  label="Severity Filter"
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  sx={{
                    bgcolor: '#0B1020',
                    color: '#F8FAFC',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                  }}
                >
                  <MenuItem value="ALL">All Severities</MenuItem>
                  <MenuItem value="CRITICAL">Critical (9.0 - 10.0)</MenuItem>
                  <MenuItem value="HIGH">High (7.0 - 8.9)</MenuItem>
                  <MenuItem value="MEDIUM">Medium (4.0 - 6.9)</MenuItem>
                  <MenuItem value="LOW">Low (0.1 - 3.9)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#94A3B8' }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{
                    bgcolor: '#0B1020',
                    color: '#F8FAFC',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                  }}
                >
                  <MenuItem value="cvss_desc">CVSS Score: High to Low</MenuItem>
                  <MenuItem value="cvss_asc">CVSS Score: Low to High</MenuItem>
                  <MenuItem value="cve_id_asc">CVE ID: A to Z</MenuItem>
                  <MenuItem value="cve_id_desc">CVE ID: Z to A</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={1} sx={{ textAlign: 'right' }}>
              <Button
                size="small"
                onClick={() => {
                  setSearchQuery('');
                  setSeverityFilter('ALL');
                  setSortBy('cvss_desc');
                }}
                sx={{ color: '#94A3B8', textTransform: 'none' }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Main CVE Table Card */}
      <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <CircularProgress size={40} sx={{ color: '#8B5CF6', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Loading CVE Registry...
              </Typography>
            </Box>
          ) : filteredCves.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <BugReportIcon sx={{ fontSize: 48, color: '#64748B', mb: 1.5 }} />
              <Typography variant="h6" color="#F8FAFC" sx={{ mb: 1 }}>
                {searchQuery || severityFilter !== 'ALL' ? 'No Matching CVE Records Found' : 'No CVE Records Registered Yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                {searchQuery || severityFilter !== 'ALL'
                  ? 'Try adjusting your search query or severity filter parameters.'
                  : 'Add your first Common Vulnerabilities and Exposures record to start tracking CVSS scores and remediations.'}
              </Typography>
              {!searchQuery && severityFilter === 'ALL' && (
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} sx={{ bgcolor: '#7C3AED' }}>
                  Add CVE Record
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer sx={{ bgcolor: '#0B1020', borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#151C2C' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>CVE Identifier</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>CVSS Score</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>Severity</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>Affected Software</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>Description</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>Remediation</TableCell>
                    <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCves.map((cve) => {
                    const sevColor = severityColors[cve.severity] || '#38BDF8';
                    const cvss = Number(cve.cvssScore) || 0;
                    return (
                      <TableRow key={cve.id} hover sx={{ borderBottom: '1px solid #1E293B' }}>
                        <TableCell sx={{ borderBottom: '1px solid #1E293B' }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color: '#F8FAFC',
                                cursor: 'pointer',
                                '&:hover': { color: '#8B5CF6', textDecoration: 'underline' }
                              }}
                              onClick={() => handleOpenDetails(cve)}
                            >
                              {cve.cveId}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid #1E293B' }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box
                              sx={{
                                px: 1,
                                py: 0.25,
                                borderRadius: 1,
                                fontWeight: 800,
                                fontSize: '0.8125rem',
                                bgcolor: `${sevColor}20`,
                                color: sevColor,
                                border: `1px solid ${sevColor}60`
                              }}
                            >
                              {cvss.toFixed(1)}
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid #1E293B' }}>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 1.2,
                              py: 0.3,
                              borderRadius: 1,
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              bgcolor: `${sevColor}1A`,
                              color: sevColor,
                              border: `1px solid ${sevColor}4D`
                            }}
                          >
                            {cve.severity}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid #1E293B' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#E2E8F0' }}>
                            {cve.affectedSoftware}
                          </Typography>
                          {cve.affectedVersion && (
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                              v{cve.affectedVersion}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid #1E293B', maxWidth: 280 }}>
                          <Tooltip title={cve.description} placement="top" arrow>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#94A3B8',
                                fontSize: '0.8125rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {cve.description}
                            </Typography>
                          </Tooltip>
                        </TableCell>

                        <TableCell sx={{ borderBottom: '1px solid #1E293B', maxWidth: 220 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#CBD5E1',
                              fontSize: '0.8125rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {cve.remediation || 'Apply latest security advisory patches.'}
                          </Typography>
                        </TableCell>

                        <TableCell align="right" sx={{ borderBottom: '1px solid #1E293B' }}>
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="View CVE Details">
                              <IconButton size="small" onClick={() => handleOpenDetails(cve)} sx={{ color: '#38BDF8' }}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit CVE Record">
                              <IconButton size="small" onClick={() => handleOpenEdit(cve)} sx={{ color: '#F59E0B' }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete CVE Record">
                              <IconButton size="small" onClick={() => handleOpenDelete(cve)} sx={{ color: '#EF4444' }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* CREATE / EDIT CVE MODAL DIALOG */}
      <Dialog
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#151C2C',
            border: '1px solid #475569',
            borderRadius: 2,
            boxShadow: '0 24px 80px rgba(2, 6, 23, 0.7)',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              display: 'block',
              height: 4,
              background: 'linear-gradient(90deg, #8B5CF6 0%, #38BDF8 55%, #22C55E 100%)'
            }
          }
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5, borderBottom: '1px solid #263244', color: '#F8FAFC' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: 1.5, color: '#C4B5FD', bgcolor: 'rgba(139, 92, 246, 0.18)' }}>
              <BugReportIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                {editingCve ? `Edit CVE Record: ${editingCve.cveId}` : 'Create New CVE Record'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                Register CVSS impact, affected software, remediation, and advisories
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3, bgcolor: '#121A2A' }}>
          {formErrors.general && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {formErrors.general}
            </Alert>
          )}

          <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="CVE Identifier *"
                placeholder="e.g. CVE-2024-3094"
                value={formData.cveId || ''}
                onChange={(e) => setFormData({ ...formData, cveId: e.target.value.toUpperCase() })}
                error={Boolean(formErrors.cveId)}
                helperText={formErrors.cveId || 'Format: CVE-YYYY-NNNN'}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                inputProps={{ step: '0.1', min: '0.0', max: '10.0' }}
                label="CVSS Score (0-10) *"
                value={formData.cvssScore !== undefined ? formData.cvssScore : ''}
                onChange={(e) => handleCvssChange(e.target.value)}
                error={Boolean(formErrors.cvssScore)}
                helperText={formErrors.cvssScore}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#94A3B8' }}>Severity *</InputLabel>
                <Select
                  value={formData.severity || 'MEDIUM'}
                  label="Severity *"
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as VulnerabilitySeverity })}
                  sx={{
                    bgcolor: '#0B1020',
                    color: '#F8FAFC',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                  }}
                >
                  <MenuItem value="CRITICAL">CRITICAL (9.0 - 10.0)</MenuItem>
                  <MenuItem value="HIGH">HIGH (7.0 - 8.9)</MenuItem>
                  <MenuItem value="MEDIUM">MEDIUM (4.0 - 6.9)</MenuItem>
                  <MenuItem value="LOW">LOW (0.1 - 3.9)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                size="small"
                label="Affected Software / Component *"
                placeholder="e.g. xz-utils, openssl, log4j-core"
                value={formData.affectedSoftware || ''}
                onChange={(e) => setFormData({ ...formData, affectedSoftware: e.target.value })}
                error={Boolean(formErrors.affectedSoftware)}
                helperText={formErrors.affectedSoftware}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Affected Version(s)"
                placeholder="e.g. 5.6.0, < 1.1.1u"
                value={formData.affectedVersion || ''}
                onChange={(e) => setFormData({ ...formData, affectedVersion: e.target.value })}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Vulnerability Description *"
                placeholder="Describe the vulnerability mechanics, vector of attack, and potential impact..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={Boolean(formErrors.description)}
                helperText={formErrors.description}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Remediation Guidance"
                placeholder="e.g. Upgrade package to version 5.6.1 or apply patch vendor advisory..."
                value={formData.remediation || ''}
                onChange={(e) => setFormData({ ...formData, remediation: e.target.value })}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                size="small"
                label="References & Advisories (URLs / NVD link)"
                placeholder="https://nvd.nist.gov/vuln/detail/CVE-..."
                value={formData.references || ''}
                onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Published Date"
                InputLabelProps={{ shrink: true }}
                value={formData.publishedAt || ''}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Last Modified Date"
                InputLabelProps={{ shrink: true }}
                value={formData.lastModifiedAt || ''}
                onChange={(e) => setFormData({ ...formData, lastModifiedAt: e.target.value })}
                sx={{
                  bgcolor: '#0B1020',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #1E293B' }}>
          <Button onClick={() => setFormOpen(false)} disabled={saving} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCve}
            disabled={saving}
            sx={{
              bgcolor: '#7C3AED',
              fontWeight: 600,
              px: 3,
              '&:hover': { bgcolor: '#6D28D9' }
            }}
          >
            {saving ? 'Saving...' : editingCve ? 'Update CVE' : 'Create CVE'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW CVE DETAILS DIALOG */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#151C2C',
            border: '1px solid #334155',
            borderRadius: 2
          }
        }}
      >
        {selectedCve && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <BugReportIcon sx={{ color: severityColors[selectedCve.severity] || '#8B5CF6', fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                    {selectedCve.cveId}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    {selectedCve.affectedSoftware} {selectedCve.affectedVersion ? `(v${selectedCve.affectedVersion})` : ''}
                  </Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setDetailsOpen(false)} sx={{ color: '#94A3B8' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
              <Stack spacing={3}>
                {/* CVSS & Severity Header Card */}
                <Card sx={{ background: '#0B1020', border: '1px solid #1E293B', p: 2.5, borderRadius: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                        BASE CVSS SCORE
                      </Typography>
                      <Stack direction="row" alignItems="baseline" spacing={1}>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 800,
                            color: severityColors[selectedCve.severity] || '#F8FAFC'
                          }}
                        >
                          {Number(selectedCve.cvssScore).toFixed(1)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>/ 10.0</Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                        SEVERITY RATING
                      </Typography>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1.5,
                          fontWeight: 800,
                          fontSize: '0.875rem',
                          bgcolor: `${severityColors[selectedCve.severity]}20`,
                          color: severityColors[selectedCve.severity],
                          border: `1px solid ${severityColors[selectedCve.severity]}60`
                        }}
                      >
                        {selectedCve.severity}
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                        TIMELINE
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                        Published: {selectedCve.publishedAt || 'N/A'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Modified: {selectedCve.lastModifiedAt || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>

                {/* Description */}
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#94A3B8', fontWeight: 700, mb: 1 }}>
                    VULNERABILITY DESCRIPTION
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E2E8F0', lineHeight: 1.6, bgcolor: '#0B1020', p: 2, borderRadius: 1.5, border: '1px solid #1E293B' }}>
                    {selectedCve.description}
                  </Typography>
                </Box>

                {/* Remediation */}
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#22C55E', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <BuildIcon sx={{ fontSize: 16 }} /> RECOMMENDED REMEDIATION
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#E2E8F0', lineHeight: 1.6, bgcolor: '#0B1020', p: 2, borderRadius: 1.5, border: '1px solid #1E293B' }}>
                    {selectedCve.remediation || 'No explicit vendor remediation provided. Upgrade to the latest software release.'}
                  </Typography>
                </Box>

                {/* References */}
                {selectedCve.references && (
                  <Box>
                    <Typography variant="subtitle2" sx={{ color: '#38BDF8', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LinkIcon sx={{ fontSize: 16 }} /> ADVISORIES & REFERENCES
                    </Typography>
                    <Box sx={{ bgcolor: '#0B1020', p: 2, borderRadius: 1.5, border: '1px solid #1E293B' }}>
                      <Typography
                        variant="body2"
                        component="a"
                        href={selectedCve.references.startsWith('http') ? selectedCve.references : `https://${selectedCve.references}`}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ color: '#38BDF8', textDecoration: 'underline', wordBreak: 'break-all' }}
                      >
                        {selectedCve.references}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Associated Asset Vulnerabilities */}
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#94A3B8', fontWeight: 700, mb: 1 }}>
                    ASSOCIATED VULNERABILITIES IN YOUR ASSETS ({associatedVulns.length})
                  </Typography>
                  {loadingVulns ? (
                    <CircularProgress size={24} sx={{ color: '#8B5CF6' }} />
                  ) : associatedVulns.length === 0 ? (
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block', p: 1.5, bgcolor: '#0B1020', borderRadius: 1 }}>
                      No active asset vulnerabilities are currently mapped to this CVE.
                    </Typography>
                  ) : (
                    <TableContainer sx={{ bgcolor: '#0B1020', borderRadius: 1, border: '1px solid #1E293B' }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: '#151C2C' }}>
                          <TableRow>
                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Asset Name</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Vulnerability</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ color: '#94A3B8', fontWeight: 600 }}>Patch Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {associatedVulns.map((v) => (
                            <TableRow key={v.id}>
                              <TableCell sx={{ color: '#F8FAFC' }}>{v.assetName || v.assetIdentifier}</TableCell>
                              <TableCell sx={{ color: '#CBD5E1' }}>{v.title}</TableCell>
                              <TableCell>
                                <StatusChip
                                  label={v.status}
                                  severity={v.status === 'RESOLVED' ? 'success' : v.status === 'IN_PROGRESS' ? 'warning' : 'error'}
                                />
                              </TableCell>
                              <TableCell>
                                <StatusChip
                                  label={v.patchStatus || 'OPEN'}
                                  severity={v.patchStatus === 'VERIFIED' ? 'success' : v.patchStatus === 'PATCHED' ? 'info' : 'warning'}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: '1px solid #1E293B' }}>
              <Button onClick={() => setDetailsOpen(false)} sx={{ color: '#94A3B8' }}>
                Close
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => {
                  setDetailsOpen(false);
                  handleOpenEdit(selectedCve);
                }}
                sx={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}
              >
                Edit CVE
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: '#151C2C',
            border: '1px solid #EF4444',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ color: '#EF4444', fontWeight: 700 }}>
          Delete CVE Record
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#CBD5E1', mb: 1 }}>
            Are you sure you want to delete <strong>{cveToDelete?.cveId}</strong>?
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8' }}>
            Note: If this CVE record is referenced by existing asset vulnerabilities, deletion will be blocked to maintain data integrity.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting} sx={{ color: '#94A3B8' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={deleting}
            sx={{ fontWeight: 600 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}