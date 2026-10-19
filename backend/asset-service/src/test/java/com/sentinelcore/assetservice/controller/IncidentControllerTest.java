package com.sentinelcore.assetservice.controller;

import java.util.List;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sentinelcore.assetservice.dto.IncidentResponse;
import com.sentinelcore.assetservice.entity.IncidentSeverity;
import com.sentinelcore.assetservice.entity.IncidentStatus;
import com.sentinelcore.assetservice.exception.GlobalExceptionHandler;
import com.sentinelcore.assetservice.exception.IncidentNotFoundException;
import com.sentinelcore.assetservice.service.IncidentService;
import com.sentinelcore.assetservice.service.JwtService;

@WebMvcTest(IncidentController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class IncidentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IncidentService incidentService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void createIncidentReturnsCreated() throws Exception {
        when(incidentService.createIncident(any())).thenReturn(response());

        mockMvc.perform(post("/api/incidents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest()))
                .andExpect(status().isCreated());
    }

    @Test
    void getIncidentsReturnsOk() throws Exception {
        when(incidentService.getIncidents(null, null)).thenReturn(List.of(response()));

        mockMvc.perform(get("/api/incidents"))
                .andExpect(status().isOk());
    }

    @Test
    void updateStatusReturnsOk() throws Exception {
        UUID id = UUID.randomUUID();
        when(incidentService.updateStatus(eq(id), any())).thenReturn(response());

        mockMvc.perform(patch("/api/incidents/{id}/status", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"INVESTIGATING\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void invalidRequestReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/incidents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void unknownIncidentReturnsNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(incidentService.getIncident(id)).thenThrow(new IncidentNotFoundException("Incident not found"));

        mockMvc.perform(get("/api/incidents/{id}", id))
                .andExpect(status().isNotFound());
    }

    private String validRequest() {
        return """
                {
                  "incidentIdentifier": "INC-2024-1247",
                  "title": "Failed login attempts",
                  "description": "Multiple failed login attempts detected",
                  "severity": "HIGH",
                  "assignedTeam": "Security Team"
                }
                """;
    }

    private IncidentResponse response() {
        return new IncidentResponse(
                UUID.randomUUID(), "INC-2024-1247", null, null, null,
                "Failed login attempts", "Multiple failed login attempts detected",
                IncidentSeverity.HIGH, IncidentStatus.NEW, "Security Team", null,
                null, null, false, null, null, null, null);
    }
}