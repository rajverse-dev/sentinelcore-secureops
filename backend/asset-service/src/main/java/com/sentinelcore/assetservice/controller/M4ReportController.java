package com.sentinelcore.assetservice.controller;
import java.nio.charset.StandardCharsets; import java.time.LocalDate; import java.util.*;
import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
import com.sentinelcore.assetservice.service.M4ReportService;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController @RequestMapping("/api/reports")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
public class M4ReportController {

    private final M4ReportService service;
    public M4ReportController(M4ReportService s) { service = s; }

    @GetMapping("/access")
    public ResponseEntity<Map<String,Object>> access(
            @RequestParam(required=false) String from,
            @RequestParam(required=false) String to) {
        LocalDate fromDate = from != null ? LocalDate.parse(from) : null;
        LocalDate toDate = to != null ? LocalDate.parse(to) : null;
        return ResponseEntity.ok(service.generateAccessReport(fromDate, toDate));
    }

    @GetMapping("/security")
    public ResponseEntity<Map<String,Object>> security() {
        return ResponseEntity.ok(service.generateSecurityReport());
    }

    @GetMapping("/compliance/{frameworkId}")
    public ResponseEntity<Map<String,Object>> compliance(@PathVariable UUID frameworkId) {
        return ResponseEntity.ok(service.generateComplianceReport(frameworkId));
    }

    @GetMapping("/access/export")
    public ResponseEntity<byte[]> exportAccess(
            @RequestParam(required=false) String from,
            @RequestParam(required=false) String to,
            @RequestParam(defaultValue = "pdf") String format) {
        LocalDate fromDate = from != null ? LocalDate.parse(from) : null;
        LocalDate toDate = to != null ? LocalDate.parse(to) : null;
        byte[] pdfBytes = service.exportAccessReportAsPdf(fromDate, toDate);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"access-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/security/export")
    public ResponseEntity<byte[]> exportSecurity(@RequestParam(defaultValue = "pdf") String format) {
        byte[] pdfBytes = service.exportSecurityReportAsPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"security-report.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/compliance/{frameworkId}/export")
    public ResponseEntity<byte[]> exportCompliance(
            @PathVariable UUID frameworkId,
            @RequestParam(defaultValue = "csv") String format) {
        if ("pdf".equalsIgnoreCase(format)) {
            byte[] pdfBytes = service.exportComplianceReportAsPdf(frameworkId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"compliance-report-" + frameworkId + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        }

        String csv = service.exportComplianceReportAsCsv(frameworkId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"compliance-report-" + frameworkId + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }
}

