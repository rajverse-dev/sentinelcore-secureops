package com.sentinelcore.assetservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.service.RiskAssessmentService;

@RestController
@RequestMapping("/api")
public class RiskAssessmentController {

    private final RiskAssessmentService riskAssessmentService;

    public RiskAssessmentController(RiskAssessmentService riskAssessmentService) {
        this.riskAssessmentService = riskAssessmentService;
    }

    @GetMapping("/assets/{assetId}/risk-assessment")
    public ResponseEntity<RiskAssessmentResponse> calculateRiskAssessment(
            @PathVariable UUID assetId) {
        return ResponseEntity.ok(riskAssessmentService.calculateRiskAssessment(assetId));
    }

    @GetMapping("/risk-assessments")
    public ResponseEntity<List<RiskAssessmentResponse>> calculateAllRiskAssessments() {
        return ResponseEntity.ok(riskAssessmentService.calculateAllRiskAssessments());
    }
}