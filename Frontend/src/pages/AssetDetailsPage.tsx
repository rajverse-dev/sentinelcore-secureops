import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import BugReportIcon from '@mui/icons-material/BugReport';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import {
  assetApi,
  vulnerabilityApi,
  scanApi,
  TrivyScanSummary,
  TrivyFinding
} from '../services/api';
import { AssetRecord } from '../data/assets';
import { VulnerabilityRecord } from '../data/vulnerabilities';

const formatEnum = (value?: string) => {
  if (!value) return '';
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character: string) => character.toUpperCase());
};

const statusSeverity = (status?: string): 'success' | 'warning' | 'error' | 'info' => {
  if (status === 'ACTIVE' || status === 'COMPLETED' || status === 'SUCCESS') return 'success';
  if (status === 'PENDING' || status === 'MEDIUM') return 'warning';
  if (status === 'CRITICAL' || status === 'HIGH') return 'error';
  return 'info';
};

const severityColor = (severity?: string): 'error' | 'warning' | 'info' | 'success' | 'default' => {
  if (severity === 'CRITICAL') return 'error';
  if (severity === 'HIGH') return 'warning';
  if (severity === 'MEDIUM') return 'info';
  if (severity === 'LOW') return 'success';
  return 'default';
};

const riskColor = (level?: string): string => {
  switch (level?.toUpperCase()) {
    case 'CRITICAL':
      return '#ef4444';
    case 'HIGH':
      return '#f97316';
    case 'MEDIUM':
      return '#eab308';
    case 'LOW':
      return '#22c55e';
    default:
      return '#94a3b8';
  }
};

const sampleOfflineJson = (assetName: string) => `{
  "Results": [
    {
      "Target": "${assetName}",
      "Vulnerabilities": [
        {
          "VulnerabilityID": "CVE-2024-3094",
          "PkgName": "xz-utils",
          "InstalledVersion": "5.6.0-0.2",
          "FixedVersion": "5.6.1-1",
          "Severity": "CRITICAL",
          "Title": "XZ Utils Backdoor in upstream release tarballs",
          "Description": "Malicious code was discovered in the upstream tarballs of xz, starting with version 5.6.0.",
          "CVSS": {
            "nvd": {
              "V3Score": 10.0
            }
          },
          "References": [
            "https://nvd.nist.gov/vuln/detail/CVE-2024-3094",
            "https://tukaani.org/xz-backdoor/"
          ]
        },
        {
          "VulnerabilityID": "CVE-2024-2961",
          "PkgName": "glibc",
          "InstalledVersion": "2.38-1ubuntu8.1",
          "FixedVersion": "2.38-1ubuntu8.2",
          "Severity": "HIGH",
          "Title": "Buffer overflow in iconv during ISO-2022-CN-EXT conversion",
          "Description": "A buffer overflow flaw in iconv module character set conversion routine.",
          "CVSS": {
            "nvd": {
              "V3Score": 8.4
            }
          },
          "References": [
            "https://nvd.nist.gov/vuln/detail/CVE-2024-2961"
          ]
        },
        {
          "VulnerabilityID": "CVE-2024-21626",
          "PkgName": "runc",
          "InstalledVersion": "1.1.11-0ubuntu1",
          "FixedVersion": "1.1.12-0ubuntu1",
          "Severity": "HIGH",
          "Title": "runc container breakout through file descriptor leak",
          "Description": "In runc through 1.1.11, file descriptors leak to the spawned container process.",
          "CVSS": {
            "nvd": {
              "V3Score": 8.6
            }
          },
          "References": [
            "https://nvd.nist.gov/vuln/detail/CVE-2024-21626"
          ]
        },
        {
          "VulnerabilityID": "CVE-2023-44487",
          "PkgName": "libnghttp2",
          "InstalledVersion": "1.52.0-1",
          "FixedVersion": "1.52.0-1+deb12u1",
          "Severity": "MEDIUM",
          "Title": "HTTP/2 Rapid Reset DDoS vulnerability",
          "Description": "HTTP/2 protocol allows a denial of service (server resource consumption) via HEADERS frames.",
          "CVSS": {
            "nvd": {
              "V3Score": 7.5
            }
          },
          "References": [
            "https://nvd.nist.gov/vuln/detail/CVE-2023-44487"
          ]
        }
      ]
    }
  ]
}`;

export default function AssetDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [asset, setAsset] = useState<AssetRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [vulnerabilities, setVulnerabilities] = useState<VulnerabilityRecord[]>([]);
  const [vulnerabilityError, setVulnerabilityError] = useState('');

  // Trivy scan state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<TrivyScanSummary | null>(null);
  const [scanSuccessMessage, setScanSuccessMessage] = useState('');
  const [scanErrorMessage, setScanErrorMessage] = useState('');

  // Finding details modal
  const [selectedFinding, setSelectedFinding] = useState<TrivyFinding | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Custom scan / Offline mode modal
  const [customScanOpen, setCustomScanOpen] = useState(false);
  const [customTarget, setCustomTarget] = useState('');
  const [customJson, setCustomJson] = useState('');

  const loadAssetData = () => {
    if (!id) return;
    setLoading(true);
    setError('');

    assetApi.getAsset(id)
      .then((response) => {
        setAsset(response.data as AssetRecord);
      })
      .catch((requestError: unknown) => {
        const status = (requestError as { response?: { status?: number } }).response?.status;
        setError(status === 404 ? 'Asset not found.' : 'Unable to load asset details. Check that the asset service is running.');
      })
      .finally(() => {
        setLoading(false);
      });

    vulnerabilityApi.getVulnerabilitiesByAsset(id)
      .then((response) => {
        setVulnerabilities(response.data as VulnerabilityRecord[]);
      })
      .catch(() => {
        setVulnerabilityError('Unable to load vulnerabilities for this asset.');
      });
  };

  useEffect(() => {
    if (!id) {
      setError('Asset ID is missing.');
      setLoading(false);
      return;
    }
    loadAssetData();
  }, [id]);

  const handleRunTrivyScan = async (overrideTarget?: string, overrideJson?: string) => {
    if (!asset || !id) return;

    setScanning(true);
    setScanErrorMessage('');
    setScanSuccessMessage('');

    try {
      const payload: { assetId: string; scanTarget?: string; trivyJson?: string } = {
        assetId: id
      };

      if (overrideTarget && overrideTarget.trim()) {
        payload.scanTarget = overrideTarget.trim();
      } else if (asset.identifier) {
        payload.scanTarget = asset.identifier;
      }

      if (overrideJson && overrideJson.trim()) {
        payload.trivyJson = overrideJson.trim();
      }

      const response = await scanApi.runTrivyScan(payload);
      const summary = response.data;
      setScanResult(summary);

      if (summary.parsedFindings === 0) {
        setScanSuccessMessage('✓ No vulnerabilities detected for this asset.');
      } else {
        setScanSuccessMessage(
          `✓ Trivy scan completed: ${summary.parsedFindings} findings processed (${summary.createdFindings} created, ${summary.updatedFindings} updated).`
        );
      }

      // Refresh vulnerability list and asset data to reflect latest dynamic state
      const vulnRes = await vulnerabilityApi.getVulnerabilitiesByAsset(id);
      setVulnerabilities(vulnRes.data as VulnerabilityRecord[]);

      const assetRes = await assetApi.getAsset(id);
      setAsset(assetRes.data as AssetRecord);
    } catch (scanErr: unknown) {
      const errResp = (scanErr as { response?: { data?: { message?: string }; status?: number } })?.response;
      if (errResp?.status === 503) {
        setScanErrorMessage(errResp.data?.message || 'Trivy scanner is unavailable on the server.');
      } else if (errResp?.status === 504 || errResp?.data?.message?.includes('timed out')) {
        setScanErrorMessage('Trivy scan timed out.');
      } else {
        setScanErrorMessage(errResp?.data?.message || 'Unable to complete Trivy scan. Please verify scanner configuration.');
      }
    } finally {
      setScanning(false);
      setCustomScanOpen(false);
    }
  };

  const handleOpenCustomScan = () => {
    if (asset) {
      setCustomTarget(asset.identifier || 'alpine:latest');
      setCustomJson(sampleOfflineJson(asset.name || asset.identifier));
    }
    setCustomScanOpen(true);
  };

  const handleViewFindingDetails = (finding: TrivyFinding) => {
    setSelectedFinding(finding);
    setDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !asset) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{error || 'Unable to load asset details.'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/assets')} sx={{ alignSelf: 'flex-start' }}>
          Back to assets
        </Button>
      </Stack>
    );
  }

  const fields = [
    ['Identifier', asset.identifier],
    ['Type', formatEnum(asset.type)],
    ['Provider', formatEnum(asset.provider)],
    ['Region', asset.region],
    ['Environment', formatEnum(asset.environment)],
    ['Owner', asset.owner || 'Unassigned'],
    ['Created', asset.createdAt || 'Not available']
  ];

  const criticalCount = vulnerabilities.filter((item) => item.severity === 'CRITICAL').length;
  const highCount = vulnerabilities.filter((item) => item.severity === 'HIGH').length;
  const mediumCount = vulnerabilities.filter((item) => item.severity === 'MEDIUM').length;
  const lowCount = vulnerabilities.filter((item) => item.severity === 'LOW').length;
  const openCount = vulnerabilities.filter((item) => item.status === 'OPEN').length;

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* Header */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
        <PageHeader title={`Asset Details - ${asset.name}`} subtitle="Infrastructure asset information & security scanning" />
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate('/assets')}
            sx={{ borderColor: '#334155', color: '#94a3b8' }}
          >
            Back to assets
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={scanning ? <CircularProgress size={18} color="inherit" /> : <SecurityIcon />}
            disabled={scanning}
            onClick={() => handleRunTrivyScan()}
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)'
              }
            }}
          >
            {scanning ? 'Scanning...' : 'Run Trivy Scan'}
          </Button>
          <Tooltip title="Configure scan target or provide sample scan results">
            <IconButton
              onClick={handleOpenCustomScan}
              sx={{ color: '#94a3b8', border: '1px solid #334155', borderRadius: 1 }}
            >
              <UploadFileIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Scan Messages */}
      {scanSuccessMessage && (
        <Alert
          severity={scanSuccessMessage.includes('No vulnerabilities') ? 'success' : 'info'}
          icon={<CheckCircleOutlineIcon />}
          onClose={() => setScanSuccessMessage('')}
          sx={{ mb: 3, border: '1px solid rgba(14, 165, 233, 0.3)', backgroundColor: '#0c1a2d' }}
        >
          {scanSuccessMessage}
        </Alert>
      )}

      {scanErrorMessage && (
        <Alert
          severity="error"
          onClose={() => setScanErrorMessage('')}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleOpenCustomScan}
              sx={{ fontWeight: 600 }}
            >
              Use Custom/Offline Scan
            </Button>
          }
          sx={{ mb: 3, border: '1px solid rgba(239, 68, 68, 0.4)', backgroundColor: '#1f1319' }}
        >
          {scanErrorMessage}
        </Alert>
      )}

      {/* Asset Information & Health Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ backgroundColor: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#f8fafc' }}>
                Asset Information
              </Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  Name: <strong style={{ color: '#f8fafc' }}>{asset.name}</strong>
                </Typography>
                {fields.map(([label, value]) => (
                  <Typography key={label} variant="body2" color="text.secondary">
                    {label}: <strong style={{ color: '#f8fafc' }}>{value}</strong>
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ backgroundColor: '#151C2C', border: '1px solid #334155', borderRadius: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: '#f8fafc' }}>
                Health & Classification
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Status:
                  </Typography>
                  <StatusChip
                    label={formatEnum(asset.status)}
                    severity={statusSeverity(asset.status) as 'success' | 'warning' | 'error'}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Risk Level:
                  </Typography>
                  <Chip
                    label={formatEnum(asset.riskLevel)}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      backgroundColor: `${riskColor(asset.riskLevel)}20`,
                      color: riskColor(asset.riskLevel),
                      border: `1px solid ${riskColor(asset.riskLevel)}40`
                    }}
                  />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Quick Actions:
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<SecurityIcon />}
                      disabled={scanning}
                      onClick={() => handleRunTrivyScan()}
                      sx={{ borderColor: '#0284c7', color: '#38bdf8' }}
                    >
                      {scanning ? 'Scanning...' : 'Run Trivy Scan'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<BugReportIcon />}
                      onClick={() => navigate(`/threat-detection?asset=${asset.id}`)}
                      sx={{ borderColor: '#334155', color: '#94a3b8' }}
                    >
                      All Findings
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* TRIVY SECURITY SCAN RESULTS SECTION */}
      {scanResult && (
        <Card sx={{ mt: 3, backgroundColor: '#151C2C', border: '1px solid #0284c7', borderRadius: 2 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 2.5 }}>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <ShieldIcon sx={{ color: '#38bdf8', fontSize: 26 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    TRIVY SECURITY SCAN
                  </Typography>
                  <Chip
                    label={scanResult.status || 'SUCCESS'}
                    size="small"
                    color="success"
                    sx={{ fontWeight: 700, height: 22 }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Target: <strong>{scanResult.scanTarget}</strong> &bull; Scanned:{' '}
                  <strong>{scanResult.scannedAt ? new Date(scanResult.scannedAt).toLocaleString() : new Date().toLocaleString()}</strong>
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  disabled={scanning}
                  onClick={() => handleRunTrivyScan()}
                  sx={{ borderColor: '#334155', color: '#94a3b8' }}
                >
                  Rescan
                </Button>
              </Stack>
            </Stack>

            {/* Metric KPI Ribbon */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={4} md={2.4}>
                <Box sx={{ p: 2, backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #334155', textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                    Total Findings
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#38bdf8', mt: 0.5 }}>
                    {scanResult.parsedFindings}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2.4}>
                <Box sx={{ p: 2, backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #7f1d1d', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#fca5a5', fontWeight: 600, textTransform: 'uppercase' }}>
                    Critical
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444', mt: 0.5 }}>
                    {scanResult.criticalCount ?? scanResult.findings.filter((f) => f.severity === 'CRITICAL').length}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2.4}>
                <Box sx={{ p: 2, backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #7c2d12', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#fdba74', fontWeight: 600, textTransform: 'uppercase' }}>
                    High
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f97316', mt: 0.5 }}>
                    {scanResult.highCount ?? scanResult.findings.filter((f) => f.severity === 'HIGH').length}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2.4}>
                <Box sx={{ p: 2, backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #713f12', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#fde047', fontWeight: 600, textTransform: 'uppercase' }}>
                    Medium
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#eab308', mt: 0.5 }}>
                    {scanResult.mediumCount ?? scanResult.findings.filter((f) => f.severity === 'MEDIUM').length}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2.4}>
                <Box sx={{ p: 2, backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #14532d', textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#86efac', fontWeight: 600, textTransform: 'uppercase' }}>
                    Low
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e', mt: 0.5 }}>
                    {scanResult.lowCount ?? scanResult.findings.filter((f) => f.severity === 'LOW').length}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Findings Table */}
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1.5 }}>
              Discovered Findings & Correlation
            </Typography>

            {scanResult.findings.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #334155' }}>
                <CheckCircleOutlineIcon sx={{ color: '#22c55e', fontSize: 40, mb: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                  No vulnerabilities detected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trivy did not detect any known CVEs or package flaws for this scan target.
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={{ backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #334155', mb: 3 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#1E293B' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>CVE Identifier</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Severity</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Package / Component</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Installed</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Fixed In</TableCell>
                      <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>Ingestion</TableCell>
                      <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scanResult.findings.map((finding) => (
                      <TableRow key={finding.vulnerabilityId || finding.cveId} hover sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.02)' } }}>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <BugReportIcon sx={{ color: '#38bdf8', fontSize: 18 }} />
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                              {finding.cveId}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={finding.severity}
                            size="small"
                            color={severityColor(finding.severity) as any}
                            sx={{ fontWeight: 700, height: 22 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#e2e8f0' }}>
                            {finding.affectedComponent}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                            {finding.installedVersion || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {finding.fixedVersion ? (
                            <Chip
                              label={finding.fixedVersion}
                              size="small"
                              variant="outlined"
                              sx={{
                                color: '#38bdf8',
                                borderColor: 'rgba(56, 189, 248, 0.4)',
                                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                                fontFamily: 'monospace',
                                height: 22
                              }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                              Not fixed
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={finding.created ? 'NEW' : 'UPDATED'}
                            size="small"
                            sx={{
                              fontSize: 10,
                              fontWeight: 700,
                              height: 20,
                              backgroundColor: finding.created ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                              color: finding.created ? '#4ade80' : '#38bdf8'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleViewFindingDetails(finding)}
                            sx={{
                              borderColor: '#334155',
                              color: '#38bdf8',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              py: 0.25,
                              px: 1
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Dynamic Risk Assessment Ribbon */}
            {scanResult.riskAssessment && (
              <Box sx={{ p: 2.5, backgroundColor: '#0B1020', borderRadius: 2, border: '1px solid #334155' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      Dynamic Risk Assessment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Automated risk rating updated from vulnerability correlations
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Category:
                    </Typography>
                    <Chip
                      label={scanResult.riskAssessment.riskCategory || 'HIGH'}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        backgroundColor: `${riskColor(scanResult.riskAssessment.riskCategory)}20`,
                        color: riskColor(scanResult.riskAssessment.riskCategory),
                        border: `1px solid ${riskColor(scanResult.riskAssessment.riskCategory)}40`
                      }}
                    />
                  </Stack>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Dynamic Risk Score
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: riskColor(scanResult.riskAssessment.riskCategory), mt: 0.5 }}>
                      {Number(scanResult.riskAssessment.riskScore).toFixed(2)}
                      <Typography component="span" variant="body2" sx={{ color: '#94a3b8', ml: 0.5 }}>
                        / 100
                      </Typography>
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, Math.max(0, Number(scanResult.riskAssessment.riskScore)))}
                      sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#1e293b',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: riskColor(scanResult.riskAssessment.riskCategory)
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3} md={2.25}>
                    <Typography variant="caption" color="text.secondary">
                      Open Vulnerabilities
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', mt: 0.5 }}>
                      {scanResult.riskAssessment.openVulnerabilities}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3} md={2.25}>
                    <Typography variant="caption" color="text.secondary">
                      Highest CVSS
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444', mt: 0.5 }}>
                      {scanResult.riskAssessment.highestCvss ? Number(scanResult.riskAssessment.highestCvss).toFixed(1) : 'N/A'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3} md={2.25}>
                    <Typography variant="caption" color="text.secondary">
                      Highest Severity
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#f97316', mt: 0.5 }}>
                      {formatEnum(scanResult.riskAssessment.highestSeverity) || 'NONE'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3} md={2.25}>
                    <Typography variant="caption" color="text.secondary">
                      Environment
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#38bdf8', mt: 0.5 }}>
                      {formatEnum(scanResult.riskAssessment.environment)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Existing Persistent Vulnerabilities Card */}
      <Card sx={{ mt: 3, backgroundColor: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                Asset Vulnerability Inventory
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All persisted findings and tracking records associated with this asset
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadAssetData}
                sx={{ borderColor: '#334155', color: '#94a3b8' }}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/threat-detection?asset=${asset.id}`)}
                sx={{ borderColor: '#0284c7', color: '#38bdf8' }}
              >
                View all in Threat Detection
              </Button>
            </Stack>
          </Stack>

          {vulnerabilityError && <Alert severity="error" sx={{ mb: 2 }}>{vulnerabilityError}</Alert>}

          {!vulnerabilityError && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 2 }}>
              <Typography color="text.secondary">Total: <strong style={{ color: '#f8fafc' }}>{vulnerabilities.length}</strong></Typography>
              <Typography color="text.secondary">Critical: <strong style={{ color: '#ef4444' }}>{criticalCount}</strong></Typography>
              <Typography color="text.secondary">High: <strong style={{ color: '#f97316' }}>{highCount}</strong></Typography>
              <Typography color="text.secondary">Medium: <strong style={{ color: '#eab308' }}>{mediumCount}</strong></Typography>
              <Typography color="text.secondary">Low: <strong style={{ color: '#22c55e' }}>{lowCount}</strong></Typography>
              <Typography color="text.secondary">Open: <strong style={{ color: '#38bdf8' }}>{openCount}</strong></Typography>
            </Stack>
          )}

          {!vulnerabilityError && vulnerabilities.length === 0 && (
            <Typography color="text.secondary">
              No vulnerabilities are recorded for this asset. Click <strong>Run Trivy Scan</strong> above to perform an automated security scan.
            </Typography>
          )}

          {!vulnerabilityError && vulnerabilities.length > 0 && (
            <Stack spacing={1}>
              {vulnerabilities.slice(0, 8).map((vulnerability) => (
                <Button
                  key={vulnerability.id}
                  variant="text"
                  onClick={() => navigate(`/vulnerabilities/${vulnerability.id}`)}
                  sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    p: 1.5,
                    backgroundColor: '#0B1020',
                    border: '1px solid #334155',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(56, 189, 248, 0.05)',
                      borderColor: '#0284c7'
                    }
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <BugReportIcon sx={{ color: '#38bdf8', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      {vulnerability.vulnerabilityIdentifier}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      &bull; {vulnerability.title}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={vulnerability.severity}
                      size="small"
                      color={severityColor(vulnerability.severity) as any}
                      sx={{ fontWeight: 700, height: 22 }}
                    />
                    <StatusChip
                      label={formatEnum(vulnerability.status)}
                      severity={vulnerability.status === 'OPEN' ? 'error' : 'success'}
                    />
                  </Stack>
                </Button>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Finding Details Modal Dialog */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#151C2C',
            border: '1px solid #334155',
            color: '#f8fafc'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <BugReportIcon sx={{ color: '#38bdf8' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Trivy Finding Details &bull; {selectedFinding?.cveId}
            </Typography>
          </Stack>
          <IconButton onClick={() => setDetailsModalOpen(false)} sx={{ color: '#94a3b8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedFinding && (
            <Stack spacing={2.5}>
              {/* Severity & Component Banner */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #334155' }}>
                    <Typography variant="caption" color="text.secondary">
                      Severity & CVSS
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                      <Chip
                        label={selectedFinding.severity}
                        color={severityColor(selectedFinding.severity) as any}
                        sx={{ fontWeight: 700 }}
                      />
                      {selectedFinding.cvssScore !== undefined && selectedFinding.cvssScore !== null && (
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                          CVSS: {Number(selectedFinding.cvssScore).toFixed(1)} / 10.0
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #334155' }}>
                    <Typography variant="caption" color="text.secondary">
                      Affected Package & Version
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#38bdf8', mt: 0.5 }}>
                      {selectedFinding.affectedComponent}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Installed: {selectedFinding.installedVersion || 'N/A'} &bull; Fixed in:{' '}
                      <strong style={{ color: '#4ade80' }}>{selectedFinding.fixedVersion || 'No fix available'}</strong>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Title & Description */}
              {selectedFinding.title && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc', mb: 0.5 }}>
                    Title
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                    {selectedFinding.title}
                  </Typography>
                </Box>
              )}

              {selectedFinding.description && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc', mb: 0.5 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', whiteSpace: 'pre-line' }}>
                    {selectedFinding.description}
                  </Typography>
                </Box>
              )}

              {/* Remediation */}
              <Box sx={{ p: 2, backgroundColor: '#0B1020', borderRadius: 1.5, border: '1px solid #0284c7' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#38bdf8', mb: 0.5 }}>
                  Remediation Advisory
                </Typography>
                <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                  {selectedFinding.remediation || `Upgrade ${selectedFinding.affectedComponent} to version ${selectedFinding.fixedVersion || 'the latest secure release'}.`}
                </Typography>
              </Box>

              {/* References */}
              {selectedFinding.references && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc', mb: 0.5 }}>
                    References & External Advisories
                  </Typography>
                  <Stack spacing={0.5}>
                    {selectedFinding.references.split('\n').filter(Boolean).map((refUrl, index) => (
                      <Typography
                        key={index}
                        component="a"
                        href={refUrl}
                        target="_blank"
                        rel="noreferrer"
                        variant="body2"
                        sx={{
                          color: '#38bdf8',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 0.5,
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {refUrl} <OpenInNewIcon sx={{ fontSize: 14 }} />
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #334155' }}>
          <Button onClick={() => setDetailsModalOpen(false)} sx={{ color: '#94a3b8' }}>
            Close
          </Button>
          {selectedFinding?.vulnerabilityId && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setDetailsModalOpen(false);
                navigate(`/vulnerabilities/${selectedFinding.vulnerabilityId}`);
              }}
              sx={{ fontWeight: 600 }}
            >
              Open Full Vulnerability Page
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Custom Scan / Offline Mode Modal */}
      <Dialog
        open={customScanOpen}
        onClose={() => setCustomScanOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#151C2C',
            border: '1px solid #334155',
            color: '#f8fafc'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <UploadFileIcon sx={{ color: '#38bdf8' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Trivy Scan Options & Ingestion
            </Typography>
          </Stack>
          <IconButton onClick={() => setCustomScanOpen(false)} sx={{ color: '#94a3b8' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5}>
            <Alert severity="info" sx={{ backgroundColor: '#0c1a2d', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
              You can trigger a live server-side Trivy scan against a specified image target, or paste raw Trivy JSON to test CVE correlation and dynamic risk calculation.
            </Alert>

            <TextField
              label="Scan Target (Container Image / Repository)"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              placeholder="e.g. alpine:latest or nginx:1.25"
              fullWidth
              size="small"
              helperText="Target name passed to the server-side Trivy process"
            />

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  Direct / Offline Trivy JSON (Optional)
                </Typography>
                <Button
                  size="small"
                  onClick={() => setCustomJson(sampleOfflineJson(asset.name || asset.identifier))}
                  sx={{ color: '#38bdf8', textTransform: 'none' }}
                >
                  Load Sample JSON
                </Button>
              </Stack>
              <TextField
                multiline
                rows={10}
                value={customJson}
                onChange={(e) => setCustomJson(e.target.value)}
                placeholder='{"Results": [{"Target": "...", "Vulnerabilities": [...]}]}'
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    backgroundColor: '#0B1020'
                  }
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #334155' }}>
          <Button onClick={() => setCustomScanOpen(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={scanning ? <CircularProgress size={18} color="inherit" /> : <SecurityIcon />}
            disabled={scanning}
            onClick={() => handleRunTrivyScan(customTarget, customJson)}
            sx={{ fontWeight: 700 }}
          >
            {scanning ? 'Scanning...' : 'Execute Scan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
