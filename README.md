# SentinelCore SecureOps

## Project Overview

SentinelCore SecureOps is a browser-based infrastructure operations dashboard for viewing assets, system metrics, health status, alerts, and operational actions in one workspace.

Milestone 1, **Infrastructure Monitoring**, establishes the monitoring experience for servers, cloud resources, networks, and service endpoints. The current project is a frontend prototype: its monitoring data and actions are represented in React state so the workflow can be demonstrated without a backend or cloud connection.

## Milestone 1 - Infrastructure Monitoring

This milestone provides an administrator-facing view of infrastructure health. It brings together asset inventory, CPU, memory, disk, and network readings, health checks, alerts, SLA information, and an auto-scaling action for the selected asset.

The workflow is simple: an administrator selects or reviews an infrastructure asset, inspects its current metrics and health status, responds to generated alerts, and can run the displayed auto-scale action when a resource needs attention.

## Key Features

- **Asset Inventory:** View sample endpoints and add a new monitored asset through the Asset Service form.
- **Infrastructure Metrics:** Review CPU utilization, memory utilization, disk utilization, and network throughput with metric cards and sparklines.
- **Cloud Monitoring:** View the displayed AWS, Azure, and Kubernetes resource totals, clusters, and pods.
- **Network Monitoring:** View throughput, healthy gateways, and packet loss summary values.
- **Health Checks:** Review each sample asset's health status, response time, and latest check time.
- **Alert Management:** View critical, warning, and informational alerts; open alerts can be resolved from the dashboard or Alerts screen.
- **Auto-scaling:** Run the `scaleAsset` action for the selected asset. In this milestone it is a frontend simulation that updates local CPU/status values and related alerts.
- **SLA Monitoring:** Display the current uptime SLA value and target in the Overview and selected asset details. The displayed value is derived from local asset status in the current prototype.

## Application Screens

The sidebar in `App.jsx` switches the active view without routing to separate URLs.

### Overview

The default screen combines the main monitoring experience:

- Summary cards for monitored assets, uptime SLA, and active alerts.
- Infrastructure health panels for servers and cloud resources.
- Aggregated CPU, memory, disk, and network metric cards.
- Recent alert rows with severity, action, status, and resolution controls.
- An auto-scaling banner with a test action.
- An Asset inventory table with search and health status.

### Assets / Asset Inventory

The Assets view lists the sample connected endpoints. Selecting an asset opens its detail panel with type, provider, environment, CPU, memory, disk, network, uptime SLA, and last health check. The Overview also includes an **Add asset** form that adds a new endpoint to the local inventory.

### Infrastructure

The Infrastructure view shows metric cards for the selected asset and a selected-asset detail panel. CPU history is updated when the dashboard refreshes, while the other displayed readings come from the asset's local state.

### Cloud

The Cloud view displays summary values for AWS resources, Azure resources, Kubernetes clusters, and monitored pods.

### Network

The Network view displays throughput, healthy gateways, and packet loss summary values.

### Health Checks

The Health checks view lists every asset with its current status, a displayed response time, and a `Checked just now` timestamp.

### Alerts

The Alerts view lists open alerts and provides a **Resolve** action. The Overview includes recent resolved and open alerts, while high CPU or disk values can cause a local alert to be added during state updates.

## Monitoring Workflow

```text
Infrastructure
      -> Metric Collection
      -> Health Checks
      -> Alert Generation
      -> Action / Auto-scaling
```

In the current implementation:

1. Sample infrastructure assets are initialized in `initialAssets`.
2. `refreshData` changes selected CPU and network readings on a five-second interval and when **Refresh data** is clicked.
3. Asset status is recalculated from CPU and disk thresholds.
4. A React effect adds local CPU anomaly or disk capacity alerts when thresholds are exceeded.
5. The administrator can resolve an alert or run `scaleAsset`, which updates local asset state and related alert state.

## Technology Stack

The project uses only technologies present in the current source and package configuration:

- **React 19** for the user interface and component state.
- **React DOM 19** to render the application from `src/main.jsx`.
- **Vite 8** for development and production builds.
- **JavaScript / JSX** with ES modules.
- **Lucide React** for interface icons.
- **Oxlint** with React and Oxc rules for linting.
- **CSS** in `src/index.css` and `src/App.css` for layout and styling.
- **Google Fonts** (`DM Sans` and `Space Grotesk`), imported by `src/App.css`.

There is currently no backend, database, API client, cloud SDK, authentication provider, message broker, or persistent monitoring service in this repository.

## Project Structure

```text
SentinelCore-SecureOps/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx          # Dashboard state, screens, monitoring workflow, and UI components
│   ├── App.css          # Dashboard layout, responsive styling, colors, and component styles
│   ├── index.css        # Global CSS defaults and base typography
│   ├── main.jsx         # React entry point; renders App in StrictMode
│   └── assets/          # Local image and starter asset files
├── index.html           # Vite HTML entry document
├── package.json         # Scripts and dependencies
├── package-lock.json    # Locked npm dependency versions
├── vite.config.js       # Vite React plugin configuration
└── .oxlintrc.json       # Oxlint rules
```

Important components defined in `src/App.jsx` include `App`, `ModuleView`, `AssetDetail`, `MetricCard`, `SummaryCard`, `ModuleStat`, `MetricMini`, and `StatusBar`. Main state handlers include `refreshData`, `resolveAlert`, `scaleAsset`, and `addAsset`.

## How to Run the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Optional commands available in `package.json`:

```bash
npm run lint
npm run preview
```

## Milestone 1 Validation

| Requirement | Status | Evidence in current implementation |
| --- | --- | --- |
| Asset Service | Implemented in UI | `addAsset` adds an asset through the Asset Service form, in local React state only. |
| Infrastructure Monitoring | Implemented in UI | Overview and Infrastructure screens display asset health and metrics. |
| Cloud Monitoring | Implemented in UI | Cloud screen displays AWS, Azure, and Kubernetes summary values. |
| Network Monitoring | Implemented in UI | Network screen displays throughput, gateways, and packet loss values. |
| Health Checks | Implemented in UI | Health checks screen displays status, response time, and check time for each asset. |
| Alert Management | Implemented in UI | Alerts are generated and resolved in local state; there is no persistence. |
| Metric collection | Simulated | `refreshData` updates CPU and network values locally; no real collector is connected. |
| Alert generation | Simulated | Local threshold logic creates CPU anomaly and disk capacity alerts. |
| Auto-scaling | Simulated | `scaleAsset` changes displayed CPU/status values and resolves related alerts; it does not change a cloud resource. |
| SLA compliance | Displayed/simulated | The UI shows an uptime SLA and target; it does not calculate SLA from external uptime data. |
| Servers | Implemented in UI | Server health totals and server-like sample assets are displayed. |
| Cloud resources | Implemented in UI | Cloud resource, cluster, and pod totals are displayed. |
| Networks | Implemented in UI | Network summary values and a network sample asset are displayed. |
| CPU, memory, disk, and network usage | Implemented in UI | Metric cards and selected asset details display all four readings. |
| Real-time health monitoring | Simulated | Local refresh runs every five seconds and updates selected readings. |
| Validation screen: Asset Inventory | Implemented | Available through the Assets navigation item and Overview inventory section. |
| Validation screen: Health Monitoring | Implemented in UI | Represented by the Overview infrastructure health section and Health checks screen. |

## Expected Milestone 1 Outcome

Milestone 1 gives an administrator a single operational view for reviewing infrastructure inventory, comparing resource health, identifying threshold-related alerts, and taking a visible response action. It demonstrates the intended path from infrastructure data to health checks, alerts, and auto-scaling while clearly keeping the current implementation's data collection, alerting, SLA, and scaling behavior within the frontend prototype.
