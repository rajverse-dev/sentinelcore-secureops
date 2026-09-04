import React, { useState } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar/Sidebar';

export default function Layout() {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 80 : 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar - Hidden on mobile by default, shown as drawer */}
      {!isMobile && (
        <Sidebar
          open={true}
          alertsCount={12}
          assetsCount={2847}
          securityEventsCount={3}
          infrastructureStatus="operational"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          alertsCount={12}
          assetsCount={2847}
          securityEventsCount={3}
          infrastructureStatus="operational"
        />
      )}

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: isMobile ? 0 : sidebarCollapsed ? '80px' : '280px',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* App Bar */}
        <AppBar
          position="sticky"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer - 1,
            background: '#0B1020',
            borderBottom: '1px solid #263244',
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                sx={{
                  mr: 2,
                  color: '#7C3AED',
                  '&:hover': {
                    background: 'rgba(124, 58, 237, 0.1)',
                  },
                }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: '#F8FAFC' }}>
              SentinelCore SecureOps
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Threat Monitoring Console
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto',
            transition: 'all 0.3s ease',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
