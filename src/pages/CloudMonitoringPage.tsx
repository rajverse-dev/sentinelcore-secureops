import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import { cloudResources } from '../data/mockData';

export default function CloudMonitoringPage() {
  return (
    <>
      <PageHeader title="Cloud Monitoring" subtitle="Multi-region workload, database and platform health" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Cloud Regions</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>4</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Healthy Services</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>2</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Warning Services</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>1</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Critical Services</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>1</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
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
