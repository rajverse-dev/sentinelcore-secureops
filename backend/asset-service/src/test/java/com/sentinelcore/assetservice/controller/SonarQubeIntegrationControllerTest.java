package com.sentinelcore.assetservice.controller;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sentinelcore.assetservice.dto.SonarQubeFindingResponse;
import com.sentinelcore.assetservice.dto.SonarQubeImportSummaryResponse;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.GlobalExceptionHandler;
import com.sentinelcore.assetservice.exception.InvalidSonarQubeResponseException;
import com.sentinelcore.assetservice.exception.SonarQubeConfigurationException;
import com.sentinelcore.assetservice.exception.SonarQubeUnavailableException;
import com.sentinelcore.assetservice.service.JwtService;
import com.sentinelcore.assetservice.service.SonarQubeIntegrationService;

@WebMvcTest(SonarQubeIntegrationController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class SonarQubeIntegrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SonarQubeIntegrationService sonarQubeIntegrationService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void importFindingsReturnsSummary() throws Exception {
        when(sonarQubeIntegrationService.importFindings(any()))
                .thenReturn(sampleSummary());

        mockMvc.perform(post("/api/integrations/sonarqube/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectKey": "sentinel-backend"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectKey").value("sentinel-backend"))
                .andExpect(jsonPath("$.importedFindings").value(1));
    }

    @Test
    void importFindingsValidationFailureReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/integrations/sonarqube/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void importFindingsWhenSonarUnavailableReturnsServiceUnavailable() throws Exception {
        when(sonarQubeIntegrationService.importFindings(any()))
                .thenThrow(new SonarQubeUnavailableException("SonarQube is down"));

        mockMvc.perform(post("/api/integrations/sonarqube/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectKey": "sentinel-backend"
                                }
                                """))
                .andExpect(status().isServiceUnavailable());
    }

    @Test
    void importFindingsWhenConfigurationMissingReturnsServiceUnavailable() throws Exception {
        when(sonarQubeIntegrationService.importFindings(any()))
                .thenThrow(new SonarQubeConfigurationException("SonarQube token missing"));

        mockMvc.perform(post("/api/integrations/sonarqube/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectKey": "sentinel-backend"
                                }
                                """))
                .andExpect(status().isServiceUnavailable());
    }

    @Test
    void importFindingsWhenResponseInvalidReturnsBadRequest() throws Exception {
        when(sonarQubeIntegrationService.importFindings(any()))
                .thenThrow(new InvalidSonarQubeResponseException("Bad JSON"));

        mockMvc.perform(post("/api/integrations/sonarqube/import")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "projectKey": "sentinel-backend"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getFindingsReturnsOk() throws Exception {
        when(sonarQubeIntegrationService.getFindings())
                .thenReturn(List.of(sampleFinding()));

        mockMvc.perform(get("/api/integrations/sonarqube/findings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].issueKey").value("AX-1"));
    }

    @Test
    void getProjectFindingsReturnsOk() throws Exception {
        when(sonarQubeIntegrationService.getProjectFindings("sentinel-backend"))
                .thenReturn(List.of(sampleFinding()));

        mockMvc.perform(get("/api/integrations/sonarqube/projects/sentinel-backend/findings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].projectKey").value("sentinel-backend"));
    }

    private SonarQubeFindingResponse sampleFinding() {
        return new SonarQubeFindingResponse(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "asset-1",
                "AX-1",
                "java:S2083",
                VulnerabilitySeverity.HIGH,
                "Review path injection",
                "src/Main.java",
                42,
                "OPEN",
                "sentinel-backend",
                null,
                null,
                null,
                null);
    }

    private SonarQubeImportSummaryResponse sampleSummary() {
        return new SonarQubeImportSummaryResponse(
                "sentinel-backend",
                1,
                1,
                0,
                0,
                List.of(sampleFinding()));
    }
}
