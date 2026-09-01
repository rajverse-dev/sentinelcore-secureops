# SentinelCore SecureOps

A professional **Security Operations Center (SOC)** frontend for enterprise infrastructure monitoring and threat detection. Built with React, TypeScript, and Material-UI with a modern dark theme designed for 24/7 security operations.

## 📋 Current Status

**Phase 5: Professional Frontend UX Restructure** ✅ Complete

- Each page now has a **unique, distinct purpose** eliminating duplicate content
- 7 operational pages fully implemented and tested
- Authentication system (Login/Register) integrated
- Build: ✅ Clean (657.53 KB minified)
- Dev Server: ✅ Running on `http://localhost:5175`

## 🎯 Page Structure & Purposes

| Page | Route | Purpose | Key Content |
|------|-------|---------|-------------|
| **Dashboard** | `/dashboard` | High-level overview | 8 KPI cards, resource trends, quick navigation |
| **Infrastructure Monitoring** | `/monitoring` | Real-time operations | Live events, at-risk assets, live metrics |
| **Infrastructure Health** | `/infrastructure-health` | Health analysis | Health %, component breakdown, health checks |
| **Assets** | `/assets` | Asset inventory | Asset list with search, filters, status |
| **Network Monitoring** | `/network-monitoring` | Network performance | Network devices, bandwidth, latency |
| **Cloud Monitoring** | `/cloud-monitoring` | Cloud infrastructure | Cloud resources, health by region |
| **Health Checks** | `/health-checks` | Health validation | Health check execution & results |
| **Alerts** | `/alerts` | Alert management | Alert table with severity & status |
| **Security Events** | `/security-events` | Security incidents | Security event logs |
| **Threat Detection** | `/threat-detection` | Threat analysis | Threat detection insights |
| **Reports** | `/reports` | Analytics | Reports & compliance data |
| **Login** | `/login` | Authentication | Email/username & password login |
| **Register** | `/register` | Account creation | Registration form with validation |

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── LoginPage.tsx              (🔐 Authentication)
│   ├── RegisterPage.tsx           (📝 Account creation)
│   ├── DashboardPage.tsx          (📊 Overview)
│   ├── AssetsPage.tsx             (📦 Inventory)
│   ├── MonitoringPage.tsx         (🔴 Real-time)
│   ├── InfrastructureHealthPage.tsx (💚 Health)
│   ├── NetworkMonitoringPage.tsx  (🌐 Network)
│   ├── CloudMonitoringPage.tsx    (☁️ Cloud)
│   ├── HealthChecksPage.tsx       (✓ Checks)
│   ├── AlertsPage.tsx             (⚠️ Alerts)
│   ├── SecurityEventsPage.tsx     (🛡️ Security)
│   ├── ThreatDetectionPage.tsx    (🎯 Threats)
│   ├── ReportsPage.tsx            (📈 Reports)
│   ├── SettingsPage.tsx           (⚙️ Settings)
│   └── UserManagement/UsersPage.tsx (👥 Users)
├── components/
│   ├── Layout.tsx                 (Main layout wrapper)
│   ├── ProtectedRoute.tsx         (Auth guard)
│   ├── PageHeader.tsx             (Page titles)
│   ├── KPICard.tsx                (Metric display)
│   ├── StatusChip.tsx             (Status badge)
│   ├── Charts/
│   │   ├── ResourceUsageTrendChart.tsx
│   │   └── AssetHealthDistribution.tsx
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── SidebarNavItem.tsx
│   │   ├── UserProfilePanel.tsx
│   │   └── SystemStatusPanel.tsx
│   └── [Other reusable components]
├── services/
│   ├── api.ts                     (API client)
│   └── mockRealtime.ts
├── data/
│   ├── dashboard.ts               (Dashboard data)
│   ├── mockData.ts                (General mock data)
│   ├── alerts.ts
│   └── assets.ts
├── config/
│   ├── navigation.ts              (Sidebar navigation config)
│   └── api.ts
├── context/
│   └── ThemeContext.tsx
├── types/
│   └── auth.ts
└── utils/
    └── storage.ts                 (LocalStorage helpers)
```

## 🎨 Technology Stack

- **Framework:** React 18+ with TypeScript
- **UI Library:** Material-UI (MUI) v5
- **Build Tool:** Vite v5.4.21
- **Routing:** React Router v6
- **Styling:** MUI theming system (dark mode)
- **State Management:** React Context + Hooks
- **Charts:** MUI charts & custom visualizations
- **Icons:** MUI Icons
- **Theme:** Enterprise dark cybersecurity theme

## ✨ Key Features

### 🔐 Authentication
- **Login Page:** Email/username and password authentication
- **Register Page:** New account creation with validation
- **Protected Routes:** Authentication guard on all dashboard pages
- **Session Persistence:** Auto-login with stored tokens

### 📊 Dashboard
- **8 KPI Cards:** Assets, Uptime, Active Alerts, Healthy/Warning/Critical counts, CPU/Memory usage
- **Resource Usage Trends:** 24h/7d/30d time range selector
- **Quick Navigation:** 4 action cards linking to major sections
- **Top Resource Consumers:** 5 highest resource consumers
- **Quick Snapshot:** System health summary (5 metrics)
- **Live Updates:** KPI values update every 5 seconds for real-time feel

### 🔴 Infrastructure Monitoring (Real-Time)
- **Live Monitoring Toggle:** Pause/resume real-time updates
- **Real-Time Resource Metrics:** CPU, Memory, Disk, Network with progress bars
- **Live Infrastructure Events:** 5 most recent events with severity indicators
- **At-Risk Assets Table:** Assets needing attention with full metrics (CPU, Memory, Disk, Network, Status)
- **Infrastructure Summary:** Health breakdown by category (Servers, Cloud, Network)

### 💚 Infrastructure Health (Analysis)
- **Overall Health Indicator:** Percentage display with health status (Healthy/Warning/Critical)
- **Asset Health Distribution:** Visual breakdown of healthy/warning/critical assets
- **Component Health Breakdown:** 3 cards showing Servers, Cloud, Network health
- **Health Check Summary:** 5 key health metrics (System Availability, Network Health, Cloud Health, Automation Coverage, Resource Efficiency)
- **Health Checks Table:** Detailed health check results with response times
- **Assessment Notes:** ✓ Operational and ⚠️ Warning notes

### 📦 Assets Inventory
- **Asset List:** 2,847+ monitored assets
- **Search:** Real-time search across asset names
- **Filters:** By type, status, resource usage
- **Asset Metrics:** CPU, Memory, Disk, Network per asset
- **Detailed View:** Click assets for detailed information

### 🌐 Network Monitoring
- **Network Device Table:** Bandwidth, latency, packet loss per device
- **Network Health:** Overall network status and metrics
- **Device Filters:** By status, performance tier

### ☁️ Cloud Monitoring
- **Cloud Resources:** AWS, Azure, GCP resource monitoring
- **Resource Health:** CPU, Memory, Network usage
- **Regional View:** Health breakdown by cloud region

### ✓ Health Checks
- **Check Execution:** Service health validation results
- **Response Times:** Performance metrics for each check
- **Status Tracking:** Pass/Fail/Warning status per check
- **Last Check Time:** Timestamp of most recent validation

### ⚠️ Alerts
- **Alert Table:** All critical, warning, and info alerts
- **Severity Badges:** Color-coded severity indicators
- **Status Chips:** Alert state (Active, Resolved, Acknowledged)
- **Recent Alerts:** Most recent alerts displayed first

### 🛡️ Sidebar Navigation
- **5-Section Organization:**
  - OVERVIEW (Dashboard)
  - INFRASTRUCTURE (6 monitoring pages)
  - SECURITY OPERATIONS (3 security pages)
  - MANAGEMENT (Reports, Users)
  - SYSTEM (Settings)
- **Search:** Quick search across all navigation items
- **Quick Access Panel:** Favorite shortcuts
- **System Status Panel:** Current system health
- **User Profile Menu:** Settings, Profile, Logout
- **Active State Indicators:** Current page highlight
- **Badges:** Alert counts and asset counts

## 🎯 Color Scheme (Dark Cybersecurity Theme)

```
Primary Background:     #0B1020 (Deep Navy)
Secondary Background:   #101827 (Dark Slate)
Card Background:        #1B2435 (Charcoal)
Accent Color:           #7C3AED (Purple)
Success/Healthy:        #22C55E (Green)
Warning:                #F59E0B (Amber)
Critical/Error:         #EF4444 (Red)
Info:                   #22D3EE (Cyan)
Text Primary:           #F8FAFC (Off-White)
Text Secondary:         #94A3B8 (Gray)
Border:                 #263244 (Dark Gray)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd "SentinelCore SecureOps"

# Install dependencies
npm install
```

### Development

```bash
# Start dev server (runs on http://localhost:5175 by default)
npm run dev
```

The Vite dev server will display the URL in the terminal. Open it in your browser to see the application.

### Build for Production

```bash
# Build the application
npm run build
```

Output is in the `dist/` folder (657.53 KB minified).

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## 📱 Accessing the Application

### Public Pages (No Login Required)
- **Login:** `http://localhost:5175/login`
- **Register:** `http://localhost:5175/register`

### Protected Pages (Login Required)
- **Dashboard:** `http://localhost:5175/dashboard`
- **Assets:** `http://localhost:5175/assets`
- **Monitoring:** `http://localhost:5175/monitoring`
- **Infrastructure Health:** `http://localhost:5175/infrastructure-health`
- **Network Monitoring:** `http://localhost:5175/network-monitoring`
- **Cloud Monitoring:** `http://localhost:5175/cloud-monitoring`
- **Health Checks:** `http://localhost:5175/health-checks`
- **Alerts:** `http://localhost:5175/alerts`
- **And more...**

## 🔄 Data Management

### Mock Data Sources
- **Dashboard Data:** `src/data/dashboard.ts`
  - Infrastructure stats, live events, at-risk assets
  - Resource usage trends, top consumers, quick snapshots
- **General Mock Data:** `src/data/mockData.ts`
  - Assets, alerts, health checks, network devices, cloud resources
- **Centralized:** All pages share the same data source for consistency

### API Integration Status
Currently using mock/sample data. Backend integration ready once REST APIs are available:
- Authentication endpoints
- Infrastructure monitoring APIs
- Asset management APIs
- Alert management APIs
- Health check APIs

## 🔐 Authentication Flow

1. **Login Page** (`/login`)
   - Email/Username + Password login
   - Remember me checkbox
   - Password recovery link (placeholder)
   - Link to create new account

2. **Register Page** (`/register`)
   - Full Name, Email, Username, Password fields
   - Password confirmation with validation
   - Terms of Service agreement
   - Link back to login

3. **Protected Routes**
   - All dashboard pages protected by `ProtectedRoute` component
   - Automatically redirects to `/login` if no valid token
   - Tokens stored in localStorage

4. **Logout**
   - User Profile → Logout clears token and redirects to `/login`

## 🛠️ Development Tips

### Component Reuse
- **KPICard:** Metric display with icon and trend
- **StatusChip:** Color-coded status badges
- **PageHeader:** Consistent page titles and descriptions
- **Charts:** ResourceUsageTrendChart, AssetHealthDistribution
- **Sidebar Components:** Modular, reusable navigation pieces

### Data Flow
- Components → Services → Mock Data
- No state management library needed (Context API handles global theme)
- Local state for component-specific data
- Real-time updates via setInterval (can be replaced with WebSocket)

### Responsive Design
- Breakpoints: xs (mobile), sm (tablet), md (desktop), lg (large desktop)
- Grid layouts automatically adjust
- Sidebar collapses on mobile
- Tables become horizontally scrollable on small screens

### Styling Approach
- MUI theming system for consistency
- Dark mode theme context
- Inline sx props for component styling
- Custom theme colors in `src/theme.ts`

## 📊 Performance Metrics

- **Build Size:** 657.53 KB (minified), 195.26 KB (gzipped)
- **Build Time:** ~24s (11,669 modules)
- **Dev Server Startup:** ~321ms
- **Bundle Modules:** 11,669
- **Vite Version:** 5.4.21

## 🔮 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Advanced filtering and search
- [ ] Custom dashboard widgets
- [ ] Export/reporting features
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Performance optimization (code splitting)
- [ ] Unit and integration tests
- [ ] E2E testing with Cypress/Playwright
- [ ] Accessibility (WCAG 2.1) improvements

## 📝 Notes

### Phase 5: UX Restructure
Previously, multiple pages showed similar content (Live Events, Health Overview, etc. on Dashboard). This created confusion about page purposes. Phase 5 restructured all pages so each answers a UNIQUE operational question:

- **Dashboard:** "How is the entire environment?" (overview)
- **Monitoring:** "What is happening RIGHT NOW?" (real-time)
- **Health:** "How healthy is infrastructure?" (analysis)
- **Assets:** "What assets exist?" (inventory)
- **Network/Cloud/Checks:** Domain-specific monitoring

Result: Each page has completely unique content with no duplication.

### Warnings (Non-Critical)
- React Router Future Flag warnings: Safe to ignore, framework migration warnings
- SVG attribute warning: Minor rendering issue in one chart, no functional impact
- Bundle size warning: Informational, no performance impact on dev/production

## 🤝 Team Structure

### Frontend (This Project)
- React/TypeScript implementation
- UI/UX with Material-UI
- Routing and navigation
- Mock data management
- Authentication UI (backend integration ready)

### Backend (Separate)
- Spring Boot REST APIs
- Database integration
- JWT authentication
- Real-time data services
- Business logic

## 📞 Support & Issues

For issues, bugs, or feature requests:
1. Check existing documentation
2. Review mock data in `src/data/`
3. Check component props in `src/components/`
4. Review TypeScript types in `src/types/`

## 📄 License

SentinelCore SecureOps - Enterprise Security Operations Platform

---

**Built for Security Operations Centers · Enterprise-Grade Infrastructure Monitoring · Real-Time Threat Detection**
