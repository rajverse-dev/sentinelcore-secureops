import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PageHeader from "../components/PageHeader";
import { securityReviewApi } from "../services/api";
import AccentMetricCard from "../components/AccentMetricCard";

export default function SecurityReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    scope: "",
    reviewPeriod: "",
    findings: "",
    anomalies: "",
    comments: ""
  });

  const load = () => {
    securityReviewApi.getReviews()
      .then((r) => setReviews(r.data || []))
      .catch((e) => setError(e.response?.data?.message || e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    try {
      await securityReviewApi.createReview(form);
      setOpenCreate(false);
      setForm({ scope: "", reviewPeriod: "", findings: "", anomalies: "", comments: "" });
      load();
    } catch (e: any) {
      setError(e.response?.data?.message || e.message);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await securityReviewApi.approve(id, approvalComments || "Approved via Security Review workflow");
      setSelectedReview(null);
      setApprovalComments("");
      load();
    } catch (e: any) {
      alert("Approval failed: " + (e.response?.data?.message || e.message));
    }
  };

  const handleReject = async (id: string) => {
    try {
      await securityReviewApi.reject(id, approvalComments || "Rejected via Security Review workflow");
      setSelectedReview(null);
      setApprovalComments("");
      load();
    } catch (e: any) {
      alert("Rejection failed: " + (e.response?.data?.message || e.message));
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "COMPLETED": return "success";
      case "PENDING":
      case "IN_REVIEW": return "warning";
      case "REJECTED": return "error";
      default: return "default";
    }
  };

  return (
    <>
      <PageHeader
        title="Security Reviews & Approvals"
        subtitle="Review security posture, findings, anomalies, and formal approval/rejection workflows"
      />

      <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenCreate(true)} sx={{ mb: 3 }}>
        New Security Review
      </Button>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <AccentMetricCard
            label="Total Reviews"
            value={reviews.length}
            subtitle="Security review register"
            color="#38BDF8"
            icon={<FactCheckIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AccentMetricCard
            label="Pending Action"
            value={reviews.filter((r) => r.status === "PENDING" || r.status === "IN_REVIEW").length}
            subtitle="Awaiting review / sign-off"
            color="#F59E0B"
            icon={<PendingActionsIcon />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <AccentMetricCard
            label="Approved & Completed"
            value={reviews.filter((r) => r.status === "APPROVED" || r.status === "COMPLETED").length}
            subtitle="Approved security reviews"
            color="#22C55E"
            icon={<CheckCircleIcon />}
          />
        </Grid>
      </Grid>

      {/* Table */}
      <Card sx={{ overflow: "hidden", borderColor: "#334155" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#101827" }}>
              <TableCell sx={{ color: "#94A3B8" }}>Scope</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Period</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Status</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Reviewer</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Date</TableCell>
              <TableCell sx={{ color: "#94A3B8" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#94A3B8" }}>
                  No security reviews registered. Click "New Security Review" to initiate one.
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{review.scope}</TableCell>
                  <TableCell>{review.reviewPeriod}</TableCell>
                  <TableCell>
                    <Chip label={review.status} color={statusColor(review.status) as any} size="small" />
                  </TableCell>
                  <TableCell>{review.reviewer}</TableCell>
                  <TableCell sx={{ fontSize: "0.85rem" }}>
                    {review.reviewDate ? new Date(review.reviewDate).toLocaleString() : ""}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => { setSelectedReview(review); setApprovalComments(""); }}
                    >
                      View / Action
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Security Review</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField label="Scope (e.g. Q3 Infrastructure Posture)" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} fullWidth />
            <TextField label="Review Period (e.g. Q3 2026)" value={form.reviewPeriod} onChange={(e) => setForm({ ...form, reviewPeriod: e.target.value })} fullWidth />
            <TextField label="Key Findings" multiline minRows={2} value={form.findings} onChange={(e) => setForm({ ...form, findings: e.target.value })} fullWidth />
            <TextField label="Detected Anomalies" multiline minRows={2} value={form.anomalies} onChange={(e) => setForm({ ...form, anomalies: e.target.value })} fullWidth />
            <TextField label="Auditor Comments" multiline minRows={2} value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={create}>Submit Review</Button>
        </DialogActions>
      </Dialog>

      {/* View & Action Detail Dialog */}
      <Dialog open={Boolean(selectedReview)} onClose={() => setSelectedReview(null)} fullWidth maxWidth="md">
        {selectedReview && (
          <>
            <DialogTitle sx={{ borderBottom: "1px solid #334155" }}>
              Security Review Detail — {selectedReview.scope}
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Reviewer</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedReview.reviewer}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Review Period</Typography>
                  <Typography variant="body2">{selectedReview.reviewPeriod}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={selectedReview.status} color={statusColor(selectedReview.status) as any} size="small" />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Review Date</Typography>
                  <Typography variant="body2">{selectedReview.reviewDate ? new Date(selectedReview.reviewDate).toLocaleString() : "N/A"}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Findings Summary</Typography>
                  <Typography variant="body2" sx={{ bgcolor: "#0F172A", p: 1.5, borderRadius: 1 }}>
                    {selectedReview.findings || "No specific findings logged."}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Anomalies Detected</Typography>
                  <Typography variant="body2" sx={{ bgcolor: "#0F172A", p: 1.5, borderRadius: 1 }}>
                    {selectedReview.anomalies || "No anomalies flagged."}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Comments / Reason</Typography>
                  <Typography variant="body2" sx={{ bgcolor: "#0F172A", p: 1.5, borderRadius: 1 }}>
                    {selectedReview.comments || "No comments."}
                  </Typography>
                </Grid>
              </Grid>

              {/* Approval action area if PENDING */}
              {(selectedReview.status === "PENDING" || selectedReview.status === "IN_REVIEW") && (
                <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed #334155" }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "#38BDF8" }}>
                    Critical Action Approval Workflow
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    label="Sign-off notes / comments"
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<ThumbUpIcon />}
                      onClick={() => handleApprove(selectedReview.id)}
                    >
                      Approve Review
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<ThumbDownIcon />}
                      onClick={() => handleReject(selectedReview.id)}
                    >
                      Reject Review
                    </Button>
                  </Stack>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedReview(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

