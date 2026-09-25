import { useEffect, useState } from "react";
import { Alert, Card, CardContent, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import BugReportIcon from "@mui/icons-material/BugReport";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PageHeader from "../components/PageHeader";
import { auditApi, complianceApi, incidentApi, reportApi } from "../services/api";

export default function DevSecOpsPage() {
  const [report, setReport] = useState<any>(null);
  const [auditSummary, setAuditSummary] = useState<any>(null);
  const [compliancePct, setCompliancePct] = useState<string>("N/A");
  const [openIncidentsCount, setOpenIncidentsCount] = useState<number | string>("N/A");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      reportApi.getCurrentReport().catch(() => ({ data: null })),
      auditApi.getSummary().catch(() => ({ data: null })),
      complianceApi.getFrameworks().then(async (r) => {
        if (r.data?.[0]) {
          const s = await complianceApi.getSummary(r.data[0].id);
          return `${s.data.percentage.toFixed(1)}%`;
        }
        return "N/A";
      }).catch(() => "N/A"),
      incidentApi.getIncidents().then((r) => r.data?.filter((i: any) => i.status !== "RESOLVED").length ?? "N/A").catch(() => "N/A")
    ])
      .then(([rRes, aRes, cPct, incCount]) => {
        if (rRes.data) setReport(rRes.data);
        if (aRes.data) setAuditSummary(aRes.data);
        setCompliancePct(cPct);
        setOpenIncidentsCount(incCount);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || "Unable to load DevSecOps posture."))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "Overall Risk Score",
      value: report?.overallRiskScore != null ? `${Number(report.overallRiskScore).toFixed(1)} / 100` : "N/A",
      subtitle: report?.overallRiskCategory ? `${report.overallRiskCategory} risk tier` : "Risk posture",
      color: "#8B5CF6",
      icon: <AssessmentIcon />
    },
    {
      title: "Compliance Posture",
      value: compliancePct,
      subtitle: "Framework controls verified",
      color: "#22C55E",
      icon: <VerifiedUserIcon />
    },
    {
      title: "Audit Log Events",
      value: auditSummary?.total ?? "N/A",
      subtitle: auditSummary?.failedAccessAttempts ? `${auditSummary.failedAccessAttempts} failed access attempts` : "Immutable event register",
      color: "#38BDF8",
      icon: <EventNoteIcon />
    },
    {
      title: "Active Incidents",
      value: openIncidentsCount,
      subtitle: "Unresolved security incidents",
      color: "#EF4444",
      icon: <WarningAmberIcon />
    },
    { title: "Open Vulnerabilities", value: report?.openVulnerabilities ?? "N/A", subtitle: "Active infrastructure findings", color: "#EF4444", icon: <BugReportIcon /> },
    { title: "SonarQube Issues", value: report?.sonarQubeFindings?.length ?? "N/A", subtitle: "Imported code-security findings", color: "#38BDF8", icon: <SearchIcon /> },
    { title: "Trivy Container Scan", value: report?.trivyFindingsCount ?? "N/A", subtitle: "Container image vulnerabilities", color: "#F59E0B", icon: <SecurityIcon /> },
    { title: "Patched Findings", value: report?.patchedVulnerabilities ?? "N/A", subtitle: "Patched & verified", color: "#22C55E", icon: <CheckCircleIcon /> },
    { title: "Remediation Queue", value: report?.pendingPatches ?? "N/A", subtitle: "Pending patch deployment", color: "#F97316", icon: <BuildIcon /> }
  ];

  return (
    <>
      <PageHeader
        title="DevSecOps & Security Operations Dashboard"
        subtitle="Unified code-security, container scans, vulnerability posture, incidents, compliance, and immutable audit metrics"
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
          <CircularProgress color="primary" />
          <Typography color="text.secondary">Loading DevSecOps metrics...</Typography>
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.title}>
              <Card
                sx={{
                  height: "100%",
                  border: `1px solid ${card.color}66`,
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": { borderColor: card.color, boxShadow: `0 12px 34px ${card.color}26` }
                }}
              >
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" sx={{ color: card.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                        {card.title}
                      </Typography>
                      <Stack sx={{ color: card.color, bgcolor: `${card.color}1A`, p: 0.75, borderRadius: 1 }}>
                        {card.icon}
                      </Stack>
                    </Stack>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#F8FAFC" }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                      {card.subtitle}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}

