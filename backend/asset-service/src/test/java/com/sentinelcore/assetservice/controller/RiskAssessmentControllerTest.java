package com.sentinelcore.assetservice.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.entity.Environment;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.AssetNotFoundException;
import com.sentinelcore.assetservice.exception.GlobalExceptionHandler;
import com.sentinelcore.assetservice.service.JwtService;
import com.sentinelcore.assetservice.service.RiskAssessmentService;

@WebMvcTest(RiskAssessmentController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class RiskAssessmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RiskAssessmentService riskAssessmentService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void getRiskAssessmentReturnsOk() throws Exception {
        UUID assetId = UUID.randomUUID();
        when(riskAssessmentService.calculateRiskAssessment(assetId)).thenReturn(response(assetId));

        mockMvc.perform(get("/api/assets/{assetId}/risk-assessment", assetId))
                .andExpect(status().isOk());
    }

    @Test
    void getAllRiskAssessmentsReturnsOk() throws Exception {
        when(riskAssessmentService.calculateAllRiskAssessments()).thenReturn(List.of(response(UUID.randomUUID())));

        mockMvc.perform(get("/api/risk-assessments"))
                .andExpect(status().isOk());
    }

            @Test
            void unknownAssetReturnsNotFound() throws Exception {
            UUID assetId = UUID.randomUUID();
            when(riskAssessmentService.calculateRiskAssessment(assetId))
                .thenThrow(new AssetNotFoundException("Asset not found with id: " + assetId));

            mockMvc.perform(get("/api/assets/{assetId}/risk-assessment", assetId))
                .andExpect(status().isNotFound());
            }

    private RiskAssessmentResponse response(UUID assetId) {
        return new RiskAssessmentResponse(
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
    }
}