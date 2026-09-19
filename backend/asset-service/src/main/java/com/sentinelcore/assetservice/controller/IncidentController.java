package com.sentinelcore.assetservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.assetservice.dto.IncidentHistoryResponse;
import com.sentinelcore.assetservice.dto.IncidentRequest;
import com.sentinelcore.assetservice.dto.IncidentResponse;
import com.sentinelcore.assetservice.dto.IncidentStatusRequest;
import com.sentinelcore.assetservice.entity.IncidentSeverity;
import com.sentinelcore.assetservice.entity.IncidentStatus;
import com.sentinelcore.assetservice.service.IncidentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(@Valid @RequestBody IncidentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(incidentService.createIncident(request));
    }

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getIncidents(
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) IncidentSeverity severity) {
        return ResponseEntity.ok(incidentService.getIncidents(status, severity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncident(@PathVariable UUID id) {
        return ResponseEntity.ok(incidentService.getIncident(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentResponse> updateIncident(
            @PathVariable UUID id,
            @Valid @RequestBody IncidentRequest request) {
        return ResponseEntity.ok(incidentService.updateIncident(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody IncidentStatusRequest request) {
        return ResponseEntity.ok(incidentService.updateStatus(id, request));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<IncidentHistoryResponse>> getHistory(@PathVariable UUID id) {
        return ResponseEntity.ok(incidentService.getHistory(id));
    }
}