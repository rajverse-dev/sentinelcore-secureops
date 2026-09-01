import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  Typography,
  Stack,
  useMediaQuery,
  useTheme as useMuiTheme,
} from '@mui/material';
import { navigationConfig, NavigationItem, NavigationSection } from '../../config/navigation';
import SidebarHeader from './SidebarHeader';
import SidebarNavItem from './SidebarNavItem';
import SidebarBadge from './SidebarBadge';
import SidebarSearch from './SidebarSearch';
import QuickAccessPanel from './QuickAccessPanel';
import SystemStatusPanel from './SystemStatusPanel';
import UserProfilePanel from './UserProfilePanel';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  alertsCount?: number;
  assetsCount?: number;
  securityEventsCount?: number;
  infrastructureStatus?: 'operational' | 'warning' | 'critical';
}

export default function Sidebar({
  open = true,
  onClose,
  alertsCount = 12,
  assetsCount = 2847,
  securityEventsCount = 3,
  infrastructureStatus = 'operational',
}: SidebarProps) {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [isCollapsed, setIsCollapsed] = useState(false);

  const drawerWidth = isCollapsed ? 80 : 280;

  // Function to get badge for a navigation item
  const getBadgeForItem = (label: string) => {
    if (label === 'Assets') {
      return <SidebarBadge count={assetsCount} variant="info" />;
    }
    if (label === 'Alerts') {
      return <SidebarBadge count={alertsCount} variant="alert" />;
    }
    if (label === 'Security Events') {
      return <SidebarBadge count={securityEventsCount} variant="alert" />;
    }
    return undefined;
  };

  // Function to get status for a navigation item
  const getStatusForItem = (label: string) => {
    if (label === 'Infrastructure Monitoring') {
      return infrastructureStatus;
    }
    return undefined;
  };

  // Get all navigation items as a flat list for search
  const getAllNavigationItems = () => {
    return navigationConfig.flatMap((section) =>
      section.items.map((item) => ({
        label: item.label,
        to: item.path,
        icon: <item.icon />,
        keywords: item.keywords,
      }))
    );
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#101827',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Header */}
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Search */}
      <SidebarSearch
        navigationItems={getAllNavigationItems()}
        isCollapsed={isCollapsed}
        onItemClick={onClose}
      />

      {/* Navigation Sections */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#263244',
            borderRadius: '3px',
            '&:hover': {
              background: '#394b5e',
            },
          },
        }}
      >
        {navigationConfig.map((section: NavigationSection) => (
          <div key={section.title}>
            {/* Section Header */}
            {!isCollapsed && (
              <Box sx={{ px: 2, py: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: '#94A3B8',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    letterSpacing: '1px',
                    mb: 1,
                  }}
                >
                  {section.title}
                </Typography>
              </Box>
            )}

            {/* Navigation Items */}
            <List sx={{ p: isCollapsed ? 1 : 0, pb: 1 }}>
              {section.items.map((item: NavigationItem) => {
                const IconComponent = item.icon;
                return (
                  <SidebarNavItem
                    key={item.label}
                    label={item.label}
                    to={item.path}
                    icon={<IconComponent />}
                    badge={getBadgeForItem(item.label)}
                    status={getStatusForItem(item.label)}
                    isCollapsed={isCollapsed}
                  />
                );
              })}
            </List>
          </div>
        ))}
      </Box>

      {/* Quick Access Panel */}
      <QuickAccessPanel
        isCollapsed={isCollapsed}
        criticalAlertsCount={alertsCount > 5 ? 3 : Math.max(0, alertsCount - 5)}
        atRiskAssetsCount={22}
      />

      {/* System Status Panel */}
      <SystemStatusPanel isCollapsed={isCollapsed} />

      {/* User Profile Panel */}
      <UserProfilePanel isCollapsed={isCollapsed} />
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: drawerWidth,
            background: 'transparent',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop: Render fixed sidebar directly without wrapper
  return (
    <Box
      sx={{
        width: drawerWidth,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      {drawerContent}
    </Box>
  );
}

export { default as SidebarHeader } from './SidebarHeader';
export { default as SidebarNavItem } from './SidebarNavItem';
export { default as SidebarBadge } from './SidebarBadge';
export { default as SidebarSearch } from './SidebarSearch';
export { default as QuickAccessPanel } from './QuickAccessPanel';
export { default as SystemStatusPanel } from './SystemStatusPanel';
export { default as UserProfilePanel } from './UserProfilePanel';
