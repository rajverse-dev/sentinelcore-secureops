package com.sentinelcore.assetservice.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.Environment;
import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@Service
public class RiskAssessmentService {

    private static final BigDecimal TEN = BigDecimal.TEN;
    private static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);
    private static final BigDecimal MAX_OPEN_VULNERABILITIES = BigDecimal.TEN;
    private static final BigDecimal PRESSURE_WEIGHT = BigDecimal.valueOf(0.20);
    private static final BigDecimal IMPACT_WEIGHT = BigDecimal.valueOf(0.60);
    private static final BigDecimal CONTEXT_WEIGHT = BigDecimal.valueOf(0.20);

    private static final Map<RiskLevel, BigDecimal> ASSET_RISK_SCORES = new EnumMap<>(RiskLevel.class);
    private static final Map<Environment, BigDecimal> ENVIRONMENT_SCORES = new EnumMap<>(Environment.class);
    private static final Map<VulnerabilitySeverity, BigDecimal> SEVERITY_SCORES = new EnumMap<>(VulnerabilitySeverity.class);

    static {
        ASSET_RISK_SCORES.put(RiskLevel.LOW, BigDecimal.valueOf(25));
        ASSET_RISK_SCORES.put(RiskLevel.MEDIUM, BigDecimal.valueOf(50));
        ASSET_RISK_SCORES.put(RiskLevel.HIGH, BigDecimal.valueOf(75));
        ASSET_RISK_SCORES.put(RiskLevel.CRITICAL, ONE_HUNDRED);

        ENVIRONMENT_SCORES.put(Environment.PRODUCTION, ONE_HUNDRED);
        ENVIRONMENT_SCORES.put(Environment.STAGING, BigDecimal.valueOf(75));
        ENVIRONMENT_SCORES.put(Environment.DEVELOPMENT, BigDecimal.valueOf(50));
        ENVIRONMENT_SCORES.put(Environment.TESTING, BigDecimal.valueOf(25));
        ENVIRONMENT_SCORES.put(Environment.OTHER, BigDecimal.valueOf(25));

        SEVERITY_SCORES.put(VulnerabilitySeverity.CRITICAL, ONE_HUNDRED);
        SEVERITY_SCORES.put(VulnerabilitySeverity.HIGH, BigDecimal.valueOf(80));
        SEVERITY_SCORES.put(VulnerabilitySeverity.MEDIUM, BigDecimal.valueOf(50));
        SEVERITY_SCORES.put(VulnerabilitySeverity.LOW, BigDecimal.valueOf(20));
    }

    private final VulnerabilityRepository vulnerabilityRepository;
    private final AssetService assetService;

    public RiskAssessmentService(
            VulnerabilityRepository vulnerabilityRepository,
            AssetService assetService) {
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.assetService = assetService;
    }

    @Transactional(readOnly = true)
    public RiskAssessmentResponse calculateRiskAssessment(UUID assetId) {
        Asset asset = assetService.getOwnedAsset(assetId);
        List<Vulnerability> vulnerabilities = vulnerabilityRepository.findByAssetId(assetId);
        return calculateAssessment(asset, vulnerabilities);
    }

    @Transactional(readOnly = true)
    public List<RiskAssessmentResponse> calculateAllRiskAssessments() {
        return assetService.getAllAssets().stream()
                .map(asset -> calculateAssessment(
                        asset,
                        vulnerabilityRepository.findByAssetId(asset.getId())))
                .toList();
    }

    private RiskAssessmentResponse calculateAssessment(Asset asset, List<Vulnerability> vulnerabilities) {
        List<Vulnerability> activeVulnerabilities = vulnerabilities.stream()
                .filter(this::isActive)
                .toList();

        BigDecimal highestImpact = BigDecimal.ZERO;
        BigDecimal highestCvssScore = null;
        VulnerabilitySeverity highestSeverity = null;

        for (Vulnerability vulnerability : activeVulnerabilities) {
            BigDecimal impact = calculateImpact(vulnerability);
            if (impact.compareTo(highestImpact) > 0) {
                highestImpact = impact;
            }

            if (vulnerability.getCveRecord() != null
                    && vulnerability.getCveRecord().getCvssScore() != null
                    && (highestCvssScore == null
                            || vulnerability.getCveRecord().getCvssScore().compareTo(highestCvssScore) > 0)) {
                highestCvssScore = vulnerability.getCveRecord().getCvssScore();
            }

            if (isHigherSeverity(vulnerability.getSeverity(), highestSeverity)) {
                highestSeverity = vulnerability.getSeverity();
            }
        }

        BigDecimal openVulnerabilityPressure = calculateOpenVulnerabilityPressure(activeVulnerabilities.size());
        BigDecimal assetContextScore = calculateAssetContext(asset);
        BigDecimal riskScore = activeVulnerabilities.isEmpty()
                ? BigDecimal.ZERO.setScale(2)
                : highestImpact.multiply(IMPACT_WEIGHT)
                        .add(openVulnerabilityPressure.multiply(PRESSURE_WEIGHT))
                        .add(assetContextScore.multiply(CONTEXT_WEIGHT))
                        .min(ONE_HUNDRED)
                        .setScale(2, RoundingMode.HALF_UP);

        return new RiskAssessmentResponse(
                asset.getId(),
                asset.getIdentifier(),
                asset.getName(),
                asset.getRiskLevel(),
                asset.getEnvironment(),
                riskScore,
                determineRiskCategory(riskScore),
                activeVulnerabilities.size(),
                highestCvssScore,
                highestSeverity,
                highestImpact.setScale(2, RoundingMode.HALF_UP),
                openVulnerabilityPressure.setScale(2, RoundingMode.HALF_UP),
                assetContextScore.setScale(2, RoundingMode.HALF_UP));
    }

    private boolean isActive(Vulnerability vulnerability) {
        boolean activeVulnerability = vulnerability.getStatus() == VulnerabilityStatus.OPEN
            || vulnerability.getStatus() == VulnerabilityStatus.IN_PROGRESS;
        PatchStatus patchStatus = vulnerability.getPatchStatus();
        boolean patchComplete = patchStatus == PatchStatus.PATCHED
            || patchStatus == PatchStatus.VERIFIED;
        return activeVulnerability && !patchComplete;
    }

    private BigDecimal calculateImpact(Vulnerability vulnerability) {
        if (vulnerability.getCveRecord() != null
                && vulnerability.getCveRecord().getCvssScore() != null) {
            return vulnerability.getCveRecord().getCvssScore().multiply(TEN);
        }
        return SEVERITY_SCORES.getOrDefault(vulnerability.getSeverity(), BigDecimal.ZERO);
    }

    private BigDecimal calculateOpenVulnerabilityPressure(int openVulnerabilityCount) {
        BigDecimal normalizedCount = BigDecimal.valueOf(openVulnerabilityCount)
                .divide(MAX_OPEN_VULNERABILITIES, 4, RoundingMode.HALF_UP)
                .min(BigDecimal.ONE);
        return normalizedCount.multiply(BigDecimal.valueOf(20));
    }

    private BigDecimal calculateAssetContext(Asset asset) {
        BigDecimal assetRiskScore = ASSET_RISK_SCORES.getOrDefault(asset.getRiskLevel(), BigDecimal.ZERO);
        BigDecimal environmentScore = ENVIRONMENT_SCORES.getOrDefault(asset.getEnvironment(), BigDecimal.ZERO);
        return assetRiskScore.add(environmentScore).divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP);
    }

    private boolean isHigherSeverity(
            VulnerabilitySeverity candidate,
            VulnerabilitySeverity current) {
        if (candidate == null) {
            return false;
        }
        if (current == null) {
            return true;
        }
        return SEVERITY_SCORES.get(candidate).compareTo(SEVERITY_SCORES.get(current)) > 0;
    }

    private RiskLevel determineRiskCategory(BigDecimal score) {
        if (score.compareTo(BigDecimal.valueOf(75)) >= 0) {
            return RiskLevel.CRITICAL;
        }
        if (score.compareTo(BigDecimal.valueOf(50)) >= 0) {
            return RiskLevel.HIGH;
        }
        if (score.compareTo(BigDecimal.valueOf(25)) >= 0) {
            return RiskLevel.MEDIUM;
        }
        return RiskLevel.LOW;
    }
}