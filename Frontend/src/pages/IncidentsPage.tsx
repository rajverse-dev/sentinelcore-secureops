import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
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
  Typography,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TimerIcon from '@mui/icons-material/Timer';
import CloseIcon from '@mui/icons-material/Close';
import TagIcon from '@mui/icons-material/Tag';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DnsIcon from '@mui/icons-material/Dns';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { incidentApi, assetApi } from '../services/api';
import { IncidentRecord, IncidentRequest, IncidentSeverity, IncidentStatus } from '../data/incidents';
import { AssetRecord } from '../data/assets';

const initialForm: IncidentRequest = {
  incidentIdentifier: '',
  title: '',
  description: '',
  severity: 'HIGH',
  assignedTeam: '',
  assignedUser: '',
  assetId: '',
  slaDueAt: ''
};

export default function IncidentsPage() {
  const { colors } = useTheme();
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<IncidentRequest>(initialForm);

  const loadIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const [incRes, assetRes] = await Promise.all([
        incidentApi.getIncidents(),
        assetApi.getAssets().catch(() => ({ data: [] }))
      ]);
      setIncidents(incRes.data);
      setAssets(assetRes.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to load incidents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCreate = async () => {
    setSaving(true);
    setError(null);
    try {
      await incidentApi.createIncident(form);
      setDialogOpen(false);
      setForm({ ...initialForm });
      await loadIncidents();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to create incident.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (incident: IncidentRecord, status: IncidentStatus) => {
    try {
      await incidentApi.updateStatus(incident.id, status);
      await loadIncidents();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Unable to update incident status.');
    }
  };

  const activeCount = incidents.filter((incident) => incident.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter((incident) => incident.severity === 'CRITICAL' && incident.status !== 'RESOLVED').length;
  const highCount = incidents.filter((incident) => incident.severity === 'HIGH' && incident.status !== 'RESOLVED').length;
  const resolved = incidents.filter((incident) => incident.resolvedAt);
  const meanResolutionMinutes = resolved.length === 0 ? null : resolved.reduce((total, incident) => {
    return total + (new Date(incident.resolvedAt as string).getTime() - new Date(incident.detectedAt).getTime()) / 60000;
  }, 0) / resolved.length;

  const severityColor = (severity: IncidentSeverity) => severity === 'CRITICAL' ? 'error' : severity === 'HIGH' ? 'warning' : severity === 'MEDIUM' ? 'info' : 'success';
  const statusColor = (status: IncidentStatus) => status === 'RESOLVED' ? 'success' : status === 'CONTAINED' ? 'info' : status === 'INVESTIGATING' ? 'warning' : 'error';

  return (
    <Box sx={{ width: '100%' }}>
      <PageHeader title="Incident Management" subtitle="Security incident tracking, assignment, SLA, and resolution workflow" />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setForm({
              ...initialForm,
              incidentIdentifier: `INC-${Date.now().toString().slice(-6)}`
            });
            setDialogOpen(true);
          }}
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
          Create Incident
        </Button>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadIncidents} disabled={loading} sx={{ textTransform: 'none' }}>
          Refresh
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Active Incidents" value={activeCount} subtitle="Open response queue" color="#8B5CF6" icon={<SecurityIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Critical" value={criticalCount} subtitle="Immediate attention" color="#EF4444" icon={<ErrorIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="High" value={highCount} subtitle="Elevated risk" color="#F59E0B" icon={<WarningAmberIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Mean Time to Resolve" value={meanResolutionMinutes === null ? 'N/A' : `${(meanResolutionMinutes / 60).toFixed(1)}h`} subtitle="Resolved incidents" color="#38BDF8" icon={<TimerIcon />} /></Grid>
      </Grid>

      <TableContainer component={Card} sx={{ overflow: 'hidden', borderColor: '#334155' }}>
        <Table>
          <TableHead><TableRow sx={{ backgroundColor: colors.activeNavBg }}>
            <TableCell>Incident ID</TableCell><TableCell>Title</TableCell><TableCell>Severity</TableCell><TableCell>Status</TableCell><TableCell>Asset</TableCell><TableCell>Detected At</TableCell><TableCell>SLA</TableCell><TableCell>Assignment</TableCell>
          </TableRow></TableHead>
          <TableBody>
            {loading ? <TableRow><TableCell colSpan={8} align="center">Loading incidents...</TableCell></TableRow> : incidents.length === 0 ? <TableRow><TableCell colSpan={8} align="center">No incidents found.</TableCell></TableRow> : incidents.map((incident) => (
              <TableRow key={incident.id} hover>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 700, color: '#A78BFA' }}>{incident.incidentIdentifier}</Typography></TableCell>
                <TableCell><Typography variant="body2" fontWeight={600}>{incident.title}</Typography><Typography variant="caption" color="text.secondary">{incident.description}</Typography></TableCell>
                <TableCell><Chip label={incident.severity} size="small" color={severityColor(incident.severity)} variant="outlined" /></TableCell>
                <TableCell><Select size="small" value={incident.status} onChange={(event) => handleStatusChange(incident, event.target.value as IncidentStatus)} sx={{ minWidth: 145 }}><MenuItem value="NEW">NEW</MenuItem><MenuItem value="INVESTIGATING">INVESTIGATING</MenuItem><MenuItem value="CONTAINED">CONTAINED</MenuItem><MenuItem value="RESOLVED">RESOLVED</MenuItem></Select><Box sx={{ mt: 0.5 }}><StatusChip label={incident.status} severity={statusColor(incident.status)} /></Box></TableCell>
                <TableCell>{incident.assetName || incident.assetIdentifier || 'Unassigned'}</TableCell>
                <TableCell>{new Date(incident.detectedAt).toLocaleString()}</TableCell>
                <TableCell><Typography color={incident.slaBreached ? 'error' : 'text.secondary'}>{incident.slaDueAt ? new Date(incident.slaDueAt).toLocaleString() : 'Not set'}</Typography></TableCell>
                <TableCell>{incident.assignedTeam || incident.assignedUser || 'Unassigned'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modern High-End Security Incident Modal */}
      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: '#0B1020',
            backgroundImage: 'radial-gradient(ellipse at top right, rgba(124, 58, 237, 0.12) 0%, transparent 60%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 3,
            boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.8), 0 0 35px rgba(124, 58, 237, 0.2)',
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
                bgcolor: 'rgba(124, 58, 237, 0.15)',
                border: '1px solid rgba(124, 58, 237, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#A78BFA',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.25)'
              }}
            >
              <SecurityIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                  Create Security Incident
                </Typography>
                <Chip
                  label="SOC Triage"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(124, 58, 237, 0.2)',
                    color: '#C4B5FD',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    border: '1px solid rgba(124, 58, 237, 0.4)'
                  }}
                />
              </Stack>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.825rem', mt: 0.25 }}>
                Initiate a tracked incident investigation, assign responders, and configure SLA targets.
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={() => setDialogOpen(false)}
            disabled={saving}
            sx={{
              color: '#94A3B8',
              '&:hover': { color: '#F8FAFC', bgcolor: 'rgba(255, 255, 255, 0.08)' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* Modal Form Content */}
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Stack spacing={3}>
            {/* Section 1: Incident Identification & Target Asset */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <TagIcon sx={{ fontSize: 18, color: '#818CF8' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                  Identification & Target Scope
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Incident Identifier"
                    value={form.incidentIdentifier}
                    onChange={(event) => setForm({ ...form, incidentIdentifier: event.target.value })}
                    required
                    placeholder="e.g. INC-948201"
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
                        '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                      }
                    }}
                  >
                    <InputLabel>Associated Asset (Optional)</InputLabel>
                    <Select
                      label="Associated Asset (Optional)"
                      value={form.assetId || ''}
                      onChange={(event) => setForm({ ...form, assetId: event.target.value })}
                      startAdornment={
                        <InputAdornment position="start">
                          <DnsIcon sx={{ color: '#64748B', fontSize: 20, ml: 1, mr: -0.5 }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>None / General Security Event</em>
                      </MenuItem>
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
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Incident Title"
                    value={form.title}
                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                    required
                    placeholder="e.g. Unauthorized administrative login attempts from foreign IP"
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
                        '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Incident Description & Impact"
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    multiline
                    minRows={3}
                    required
                    placeholder="Provide details on the anomaly, affected endpoints, indicators of compromise (IoCs), and preliminary impact assessment..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: 'rgba(51, 65, 85, 0.5)' }} />

            {/* Section 2: Severity & Assignment */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <LocalFireDepartmentIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                  Triage Severity & Assignment
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl
                    fullWidth
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                      }
                    }}
                  >
                    <InputLabel>Severity Level</InputLabel>
                    <Select
                      label="Severity Level"
                      value={form.severity}
                      onChange={(event) => setForm({ ...form, severity: event.target.value as IncidentSeverity })}
                    >
                      <MenuItem value="CRITICAL">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
                          <Typography sx={{ fontWeight: 600, color: '#EF4444' }}>CRITICAL — P1</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="HIGH">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
                          <Typography sx={{ fontWeight: 600, color: '#F59E0B' }}>HIGH — P2</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="MEDIUM">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#38BDF8', boxShadow: '0 0 8px #38BDF8' }} />
                          <Typography sx={{ fontWeight: 600, color: '#38BDF8' }}>MEDIUM — P3</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="LOW">
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22C55E', boxShadow: '0 0 8px #22C55E' }} />
                          <Typography sx={{ fontWeight: 600, color: '#22C55E' }}>LOW — P4</Typography>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Assigned Team"
                    value={form.assignedTeam}
                    onChange={(event) => setForm({ ...form, assignedTeam: event.target.value })}
                    placeholder="e.g. SOC Tier 2"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GroupIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Assigned Responder / User"
                    value={form.assignedUser}
                    onChange={(event) => setForm({ ...form, assignedUser: event.target.value })}
                    placeholder="e.g. analyst@sentinelcore.local"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(15, 23, 42, 0.7)',
                        '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ borderColor: 'rgba(51, 65, 85, 0.5)' }} />

            {/* Section 3: SLA & Resolution Target */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: '#38BDF8' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#E2E8F0', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
                  Response SLA Target
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="SLA Resolution Due At"
                    value={form.slaDueAt}
                    onChange={(event) => setForm({ ...form, slaDueAt: event.target.value })}
                    InputLabelProps={{ shrink: true }}
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
                        '&:hover fieldset': { borderColor: 'rgba(139, 92, 246, 0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(56, 189, 248, 0.06)',
                      border: '1px dashed rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%'
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#94A3B8', lineHeight: 1.5 }}>
                      💡 Setting an SLA timestamp activates real-time breach detection and automated alert tracking in the Incident Queue.
                    </Typography>
                  </Box>
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
              onClick={() => setDialogOpen(false)}
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
              onClick={handleCreate}
              variant="contained"
              disabled={saving || !form.incidentIdentifier || !form.title || !form.description}
              startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
              sx={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                color: '#F8FAFC',
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6D28D9 0%, #4F46E5 100%)',
                  boxShadow: '0 6px 20px rgba(124, 58, 237, 0.6)'
                },
                '&.Mui-disabled': {
                  background: 'rgba(124, 58, 237, 0.2)',
                  color: 'rgba(248, 250, 252, 0.4)'
                }
              }}
            >
              {saving ? 'Creating...' : 'Create Incident'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

