import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BuildIcon from '@mui/icons-material/Build';
import SpeedIcon from '@mui/icons-material/Speed';
import AssessmentIcon from '@mui/icons-material/Assessment';

import StatusChip from '../components/StatusChip';
import { DonutChart } from '../components/Charts';
import { assetApi, cveApi, riskApi, vulnerabilityApi } from '../services/api';
import { AssetRecord } from '../data/assets';
import { VulnerabilityRecord, VulnerabilitySeverity } from '../data/vulnerabilities';
import { CveRecord, RiskAssessmentRecord, RiskLevel } from '../data/risk';

const severityColors: Record<VulnerabilitySeverity, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F59E0B',
  MEDIUM: '#38BDF8',
  LOW: '#22C55E'
};

const riskLevelColors: Record<RiskLevel, string> = {
  CRITICAL: '#EF4444',
  HIGH: '#F59E0B',
  MEDIUM: '#38BDF8',
  LOW: '#22C55E'
};

const patchStatusColors: Record<string, string> = {
  VERIFIED: '#22C55E',
  PATCHED: '#38BDF8',
  PATCHING: '#F59E0B',
  OPEN: '#EF4444'
};

export default function RiskDashboardPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityRecord[]>([]);
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessmentRecord[]>([]);
  const [cves, setCves] = useState<CveRecord[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [environmentFilter, setEnvironmentFilter] = useState('ALL');
  const [riskCategoryFilter, setRiskCategoryFilter] = useState('ALL');

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [vulnRes, assetRes, riskRes, cveRes] = await Promise.all([
        vulnerabilityApi.getVulnerabilities(),
        assetApi.getAssets(),
        riskApi.getRiskAssessments(),
        cveApi.getCves()
      ]);

      setVulnerabilities(vulnRes.data ?? []);
      setAssets(assetRes.data ?? []);
      setRiskAssessments(riskRes.data ?? []);
      setCves(cveRes.data ?? []);
    } catch (err: any) {
      console.error('Failed to load risk dashboard data:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load risk dashboard data. Please check your backend connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const metrics = useMemo(() => {
    const totalVulnerabilities = vulnerabilities.length;
    const criticalVulnerabilities = vulnerabilities.filter((v) => v.severity === 'CRITICAL').length;
    const highVulnerabilities = vulnerabilities.filter((v) => v.severity === 'HIGH').length;
    const openVulnerabilities = vulnerabilities.filter((v) => v.status === 'OPEN' || v.status === 'IN_PROGRESS').length;
    const patchedVulnerabilities = vulnerabilities.filter((v) => v.status === 'RESOLVED' || v.patchStatus === 'PATCHED' || v.patchStatus === 'VERIFIED').length;
    const pendingPatches = vulnerabilities.filter((v) => v.patchStatus === 'OPEN' || v.patchStatus === 'PATCHING').length;

    let avgRiskScore = 0;
    if (riskAssessments.length > 0) {
      const totalScore = riskAssessments.reduce((acc, curr) => acc + (Number(curr.riskScore) || 0), 0);
      avgRiskScore = totalScore / riskAssessments.length;
    }

    return {
      totalVulnerabilities,
      criticalVulnerabilities,
      highVulnerabilities,
      openVulnerabilities,
      patchedVulnerabilities,
      pendingPatches,
      avgRiskScore: avgRiskScore.toFixed(1)
    };
  }, [vulnerabilities, riskAssessments]);

  const vulnSeveritySegments = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    vulnerabilities.forEach((v) => {
      if (counts[v.severity] !== undefined) {
        counts[v.severity]++;
      }
    });
    return [
      { label: 'Critical', value: counts.CRITICAL, color: severityColors.CRITICAL },
      { label: 'High', value: counts.HIGH, color: severityColors.HIGH },
      { label: 'Medium', value: counts.MEDIUM, color: severityColors.MEDIUM },
      { label: 'Low', value: counts.LOW, color: severityColors.LOW }
    ];
  }, [vulnerabilities]);

  const riskCategorySegments = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    riskAssessments.forEach((r) => {
      if (counts[r.riskCategory] !== undefined) {
        counts[r.riskCategory]++;
      }
    });
    return [
      { label: 'Critical', value: counts.CRITICAL, color: riskLevelColors.CRITICAL },
      { label: 'High', value: counts.HIGH, color: riskLevelColors.HIGH },
      { label: 'Medium', value: counts.MEDIUM, color: riskLevelColors.MEDIUM },
      { label: 'Low', value: counts.LOW, color: riskLevelColors.LOW }
    ];
  }, [riskAssessments]);

  const patchStatusSegments = useMemo(() => {
    const counts: Record<string, number> = { VERIFIED: 0, PATCHED: 0, PATCHING: 0, OPEN: 0 };
    vulnerabilities.forEach((v) => {
      const status = v.patchStatus || (v.status === 'RESOLVED' ? 'PATCHED' : 'OPEN');
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });
    return [
      { label: 'Verified', value: counts.VERIFIED, color: patchStatusColors.VERIFIED },
      { label: 'Patched', value: counts.PATCHED, color: patchStatusColors.PATCHED },
      { label: 'Patching', value: counts.PATCHING, color: patchStatusColors.PATCHING },
      { label: 'Open', value: counts.OPEN, color: patchStatusColors.OPEN }
    ];
  }, [vulnerabilities]);

  const cveSeveritySegments = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    cves.forEach((c) => {
      if (counts[c.severity] !== undefined) {
        counts[c.severity]++;
      }
    });
    return [
      { label: 'Critical', value: counts.CRITICAL, color: severityColors.CRITICAL },
      { label: 'High', value: counts.HIGH, color: severityColors.HIGH },
      { label: 'Medium', value: counts.MEDIUM, color: severityColors.MEDIUM },
      { label: 'Low', value: counts.LOW, color: severityColors.LOW }
    ];
  }, [cves]);

  const environmentDistribution = useMemo(() => {
    const envMap: Record<string, { totalVulns: number; criticalCount: number; assetCount: number }> = {};

    assets.forEach((a) => {
      const env = a.environment || 'UNKNOWN';
      if (!envMap[env]) {
        envMap[env] = { totalVulns: 0, criticalCount: 0, assetCount: 0 };
      }
      envMap[env].assetCount++;
    });

    const assetEnvMap = new Map<string, string>();
    assets.forEach((a) => assetEnvMap.set(a.id, a.environment || 'UNKNOWN'));

    vulnerabilities.forEach((v) => {
      const env = assetEnvMap.get(v.assetId) || 'UNKNOWN';
      if (!envMap[env]) {
        envMap[env] = { totalVulns: 0, criticalCount: 0, assetCount: 0 };
      }
      envMap[env].totalVulns++;
      if (v.severity === 'CRITICAL') {
        envMap[env].criticalCount++;
      }
    });

    return Object.entries(envMap).map(([env, data]) => ({
      environment: env,
      ...data
    }));
  }, [assets, vulnerabilities]);

  const topRiskyAssets = useMemo(() => {
    return [...riskAssessments]
      .sort((a, b) => Number(b.riskScore) - Number(a.riskScore))
      .slice(0, 5);
  }, [riskAssessments]);

  const filteredRiskAssessments = useMemo(() => {
    return riskAssessments.filter((r) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        r.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.assetIdentifier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEnv =
        environmentFilter === 'ALL' ||
        r.environment?.toUpperCase() === environmentFilter.toUpperCase();

      const matchesCategory =
        riskCategoryFilter === 'ALL' ||
        r.riskCategory?.toUpperCase() === riskCategoryFilter.toUpperCase();

      return matchesSearch && matchesEnv && matchesCategory;
    });
  }, [riskAssessments, searchQuery, environmentFilter, riskCategoryFilter]);

  const uniqueEnvironments = useMemo(() => {
    const envs = new Set<string>();
    riskAssessments.forEach((r) => {
      if (r.environment) envs.add(r.environment);
    });
    assets.forEach((a) => {
      if (a.environment) envs.add(a.environment);
    });
    return Array.from(envs);
  }, [riskAssessments, assets]);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            Vulnerability & Risk Management Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time security analytics, multi-factor asset risk scoring, CVE registry, and patch remediation tracking.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
            color: '#FFFFFF',
            fontWeight: 600,
            textTransform: 'none',
            px: 2.5,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%)',
            }
          }}
        >
          Refresh Data
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadDashboardData}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 12 }}>
          <CircularProgress size={48} sx={{ color: '#8B5CF6', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading vulnerability intelligence & risk models...
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {/* SECTION 1: SUMMARY KPI METRIC CARDS */}
          <Grid container spacing={2}>
            {/* Total Vulnerabilities */}
            <Grid item xs={12} sm={6} md={3} lg={1.71}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: '#A7B0C0', fontWeight: 600, textTransform: 'uppercase' }}>
                        Total Vulns
                      </Typography>
                      <BugReportIcon sx={{ color: '#38BDF8', fontSize: 18 }} />
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                      {metrics.totalVulnerabilities}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Across all monitored assets
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Critical Vulnerabilities */}
            <Grid item xs={12} sm={6} md={3} lg={1.71}>
              <Card sx={{ background: '#151C2C', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 2, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: '#EF4444' }} />
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 600, textTransform: 'uppercase' }}>
                        Critical
                      </Typography>
                      <WarningAmberIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#EF4444' }}>
                      {metrics.criticalVulnerabilities}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#EF4444', opacity: 0.8 }}>
                      Requires urgent patch
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* High Vulnerabilities */}
            <Grid item xs={12} sm={6} md={3} lg={1.71}>
              <Card sx={{ background: '#151C2C', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 2, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: '#F59E0B' }} />
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600, textTransform: 'uppercase' }}>
                        High Severity
                      </Typography>
                      <WarningAmberIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F59E0B' }}>
                      {metrics.highVulnerabilities}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#F59E0B', opacity: 0.8 }}>
                      Elevated risk impact
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Open Vulnerabilities */}
            <Grid item xs={12} sm={6} md={3} lg={1.71}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: '#A7B0C0', fontWeight: 600, textTransform: 'uppercase' }}>
                        Active / Open
                      </Typography>
                      <SecurityIcon sx={{ color: '#8B5CF6', fontSize: 18 }} />
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                      {metrics.openVulnerabilities}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Pending remediation
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Patched / Resolved */}
            <Grid item xs={12} sm={6} md={3} lg={1.71}>
              <Card sx={{ background: '#151C2C', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: 2, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, bgcolor: '#22C55E' }} />
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 600, textTransform: 'uppercase' }}>
                        Patched
                      </Typography>
                      <CheckCircleIcon sx={{ color: '#22C55E', fontSize: 18 }} />
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#22C55E' }}>
                      {metrics.patchedVulnerabilities}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#22C55E', opacity: 0.8 }}>
                      Resolved & verified
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Pending Patches */}
            <Grid item xs={12} sm={6} md={3} lg={1.71}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: '#A7B0C0', fontWeight: 600, textTransform: 'uppercase' }}>
                        Pending Patches
                      </Typography>
                      <BuildIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                      {metrics.pendingPatches}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      In queue / patching
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Avg Risk Score */}
            <Grid item xs={12} sm={6} md={3} lg={1.74}>
              <Card sx={{ background: '#151C2C', border: '1px solid #7C3AED', borderRadius: 2, height: '100%', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #7C3AED, #38BDF8)' }} />
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Stack spacing={0.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: '#A78BFA', fontWeight: 600, textTransform: 'uppercase' }}>
                        Avg Risk Score
                      </Typography>
                      <SpeedIcon sx={{ color: '#A78BFA', fontSize: 18 }} />
                    </Stack>
                    <Stack direction="row" alignItems="baseline" spacing={1}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                        {metrics.avgRiskScore}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8' }}>/ 100</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#A78BFA' }}>
                      Enterprise posture
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* SECTION 2: CHARTS AND VISUAL DISTRIBUTIONS */}
          <Grid container spacing={3}>
            {/* Chart 1: Vulnerabilities by Severity */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F8FAFC' }}>
                    Vulnerabilities by Severity
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <DonutChart segments={vulnSeveritySegments} centerLabel="vulns" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Chart 2: Asset Risk Distribution */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F8FAFC' }}>
                    Asset Risk Categories
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <DonutChart segments={riskCategorySegments} centerLabel="assets" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Chart 3: Patch Lifecycle Status */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F8FAFC' }}>
                    Patch Remediation Status
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <DonutChart segments={patchStatusSegments} centerLabel="patches" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Chart 4: CVE Registry Severity Breakdown */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                      CVE Catalog Severity
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8B5CF6', bgcolor: 'rgba(139, 92, 246, 0.1)', px: 1, py: 0.5, borderRadius: 1 }}>
                      {cves.length} Registered CVEs
                    </Typography>
                  </Stack>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                    <DonutChart segments={cveSeveritySegments} centerLabel="CVEs" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Section 5: Vulnerabilities by Environment */}
            <Grid item xs={12} md={6} lg={4}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#F8FAFC' }}>
                    Vulnerabilities by Environment
                  </Typography>
                  <Stack spacing={2} sx={{ mt: 1 }}>
                    {environmentDistribution.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No environment data available</Typography>
                    ) : (
                      environmentDistribution.map((item) => {
                        const total = metrics.totalVulnerabilities || 1;
                        const pct = Math.round((item.totalVulns / total) * 100);
                        return (
                          <Box key={item.environment}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                                {item.environment}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                {item.totalVulns} vulns ({pct}%) â€¢ {item.criticalCount} Critical
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={pct}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                bgcolor: '#1E293B',
                                '& .MuiLinearProgress-bar': {
                                  background: item.environment === 'PRODUCTION'
                                    ? 'linear-gradient(90deg, #EF4444, #F59E0B)'
                                    : 'linear-gradient(90deg, #8B5CF6, #38BDF8)',
                                  borderRadius: 4
                                }
                              }}
                            />
                          </Box>
                        );
                      })
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Section 6: Top Risky Assets Leaderboard */}
            <Grid item xs={12} md={12} lg={4}>
              <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                      Top Risky Assets
                    </Typography>
                    <AssessmentIcon sx={{ color: '#EF4444' }} />
                  </Stack>
                  <Stack spacing={1.5}>
                    {topRiskyAssets.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">No risk assessment records available</Typography>
                    ) : (
                      topRiskyAssets.map((asset) => (
                        <Box
                          key={asset.assetId}
                          onClick={() => navigate(`/assets/${asset.assetId}`)}
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            bgcolor: '#0B1020',
                            border: '1px solid #1E293B',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: '#7C3AED',
                              bgcolor: 'rgba(124, 58, 237, 0.05)',
                              transform: 'translateX(3px)'
                            }
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box sx={{ minWidth: 0, flex: 1, mr: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {asset.assetName}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#64748B' }}>
                                {asset.assetIdentifier} â€¢ {asset.environment}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box
                                sx={{
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontWeight: 700,
                                  fontSize: '0.8125rem',
                                  bgcolor: asset.riskCategory === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                  color: asset.riskCategory === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                                  border: `1px solid ${asset.riskCategory === 'CRITICAL' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                                }}
                              >
                                {Number(asset.riskScore).toFixed(1)}
                              </Box>
                              <OpenInNewIcon sx={{ color: '#64748B', fontSize: 16 }} />
                            </Stack>
                          </Stack>
                        </Box>
                      ))
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* SECTION 3: ASSET RISK POSTURE TABLE */}
          <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', md: 'center' }} spacing={2} sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                    Asset Risk Assessments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enterprise risk scoring computed across asset criticality, CVSS severity, and open vulnerability pressure
                  </Typography>
                </Box>

                {/* Filter Controls */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <TextField
                    size="small"
                    placeholder="Search asset name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      minWidth: { xs: '100%', sm: 220 },
                      '& .MuiOutlinedInput-root': {
                        bgcolor: '#0B1020',
                        color: '#F8FAFC',
                        '& fieldset': { borderColor: '#334155' },
                        '&:hover fieldset': { borderColor: '#64748B' },
                        '&.Mui-focused fieldset': { borderColor: '#7C3AED' }
                      }
                    }}
                  />

                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel sx={{ color: '#94A3B8' }}>Environment</InputLabel>
                    <Select
                      value={environmentFilter}
                      label="Environment"
                      onChange={(e) => setEnvironmentFilter(e.target.value)}
                      sx={{
                        bgcolor: '#0B1020',
                        color: '#F8FAFC',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                      }}
                    >
                      <MenuItem value="ALL">All Environments</MenuItem>
                      {uniqueEnvironments.map((env) => (
                        <MenuItem key={env} value={env}>{env}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel sx={{ color: '#94A3B8' }}>Risk Category</InputLabel>
                    <Select
                      value={riskCategoryFilter}
                      label="Risk Category"
                      onChange={(e) => setRiskCategoryFilter(e.target.value)}
                      sx={{
                        bgcolor: '#0B1020',
                        color: '#F8FAFC',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' }
                      }}
                    >
                      <MenuItem value="ALL">All Categories</MenuItem>
                      <MenuItem value="CRITICAL">Critical</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>

              <TableContainer sx={{ borderRadius: 1.5, border: '1px solid #1E293B', bgcolor: '#0B1020' }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#151C2C' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>Asset</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>Environment</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>Risk Score</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }}>Risk Category</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }} align="center">Open Vulns</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }} align="center">Highest CVSS</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontWeight: 600, borderBottom: '1px solid #1E293B' }} align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRiskAssessments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: '#64748B', borderBottom: 'none' }}>
                          <SecurityIcon sx={{ fontSize: 40, opacity: 0.4, mb: 1, display: 'block', mx: 'auto' }} />
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#94A3B8' }}>
                            No risk assessment data found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {searchQuery || environmentFilter !== 'ALL' || riskCategoryFilter !== 'ALL'
                              ? 'Try adjusting your search query or active filters.'
                              : 'Run vulnerability scans or register assets to compute risk scores.'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRiskAssessments.map((record) => {
                        const score = Number(record.riskScore) || 0;
                        const scoreColor =
                          record.riskCategory === 'CRITICAL'
                            ? '#EF4444'
                            : record.riskCategory === 'HIGH'
                            ? '#F59E0B'
                            : record.riskCategory === 'MEDIUM'
                            ? '#38BDF8'
                            : '#22C55E';

                        return (
                          <TableRow
                            key={record.assetId}
                            hover
                            sx={{
                              '&:hover': { bgcolor: 'rgba(124, 58, 237, 0.04)' },
                              borderBottom: '1px solid #1E293B'
                            }}
                          >
                            <TableCell sx={{ borderBottom: '1px solid #1E293B' }}>
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#F8FAFC',
                                    cursor: 'pointer',
                                    '&:hover': { color: '#8B5CF6', textDecoration: 'underline' }
                                  }}
                                  onClick={() => navigate(`/assets/${record.assetId}`)}
                                >
                                  {record.assetName}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#64748B' }}>
                                  {record.assetIdentifier}
                                </Typography>
                              </Box>
                            </TableCell>

                            <TableCell sx={{ borderBottom: '1px solid #1E293B' }}>
                              <StatusChip
                                label={record.environment || 'UNKNOWN'}
                                severity={
                                  record.environment === 'PRODUCTION'
                                    ? 'error'
                                    : record.environment === 'STAGING'
                                    ? 'warning'
                                    : 'info'
                                }
                              />
                            </TableCell>

                            <TableCell sx={{ borderBottom: '1px solid #1E293B' }}>
                              <Box sx={{ width: 140 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                  <Typography variant="body2" sx={{ fontWeight: 700, color: scoreColor }}>
                                    {score.toFixed(1)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#64748B' }}>
                                    / 100
                                  </Typography>
                                </Stack>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(score, 100)}
                                  sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: '#1E293B',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: scoreColor,
                                      borderRadius: 3
                                    }
                                  }}
                                />
                              </Box>
                            </TableCell>

                            <TableCell sx={{ borderBottom: '1px solid #1E293B' }}>
                              <Box
                                sx={{
                                  display: 'inline-block',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  bgcolor: `${scoreColor}1A`,
                                  color: scoreColor,
                                  border: `1px solid ${scoreColor}4D`
                                }}
                              >
                                {record.riskCategory}
                              </Box>
                            </TableCell>

                            <TableCell align="center" sx={{ borderBottom: '1px solid #1E293B' }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 700,
                                  color: record.openVulnerabilityCount > 0 ? '#EF4444' : '#22C55E'
                                }}
                              >
                                {record.openVulnerabilityCount}
                              </Typography>
                            </TableCell>

                            <TableCell align="center" sx={{ borderBottom: '1px solid #1E293B' }}>
                              {record.highestCvssScore !== undefined && record.highestCvssScore !== null ? (
                                <Box
                                  sx={{
                                    display: 'inline-block',
                                    px: 1.2,
                                    py: 0.25,
                                    borderRadius: 1,
                                    fontWeight: 700,
                                    fontSize: '0.8125rem',
                                    bgcolor: Number(record.highestCvssScore) >= 9.0
                                      ? 'rgba(239, 68, 68, 0.15)'
                                      : Number(record.highestCvssScore) >= 7.0
                                      ? 'rgba(245, 158, 11, 0.15)'
                                      : 'rgba(56, 189, 248, 0.15)',
                                    color: Number(record.highestCvssScore) >= 9.0
                                      ? '#EF4444'
                                      : Number(record.highestCvssScore) >= 7.0
                                      ? '#F59E0B'
                                      : '#38BDF8'
                                  }}
                                >
                                  {Number(record.highestCvssScore).toFixed(1)}
                                </Box>
                              ) : (
                                <Typography variant="caption" sx={{ color: '#64748B' }}>None</Typography>
                              )}
                            </TableCell>

                            <TableCell align="right" sx={{ borderBottom: '1px solid #1E293B' }}>
                              <Tooltip title="View Asset Security Details">
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/assets/${record.assetId}`)}
                                  sx={{
                                    color: '#8B5CF6',
                                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.2)' }
                                  }}
                                >
                                  <OpenInNewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Stack>
      )}
    </Box>
  );
}
