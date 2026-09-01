import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';import { useTheme } from '../context/ThemeContext';import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import { incidents } from '../data/mockData';

export default function IncidentsPage() {
  const { colors } = useTheme();
  return (
    <>
      <PageHeader title="Incident Management" subtitle="Active security incidents and threat response timeline" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Active Incidents</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>3</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Critical</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: colors.critical }}>2</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">High</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: colors.warning }}>2</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Mean Time to Resolve</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>4.5h</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.activeNavBg }}>
              <TableCell>Incident ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>Detected At</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Affected Assets</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id} hover sx={{ '&:hover': { backgroundColor: `${colors.activeNavBg}80` } }}>
                <TableCell>{incident.id}</TableCell>
                <TableCell>{incident.title}</TableCell>
                <TableCell><Chip label={incident.severity} size="small" color={incident.severity === 'Critical' ? 'error' : 'warning'} variant="outlined" /></TableCell>
                <TableCell><StatusChip label={incident.status} severity={incident.status === 'Active' ? 'error' : incident.status === 'Investigating' ? 'warning' : 'success'} /></TableCell>
                <TableCell>{incident.asset}</TableCell>
                <TableCell>{new Date(incident.detectedAt).toLocaleString()}</TableCell>
                <TableCell>{incident.duration}</TableCell>
                <TableCell>{incident.affectedAssets}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Incident Timeline</Typography>
          <Stack spacing={2}>
            {incidents.slice(0, 3).map((incident) => (
              <Stack key={incident.id} direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pb: 1.5, borderBottom: `1px solid ${colors.border}`, '&:last-child': { borderBottom: 'none' } }}>
                <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>{new Date(incident.detectedAt).toLocaleTimeString()}</Typography>
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Typography variant="subtitle2">{incident.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{incident.description}</Typography>
                </Stack>
                <Chip label={incident.severity} size="small" color={incident.severity === 'Critical' ? 'error' : 'warning'} variant="outlined" />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
