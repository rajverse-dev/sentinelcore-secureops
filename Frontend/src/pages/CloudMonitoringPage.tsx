import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Grid, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material';
import CloudIcon from '@mui/icons-material/Cloud';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import PageHeader from '../components/PageHeader';
import StatusChip from '../components/StatusChip';
import AccentMetricCard from '../components/AccentMetricCard';
import { assetApi } from '../services/api';

const CLOUD_TYPES = ['EC2', 'S3', 'RDS', 'VIRTUAL_MACHINE', 'STORAGE', 'DATABASE'];

interface CloudAsset {
  id: string;
  name: string;
  identifier: string;
  type: string;
  region: string;
  status: string;
  riskLevel: string;
  provider: string;
  environment: string;
}

function getResourceStatus(asset: CloudAsset): 'Healthy' | 'Warning' | 'Critical' {
  if (asset.riskLevel === 'CRITICAL') return 'Critical';
  if (asset.status !== 'ACTIVE' || asset.riskLevel === 'HIGH' || asset.riskLevel === 'MEDIUM') return 'Warning';
  return 'Healthy';
}

export default function CloudMonitoringPage() {
  const [resources, setResources] = useState<CloudAsset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetApi.getAssets()
      .then((response) => {
        const all = response.data as CloudAsset[];
        setResources(all.filter(a => CLOUD_TYPES.includes(a.type)));
      })
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, []);

  const healthy = resources.filter(r => getResourceStatus(r) === 'Healthy').length;
  const warning = resources.filter(r => getResourceStatus(r) === 'Warning').length;
  const critical = resources.filter(r => getResourceStatus(r) === 'Critical').length;

  // Compute unique active regions
  const regions = useMemo(() => new Set(resources.map(r => r.region)).size, [resources]);

  // Service overview by type category
  const computeCount = resources.filter(a => ['EC2', 'VIRTUAL_MACHINE'].includes(a.type)).length;
  const storageCount = resources.filter(a => ['S3', 'STORAGE'].includes(a.type)).length;
  const dbCount = resources.filter(a => ['RDS', 'DATABASE'].includes(a.type)).length;
  const totalCloud = resources.length || 1;

  return (
    <>
      <PageHeader title="Cloud Monitoring" subtitle="Multi-region workload, database and platform health" />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard label="Cloud Regions" value={loading ? '…' : String(regions)} subtitle="Active regions" color="#38BDF8" icon={<CloudIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard label="Healthy Services" value={loading ? '…' : String(healthy)} subtitle="Operating normally" color="#22C55E" icon={<CheckCircleIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard label="Warning Services" value={loading ? '…' : String(warning)} subtitle="Needs attention" color="#F59E0B" icon={<WarningAmberIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard label="Critical Services" value={loading ? '…' : String(critical)} subtitle="Immediate review" color="#EF4444" icon={<ErrorIcon />} />
        </Grid>
      </Grid>

      <TableContainer component={Card} sx={{ overflow: 'hidden', borderColor: '#334155' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#101827' }}>
              <TableCell>Resource</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Provider</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Risk Level</TableCell>
              <TableCell>Environment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            )}
            {!loading && resources.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ color: '#94A3B8', py: 4 }}>
                  No cloud resources found. Add assets with types EC2, S3, RDS, etc. to see data here.
                </TableCell>
              </TableRow>
            )}
            {resources.map((resource) => {
              const resStatus = getResourceStatus(resource);
              return (
                <TableRow key={resource.id} hover>
                  <TableCell sx={{ color: '#F8FAFC', fontWeight: 500 }}>{resource.name}</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{resource.type}</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{resource.provider}</TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{resource.region}</TableCell>
                  <TableCell>
                    <StatusChip
                      label={resStatus}
                      severity={resStatus === 'Critical' ? 'error' : resStatus === 'Warning' ? 'warning' : 'success'}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      label={resource.riskLevel}
                      severity={resource.riskLevel === 'CRITICAL' ? 'error' : (resource.riskLevel === 'HIGH' || resource.riskLevel === 'MEDIUM') ? 'warning' : 'success'}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#94A3B8' }}>{resource.environment}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Service Overview</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Compute</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  {loading ? '…' : `${Math.round((computeCount / totalCloud) * 100)}%`}
                </Typography>
                <Typography variant="caption" color="text.secondary">{computeCount} resources</Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Storage</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  {loading ? '…' : `${Math.round((storageCount / totalCloud) * 100)}%`}
                </Typography>
                <Typography variant="caption" color="text.secondary">{storageCount} resources</Typography>
              </CardContent>
            </Card>
            <Card variant="outlined" sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">Database</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                  {loading ? '…' : `${Math.round((dbCount / totalCloud) * 100)}%`}
                </Typography>
                <Typography variant="caption" color="text.secondary">{dbCount} resources</Typography>
              </CardContent>
            </Card>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
