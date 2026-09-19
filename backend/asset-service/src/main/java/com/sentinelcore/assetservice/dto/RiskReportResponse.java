package com.sentinelcore.assetservice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.RiskLevel;

public class RiskReportResponse {

    private UUID reportId;
    private LocalDateTime generatedAt;
    private String generatedBy;
    private String scope;
    private String executiveSummary;
    private BigDecimal overallRiskScore;
    private RiskLevel overallRiskCategory;

    private int totalAssetsAssessed;
    private int totalVulnerabilities;
    private int criticalVulnerabilities;
    private int highVulnerabilities;
    private int mediumVulnerabilities;
    private int lowVulnerabilities;
    private int openVulnerabilities;
    private int patchedVulnerabilities;
    private int pendingPatches;

    private BigDecimal highestCvssScore;
    private BigDecimal averageCvssScore;

    private List<RiskAssessmentResponse> highestRiskAssets;
    private List<CveResponse> cveRecords;
    private List<RemediationItemResponse> pendingRemediations;
    private List<SonarQubeFindingResponse> sonarQubeFindings;
    private int trivyFindingsCount;

    public RiskReportResponse() {
    }

    public RiskReportResponse(
            UUID reportId,
            LocalDateTime generatedAt,
            String generatedBy,
            String scope,
            String executiveSummary,
            BigDecimal overallRiskScore,
            RiskLevel overallRiskCategory,
            int totalAssetsAssessed,
            int totalVulnerabilities,
            int criticalVulnerabilities,
            int highVulnerabilities,
            int mediumVulnerabilities,
            int lowVulnerabilities,
            int openVulnerabilities,
            int patchedVulnerabilities,
            int pendingPatches,
            BigDecimal highestCvssScore,
            BigDecimal averageCvssScore,
            List<RiskAssessmentResponse> highestRiskAssets,
            List<CveResponse> cveRecords,
            List<RemediationItemResponse> pendingRemediations,
            List<SonarQubeFindingResponse> sonarQubeFindings,
            int trivyFindingsCount) {
        this.reportId = reportId;
        this.generatedAt = generatedAt;
        this.generatedBy = generatedBy;
        this.scope = scope;
        this.executiveSummary = executiveSummary;
        this.overallRiskScore = overallRiskScore;
        this.overallRiskCategory = overallRiskCategory;
        this.totalAssetsAssessed = totalAssetsAssessed;
        this.totalVulnerabilities = totalVulnerabilities;
        this.criticalVulnerabilities = criticalVulnerabilities;
        this.highVulnerabilities = highVulnerabilities;
        this.mediumVulnerabilities = mediumVulnerabilities;
        this.lowVulnerabilities = lowVulnerabilities;
        this.openVulnerabilities = openVulnerabilities;
        this.patchedVulnerabilities = patchedVulnerabilities;
        this.pendingPatches = pendingPatches;
        this.highestCvssScore = highestCvssScore;
        this.averageCvssScore = averageCvssScore;
        this.highestRiskAssets = highestRiskAssets;
        this.cveRecords = cveRecords;
        this.pendingRemediations = pendingRemediations;
        this.sonarQubeFindings = sonarQubeFindings;
        this.trivyFindingsCount = trivyFindingsCount;
    }

    public UUID getReportId() {
        return reportId;
    }

    public void setReportId(UUID reportId) {
        this.reportId = reportId;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getGeneratedBy() {
        return generatedBy;
    }

    public void setGeneratedBy(String generatedBy) {
        this.generatedBy = generatedBy;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(String executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public BigDecimal getOverallRiskScore() {
        return overallRiskScore;
    }

    public void setOverallRiskScore(BigDecimal overallRiskScore) {
        this.overallRiskScore = overallRiskScore;
    }

    public RiskLevel getOverallRiskCategory() {
        return overallRiskCategory;
    }

    public void setOverallRiskCategory(RiskLevel overallRiskCategory) {
        this.overallRiskCategory = overallRiskCategory;
    }

    public int getTotalAssetsAssessed() {
        return totalAssetsAssessed;
    }

    public void setTotalAssetsAssessed(int totalAssetsAssessed) {
        this.totalAssetsAssessed = totalAssetsAssessed;
    }

    public int getTotalVulnerabilities() {
        return totalVulnerabilities;
    }

    public void setTotalVulnerabilities(int totalVulnerabilities) {
        this.totalVulnerabilities = totalVulnerabilities;
    }

    public int getCriticalVulnerabilities() {
        return criticalVulnerabilities;
    }

    public void setCriticalVulnerabilities(int criticalVulnerabilities) {
        this.criticalVulnerabilities = criticalVulnerabilities;
    }

    public int getHighVulnerabilities() {
        return highVulnerabilities;
    }

    public void setHighVulnerabilities(int highVulnerabilities) {
        this.highVulnerabilities = highVulnerabilities;
    }

    public int getMediumVulnerabilities() {
        return mediumVulnerabilities;
    }

    public void setMediumVulnerabilities(int mediumVulnerabilities) {
        this.mediumVulnerabilities = mediumVulnerabilities;
    }

    public int getLowVulnerabilities() {
        return lowVulnerabilities;
    }

    public void setLowVulnerabilities(int lowVulnerabilities) {
        this.lowVulnerabilities = lowVulnerabilities;
    }

    public int getOpenVulnerabilities() {
        return openVulnerabilities;
    }

    public void setOpenVulnerabilities(int openVulnerabilities) {
        this.openVulnerabilities = openVulnerabilities;
    }

    public int getPatchedVulnerabilities() {
        return patchedVulnerabilities;
    }

    public void setPatchedVulnerabilities(int patchedVulnerabilities) {
        this.patchedVulnerabilities = patchedVulnerabilities;
    }

    public int getPendingPatches() {
        return pendingPatches;
    }

    public void setPendingPatches(int pendingPatches) {
        this.pendingPatches = pendingPatches;
    }

    public BigDecimal getHighestCvssScore() {
        return highestCvssScore;
    }

    public void setHighestCvssScore(BigDecimal highestCvssScore) {
        this.highestCvssScore = highestCvssScore;
    }

    public BigDecimal getAverageCvssScore() {
        return averageCvssScore;
    }

    public void setAverageCvssScore(BigDecimal averageCvssScore) {
        this.averageCvssScore = averageCvssScore;
    }

    public List<RiskAssessmentResponse> getHighestRiskAssets() {
        return highestRiskAssets;
    }

    public void setHighestRiskAssets(List<RiskAssessmentResponse> highestRiskAssets) {
        this.highestRiskAssets = highestRiskAssets;
    }

    public List<CveResponse> getCveRecords() {
        return cveRecords;
    }

    public void setCveRecords(List<CveResponse> cveRecords) {
        this.cveRecords = cveRecords;
    }

    public List<RemediationItemResponse> getPendingRemediations() {
        return pendingRemediations;
    }

    public void setPendingRemediations(List<RemediationItemResponse> pendingRemediations) {
        this.pendingRemediations = pendingRemediations;
    }

    public List<SonarQubeFindingResponse> getSonarQubeFindings() {
        return sonarQubeFindings;
    }

    public void setSonarQubeFindings(List<SonarQubeFindingResponse> sonarQubeFindings) {
        this.sonarQubeFindings = sonarQubeFindings;
    }

    public int getTrivyFindingsCount() {
        return trivyFindingsCount;
    }

    public void setTrivyFindingsCount(int trivyFindingsCount) {
        this.trivyFindingsCount = trivyFindingsCount;
    }
}