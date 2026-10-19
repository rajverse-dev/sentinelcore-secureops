import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import AssetDetailsPage from './pages/AssetDetailsPage';
import MonitoringPage from './pages/MonitoringPage';
import InfrastructureHealthPage from './pages/InfrastructureHealthPage';
import NetworkMonitoringPage from './pages/NetworkMonitoringPage';
import CloudMonitoringPage from './pages/CloudMonitoringPage';
import HealthChecksPage from './pages/HealthChecksPage';
import AlertsPage from './pages/AlertsPage';
import SecurityEventsPage from './pages/SecurityEventsPage';
import IncidentsPage from './pages/IncidentsPage';
import ThreatDetectionPage from './pages/ThreatDetectionPage';
import VulnerabilityDetailsPage from './pages/VulnerabilityDetailsPage';
import CveManagementPage from './pages/CveManagementPage';
import RiskDashboardPage from './pages/RiskDashboardPage';
import ReportsPage from './pages/ReportsPage';
import AuditPage from './pages/AuditPage';
import CompliancePage from './pages/CompliancePage';
import SecurityReviewsPage from './pages/SecurityReviewsPage';
import DevSecOpsPage from './pages/DevSecOpsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Overview */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Infrastructure */}
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/assets/:id" element={<AssetDetailsPage />} />
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/infrastructure-health" element={<InfrastructureHealthPage />} />
        <Route path="/network-monitoring" element={<NetworkMonitoringPage />} />
        <Route path="/cloud-monitoring" element={<CloudMonitoringPage />} />
        <Route path="/health-checks" element={<HealthChecksPage />} />

        {/* Security Operations */}
        <Route path="/risk-dashboard" element={<RiskDashboardPage />} />
        <Route path="/cves" element={<CveManagementPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/security-events" element={<SecurityEventsPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/threat-detection" element={<ThreatDetectionPage />} />
        <Route path="/vulnerabilities/:id" element={<VulnerabilityDetailsPage />} />

        {/* Management */}
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/security-reviews" element={<SecurityReviewsPage />} />
        <Route path="/devsecops" element={<DevSecOpsPage />} />
        <Route path="/users" element={<UsersPage />} />

        {/* System */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
