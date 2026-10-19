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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SecurityIcon from '@mui/icons-material/Security';
import ErrorIcon from '@mui/icons-material/Error';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TimerIcon from '@mui/icons-material/Timer';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { incidentApi } from '../services/api';
import { IncidentRecord, IncidentRequest, IncidentSeverity, IncidentStatus } from '../data/incidents';

const initialForm: IncidentRequest = {
  incidentIdentifier: '',
  title: '',
  description: '',
  severity: 'HIGH',
  assignedTeam: '',
  assignedUser: '',
  slaDueAt: ''
};

export default function IncidentsPage() {
  const { colors } = useTheme();
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<IncidentRequest>(initialForm);

  const loadIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await incidentApi.getIncidents();
      setIncidents(response.data);
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)} sx={{ bgcolor: colors.primary, textTransform: 'none' }}>
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
                <TableCell>{incident.incidentIdentifier}</TableCell>
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

      <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Security Incident</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Incident ID" value={form.incidentIdentifier} onChange={(event) => setForm({ ...form, incidentIdentifier: event.target.value })} required />
            <TextField label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            <TextField label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} multiline minRows={3} required />
            <FormControl><InputLabel>Severity</InputLabel><Select label="Severity" value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value as IncidentSeverity })}><MenuItem value="CRITICAL">CRITICAL</MenuItem><MenuItem value="HIGH">HIGH</MenuItem><MenuItem value="MEDIUM">MEDIUM</MenuItem><MenuItem value="LOW">LOW</MenuItem></Select></FormControl>
            <TextField label="Assigned Team" value={form.assignedTeam} onChange={(event) => setForm({ ...form, assignedTeam: event.target.value })} />
            <TextField label="Assigned User" value={form.assignedUser} onChange={(event) => setForm({ ...form, assignedUser: event.target.value })} />
            <TextField label="SLA Due At" type="datetime-local" value={form.slaDueAt} onChange={(event) => setForm({ ...form, slaDueAt: event.target.value })} InputLabelProps={{ shrink: true }} />
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button><Button onClick={handleCreate} variant="contained" disabled={saving || !form.incidentIdentifier || !form.title || !form.description}>Create</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
