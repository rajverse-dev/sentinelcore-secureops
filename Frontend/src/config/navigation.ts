import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import RouterIcon from '@mui/icons-material/Router';
import CloudIcon from '@mui/icons-material/Cloud';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ErrorIcon from '@mui/icons-material/Error';
import SearchIcon from '@mui/icons-material/Search';
import ShieldIcon from '@mui/icons-material/Shield';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import BugReportIcon from '@mui/icons-material/BugReport';

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  keywords?: string[];
  badge?: {
    count: number;
    variant: 'alert' | 'info' | 'success';
  };
  status?: 'operational' | 'warning' | 'critical';
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export const navigationConfig: NavigationSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: DashboardIcon,
        keywords: ['dashboard', 'overview', 'home', 'main'],
      },
    ],
  },
  {
    title: 'INFRASTRUCTURE',
    items: [
      {
        label: 'Assets',
        path: '/assets',
        icon: StorageIcon,
        keywords: ['assets', 'inventory', 'servers', 'infrastructure', 'devices'],
      },
      {
        label: 'Infrastructure Monitoring',
        path: '/monitoring',
        icon: HealthAndSafetyIcon,
        keywords: ['infrastructure', 'monitoring', 'health', 'status', 'real-time'],
        status: 'operational',
      },
      {
        label: 'Infrastructure Health',
        path: '/infrastructure-health',
        icon: MonitorHeartIcon,
        keywords: ['health', 'analysis', 'status', 'reliability', 'checks'],
      },
      {
        label: 'Network Monitoring',
        path: '/network-monitoring',
        icon: RouterIcon,
        keywords: ['network', 'networking', 'connectivity', 'wifi', 'router', 'bandwidth'],
      },
      {
        label: 'Cloud Monitoring',
        path: '/cloud-monitoring',
        icon: CloudIcon,
        keywords: ['cloud', 'aws', 'azure', 'gcp', 'cloud monitoring', 'resources'],
      },
      {
        label: 'Health Checks',
        path: '/health-checks',
        icon: MonitorHeartIcon,
        keywords: ['health', 'checks', 'synthetic', 'diagnostics', 'validation'],
      },
    ],
  },
  {
    title: 'SECURITY OPERATIONS',
    items: [
      {
        label: 'Risk Dashboard',
        path: '/risk-dashboard',
        icon: AssessmentIcon,
        keywords: ['risk', 'dashboard', 'vulnerabilities', 'cve', 'patch', 'scoring'],
      },
      {
        label: 'CVE Management',
        path: '/cves',
        icon: BugReportIcon,
        keywords: ['cve', 'cves', 'vulnerabilities', 'cvss', 'cve management', 'cve registry', 'security'],
      },
      {
        label: 'Alerts',
        path: '/alerts',
        icon: ErrorIcon,
        keywords: ['alerts', 'notifications', 'warnings', 'issues', 'critical'],
        badge: {
          count: 12,
          variant: 'alert',
        },
      },
      {
        label: 'Security Events',
        path: '/security-events',
        icon: ShieldIcon,
        keywords: ['security', 'events', 'incidents', 'breaches'],
        badge: {
          count: 3,
          variant: 'alert',
        },
      },
      {
        label: 'Incidents',
        path: '/incidents',
        icon: ShieldIcon,
        keywords: ['incidents', 'security', 'response', 'assignment', 'sla'],
      },
      {
        label: 'Threat Detection',
        path: '/threat-detection',
        icon: SearchIcon,
        keywords: ['threats', 'detection', 'vulnerabilities', 'malware', 'scanning'],
      },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      {
        label: 'Reports',
        path: '/reports',
        icon: DescriptionIcon,
        keywords: ['reports', 'analytics', 'compliance', 'documentation'],
      },
      {
        label: 'Audit',
        path: '/audit',
        icon: DescriptionIcon,
        keywords: ['audit', 'logs', 'access', 'integrity'],
      },
      {
        label: 'Compliance',
        path: '/compliance',
        icon: AssessmentIcon,
        keywords: ['compliance', 'pci', 'soc', 'controls', 'evidence'],
      },
      {
        label: 'Security Reviews',
        path: '/security-reviews',
        icon: ShieldIcon,
        keywords: ['security', 'reviews', 'approval', 'audit'],
      },
      {
        label: 'DevSecOps',
        path: '/devsecops',
        icon: ShieldIcon,
        keywords: ['devsecops', 'sonarqube', 'trivy', 'security', 'compliance'],
      },
      {
        label: 'Users',
        path: '/users',
        icon: PeopleIcon,
        keywords: ['users', 'team', 'members', 'management', 'accounts'],
      },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      {
        label: 'Settings',
        path: '/settings',
        icon: SettingsIcon,
        keywords: ['settings', 'configuration', 'preferences', 'options'],
      },
    ],
  },
];

/**
 * Flatten navigation config into a single list for search
 */
export function getAllNavigationItems(): NavigationItem[] {
  return navigationConfig.flatMap((section) => section.items);
}

/**
 * Get navigation item by path
 */
export function getNavigationItemByPath(path: string): NavigationItem | undefined {
  return getAllNavigationItems().find((item) => item.path === path);
}
