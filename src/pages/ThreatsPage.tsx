import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, LinearProgress, Box } from '@mui/material';
import { useTheme } from '../context/ThemeContext';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import { threats, threatHeatmap } from '../data/mockData';

export default function ThreatsPage() {
  const { colors } = useTheme();
  return (
    <>
      <PageHeader title="Threats & Vulnerabilities" subtitle="Vulnerability scanner results and threat intelligence feed" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Active Threats</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>5</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Critical CVEs</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: colors.critical }}>2</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Affected Assets</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>54</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent><Typography variant="body2" color="text.secondary">Avg CVSS Score</Typography><Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>8.2</Typography></CardContent></Card>
        </Grid>
      </Grid>

      <TableContainer component={Card} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.activeNavBg }}>
              <TableCell>Threat ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>CVSS Score</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Affected</TableCell>
              <TableCell>Discovered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {threats.map((threat) => (
              <TableRow key={threat.id} hover sx={{ '&:hover': { backgroundColor: `${colors.activeNavBg}80` } }}>
                <TableCell>{threat.id}</TableCell>
                <TableCell>{threat.name}</TableCell>
                <TableCell>{threat.type}</TableCell>
                <TableCell><Chip label={threat.severity} size="small" color={threat.severity === 'Critical' ? 'error' : threat.severity === 'High' ? 'warning' : 'default'} variant="outlined" /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 30 }}>{threat.cvss}</Typography>
                    <Box sx={{ width: 60, height: 8, backgroundColor: threat.cvss >= 9 ? colors.critical : threat.cvss >= 7 ? colors.warning : colors.info, borderRadius: 999 }} />
                  </Box>
                </TableCell>
                <TableCell><StatusChip label={threat.status} severity={threat.status === 'Unpatched' ? 'error' : threat.status === 'Patching' ? 'warning' : 'success'} /></TableCell>
                <TableCell>{threat.affectedAssets}</TableCell>
                <TableCell>{new Date(threat.discoveredAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Threat Intensity Heatmap</Typography>
              <Stack spacing={2}>
                {threatHeatmap.map((point) => (
                  <Box key={point.label}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">{point.label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{point.value}/100</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={point.value} 
                      sx={{
                        height: 12,
                        borderRadius: 999,
                        backgroundColor: colors.border,
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 999,
                          backgroundColor: 
                            point.intensity === 'critical' ? colors.critical :
                            point.intensity === 'high' ? colors.warning :
                            point.intensity === 'medium' ? colors.info : colors.healthy
                        }
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Remediation Progress</Typography>
              <Stack spacing={2.5}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Critical Vulnerabilities</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>1/5 Patched</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={20} sx={{ height: 10, borderRadius: 999 }} />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">High Severity Issues</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>2/8 Mitigated</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={25} sx={{ height: 10, borderRadius: 999 }} />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography variant="body2">Medium Priority</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>4/12 Addressed</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={33} sx={{ height: 10, borderRadius: 999 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
