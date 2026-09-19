import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { cloudResources } from '../data/mockData';

export default function CloudMonitoringPage() {
  return (
    <>
      <PageHeader title="Cloud Monitoring" subtitle="Multi-region workload, database and platform health" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Cloud Regions" value="4" subtitle="Active regions" color="#38BDF8" icon={<CloudIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Healthy Services" value="2" subtitle="Operating normally" color="#22C55E" icon={<CheckCircleIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Warning Services" value="1" subtitle="Needs attention" color="#F59E0B" icon={<WarningAmberIcon />} /></Grid>
        <Grid item xs={12} sm={6} md={3}><AccentMetricCard label="Critical Services" value="1" subtitle="Immediate review" color="#EF4444" icon={<ErrorIcon />} /></Grid>
      </Grid>

      <TableContainer component={Card} sx={{ overflow: 'hidden', borderColor: '#334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#101827' }}>
              <TableCell>Resource</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>CPU</TableCell>
              <TableCell>Memory</TableCell>
              <TableCell>Network</TableCell>
              <TableCell>Last Check</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cloudResources.map((resource) => (
              <TableRow key={resource.resource} hover>
                <TableCell>{resource.resource}</TableCell>
                <TableCell>{resource.type}</TableCell>
                <TableCell>{resource.region}</TableCell>
                <TableCell><StatusChip label={resource.status} severity={resource.status === 'Critical' ? 'error' : resource.status === 'Warning' ? 'warning' : 'success'} /></TableCell>
                <TableCell>{resource.cpu}</TableCell>
                <TableCell>{resource.memory}</TableCell>
                <TableCell>{resource.network}</TableCell>
                <TableCell>{resource.lastCheck}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Service Overview</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Card variant="outlined" sx={{ flex: 1 }}><CardContent><Typography variant="body2" color="text.secondary">Compute</Typography><Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>86%</Typography></CardContent></Card>
            <Card variant="outlined" sx={{ flex: 1 }}><CardContent><Typography variant="body2" color="text.secondary">Storage</Typography><Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>71%</Typography></CardContent></Card>
            <Card variant="outlined" sx={{ flex: 1 }}><CardContent><Typography variant="body2" color="text.secondary">Network</Typography><Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>42%</Typography></CardContent></Card>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
