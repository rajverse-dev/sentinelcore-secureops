import { Card, CardContent, Grid, Stack, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, LinearProgress, Box } from '@mui/material';
import { Download as DownloadIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';

export default function ReportsPage() {
  const { colors } = useTheme();
  const reports = [
    { name: 'Security Posture Summary', date: '2026-08-31', type: 'Executive', status: 'Ready' },
    { name: 'Vulnerability Assessment Report', date: '2026-08-30', type: 'Technical', status: 'Ready' },
    { name: 'Incident Response Analysis', date: '2026-08-28', type: 'Forensics', status: 'Processing' },
    { name: 'Compliance Audit Trail', date: '2026-08-25', type: 'Compliance', status: 'Ready' },
    { name: 'Network Traffic Analysis', date: '2026-08-22', type: 'Technical', status: 'Ready' }
  ];

  return (
    <>
      <PageHeader title="Reports & Analytics" subtitle="Security reports, compliance audits, and performance analytics" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Reports Generated</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>47</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Ready to Download</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>4</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Compliance Score</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>94%</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Last Full Audit</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>8 days</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Report Generator</Typography>
              <Stack spacing={2}>
                <Button variant="outlined" fullWidth>Executive Summary</Button>
                <Button variant="outlined" fullWidth>Vulnerability Report</Button>
                <Button variant="outlined" fullWidth>Incident Trends</Button>
                <Button variant="outlined" fullWidth>Compliance Status</Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>30-Day Security Metrics</Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2">Incidents Resolved</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>12/15</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={80} sx={{ height: 8, borderRadius: 999 }} />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2">Vulnerabilities Patched</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>8/12</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={67} sx={{ height: 8, borderRadius: 999 }} />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2">Security Training</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>156/180</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={87} sx={{ height: 8, borderRadius: 999 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.activeNavBg }}>
              <TableCell>Report Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Generated</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{report.name}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.status === 'Ready' ? '✓ Ready' : '⟳ Processing'}</TableCell>
                <TableCell>
                  <Button size="small" startIcon={<DownloadIcon />} disabled={report.status !== 'Ready'}>
                    {report.status === 'Ready' ? 'Download' : 'Pending'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
