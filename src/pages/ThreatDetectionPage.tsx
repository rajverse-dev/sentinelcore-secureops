import React from 'react';
import { Box, Container, Typography, Card, CardContent, Stack, Alert, AlertTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../components/PageHeader';

export default function ThreatDetectionPage() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <PageHeader title="Threat Detection" subtitle="Advanced threat detection and vulnerability scanning" />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* Info Alert */}
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <AlertTitle>Threat Detection</AlertTitle>
            Threat detection capabilities will be connected to the security monitoring service. This page provides a
            unified view of potential threats, vulnerabilities, and suspicious activities across your infrastructure.
          </Alert>

          {/* Coming Soon Card */}
          <Card sx={{ bgcolor: '#151C2C', borderColor: '#263244', border: '1px solid' }}>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <SearchIcon sx={{ fontSize: 48, color: '#7C3AED', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#F8FAFC' }}>
                Threat Detection Engine
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time scanning and analysis of potential security threats will be available here.
              </Typography>
            </CardContent>
          </Card>

          {/* Feature List */}
          <Card sx={{ bgcolor: '#151C2C', borderColor: '#263244', border: '1px solid' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#F8FAFC' }}>
                Planned Features
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#7C3AED', mb: 0.5 }}>
                    ✓ Vulnerability Scanning
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automated scanning of assets for known vulnerabilities with CVSS scoring
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#7C3AED', mb: 0.5 }}>
                    ✓ Threat Intelligence Feed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Integration with threat intelligence sources for emerging threats
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#7C3AED', mb: 0.5 }}>
                    ✓ Anomaly Detection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Machine learning-based detection of unusual patterns and behaviors
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#7C3AED', mb: 0.5 }}>
                    ✓ Remediation Guidance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Actionable recommendations for remediating detected threats
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
