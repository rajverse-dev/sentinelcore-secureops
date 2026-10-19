package com.sentinelcore.assetservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.assetservice.dto.SonarQubeFindingResponse;
import com.sentinelcore.assetservice.dto.SonarQubeImportRequest;
import com.sentinelcore.assetservice.dto.SonarQubeImportSummaryResponse;
import com.sentinelcore.assetservice.service.SonarQubeIntegrationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/integrations/sonarqube")
public class SonarQubeIntegrationController {

    private final SonarQubeIntegrationService sonarQubeIntegrationService;

    public SonarQubeIntegrationController(SonarQubeIntegrationService sonarQubeIntegrationService) {
        this.sonarQubeIntegrationService = sonarQubeIntegrationService;
    }

    @PostMapping("/import")
    public ResponseEntity<SonarQubeImportSummaryResponse> importFindings(
            @Valid @RequestBody SonarQubeImportRequest request) {
        return ResponseEntity.ok(sonarQubeIntegrationService.importFindings(request));
    }

    @GetMapping("/findings")
    public ResponseEntity<List<SonarQubeFindingResponse>> getFindings() {
        return ResponseEntity.ok(sonarQubeIntegrationService.getFindings());
    }

    @GetMapping("/projects/{projectKey}/findings")
    public ResponseEntity<List<SonarQubeFindingResponse>> getProjectFindings(
            @PathVariable String projectKey) {
        return ResponseEntity.ok(sonarQubeIntegrationService.getProjectFindings(projectKey));
    }
}
