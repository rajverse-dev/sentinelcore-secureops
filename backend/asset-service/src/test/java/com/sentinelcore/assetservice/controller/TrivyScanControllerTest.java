package com.sentinelcore.assetservice.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.dto.TrivyFindingResponse;
import com.sentinelcore.assetservice.dto.TrivyScanSummaryResponse;
import com.sentinelcore.assetservice.entity.Environment;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.GlobalExceptionHandler;
import com.sentinelcore.assetservice.exception.InvalidTrivyScanException;
import com.sentinelcore.assetservice.service.JwtService;
import com.sentinelcore.assetservice.service.TrivyScanService;

@WebMvcTest(TrivyScanController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class TrivyScanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TrivyScanService trivyScanService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void processTrivyScanReturnsSummary() throws Exception {
        when(trivyScanService.processScan(any())).thenReturn(summary());

        mockMvc.perform(post("/api/scans/trivy")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest()))
                .andExpect(status().isOk());
    }

    @Test
    void invalidScanResultReturnsBadRequest() throws Exception {
        when(trivyScanService.processScan(any()))
                .thenThrow(new InvalidTrivyScanException("Invalid Trivy JSON"));

        mockMvc.perform(post("/api/scans/trivy")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest()))
                .andExpect(status().isBadRequest());
    }

    @Test
    void validationFailureReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/scans/trivy")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    private String validRequest() {
        return """
                {
                  "assetId": "%s",
                  "scanTarget": "approved-image",
                  "trivyJson": "{\\"Results\\":[]}"
                }
                """.formatted(UUID.randomUUID());
    }

    private TrivyScanSummaryResponse summary() {
        UUID assetId = UUID.randomUUID();
        RiskAssessmentResponse risk = new RiskAssessmentResponse(
                assetId,
                "asset-1",
                "Test asset",
                RiskLevel.HIGH,
                Environment.PRODUCTION,
                BigDecimal.valueOf(64.20),
                RiskLevel.HIGH,
                1,
                BigDecimal.valueOf(9.8),
                VulnerabilitySeverity.CRITICAL,
                BigDecimal.valueOf(98),
                BigDecimal.valueOf(2),
                BigDecimal.valueOf(87.5));

        return new TrivyScanSummaryResponse(
                assetId,
                "asset-1",
                "approved-image",
                1,
                1,
                0,
                0,
                risk,
                List.of(new TrivyFindingResponse(
                        UUID.randomUUID(),
                        "CVE-2026-1234",
                        VulnerabilitySeverity.HIGH,
                        "openssl",
                        "1.1.1k",
                        "1.1.1u",
                        true)));
    }
}
