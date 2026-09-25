package com.sentinelcore.assetservice.service;

import java.time.LocalDate; import java.time.LocalDateTime; import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sentinelcore.assetservice.dto.*;
import com.sentinelcore.assetservice.entity.*;
import com.sentinelcore.assetservice.repository.*;

@Service
public class M4ReportService {

    private final AuditService auditService;
    private final AuditLogRepository auditLogRepository;
    private final ComplianceService complianceService;
    private final IncidentRepository incidentRepository;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final AssetService assetService;
    private final UserRepository userRepository;

    private final PdfReportGenerator pdfReportGenerator;

    public M4ReportService(AuditService auditService, AuditLogRepository auditLogRepository,
            ComplianceService complianceService, IncidentRepository incidentRepository,
            VulnerabilityRepository vulnerabilityRepository, AssetService assetService,
            UserRepository userRepository, PdfReportGenerator pdfReportGenerator) {
        this.auditService = auditService; this.auditLogRepository = auditLogRepository;
        this.complianceService = complianceService; this.incidentRepository = incidentRepository;
        this.vulnerabilityRepository = vulnerabilityRepository; this.assetService = assetService;
        this.userRepository = userRepository; this.pdfReportGenerator = pdfReportGenerator;
    }


    @Transactional(readOnly = true)
    public Map<String, Object> generateAccessReport(LocalDate from, LocalDate to) {
        LocalDateTime fromDt = from != null ? from.atStartOfDay() : LocalDateTime.now().minusDays(30);
        LocalDateTime toDt = to != null ? to.atTime(23, 59, 59) : LocalDateTime.now();

        long totalLogins = auditLogRepository.findFiltered("LOGIN", "USER", null, null, "SUCCESS",
                null, null, "AUTH", null, fromDt, toDt,
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements();
        long failedLogins = auditLogRepository.findFiltered("LOGIN", null, null, null, "FAILURE",
                null, null, "AUTH", null, fromDt, toDt,
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements();
        long totalRegistrations = auditLogRepository.findFiltered("REGISTER", null, null, null, null,
                null, null, "AUTH", null, fromDt, toDt,
                org.springframework.data.domain.PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements();
        long userCount = userRepository.count();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "ACCESS_REPORT");
        report.put("generatedAt", LocalDateTime.now());
        report.put("period", Map.of("from", fromDt, "to", toDt));
        report.put("totalUsers", userCount);
        report.put("successfulLogins", totalLogins);
        report.put("failedLogins", failedLogins);
        report.put("loginSuccessRate", (totalLogins + failedLogins) > 0 ? (totalLogins * 100.0 / (totalLogins + failedLogins)) : 0);
        report.put("newRegistrations", totalRegistrations);
        report.put("note", "Access report generated from audit trail. Values reflect authenticated users only.");
        return report;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> generateSecurityReport() {
        User user = assetService.getCurrentUser();
        Map<String, Object> auditSummary = auditService.getSummary();
        List<Incident> incidents = incidentRepository.findByOwnerUserOrderByDetectedAtDesc(user);
        List<Vulnerability> vulns = vulnerabilityRepository.findByAssetOwnerUser(user);

        long openIncidents = incidents.stream().filter(i -> i.getStatus() != IncidentStatus.RESOLVED).count();
        long criticalIncidents = incidents.stream().filter(i -> i.getSeverity() == IncidentSeverity.CRITICAL).count();
        long openVulns = vulns.stream().filter(v -> v.getStatus() != VulnerabilityStatus.RESOLVED).count();
        long criticalVulns = vulns.stream().filter(v -> v.getSeverity() == VulnerabilitySeverity.CRITICAL).count();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "SECURITY_REPORT");
        report.put("generatedAt", LocalDateTime.now());
        report.put("generatedBy", user.getEmail());
        report.put("auditSummary", auditSummary);
        report.put("incidents", Map.of("total", incidents.size(), "open", openIncidents, "critical", criticalIncidents));
        report.put("vulnerabilities", Map.of("total", vulns.size(), "open", openVulns, "critical", criticalVulns));
        return report;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> generateComplianceReport(UUID frameworkId) {
        ComplianceSummaryResponse summary = complianceService.summary(frameworkId);
        List<ComplianceGapItem> gaps = complianceService.gapAnalysis(frameworkId);
        Map<String, Object> report = new LinkedHashMap<>();
        report.put("reportType", "COMPLIANCE_REPORT");
        report.put("generatedAt", LocalDateTime.now());
        report.put("frameworkId", frameworkId);
        report.put("frameworkName", summary.frameworkName());
        report.put("compliancePercentage", summary.percentage());
        report.put("totalControls", summary.controls());
        report.put("compliantControls", summary.compliant());
        report.put("partialControls", summary.partial());
        report.put("nonCompliantControls", summary.nonCompliant());
        report.put("notAssessedControls", summary.notAssessed());
        report.put("gaps", gaps);
        report.put("disclaimer", "This report reflects a compliance assessment posture only. It does not constitute formal certification.");
        return report;
    }

    public String exportComplianceReportAsCsv(UUID frameworkId) {
        Map<String, Object> report = generateComplianceReport(frameworkId);
        List<ComplianceGapItem> gaps = complianceService.gapAnalysis(frameworkId);
        StringBuilder sb = new StringBuilder();
        sb.append("Framework,Compliance %,Total Controls,Compliant,Partial,Non-Compliant,Not Assessed\n");
        sb.append(report.get("frameworkName")).append(",")
          .append(String.format("%.1f", report.get("compliancePercentage"))).append(",")
          .append(report.get("totalControls")).append(",")
          .append(report.get("compliantControls")).append(",")
          .append(report.get("partialControls")).append(",")
          .append(report.get("nonCompliantControls")).append(",")
          .append(report.get("notAssessedControls")).append("\n\n");
        sb.append("Gap Analysis\n");
        sb.append("Control ID,Title,Status,Evidence Count,Last Review,Gap Reason\n");
        for (ComplianceGapItem g : gaps) {
            sb.append("\"").append(g.controlRef()).append("\",")
              .append("\"").append(g.title()).append("\",")
              .append(g.status()).append(",")
              .append(g.evidenceCount()).append(",")
              .append(g.lastReviewedAt() != null ? g.lastReviewedAt().toLocalDate() : "Never").append(",")
              .append("\"").append(g.gapReason()).append("\"").append("\n");
        }
        return sb.toString();
    }

    public byte[] exportComplianceReportAsPdf(UUID frameworkId) {
        Map<String, Object> report = generateComplianceReport(frameworkId);
        List<ComplianceGapItem> gaps = complianceService.gapAnalysis(frameworkId);
        return pdfReportGenerator.generateCompliancePdf(report, gaps);
    }

    public byte[] exportAccessReportAsPdf(LocalDate from, LocalDate to) {
        Map<String, Object> report = generateAccessReport(from, to);
        return pdfReportGenerator.generateAccessPdf(report);
    }

    public byte[] exportSecurityReportAsPdf() {
        Map<String, Object> report = generateSecurityReport();
        return pdfReportGenerator.generateSecurityPdf(report);
    }
}

