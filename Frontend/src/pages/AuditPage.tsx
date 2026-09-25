import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Typography
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EventNoteIcon from "@mui/icons-material/EventNote";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LockResetIcon from "@mui/icons-material/LockReset";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import PageHeader from "../components/PageHeader";
import { auditApi, getSseStreamUrl } from "../services/api";
import AccentMetricCard from "../components/AccentMetricCard";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [integrity, setIntegrity] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [sseConnected, setSseConnected] = useState<boolean>(false);

  // Filters & Pagination
  const [actionQuery, setActionQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [resultFilter, setResultFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Detail Modal
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const loadData = async () => {
    setError(null);
    try {
      let logsRes: any;
      try {
        logsRes = await auditApi.search({
          action: actionQuery || undefined,
          severity: severityFilter || undefined,
          result: resultFilter || undefined,
          page,
          size: 15
        });
      } catch (_) {
        logsRes = await auditApi.getLogs(actionQuery || undefined, page, 15);
      }

      const [summaryRes, integrityRes] = await Promise.all([
        auditApi.getSummary().catch(() => ({ data: null })),
        auditApi.getIntegrity().catch(() => ({ data: null }))
      ]);

      const content = Array.isArray(logsRes.data)
        ? logsRes.data
        : (logsRes.data?.content || []);
      const total = logsRes.data?.totalElements ?? logsRes.data?.page?.totalElements ?? content.length;
      const pages = logsRes.data?.totalPages ?? logsRes.data?.page?.totalPages ?? 1;

      setLogs(content);
      setTotalPages(pages);
      setTotalElements(total);

      if (summaryRes?.data) setSummary(summaryRes.data);
      if (integrityRes?.data) {
        setIntegrity(typeof integrityRes.data === "boolean" ? { pass: integrityRes.data } : integrityRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Unable to load audit data.");
    }
  };

  useEffect(() => {
    loadData();
  }, [page, severityFilter, resultFilter]);

  // Real-time Kafka SSE event stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(getSseStreamUrl());
      eventSource.onopen = () => {
        setSseConnected(true);
      };
      eventSource.onmessage = (event) => {
        try {
          const incoming = JSON.parse(event.data);
          if (incoming && (incoming.id || incoming.action)) {
            setLogs((prev) => {
              if (incoming.id && prev.some((l) => l.id === incoming.id)) {
                return prev;
              }
              return [{ ...incoming, isLive: true }, ...prev];
            });
            setTotalElements((prev) => prev + 1);
            setSummary((prev: any) =>
              prev ? { ...prev, total: (prev.total || 0) + 1 } : null
            );
          }
        } catch (_) {}
      };
      eventSource.onerror = () => {
        setSseConnected(false);
      };
    } catch (_) {}

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const handleSearch = () => {
    setPage(0);
    loadData();
  };

  const handleReset = () => {
    setActionQuery("");
    setSeverityFilter("");
    setResultFilter("");
    setPage(0);
    loadData();
  };

  const passIntegrity = integrity?.pass ?? integrity;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 1, mb: 1 }}>
        <PageHeader
          title="Audit Trail & Immutability Register"
          subtitle="Cryptographically verified append-only audit trail of security and administrative operations"
        />
        <Chip
          icon={<FiberManualRecordIcon sx={{ fontSize: "12px !important", color: sseConnected ? "#22C55E" : "#F59E0B" }} />}
          label={sseConnected ? "Kafka Stream: Live" : "Kafka Stream: Connecting"}
          size="small"
          sx={{
            mt: 1,
            bgcolor: sseConnected ? "rgba(34, 197, 94, 0.1)" : "rgba(245, 158, 11, 0.1)",
            color: sseConnected ? "#22C55E" : "#F59E0B",
            borderColor: sseConnected ? "rgba(34, 197, 94, 0.3)" : "rgba(245, 158, 11, 0.3)",
            borderWidth: 1,
            borderStyle: "solid",
            fontWeight: 600
          }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Metric Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard
            label="Total Audit Events"
            value={summary?.total ?? totalElements}
            subtitle="Recorded security log entries"
            color="#38BDF8"
            icon={<EventNoteIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard
            label="Audit Integrity"
            value={passIntegrity === true ? "PASS" : passIntegrity === false ? "FAIL" : "..."}
            subtitle={passIntegrity === true ? "SHA-256 Hash Chain Valid" : "Verification Pending"}
            color={passIntegrity === false ? "#EF4444" : "#22C55E"}
            icon={<VerifiedUserIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard
            label="Failed Access Attempts"
            value={summary?.failedAccessAttempts ?? 0}
            subtitle="Rejected auth / unauthorized"
            color="#EF4444"
            icon={<LockResetIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AccentMetricCard
            label="Critical Actions"
            value={summary?.criticalActions ?? 0}
            subtitle="High-severity admin actions"
            color="#F59E0B"
            icon={<WarningAmberIcon />}
          />
        </Grid>
      </Grid>

      {/* Filters Bar */}
      <Card sx={{ p: 2, mb: 3, borderColor: "#334155", bgcolor: "#0F172A" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
          <TextField
            size="small"
            label="Filter by action / keyword"
            value={actionQuery}
            onChange={(e) => setActionQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            sx={{ minWidth: 220 }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              label="Severity"
              value={severityFilter}
              onChange={(e) => { setSeverityFilter(e.target.value); setPage(0); }}
            >
              <MenuItem value="">All Severities</MenuItem>
              <MenuItem value="CRITICAL">Critical</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="INFO">Info</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Result</InputLabel>
            <Select
              label="Result"
              value={resultFilter}
              onChange={(e) => { setResultFilter(e.target.value); setPage(0); }}
            >
              <MenuItem value="">All Results</MenuItem>
              <MenuItem value="SUCCESS">Success</MenuItem>
              <MenuItem value="FAILURE">Failure</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </Stack>
      </Card>

      {/* Logs Table */}
      <Card sx={{ overflow: "hidden", borderColor: "#334155" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#101827" }}>
              <TableCell sx={{ color: "#94A3B8" }}>Timestamp</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Actor</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Role</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Action</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Entity</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Result</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Severity</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: "#94A3B8" }}>
                  No audit log events found matching the criteria.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                    {log.isLive && (
                      <Chip
                        label="LIVE"
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          bgcolor: "rgba(34, 197, 94, 0.15)",
                          color: "#22C55E",
                          border: "1px solid rgba(34, 197, 94, 0.3)",
                          mr: 1
                        }}
                      />
                    )}
                    {new Date(log.occurredAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.actor}</TableCell>
                  <TableCell>
                    <Chip label={log.role} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{log.action}</TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.result}
                      size="small"
                      color={log.result === "SUCCESS" ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    {log.severity && (
                      <Chip
                        label={log.severity}
                        size="small"
                        sx={{
                          bgcolor:
                            log.severity === "CRITICAL"
                              ? "#EF444422"
                              : log.severity === "HIGH"
                              ? "#F59E0B22"
                              : "#38BDF822",
                          color:
                            log.severity === "CRITICAL"
                              ? "#EF4444"
                              : log.severity === "HIGH"
                              ? "#F59E0B"
                              : "#38BDF8",
                          fontWeight: 700
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setSelectedLog(log)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, value) => setPage(value - 1)}
              color="primary"
            />
          </Box>
        )}
      </Card>

      {/* Log Detail Dialog */}
      <Dialog
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        fullWidth
        maxWidth="md"
      >
        {selectedLog && (
          <>
            <DialogTitle sx={{ borderBottom: "1px solid #334155" }}>
              Audit Log Detail — {selectedLog.action}
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Actor</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedLog.actor}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Role</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedLog.role}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Timestamp</Typography>
                  <Typography variant="body2">{new Date(selectedLog.occurredAt).toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Result / Severity</Typography>
                  <Typography variant="body2">{selectedLog.result} / {selectedLog.severity || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Entity Type / ID</Typography>
                  <Typography variant="body2">{selectedLog.entityType} ({selectedLog.entityId || "N/A"})</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Source / Event Type</Typography>
                  <Typography variant="body2">{selectedLog.source || "N/A"} / {selectedLog.eventType || "N/A"}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Description</Typography>
                  <Typography variant="body2" sx={{ bgcolor: "#0F172A", p: 1.5, borderRadius: 1 }}>
                    {selectedLog.description || "No description provided"}
                  </Typography>
                </Grid>

                {selectedLog.beforeState && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Before State</Typography>
                    <Typography variant="body2" sx={{ bgcolor: "#0F172A", p: 1.5, borderRadius: 1, fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {selectedLog.beforeState}
                    </Typography>
                  </Grid>
                )}

                {selectedLog.afterState && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">After State</Typography>
                    <Typography variant="body2" sx={{ bgcolor: "#0F172A", p: 1.5, borderRadius: 1, fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {selectedLog.afterState}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Cryptographic SHA-256 Event Hash</Typography>
                  <Typography variant="body2" sx={{ bgcolor: "#0F172A", p: 1.5, borderRadius: 1, fontFamily: "monospace", fontSize: "0.75rem", color: "#22C55E", wordBreak: "break-all" }}>
                    {selectedLog.eventHash}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedLog(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

