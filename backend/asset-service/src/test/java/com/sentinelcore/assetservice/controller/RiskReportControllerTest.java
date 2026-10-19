package com.sentinelcore.assetservice.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sentinelcore.assetservice.dto.RiskReportResponse;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.exception.GlobalExceptionHandler;
import com.sentinelcore.assetservice.service.JwtService;
import com.sentinelcore.assetservice.service.RiskReportService;

@WebMvcTest(RiskReportController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class RiskReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RiskReportService riskReportService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void getCurrentReportReturnsOkWithReportData() throws Exception {
        UUID reportId = UUID.randomUUID();
        RiskReportResponse response = sampleReport(reportId);
        when(riskReportService.generateCurrentReport()).thenReturn(response);

        mockMvc.perform(get("/api/risk-reports/current"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reportId").value(reportId.toString()))
                .andExpect(jsonPath("$.generatedBy").value("admin@sentinelcore.com"))
                .andExpect(jsonPath("$.totalAssetsAssessed").value(4))
                .andExpect(jsonPath("$.totalVulnerabilities").value(10))
                .andExpect(jsonPath("$.criticalVulnerabilities").value(2))
                .andExpect(jsonPath("$.overallRiskScore").value(68.5))
                .andExpect(jsonPath("$.overallRiskCategory").value("HIGH"));
    }

    @Test
    void exportReportAsMarkdownReturnsAttachment() throws Exception {
        UUID reportId = UUID.randomUUID();
        RiskReportResponse response = sampleReport(reportId);
        when(riskReportService.generateCurrentReport()).thenReturn(response);
        when(riskReportService.exportReportAsMarkdown(any())).thenReturn("# SentinelCore Risk Report\nMarkdown content");

        mockMvc.perform(get("/api/risk-reports/export").param("format", "markdown"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Content-Disposition"))
                .andExpect(content().string("# SentinelCore Risk Report\nMarkdown content"));
    }

    @Test
    void exportReportAsJsonReturnsJsonAttachment() throws Exception {
        UUID reportId = UUID.randomUUID();
        RiskReportResponse response = sampleReport(reportId);
        when(riskReportService.generateCurrentReport()).thenReturn(response);

        mockMvc.perform(get("/api/risk-reports/export").param("format", "json"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Content-Disposition"))
                .andExpect(jsonPath("$.reportId").value(reportId.toString()));
    }

    @Test
    void downloadReportEndpointWorksAsAlias() throws Exception {
        UUID reportId = UUID.randomUUID();
        RiskReportResponse response = sampleReport(reportId);
        when(riskReportService.generateCurrentReport()).thenReturn(response);
        when(riskReportService.exportReportAsMarkdown(any())).thenReturn("Downloaded Report");

        mockMvc.perform(get("/api/risk-reports/download"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Content-Disposition"));
    }

    private RiskReportResponse sampleReport(UUID reportId) {
        return new RiskReportResponse(
                reportId,
                LocalDateTime.of(2026, 9, 16, 10, 0, 0),
                "admin@sentinelcore.com",
                "Enterprise Scope",
                "Executive Summary Sample",
                BigDecimal.valueOf(68.5),
                RiskLevel.HIGH,
                4,
                10,
                2,
                4,
                3,
                1,
                6,
                4,
                3,
                BigDecimal.valueOf(9.8),
                BigDecimal.valueOf(7.4),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                2);
    }
}