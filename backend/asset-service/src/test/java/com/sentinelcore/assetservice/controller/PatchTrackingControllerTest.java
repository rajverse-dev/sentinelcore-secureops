package com.sentinelcore.assetservice.controller;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sentinelcore.assetservice.dto.PatchTrackingResponse;
import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;
import com.sentinelcore.assetservice.exception.GlobalExceptionHandler;
import com.sentinelcore.assetservice.exception.InvalidPatchTransitionException;
import com.sentinelcore.assetservice.service.JwtService;
import com.sentinelcore.assetservice.service.PatchTrackingService;
import com.sentinelcore.assetservice.service.VulnerabilityService;

@WebMvcTest(VulnerabilityController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class PatchTrackingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VulnerabilityService vulnerabilityService;

    @MockitoBean
    private PatchTrackingService patchTrackingService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void updatePatchStatusReturnsOk() throws Exception {
        UUID id = UUID.randomUUID();
        when(patchTrackingService.updatePatchStatus(eq(id), any())).thenReturn(response(id));

        mockMvc.perform(patch("/api/vulnerabilities/{id}/patch-status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"PATCHING\",\"patchVersion\":\"1.2.3\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void getPatchTrackingReturnsOk() throws Exception {
        UUID id = UUID.randomUUID();
        when(patchTrackingService.getPatchTracking(id)).thenReturn(response(id));

        mockMvc.perform(get("/api/vulnerabilities/{id}/patch", id))
                .andExpect(status().isOk());
    }

    @Test
    void invalidTransitionReturnsBadRequest() throws Exception {
        UUID id = UUID.randomUUID();
        when(patchTrackingService.updatePatchStatus(eq(id), any()))
                .thenThrow(new InvalidPatchTransitionException("Invalid patch transition"));

        mockMvc.perform(patch("/api/vulnerabilities/{id}/patch-status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"PATCHED\"}"))
                .andExpect(status().isBadRequest());
    }

    private PatchTrackingResponse response(UUID id) {
        return new PatchTrackingResponse(
                id,
                VulnerabilityStatus.OPEN,
                PatchStatus.PATCHING,
                null,
                null,
                null,
                "1.2.3",
                null,
                null,
                "security-team");
    }
}