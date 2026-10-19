package com.sentinelcore.assetservice.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sentinelcore.assetservice.dto.CveResponse;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.CveInUseException;
import com.sentinelcore.assetservice.exception.CveNotFoundException;
import com.sentinelcore.assetservice.exception.DuplicateCveException;
import com.sentinelcore.assetservice.exception.GlobalExceptionHandler;
import com.sentinelcore.assetservice.service.CveService;
import com.sentinelcore.assetservice.service.JwtService;

@WebMvcTest(CveController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class CveControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CveService cveService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void createCve_ReturnsCreated() throws Exception {
        when(cveService.createCve(any())).thenReturn(sampleResponse());

        mockMvc.perform(post("/api/cves")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.cveId").value("CVE-2024-3094"));
    }

    @Test
    void getAllCves_ReturnsOk() throws Exception {
        when(cveService.getAllCves()).thenReturn(List.of(sampleResponse()));

        mockMvc.perform(get("/api/cves"))
                .andExpect(status().isOk());
    }

    @Test
    void getCveById_ReturnsOk() throws Exception {
        UUID id = UUID.randomUUID();
        when(cveService.getCveById(id)).thenReturn(sampleResponse());

        mockMvc.perform(get("/api/cves/{id}", id))
                .andExpect(status().isOk());
    }

    @Test
    void getCveById_NotFound_Returns404() throws Exception {
        UUID id = UUID.randomUUID();
        when(cveService.getCveById(id)).thenThrow(new CveNotFoundException("CVE not found"));

        mockMvc.perform(get("/api/cves/{id}", id))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateCve_ReturnsOk() throws Exception {
        UUID id = UUID.randomUUID();
        when(cveService.updateCve(eq(id), any())).thenReturn(sampleResponse());

        mockMvc.perform(put("/api/cves/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest()))
                .andExpect(status().isOk());
    }

    @Test
    void deleteCve_ReturnsNoContent() throws Exception {
        UUID id = UUID.randomUUID();
        doNothing().when(cveService).deleteCve(id);

        mockMvc.perform(delete("/api/cves/{id}", id))
                .andExpect(status().isNoContent());
    }

    @Test
    void deleteCve_WhenInUse_ReturnsConflict() throws Exception {
        UUID id = UUID.randomUUID();
        doThrow(new CveInUseException("CVE is in use by vulnerabilities")).when(cveService).deleteCve(id);

        mockMvc.perform(delete("/api/cves/{id}", id))
                .andExpect(status().isConflict());
    }

    @Test
    void createCve_Duplicate_ReturnsConflict() throws Exception {
        when(cveService.createCve(any())).thenThrow(new DuplicateCveException("CVE already exists"));

        mockMvc.perform(post("/api/cves")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest()))
                .andExpect(status().isConflict());
    }

    @Test
    void createCve_InvalidInput_ReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/cves")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    private String validRequest() {
        return """
                {
                  "cveId": "CVE-2024-3094",
                  "cvssScore": 10.0,
                  "severity": "CRITICAL",
                  "description": "Backdoor in xz-utils upstream package",
                  "affectedSoftware": "xz-utils"
                }
                """;
    }

    private CveResponse sampleResponse() {
        return new CveResponse(
                UUID.randomUUID(),
                "CVE-2024-3094",
                BigDecimal.valueOf(10.0),
                VulnerabilitySeverity.CRITICAL,
                "Backdoor in xz-utils upstream package",
                "xz-utils",
                "5.6.0, 5.6.1",
                "Downgrade to 5.4.x",
                "https://nvd.nist.gov/vuln/detail/CVE-2024-3094",
                null,
                null,
                null,
                null);
    }
}
