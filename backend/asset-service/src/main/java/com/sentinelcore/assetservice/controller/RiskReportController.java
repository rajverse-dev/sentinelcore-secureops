package com.sentinelcore.assetservice.controller;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinelcore.assetservice.dto.RiskReportResponse;
import com.sentinelcore.assetservice.service.RiskReportService;

@RestController
@RequestMapping("/api/risk-reports")
public class RiskReportController {

    private final RiskReportService riskReportService;
    private final ObjectMapper objectMapper;

    public RiskReportController(RiskReportService riskReportService) {
        this.riskReportService = riskReportService;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
        this.objectMapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @GetMapping("/current")
    public ResponseEntity<RiskReportResponse> getCurrentReport() {
        return ResponseEntity.ok(riskReportService.generateCurrentReport());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportReport(
            @RequestParam(defaultValue = "markdown") String format) {
        RiskReportResponse report = riskReportService.generateCurrentReport();
        String timestamp = report.getGeneratedAt().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"));

        if ("json".equalsIgnoreCase(format)) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"risk-report-" + timestamp + ".json\"")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(toJsonBytes(report));
        }

        String markdown = riskReportService.exportReportAsMarkdown(report);
        byte[] content = markdown.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"risk-report-" + timestamp + ".md\"")
                .contentType(MediaType.TEXT_MARKDOWN)
                .body(content);
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadReport(
            @RequestParam(defaultValue = "markdown") String format) {
        return exportReport(format);
    }

    private byte[] toJsonBytes(RiskReportResponse report) {
        try {
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(report);
        } catch (Exception e) {
            return "{}".getBytes(StandardCharsets.UTF_8);
        }
    }
}