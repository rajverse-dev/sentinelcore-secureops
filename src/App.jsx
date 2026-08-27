import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Cloud,
  Database,
  Gauge,
  HardDrive,
  LayoutDashboard,
  Menu,
  Network,
  Plus,
  Play,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import "./App.css";

const initialAssets = [
  {
    id: "db-srv-12",
    name: "DB-SRV-12",
    type: "Database",
    provider: "AWS",
    environment: "Production",
    status: "Critical",
    cpu: 94,
    memory: 47,
    disk: 67,
    network: 12,
  },
  {
    id: "app-srv-47",
    name: "APP-SRV-47",
    type: "Application",
    provider: "Azure",
    environment: "Production",
    status: "Warning",
    cpu: 41,
    memory: 72,
    disk: 91,
    network: 18,
  },
  {
    id: "k8s-prod-01",
    name: "K8S-PROD-01",
    type: "Kubernetes",
    provider: "AWS",
    environment: "Production",
    status: "Healthy",
    cpu: 23,
    memory: 47,
    disk: 52,
    network: 12,
  },
  {
    id: "edge-gw-08",
    name: "EDGE-GW-08",
    type: "Network",
    provider: "On-prem",
    environment: "Production",
    status: "Healthy",
    cpu: 18,
    memory: 34,
    disk: 41,
    network: 29,
  },
];
const initialAlerts = [
  {
    id: 1,
    asset: "DB-SRV-12",
    type: "CPU anomaly",
    detail: "CPU utilization reached 94%",
    severity: "Critical",
    action: "Auto-scaled",
    status: "Resolved",
    time: "2 min ago",
  },
  {
    id: 2,
    asset: "APP-SRV-47",
    type: "Disk capacity",
    detail: "Disk utilization reached 91%",
    severity: "Warning",
    action: "Cleanup scheduled",
    status: "Open",
    time: "8 min ago",
  },
  {
    id: 3,
    asset: "K8S-PROD-01",
    type: "Health check",
    detail: "Pod restart rate above baseline",
    severity: "Info",
    action: "Monitoring",
    status: "Open",
    time: "14 min ago",
  },
];
const navItems = [
  ["Overview", LayoutDashboard],
  ["Assets", Server],
  ["Infrastructure", Activity],
  ["Cloud", Cloud],
  ["Network", Network],
  ["Health checks", ShieldCheck],
  ["Alerts", Bell],
];

function App() {
  const [assets, setAssets] = useState(initialAssets);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [toast, setToast] = useState("");
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState(initialAssets[0].id);
  const [metricHistory, setMetricHistory] = useState([23, 25, 21, 24, 22, 23]);
  const [assetForm, setAssetForm] = useState({
    name: "",
    type: "Server",
    provider: "AWS",
    environment: "Production",
  });
  function refreshData(showConfirmation = false) {
    setAssets((current) =>
      current.map((asset) => {
        const cpu = Math.max(8, Math.min(96, asset.cpu + Math.round((Math.random() - 0.5) * 8)));
        const network = Math.max(5, Math.min(40, asset.network + Math.round((Math.random() - 0.5) * 5)));
        return { ...asset, cpu, network, status: cpu >= 90 || asset.disk >= 90 ? "Critical" : cpu >= 70 ? "Warning" : "Healthy" };
      }),
    );
    setMetricHistory((current) => [...current.slice(-5), 20 + Math.round(Math.random() * 8)]);
    setLastSync(new Date());
    if (showConfirmation) {
      setToast("Metrics refreshed just now");
      setTimeout(() => setToast(""), 3000);
    }
  }
  useEffect(() => {
    const timer = setInterval(() => {
      refreshData();
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    assets.forEach((asset) => {
      const type = asset.cpu >= 90 ? "CPU anomaly" : asset.disk >= 90 ? "Disk capacity" : null;
      if (!type) return;
      setAlerts((current) => current.some((alert) => alert.asset === asset.name && alert.type === type && alert.status === "Open") ? current : [{ id: Date.now() + asset.id.length, asset: asset.name, type, detail: `${type === "CPU anomaly" ? "CPU" : "Disk"} utilization exceeded threshold`, severity: "Critical", action: type === "CPU anomaly" ? "Scale recommended" : "Cleanup scheduled", status: "Open", time: "Just now" }, ...current]);
    });
  }, [assets]);
  const monitored = assets[0];
  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId) || monitored;
  const uptime = assets.some((asset) => asset.status === "Critical") ? "99.97%" : "99.99%";
  const filteredAssets = useMemo(
    () =>
      assets.filter((asset) =>
        `${asset.name} ${asset.type} ${asset.provider}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [assets, query],
  );
  const visibleAlerts = showAll ? alerts : alerts.slice(0, 2);
  const activeAlerts =
    alerts.filter((alert) => alert.status === "Open").length + 10;
  function resolveAlert(id) {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Resolved", action: "Resolved just now" }
          : alert,
      ),
    );
    setToast("Alert resolved and SLA timer stopped");
    setTimeout(() => setToast(""), 3000);
  }
  function scaleAsset(assetId = monitored.id) {
    setAssets((current) =>
      current.map((asset) =>
        asset.id === assetId
          ? { ...asset, cpu: 23, status: "Healthy" }
          : asset,
      ),
    );
    setAlerts((current) =>
      current.map((alert) =>
        alert.asset === assets.find((asset) => asset.id === assetId)?.name
          ? { ...alert, status: "Resolved", action: "Auto-scaled just now" }
          : alert,
      ),
    );
    setToast(`Auto-scaling action completed for ${assets.find((asset) => asset.id === assetId)?.name}`);
    setTimeout(() => setToast(""), 3000);
  }
  function addAsset(event) {
    event.preventDefault();
    const newAsset = {
      id: assetForm.name.toLowerCase().replace(/\s+/g, "-"),
      name: assetForm.name.toUpperCase(),
      type: assetForm.type,
      provider: assetForm.provider,
      environment: assetForm.environment,
      status: "Healthy",
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
    };
    setAssets((current) => [newAsset, ...current]);
    setShowAssetForm(false);
    setAssetForm({
      name: "",
      type: "Server",
      provider: "AWS",
      environment: "Production",
    });
    setToast(`${newAsset.name} added to asset inventory`);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={19} />
          </div>
          <div>
            <strong>
              sentinel<span>core</span>
            </strong>
            <small>SECUREOPS</small>
          </div>
        </div>
        <div className="workspace">
          <span className="status-dot" /> <span>Acme Infrastructure</span>
          <ChevronDown size={14} />
        </div>
        <nav>
          {navItems.map(([label, Icon]) => (
            <button
              key={label}
              className={activeNav === label ? "nav-item active" : "nav-item"}
              onClick={() => setActiveNav(label)}
            >
              <Icon size={17} />
              <span>{label}</span>
              {label === "Alerts" && <b>{activeAlerts}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={17} />
            <span>Settings</span>
          </button>
          <div className="user">
            <div className="avatar">AR</div>
            <div>
              <strong>Alex Rivera</strong>
              <small>Platform admin</small>
            </div>
            <span className="dots">•••</span>
          </div>
        </div>
      </aside>
      <main className="main">
        <header>
          <div className="mobile-brand">
            <Menu size={20} />
            <strong>
              sentinel<span>core</span>
            </strong>
          </div>
          <div className="crumb">
            <span>Monitoring</span>
            <ArrowUpRight size={13} />
            <strong>{activeNav}</strong>
          </div>
          <div className="header-actions">
            <div className="sync">
              <span className="live-dot" /> Live{" "}
              <span className="sync-time">
                Updated{" "}
                {lastSync.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <button className="icon-btn" title="Help" onClick={() => { setToast("Support center: monitoring thresholds are active"); setTimeout(() => setToast(""), 3000); }}>
              <CircleHelp size={18} />
            </button>
            <button className="icon-btn notification" title="Notifications" onClick={() => setActiveNav("Alerts")}>
              <Bell size={18} />
              <i />
            </button>
            <button className="header-avatar profile-button" title="Profile" onClick={() => { setToast("Signed in as Alex Rivera · Platform admin"); setTimeout(() => setToast(""), 3000); }}>AR</button>
          </div>
        </header>
        <div className={activeNav === "Overview" ? "content" : "content module-mode"}>
          {activeNav !== "Overview" && (
            <ModuleView
              activeNav={activeNav}
              assets={assets}
              alerts={alerts}
              selectedAsset={selectedAsset}
              selectedAssetId={selectedAssetId}
              setSelectedAssetId={setSelectedAssetId}
              uptime={uptime}
              metricHistory={metricHistory}
              onScale={scaleAsset}
              onResolve={resolveAlert}
            />
          )}
          <div className="page-heading">
            <div>
              <p className="eyebrow">
                INFRASTRUCTURE MONITORING <span>·</span> OVERVIEW
              </p>
              <h1>
                Good morning, Alex <span className="wave">✦</span>
              </h1>
              <p className="subhead">
                Your infrastructure is operating within healthy parameters.
              </p>
            </div>
            <div className="heading-actions">
              <button
                className="button secondary"
                onClick={() => refreshData(true)}
              >
                <RefreshCw size={15} /> Refresh data
              </button>
              <button className="button primary" onClick={() => setShowAssetForm(true)}>
                <Plus size={16} /> Add asset
              </button>
            </div>
          </div>
          <section className="summary-grid">
            <SummaryCard
              icon={<Server />}
              label="Assets monitored"
              value="2,847"
              meta="Across 5 environments"
              trend="+12 this month"
            />
            <SummaryCard
              icon={<Gauge />}
              label="Uptime SLA"
              value="99.99%"
              meta="Target ≥ 99.95%"
              trend="On target"
              good
            />
            <SummaryCard
              icon={<Bell />}
              label="Active alerts"
              value={activeAlerts}
              meta="2 critical · 8 warning · 2 info"
              trend="View alerts"
              warning
            />
          </section>
          <div className="section-header">
            <div>
              <h2>Infrastructure health</h2>
              <p>Live status across your estate</p>
            </div>
            <button className="text-button">
              View health checks <ArrowUpRight size={14} />
            </button>
          </div>
          <section className="health-grid">
            <div className="health-panel server-panel">
              <div className="panel-title">
                <div>
                  <span className="icon-tile blue">
                    <Server size={18} />
                  </span>
                  <div>
                    <h3>Servers</h3>
                    <span>1,247 total assets</span>
                  </div>
                </div>
                <span className="pill good">
                  <span /> 99.0% healthy
                </span>
              </div>
              <div className="server-total">
                1,247 <small>servers monitored</small>
              </div>
              <div className="status-bars">
                <StatusBar
                  label="Healthy"
                  value="1,235"
                  width="88%"
                  color="green"
                />
                <StatusBar
                  label="Warning"
                  value="10"
                  width="4%"
                  color="yellow"
                />
                <StatusBar label="Critical" value="2" width="2%" color="red" />
              </div>
              <div className="panel-footer">
                <span>
                  <i className="dot aws" /> AWS <b>847</b>
                </span>
                <span>
                  <i className="dot azure" /> Azure <b>400</b>
                </span>
                <span>
                  <i className="dot kubernetes" /> Kubernetes <b>47 clusters</b>
                </span>
              </div>
            </div>
            <div className="health-panel cloud-panel">
              <div className="panel-title">
                <div>
                  <span className="icon-tile purple">
                    <Cloud size={18} />
                  </span>
                  <div>
                    <h3>Cloud resources</h3>
                    <span>Multi-cloud footprint</span>
                  </div>
                </div>
                <button className="more">
                  <SlidersHorizontal size={16} />
                </button>
              </div>
              <div className="cloud-stat">
                <div className="donut">
                  <span>
                    2,847<small>total</small>
                  </span>
                </div>
                <div className="cloud-legend">
                  <span>
                    <i className="dot aws" /> AWS <b>847</b>
                  </span>
                  <span>
                    <i className="dot azure" /> Azure <b>400</b>
                  </span>
                  <span>
                    <i className="dot kubernetes" /> Kubernetes <b>47</b>
                  </span>
                </div>
              </div>
              <div className="panel-footer">
                <span>
                  <Database size={14} /> 47 clusters
                </span>
                <span>
                  <Activity size={14} /> 2,847 pods
                </span>
              </div>
            </div>
          </section>
          <div className="section-header metrics-head">
            <div>
              <h2>System metrics</h2>
              <p>Aggregated across all monitored assets</p>
            </div>
            <div className="range-select">
              Last 15 minutes <ChevronDown size={14} />
            </div>
          </div>
          <section className="metric-grid">
            <MetricCard
              icon={<Gauge />}
              label="CPU utilization"
              value={23}
              unit="%"
              status="Healthy"
              color="blue"
              points="8,38 22,31 37,35 53,20 70,26 86,14 100,19"
            />
            <MetricCard
              icon={<Activity />}
              label="Memory utilization"
              value={47}
              unit="%"
              status="Healthy"
              color="purple"
              points="8,30 22,28 37,33 53,26 70,28 86,17 100,21"
            />
            <MetricCard
              icon={<HardDrive />}
              label="Disk utilization"
              value={67}
              unit="%"
              status="Elevated"
              color="orange"
              points="8,35 22,27 37,31 53,20 70,24 86,10 100,15"
            />
            <MetricCard
              icon={<Network />}
              label="Network throughput"
              value={12}
              unit="Gbps"
              status="Healthy"
              color="green"
              points="8,29 22,33 37,25 53,28 70,17 86,22 100,12"
            />
          </section>
          <div className="section-header alerts-header">
            <div>
              <h2>Alert management</h2>
              <p>Recent events requiring attention</p>
            </div>
            <button
              className="text-button"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : "View all alerts"}{" "}
              <ArrowUpRight size={14} />
            </button>
          </div>
          <section className="alert-list">
            {visibleAlerts.map((alert) => (
              <div className="alert-row" key={alert.id}>
                <div className={`alert-icon ${alert.severity.toLowerCase()}`}>
                  {alert.severity === "Critical" ? (
                    <AlertTriangle size={17} />
                  ) : alert.severity === "Warning" ? (
                    <HardDrive size={17} />
                  ) : (
                    <ShieldCheck size={17} />
                  )}
                </div>
                <div className="alert-main">
                  <div>
                    <strong>{alert.asset}</strong>
                    <span className="alert-type">{alert.type}</span>
                  </div>
                  <p>{alert.detail}</p>
                </div>
                <div className="alert-action">
                  <span className={`severity ${alert.severity.toLowerCase()}`}>
                    {alert.severity}
                  </span>
                  <strong>{alert.action}</strong>
                </div>
                <div className="alert-status">
                  <span
                    className={`status-label ${alert.status.toLowerCase()}`}
                  >
                    {alert.status === "Resolved" && <Check size={12} />}
                    {alert.status}
                  </span>
                  <small>{alert.time}</small>
                </div>
                {alert.status === "Open" && (
                  <button
                    className="resolve"
                    onClick={() => resolveAlert(alert.id)}
                    title="Resolve alert"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            ))}
          </section>
          <section className="workflow-banner">
            <div className="spark">
              <Sparkles size={19} />
            </div>
            <div>
              <strong>Auto-scaling is active</strong>
              <p>
                Policies are monitoring 47 cloud clusters and will scale
                resources when thresholds are exceeded.
              </p>
            </div>
            <button className="button secondary" onClick={scaleAsset}>
              <Play size={14} /> Run test action
            </button>
          </section>
          <div className="inventory-header">
            <div>
              <h2>Asset inventory</h2>
              <p>Connected infrastructure and service endpoints</p>
            </div>
            <div className="inventory-tools">
              <div className="search">
                <Search size={15} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search assets"
                />
              </div>
              <button className="icon-btn">
                <SlidersHorizontal size={16} />
              </button>
            </div>
          </div>
          <section className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Type</th>
                  <th>Provider</th>
                  <th>Environment</th>
                  <th>Health</th>
                  <th>Last check</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>
                      <span className="table-icon">
                        <Server size={15} />
                      </span>
                      <strong>{asset.name}</strong>
                    </td>
                    <td>{asset.type}</td>
                    <td>{asset.provider}</td>
                    <td>
                      <span className="env-dot" />
                      {asset.environment}
                    </td>
                    <td>
                      <span
                        className={`health-label ${asset.status.toLowerCase()}`}
                      >
                        <span /> {asset.status}
                      </span>
                    </td>
                    <td>Just now</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
      {toast && (
        <div className="toast">
          <Check size={16} /> {toast}
          <button onClick={() => setToast("")}>
            <X size={14} />
          </button>
        </div>
      )}
      {showAssetForm && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowAssetForm(false)}>
          <form className="asset-modal" onSubmit={addAsset}>
            <div className="modal-heading"><div><p className="eyebrow">ASSET SERVICE</p><h2>Add monitored asset</h2><p>Connect a new endpoint to your infrastructure inventory.</p></div><button type="button" className="icon-btn" onClick={() => setShowAssetForm(false)} title="Close"><X size={17} /></button></div>
            <label>Asset name<input required autoFocus value={assetForm.name} onChange={(event) => setAssetForm({ ...assetForm, name: event.target.value })} placeholder="e.g. API-SRV-09" /></label>
            <div className="form-grid"><label>Asset type<select value={assetForm.type} onChange={(event) => setAssetForm({ ...assetForm, type: event.target.value })}><option>Server</option><option>Database</option><option>Application</option><option>Kubernetes</option><option>Network</option></select></label><label>Provider<select value={assetForm.provider} onChange={(event) => setAssetForm({ ...assetForm, provider: event.target.value })}><option>AWS</option><option>Azure</option><option>Kubernetes</option><option>On-prem</option></select></label></div>
            <label>Environment<select value={assetForm.environment} onChange={(event) => setAssetForm({ ...assetForm, environment: event.target.value })}><option>Production</option><option>Staging</option><option>Development</option></select></label>
            <div className="modal-actions"><button type="button" className="button secondary" onClick={() => setShowAssetForm(false)}>Cancel</button><button className="button primary" type="submit"><Plus size={15} /> Add asset</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, meta, trend, good, warning }) {
  return (
    <div className="summary-card">
      <div className="card-icon">{icon}</div>
      <div className="card-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{meta}</small>
      </div>
      <span className={`trend ${good ? "good" : warning ? "warning" : ""}`}>
        {trend}
      </span>
    </div>
  );
}
function ModuleView({ activeNav, assets, alerts, selectedAsset, selectedAssetId, setSelectedAssetId, uptime, metricHistory, onScale, onResolve }) {
  const openAlerts = alerts.filter((alert) => alert.status === "Open");
  const title = activeNav === "Assets" ? "Asset inventory" : activeNav === "Infrastructure" ? "Infrastructure metrics" : activeNav;
  return <div className="module-view">
    <div className="module-heading"><div><p className="eyebrow">SECUREOPS <span>·</span> {activeNav.toUpperCase()}</p><h1>{title}</h1><p className="subhead">Live operational data from your monitored infrastructure.</p></div><span className="module-live"><i className="live-dot" /> Streaming live data</span></div>
    {activeNav === "Assets" && <><div className="module-stat-grid"><ModuleStat label="Total assets" value="2,847" icon={<Server />} /><ModuleStat label="Healthy assets" value="1,235" icon={<ShieldCheck />} /><ModuleStat label="Providers" value="3" icon={<Cloud />} /></div><div className="detail-layout"><div className="module-table"><div className="module-table-title"><h2>Connected endpoints</h2><span>{assets.length} sample endpoints</span></div>{assets.map((asset) => <button className={`asset-item ${selectedAssetId === asset.id ? "selected" : ""}`} key={asset.id} onClick={() => setSelectedAssetId(asset.id)}><span className="table-icon"><Server size={15} /></span><strong>{asset.name}</strong><span>{asset.type}</span><span>{asset.provider}</span><span className={`health-label ${asset.status.toLowerCase()}`}><span /> {asset.status}</span><ArrowUpRight size={14} /></button>)}</div><AssetDetail asset={selectedAsset} uptime={uptime} onScale={() => onScale(selectedAsset.id)} /></div></>}
    {activeNav === "Infrastructure" && <><div className="metric-grid module-metrics"><MetricCard icon={<Gauge />} label="CPU utilization" value={metricHistory[metricHistory.length - 1]} unit="%" status={selectedAsset.cpu >= 90 ? "Critical" : "Healthy"} color="blue" points={metricHistory.map((value, index) => `${index * 18 + 8},${48 - value / 2}`).join(" ")} /><MetricCard icon={<Activity />} label="Memory utilization" value={selectedAsset.memory} unit="%" status="Healthy" color="purple" points="8,30 22,28 37,33 53,26 70,28 86,17 100,21" /><MetricCard icon={<HardDrive />} label="Disk utilization" value={selectedAsset.disk} unit="%" status={selectedAsset.disk >= 90 ? "Critical" : "Elevated"} color="orange" points="8,35 22,27 37,31 53,20 70,24 86,10 100,15" /><MetricCard icon={<Network />} label="Network throughput" value={selectedAsset.network} unit="Gbps" status="Healthy" color="green" points="8,29 22,33 37,25 53,28 70,17 86,22 100,12" /></div><AssetDetail asset={selectedAsset} uptime={uptime} onScale={() => onScale(selectedAsset.id)} /></>}
    {activeNav === "Cloud" && <div className="module-stat-grid"><ModuleStat label="AWS resources" value="847" icon={<Cloud />} /><ModuleStat label="Azure resources" value="400" icon={<Cloud />} /><ModuleStat label="Kubernetes clusters" value="47" icon={<Database />} /><ModuleStat label="Pods monitored" value="2,847" icon={<Activity />} /></div>}
    {activeNav === "Network" && <div className="module-stat-grid"><ModuleStat label="Throughput" value="12 Gbps" icon={<Network />} /><ModuleStat label="Healthy gateways" value="98.7%" icon={<ShieldCheck />} /><ModuleStat label="Packet loss" value="0.02%" icon={<Activity />} /></div>}
    {activeNav === "Health checks" && <div className="check-list">{assets.map((asset) => <div className="check-row" key={asset.id}><span className={`health-label ${asset.status.toLowerCase()}`}><span /> {asset.status}</span><strong>{asset.name}</strong><span>Response time {asset.status === "Critical" ? "1.8s" : "42ms"}</span><small>Checked just now</small></div>)}</div>}
    {activeNav === "Alerts" && <div className="check-list">{openAlerts.length === 0 ? <div className="empty-state"><Check size={24} /> No open alerts. All systems are within thresholds.</div> : openAlerts.map((alert) => <div className="check-row" key={alert.id}><span className={`severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span><strong>{alert.asset}</strong><span>{alert.detail}</span><button className="button secondary" onClick={() => onResolve(alert.id)}><Check size={13} /> Resolve</button></div>)}</div>}
  </div>;
}
function ModuleStat({ label, value, icon }) { return <div className="module-stat"><span className="icon-tile blue">{icon}</span><span>{label}</span><strong>{value}</strong><small><i className="live-dot" /> Live reading</small></div>; }
function AssetDetail({ asset, uptime, onScale }) { return <div className="asset-detail"><div className="detail-top"><div><p className="eyebrow">SELECTED ASSET</p><h2>{asset.name}</h2><span>{asset.type} · {asset.provider} · {asset.environment}</span></div><span className={`health-label ${asset.status.toLowerCase()}`}><span /> {asset.status}</span></div><div className="detail-metrics"><MetricMini label="CPU" value={`${asset.cpu}%`} /><MetricMini label="Memory" value={`${asset.memory}%`} /><MetricMini label="Disk" value={`${asset.disk}%`} /><MetricMini label="Network" value={`${asset.network} Gbps`} /></div><div className="detail-footer"><span>Uptime SLA <b>{uptime}</b></span><span>Last health check <b>Just now</b></span></div><button className="button primary" onClick={onScale}><Sparkles size={14} /> Run auto-scale action</button></div>; }
function MetricMini({ label, value }) { return <div><span>{label}</span><strong>{value}</strong></div>; }
function StatusBar({ label, value, width, color }) {
  return (
    <div className="status-bar">
      <div>
        <span>{label}</span>
        <b>{value}</b>
      </div>
      <div className="track">
        <i className={color} style={{ width }} />
      </div>
    </div>
  );
}
function MetricCard({ icon, label, value, unit, status, color, points }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span className={`metric-icon ${color}`}>{icon}</span>
        <span className={`metric-status ${color}`}>{status}</span>
      </div>
      <span className="metric-label">{label}</span>
      <div className="metric-value">
        {value}
        <small>{unit}</small>
      </div>
      <svg
        className={`sparkline ${color}`}
        viewBox="0 0 108 48"
        preserveAspectRatio="none"
      >
        <polyline points={points} />
      </svg>
      <span className="metric-foot">
        <span>
          <i className="live-dot" /> Live
        </span>{" "}
        vs. 15 min ago
      </span>
    </div>
  );
}

export default App;
