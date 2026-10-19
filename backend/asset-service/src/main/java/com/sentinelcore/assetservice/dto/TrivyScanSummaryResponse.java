package com.sentinelcore.assetservice.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

public class TrivyScanSummaryResponse {

    private final UUID assetId;
    private final String assetIdentifier;
    private final String scanTarget;
    private final String status;
    private final LocalDateTime scannedAt;
    private final int parsedFindings;
    private final int createdFindings;
    private final int updatedFindings;
    private final int duplicateFindingsPrevented;
    private final int criticalCount;
    private final int highCount;
    private final int mediumCount;
    private final int lowCount;
    private final RiskAssessmentResponse riskAssessment;
    private final List<TrivyFindingResponse> findings;

    public TrivyScanSummaryResponse(
            UUID assetId,
            String assetIdentifier,
            String scanTarget,
            int parsedFindings,
            int createdFindings,
            int updatedFindings,
            int duplicateFindingsPrevented,
            RiskAssessmentResponse riskAssessment,
            List<TrivyFindingResponse> findings) {
        this(
                assetId,
                assetIdentifier,
                scanTarget,
                "SUCCESS",
                LocalDateTime.now(),
                parsedFindings,
                createdFindings,
                updatedFindings,
                duplicateFindingsPrevented,
                countSeverity(findings, VulnerabilitySeverity.CRITICAL),
                countSeverity(findings, VulnerabilitySeverity.HIGH),
                countSeverity(findings, VulnerabilitySeverity.MEDIUM),
                countSeverity(findings, VulnerabilitySeverity.LOW),
                riskAssessment,
                findings);
    }

    public TrivyScanSummaryResponse(
            UUID assetId,
            String assetIdentifier,
            String scanTarget,
            String status,
            LocalDateTime scannedAt,
            int parsedFindings,
            int createdFindings,
            int updatedFindings,
            int duplicateFindingsPrevented,
            int criticalCount,
            int highCount,
            int mediumCount,
            int lowCount,
            RiskAssessmentResponse riskAssessment,
            List<TrivyFindingResponse> findings) {
        this.assetId = assetId;
        this.assetIdentifier = assetIdentifier;
        this.scanTarget = scanTarget;
        this.status = status;
        this.scannedAt = scannedAt;
        this.parsedFindings = parsedFindings;
        this.createdFindings = createdFindings;
        this.updatedFindings = updatedFindings;
        this.duplicateFindingsPrevented = duplicateFindingsPrevented;
        this.criticalCount = criticalCount;
        this.highCount = highCount;
        this.mediumCount = mediumCount;
        this.lowCount = lowCount;
        this.riskAssessment = riskAssessment;
        this.findings = findings;
    }

    private static int countSeverity(List<TrivyFindingResponse> findings, VulnerabilitySeverity severity) {
        if (findings == null) return 0;
        return (int) findings.stream().filter(f -> f.getSeverity() == severity).count();
    }

    public UUID getAssetId() {
        return assetId;
    }

    public String getAssetIdentifier() {
        return assetIdentifier;
    }

    public String getScanTarget() {
        return scanTarget;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getScannedAt() {
        return scannedAt;
    }

    public int getParsedFindings() {
        return parsedFindings;
    }

    public int getCreatedFindings() {
        return createdFindings;
    }

    public int getUpdatedFindings() {
        return updatedFindings;
    }

    public int getDuplicateFindingsPrevented() {
        return duplicateFindingsPrevented;
    }

    public int getCriticalCount() {
        return criticalCount;
    }

    public int getHighCount() {
        return highCount;
    }

    public int getMediumCount() {
        return mediumCount;
    }

    public int getLowCount() {
        return lowCount;
    }

    public RiskAssessmentResponse getRiskAssessment() {
        return riskAssessment;
    }

    public List<TrivyFindingResponse> getFindings() {
        return findings;
    }
}
