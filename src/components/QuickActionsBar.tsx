import React from 'react';
import {
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  Tooltip,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import RouterIcon from '@mui/icons-material/Router';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import WarningIcon from '@mui/icons-material/Warning';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

interface QuickActionsBarProps {
  onViewAssets?: () => void;
  onViewInfrastructureHealth?: () => void;
  onViewNetworkMonitoring?: () => void;
  onViewCloudMonitoring?: () => void;
  onViewHealthChecks?: () => void;
  onViewAlerts?: () => void;
}

export default function QuickActionsBar({
  onViewAssets,
  onViewInfrastructureHealth,
  onViewNetworkMonitoring,
  onViewCloudMonitoring,
  onViewHealthChecks,
  onViewAlerts,
}: QuickActionsBarProps) {
  const actions = [
    {
      label: 'View Assets',
      icon: <StorageIcon />,
      onClick: onViewAssets,
      color: '#22C55E',
    },
    {
      label: 'Infrastructure Health',
      icon: <HealthAndSafetyIcon />,
      onClick: onViewInfrastructureHealth,
      color: '#7C3AED',
    },
    {
      label: 'Network Monitoring',
      icon: <RouterIcon />,
      onClick: onViewNetworkMonitoring,
      color: '#4F46E5',
    },
    {
      label: 'Cloud Monitoring',
      icon: <CloudIcon />,
      onClick: onViewCloudMonitoring,
      color: '#22D3EE',
    },
    {
      label: 'Health Checks',
      icon: <MonitorHeartIcon />,
      onClick: onViewHealthChecks,
      color: '#F59E0B',
    },
    {
      label: 'View Alerts',
      icon: <WarningIcon />,
      onClick: onViewAlerts,
      color: '#EF4444',
    },
  ];

  return (
    <Card sx={{ background: '#151C2C', border: '1px solid #334155', borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          {actions.map((action) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={action.label}>
              <Tooltip title={action.label} arrow>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={action.onClick}
                  startIcon={action.icon}
                  sx={{
                    borderColor: '#334155',
                    color: '#A7B0C0',
                    textTransform: 'capitalize',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    py: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    transition: 'all 0.3s ease',
                    '& .MuiButton-startIcon': {
                      mr: 0,
                      color: action.color,
                      fontSize: '1.5rem',
                    },
                    '&:hover': {
                      borderColor: action.color,
                      backgroundColor: `${action.color}15`,
                      color: action.color,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${action.color}20`,
                    },
                  }}
                >
                  {action.label}
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
