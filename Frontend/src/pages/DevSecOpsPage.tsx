import { useEffect, useState } from 'react';
import { Alert, Card, CardContent, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import PageHeader from '../components/PageHeader';
import { reportApi } from '../services/api';

export default function DevSecOpsPage() {
  const [report, setReport] = useState<any>(null); const [error, setError] = useState<string | null>(null);
  useEffect(() => { reportApi.getCurrentReport().then((response) => setReport(response.data)).catch((err) => setError(err.response?.data?.message || err.message || 'Unable to load DevSecOps data.')); }, []);
  const cards = [
    {
      title: 'Overall Risk',
      value: report?.overallRiskScore != null ? `${Number(report.overallRiskScore).toFixed(1)} / 100` : 'N/A',
      subtitle: report?.overallRiskCategory ? `${report.overallRiskCategory} risk category` : 'No assessment data',
      color: '#8B5CF6',
      icon: <AssessmentIcon />
    },
    { title: 'Open Vulnerabilities', value: report?.openVulnerabilities ?? 'N/A', subtitle: 'Active security findings', color: '#EF4444', icon: <BugReportIcon /> },
    { title: 'SonarQube Findings', value: report?.sonarQubeFindings?.length ?? 'N/A', subtitle: 'Imported code-security findings', color: '#38BDF8', icon: <SearchIcon /> },
    { title: 'Trivy Findings', value: report?.trivyFindingsCount ?? 'N/A', subtitle: 'Container scan findings', color: '#F59E0B', icon: <SecurityIcon /> },
    { title: 'Patched Findings', value: report?.patchedVulnerabilities ?? 'N/A', subtitle: 'Patched or resolved', color: '#22C55E', icon: <CheckCircleIcon /> },
    { title: 'Pending Patches', value: report?.pendingPatches ?? 'N/A', subtitle: 'Active remediation queue', color: '#F97316', icon: <BuildIcon /> }
  ];
  return (
    <>
      <PageHeader
        title="DevSecOps Dashboard"
        subtitle="Code security, vulnerability, risk, incident, compliance, and audit posture"
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!report && !error ? (
        <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
          <CircularProgress color="primary" />
          <Typography color="text.secondary">Loading DevSecOps posture...</Typography>
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Card
                sx={{
                  height: '100%',
                  border: `1px solid ${card.color}66`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { borderColor: card.color, boxShadow: `0 12px 34px ${card.color}26` }
                }}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: card.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                        {card.title}
                      </Typography>
                      <Stack sx={{ color: card.color, bgcolor: `${card.color}1A`, p: 0.75, borderRadius: 1 }}>
                        {card.icon}
                      </Stack>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#F8FAFC' }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {card.subtitle}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
