import { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventNoteIcon from '@mui/icons-material/EventNote';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PageHeader from '../components/PageHeader';
import { auditApi } from '../services/api';
import AccentMetricCard from '../components/AccentMetricCard';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [integrity, setIntegrity] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const load = async () => { try { const [logsResponse, integrityResponse] = await Promise.all([auditApi.getLogs(query), auditApi.getIntegrity()]); setLogs(logsResponse.data.content || []); setIntegrity(integrityResponse.data); } catch (err: any) { setError(err.response?.data?.message || err.message || 'Unable to load audit data.'); } };
  useEffect(() => { load(); }, []);
  return <><PageHeader title="Audit Trail" subtitle="Immutable security and administrative activity" /><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 3 }}><TextField size="small" label="Search action or entity" value={query} onChange={(e) => setQuery(e.target.value)} /><Button variant="contained" startIcon={<RefreshIcon />} onClick={load}>Refresh</Button></Stack>{error && <Alert severity="error">{error}</Alert>}<Grid container spacing={2} sx={{ mb: 3 }}><Grid item xs={12} sm={6} md={4}><AccentMetricCard label="Audit Events" value={logs.length} subtitle="Loaded activity records" color="#38BDF8" icon={<EventNoteIcon />} /></Grid><Grid item xs={12} sm={6} md={4}><AccentMetricCard label="Integrity" value={integrity === true ? 'PASS' : integrity === false ? 'FAIL' : '...' } subtitle="Hash verification status" color={integrity === false ? '#EF4444' : '#22C55E'} icon={<VerifiedUserIcon />} /></Grid><Grid item xs={12} sm={6} md={4}><AccentMetricCard label="Critical Actions" value={logs.filter((log) => log.severity === 'CRITICAL' || log.severity === 'HIGH').length} subtitle="High-impact activity" color="#F59E0B" icon={<WarningAmberIcon />} /></Grid></Grid><Card sx={{ overflow: 'hidden', borderColor: '#334155' }}><Table><TableHead><TableRow sx={{ bgcolor: '#101827' }}><TableCell>Time</TableCell><TableCell>Actor</TableCell><TableCell>Action</TableCell><TableCell>Entity</TableCell><TableCell>Result</TableCell><TableCell>Description</TableCell></TableRow></TableHead><TableBody>{logs.map((log) => <TableRow key={log.id} hover><TableCell>{new Date(log.occurredAt).toLocaleString()}</TableCell><TableCell>{log.actor}</TableCell><TableCell>{log.action}</TableCell><TableCell>{log.entityType}</TableCell><TableCell>{log.result}</TableCell><TableCell>{log.description}</TableCell></TableRow>)}</TableBody></Table></Card></>;
}
