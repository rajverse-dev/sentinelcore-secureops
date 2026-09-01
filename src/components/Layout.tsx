import { AppBar, Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Dashboard as DashboardIcon, Devices as AssetsIcon, MonitorHeart as MonitorIcon, Notifications as AlertsIcon, Logout as LogoutIcon, Menu as MenuIcon } from '@mui/icons-material';
import { NavLink, Outlet } from 'react-router-dom';
import { storage } from '../utils/storage';

const drawerWidth = 240;

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Assets', to: '/assets', icon: <AssetsIcon /> },
  { label: 'Infrastructure Monitoring', to: '/monitoring', icon: <MonitorIcon /> },
  { label: 'Alerts', to: '/alerts', icon: <AlertsIcon /> }
];

export default function Layout() {
  const logout = () => {
    storage.clear();
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, ml: { xs: 0, md: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            SentinelCore SecureOps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Threat Monitoring Console
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: '64px'
          }
        }}
      >
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ px: 2, mb: 1, display: 'block' }}>
            Operations
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                  sx={{ borderRadius: 2, color: 'text.primary', '&.active': { bgcolor: 'rgba(94,234,212,0.12)', color: 'primary.main' } }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={logout} sx={{ borderRadius: 2, color: 'text.primary' }}>
                <ListItemIcon sx={{ minWidth: 36 }}><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { md: `${drawerWidth}px` }, mt: '64px' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
