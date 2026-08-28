import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import SecurityOverview from './pages/dashboard/SecurityOverview';
import IncidentManagement from './pages/dashboard/IncidentManagement';
import ThreatDetection from './pages/dashboard/ThreatDetection';
import CloudAssets from './pages/dashboard/CloudAssets';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<SecurityOverview />} />
          <Route path="incidents" element={<IncidentManagement />} />
          <Route path="threats" element={<ThreatDetection />} />
          <Route path="assets" element={<CloudAssets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
