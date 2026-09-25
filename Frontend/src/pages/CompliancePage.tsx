import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, Grid, InputLabel, MenuItem, Select, Stack, Tab, Table, TableBody,
  TableCell, TableHead, TableRow, Tabs, TextField, Typography
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ErrorIcon from "@mui/icons-material/Error";
import RuleIcon from "@mui/icons-material/Rule";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import PageHeader from "../components/PageHeader";
import { complianceApi, reportApi } from "../services/api";
import AccentMetricCard from "../components/AccentMetricCard";

export default function CompliancePage() {
  const [frameworks, setFrameworks] = useState<any[]>([]);
  const [controls, setControls] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [gaps, setGaps] = useState<any[]>([]);
  const [selectedFramework, setSelectedFramework] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Status edit modal
  const [editControl, setEditControl] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [newOwner, setNewOwner] = useState("");

  // Evidence modal
  const [evidenceControl, setEvidenceControl] = useState<any | null>(null);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [evType, setEvType] = useState("DOCUMENT");
  const [evDesc, setEvDesc] = useState("");
  const [evRef, setEvRef] = useState("");

  const loadData = async () => {
    if (!selectedFramework) return;
    setError(null);
    try {
      const [cRes, sRes, gRes] = await Promise.all([
        complianceApi.getControls(selectedFramework),
        complianceApi.getSummary(selectedFramework),
        complianceApi.getGapAnalysis(selectedFramework)
      ]);
      setControls(cRes.data || []);
      setSummary(sRes.data || null);
      setGaps(gRes.data || []);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Failed to load compliance data");
    }
  };

  useEffect(() => {
    complianceApi.getFrameworks()
      .then((r) => {
        setFrameworks(r.data || []);
        if (r.data?.[0]) setSelectedFramework(r.data[0].id);
      })
      .catch((e) => setError(e.response?.data?.message || e.message));
  }, []);

  useEffect(() => {
    loadData();
  }, [selectedFramework]);

  const handleExportCsv = async () => {
    if (!selectedFramework) return;
    try {
      const res = await reportApi.exportComplianceCsv(selectedFramework);
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `compliance-report-${selectedFramework}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e: any) {
      alert("Failed to export compliance CSV");
    }
  };

  const handleUpdateStatus = async () => {
    if (!editControl) return;
    try {
      await complianceApi.updateStatus(editControl.id, newStatus, newOwner);
      setEditControl(null);
      loadData();
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Failed to update control status");
    }
  };

  const openEvidenceModal = async (control: any) => {
    setEvidenceControl(control);
    try {
      const res = await complianceApi.getEvidence(control.id);
      setEvidenceList(res.data || []);
    } catch (e) {
      setEvidenceList([]);
    }
  };

  const handleAddEvidence = async () => {
    if (!evidenceControl) return;
    try {
      await complianceApi.addEvidence(evidenceControl.id, {
        evidenceType: evType,
        description: evDesc,
        reference: evRef,
        status: "VERIFIED"
      });
      setEvDesc("");
      setEvRef("");
      const res = await complianceApi.getEvidence(evidenceControl.id);
      setEvidenceList(res.data || []);
      loadData();
    } catch (e: any) {
      alert("Failed to add evidence");
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "COMPLIANT": return "success";
      case "PARTIALLY_COMPLIANT": return "warning";
      case "NON_COMPLIANT": return "error";
      default: return "default";
    }
  };

  return (
    <>
      <PageHeader
        title="Compliance Dashboard & Frameworks"
        subtitle="Track controls, evidence management, and gap analysis for PCI DSS, SOC 2, ISO 27001 posture"
      />

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Top Action Bar */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 260 }}>
          <InputLabel>Framework</InputLabel>
          <Select
            label="Framework"
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
          >
            {frameworks.map((fw) => (
              <MenuItem key={fw.id} value={fw.id}>
                {fw.name} {fw.version ? `(${fw.version})` : ""}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleExportCsv}
          disabled={!selectedFramework}
        >
          Export Compliance CSV Report
        </Button>
      </Stack>

      {/* Metric Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <AccentMetricCard
              label="Compliance Posture"
              value={`${summary.percentage.toFixed(1)}%`}
              subtitle="Weighted control score"
              color="#22C55E"
              icon={<VerifiedUserIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AccentMetricCard
              label="Total Controls"
              value={summary.controls}
              subtitle="Mapped framework requirements"
              color="#38BDF8"
              icon={<RuleIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AccentMetricCard
              label="Compliant Controls"
              value={summary.compliant}
              subtitle="Fully passing & verified"
              color="#22C55E"
              icon={<FactCheckIcon />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AccentMetricCard
              label="Compliance Gaps"
              value={summary.nonCompliant + summary.notAssessed}
              subtitle="Gaps requiring remediation"
              color="#EF4444"
              icon={<ErrorIcon />}
            />
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)}>
          <Tab label="Controls & Evidence Register" />
          <Tab label={`Gap Analysis (${gaps.length})`} />
        </Tabs>
      </Box>

      {/* Tab 0: Controls Table */}
      {activeTab === 0 && (
        <Card sx={{ overflow: "hidden", borderColor: "#334155" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#101827" }}>
                <TableCell sx={{ color: "#94A3B8" }}>Ref</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Title & Domain</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Status</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Owner</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Evidence</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Next Review</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {controls.map((ctrl) => (
                <TableRow key={ctrl.id} hover>
                  <TableCell sx={{ fontWeight: 700, color: "#38BDF8" }}>{ctrl.controlId}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{ctrl.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{ctrl.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={ctrl.status} color={statusColor(ctrl.status) as any} size="small" />
                  </TableCell>
                  <TableCell>{ctrl.owner || "Unassigned"}</TableCell>
                  <TableCell>
                    <Chip
                      icon={<FolderZipIcon />}
                      label={`${ctrl.evidenceCount || 0} file(s)`}
                      size="small"
                      variant="outlined"
                      onClick={() => openEvidenceModal(ctrl)}
                      clickable
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.85rem" }}>
                    {ctrl.nextReviewAt ? new Date(ctrl.nextReviewAt).toLocaleDateString() : "Not set"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setEditControl(ctrl);
                        setNewStatus(ctrl.status);
                        setNewOwner(ctrl.owner || "");
                      }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Tab 1: Gap Analysis Table */}
      {activeTab === 1 && (
        <Card sx={{ overflow: "hidden", borderColor: "#334155" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#101827" }}>
                <TableCell sx={{ color: "#94A3B8" }}>Control ID</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Control Title</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Current Status</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Attached Evidence</TableCell>
                <TableCell sx={{ color: "#94A3B8" }}>Identified Gap Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gaps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#22C55E" }}>
                    No compliance gaps detected! All controls are verified and compliant.
                  </TableCell>
                </TableRow>
              ) : (
                gaps.map((gap) => (
                  <TableRow key={gap.controlId} hover>
                    <TableCell sx={{ fontWeight: 700, color: "#EF4444" }}>{gap.controlRef}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{gap.title}</TableCell>
                    <TableCell>
                      <Chip label={gap.status} color={statusColor(gap.status) as any} size="small" />
                    </TableCell>
                    <TableCell>{gap.evidenceCount} item(s)</TableCell>
                    <TableCell sx={{ color: "#F59E0B", fontWeight: 600 }}>{gap.gapReason}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Control Update Dialog */}
      <Dialog open={Boolean(editControl)} onClose={() => setEditControl(null)} fullWidth maxWidth="xs">
        {editControl && (
          <>
            <DialogTitle>Update Control — {editControl.controlId}</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Compliance Status</InputLabel>
                  <Select
                    label="Compliance Status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="COMPLIANT">COMPLIANT</MenuItem>
                    <MenuItem value="PARTIALLY_COMPLIANT">PARTIALLY_COMPLIANT</MenuItem>
                    <MenuItem value="NON_COMPLIANT">NON_COMPLIANT</MenuItem>
                    <MenuItem value="NOT_ASSESSED">NOT_ASSESSED</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Control Owner / Reviewer"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  fullWidth
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditControl(null)}>Cancel</Button>
              <Button variant="contained" onClick={handleUpdateStatus}>Save Changes</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Evidence Panel Dialog */}
      <Dialog open={Boolean(evidenceControl)} onClose={() => setEvidenceControl(null)} fullWidth maxWidth="sm">
        {evidenceControl && (
          <>
            <DialogTitle>Evidence Register — {evidenceControl.controlId}: {evidenceControl.title}</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: "#38BDF8" }}>Existing Evidence Files / Links</Typography>
              {evidenceList.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No evidence uploaded for this control.
                </Typography>
              ) : (
                <Stack spacing={1} sx={{ mb: 3 }}>
                  {evidenceList.map((ev) => (
                    <Box key={ev.id} sx={{ p: 1.5, border: "1px solid #334155", borderRadius: 1, bgcolor: "#0F172A" }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{ev.evidenceType}: {ev.description}</Typography>
                        <Chip label={ev.status} size="small" color="success" />
                      </Stack>
                      {ev.reference && <Typography variant="caption" color="text.secondary">Ref: {ev.reference}</Typography>}
                    </Box>
                  ))}
                </Stack>
              )}

              <Typography variant="subtitle2" sx={{ mb: 1, color: "#22C55E" }}>Add New Evidence Record</Typography>
              <Stack spacing={1.5}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select label="Type" value={evType} onChange={(e) => setEvType(e.target.value)}>
                    <MenuItem value="DOCUMENT">Document / SOP</MenuItem>
                    <MenuItem value="AUDIT_LOG">Audit Log Export</MenuItem>
                    <MenuItem value="CONFIG_FILE">Configuration Dump</MenuItem>
                    <MenuItem value="SCAN_REPORT">Vulnerability Scan</MenuItem>
                  </Select>
                </FormControl>
                <TextField size="small" label="Description" value={evDesc} onChange={(e) => setEvDesc(e.target.value)} fullWidth />
                <TextField size="small" label="Reference / URL / File Hash" value={evRef} onChange={(e) => setEvRef(e.target.value)} fullWidth />
                <Button variant="outlined" startIcon={<FolderZipIcon />} onClick={handleAddEvidence}>
                  Submit Evidence Record
                </Button>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEvidenceControl(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

