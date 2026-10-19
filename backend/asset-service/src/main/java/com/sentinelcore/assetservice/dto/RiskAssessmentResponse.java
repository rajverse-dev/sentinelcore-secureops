package com.sentinelcore.assetservice.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.Environment;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

public class RiskAssessmentResponse {

    private UUID assetId;
    private String assetIdentifier;
    private String assetName;
    private RiskLevel assetRiskLevel;
    private Environment environment;
    private BigDecimal riskScore;
    private RiskLevel riskCategory;
    private int openVulnerabilityCount;
    private BigDecimal highestCvssScore;
    private VulnerabilitySeverity highestSeverity;
    private BigDecimal vulnerabilityImpact;
    private BigDecimal openVulnerabilityPressure;
    private BigDecimal assetContextScore;

    public RiskAssessmentResponse() {
    }

    public RiskAssessmentResponse(
            UUID assetId,
            String assetIdentifier,
            String assetName,
            RiskLevel assetRiskLevel,
            Environment environment,
            BigDecimal riskScore,
            RiskLevel riskCategory,
            int openVulnerabilityCount,
            BigDecimal highestCvssScore,
            VulnerabilitySeverity highestSeverity,
            BigDecimal vulnerabilityImpact,
            BigDecimal openVulnerabilityPressure,
            BigDecimal assetContextScore) {
        this.assetId = assetId;
        this.assetIdentifier = assetIdentifier;
        this.assetName = assetName;
        this.assetRiskLevel = assetRiskLevel;
        this.environment = environment;
        this.riskScore = riskScore;
        this.riskCategory = riskCategory;
        this.openVulnerabilityCount = openVulnerabilityCount;
        this.highestCvssScore = highestCvssScore;
        this.highestSeverity = highestSeverity;
        this.vulnerabilityImpact = vulnerabilityImpact;
        this.openVulnerabilityPressure = openVulnerabilityPressure;
        this.assetContextScore = assetContextScore;
    }

    public UUID getAssetId() {
        return assetId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
    }

    public String getAssetIdentifier() {
        return assetIdentifier;
    }

    public void setAssetIdentifier(String assetIdentifier) {
        this.assetIdentifier = assetIdentifier;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public RiskLevel getAssetRiskLevel() {
        return assetRiskLevel;
    }

    public void setAssetRiskLevel(RiskLevel assetRiskLevel) {
        this.assetRiskLevel = assetRiskLevel;
    }

    public Environment getEnvironment() {
        return environment;
    }

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    public BigDecimal getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(BigDecimal riskScore) {
        this.riskScore = riskScore;
    }

    public RiskLevel getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(RiskLevel riskCategory) {
        this.riskCategory = riskCategory;
    }

    public int getOpenVulnerabilityCount() {
        return openVulnerabilityCount;
    }

    public void setOpenVulnerabilityCount(int openVulnerabilityCount) {
        this.openVulnerabilityCount = openVulnerabilityCount;
    }

    public BigDecimal getHighestCvssScore() {
        return highestCvssScore;
    }

    public void setHighestCvssScore(BigDecimal highestCvssScore) {
        this.highestCvssScore = highestCvssScore;
    }

    public VulnerabilitySeverity getHighestSeverity() {
        return highestSeverity;
    }

    public void setHighestSeverity(VulnerabilitySeverity highestSeverity) {
        this.highestSeverity = highestSeverity;
    }

    public BigDecimal getVulnerabilityImpact() {
        return vulnerabilityImpact;
    }

    public void setVulnerabilityImpact(BigDecimal vulnerabilityImpact) {
        this.vulnerabilityImpact = vulnerabilityImpact;
    }

    public BigDecimal getOpenVulnerabilityPressure() {
        return openVulnerabilityPressure;
    }

    public void setOpenVulnerabilityPressure(BigDecimal openVulnerabilityPressure) {
        this.openVulnerabilityPressure = openVulnerabilityPressure;
    }

    public BigDecimal getAssetContextScore() {
        return assetContextScore;
    }

    public void setAssetContextScore(BigDecimal assetContextScore) {
        this.assetContextScore = assetContextScore;
    }
}