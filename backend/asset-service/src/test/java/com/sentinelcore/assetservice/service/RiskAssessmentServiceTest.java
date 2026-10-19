package com.sentinelcore.assetservice.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.Environment;
import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@ExtendWith(MockitoExtension.class)
class RiskAssessmentServiceTest {

    @Mock
    private VulnerabilityRepository vulnerabilityRepository;

    @Mock
    private AssetService assetService;

    private RiskAssessmentService riskAssessmentService;
    private Asset asset;

    @BeforeEach
    void setUp() {
        riskAssessmentService = new RiskAssessmentService(vulnerabilityRepository, assetService);
        asset = asset(RiskLevel.HIGH, Environment.PRODUCTION);
        lenient().when(assetService.getOwnedAsset(asset.getId())).thenReturn(asset);
    }

    @Test
    void noVulnerabilitiesReturnsZeroAndLow() {
        givenVulnerabilities();

        RiskAssessmentResponse response = riskAssessmentService.calculateRiskAssessment(asset.getId());

        assertEquals(BigDecimal.ZERO.setScale(2), response.getRiskScore());
        assertEquals(RiskLevel.LOW, response.getRiskCategory());
        assertEquals(0, response.getOpenVulnerabilityCount());
        assertEquals(BigDecimal.valueOf(87.5).setScale(2), response.getAssetContextScore());
    }

    @Test
    void cvss98IsUsedAndCriticalVulnerabilityIsIncluded() {
        Vulnerability vulnerability = vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.CRITICAL, BigDecimal.valueOf(9.8));
        givenVulnerabilities(vulnerability);

        RiskAssessmentResponse response = riskAssessmentService.calculateRiskAssessment(asset.getId());

        assertEquals(BigDecimal.valueOf(9.8), response.getHighestCvssScore());
        assertEquals(BigDecimal.valueOf(98).setScale(2), response.getVulnerabilityImpact());
        assertEquals(BigDecimal.valueOf(76.7).setScale(2), response.getRiskScore());
        assertEquals(RiskLevel.CRITICAL, response.getRiskCategory());
    }

    @Test
    void highestCvssIsSelectedAmongActiveVulnerabilities() {
        Vulnerability lower = vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.HIGH, BigDecimal.valueOf(7.5));
        Vulnerability higher = vulnerability(VulnerabilityStatus.IN_PROGRESS, VulnerabilitySeverity.CRITICAL, BigDecimal.valueOf(9.8));
        givenVulnerabilities(lower, higher);

        RiskAssessmentResponse response = riskAssessmentService.calculateRiskAssessment(asset.getId());

        assertEquals(BigDecimal.valueOf(9.8), response.getHighestCvssScore());
        assertEquals(BigDecimal.valueOf(98).setScale(2), response.getVulnerabilityImpact());
        assertEquals(2, response.getOpenVulnerabilityCount());
    }

    @Test
    void severityFallbackIsUsedWhenCveAndCvssAreUnavailable() {
        Vulnerability vulnerability = vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.MEDIUM, null);
        givenVulnerabilities(vulnerability);

        RiskAssessmentResponse response = riskAssessmentService.calculateRiskAssessment(asset.getId());

        assertEquals(null, response.getHighestCvssScore());
        assertEquals(BigDecimal.valueOf(50).setScale(2), response.getVulnerabilityImpact());
    }

    @Test
    void criticalSeverityFallbackReturns100() {
        assertFallbackImpact(VulnerabilitySeverity.CRITICAL, 100);
    }

    @Test
    void highSeverityFallbackReturns80() {
        assertFallbackImpact(VulnerabilitySeverity.HIGH, 80);
    }

    @Test
    void mediumSeverityFallbackReturns50() {
        assertFallbackImpact(VulnerabilitySeverity.MEDIUM, 50);
    }

    @Test
    void lowSeverityFallbackReturns20() {
        assertFallbackImpact(VulnerabilitySeverity.LOW, 20);
    }

    @Test
    void resolvedAndAcceptedVulnerabilitiesAreExcluded() {
        Vulnerability resolved = vulnerability(VulnerabilityStatus.RESOLVED, VulnerabilitySeverity.CRITICAL, BigDecimal.valueOf(10));
        Vulnerability accepted = vulnerability(VulnerabilityStatus.ACCEPTED, VulnerabilitySeverity.CRITICAL, BigDecimal.valueOf(10));
        givenVulnerabilities(resolved, accepted);

        RiskAssessmentResponse response = riskAssessmentService.calculateRiskAssessment(asset.getId());

        assertEquals(0, response.getOpenVulnerabilityCount());
        assertEquals(BigDecimal.ZERO.setScale(2), response.getRiskScore());
        assertEquals(RiskLevel.LOW, response.getRiskCategory());
    }

    @Test
    void inProgressVulnerabilitiesAreIncluded() {
        Vulnerability vulnerability = vulnerability(VulnerabilityStatus.IN_PROGRESS, VulnerabilitySeverity.HIGH, null);
        givenVulnerabilities(vulnerability);

        assertEquals(1, riskAssessmentService.calculateRiskAssessment(asset.getId()).getOpenVulnerabilityCount());
    }

    @Test
    void patchingRemainsActiveButPatchedAndVerifiedAreExcluded() {
        Vulnerability patching = vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.HIGH, null);
        patching.setPatchStatus(PatchStatus.PATCHING);
        Vulnerability patched = vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.CRITICAL, BigDecimal.TEN);
        patched.setPatchStatus(PatchStatus.PATCHED);
        Vulnerability verified = vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.CRITICAL, BigDecimal.TEN);
        verified.setPatchStatus(PatchStatus.VERIFIED);
        givenVulnerabilities(patching, patched, verified);

        RiskAssessmentResponse response = riskAssessmentService.calculateRiskAssessment(asset.getId());

        assertEquals(1, response.getOpenVulnerabilityCount());
        assertEquals(VulnerabilitySeverity.HIGH, response.getHighestSeverity());
    }

    @Test
    void productionEnvironmentAffectsAssetContext() {
        Asset testingAsset = asset(RiskLevel.LOW, Environment.TESTING);
        when(assetService.getOwnedAsset(testingAsset.getId())).thenReturn(testingAsset);
        when(vulnerabilityRepository.findByAssetId(testingAsset.getId())).thenReturn(List.of());

        RiskAssessmentResponse response = riskAssessmentService.calculateRiskAssessment(testingAsset.getId());

        assertEquals(BigDecimal.valueOf(25).setScale(2), response.getAssetContextScore());
        assertEquals(Environment.TESTING, response.getEnvironment());
    }

    @Test
    void assetRiskLevelAffectsAssetContext() {
        Asset lowRiskAsset = asset(RiskLevel.LOW, Environment.PRODUCTION);
        when(assetService.getOwnedAsset(lowRiskAsset.getId())).thenReturn(lowRiskAsset);
        when(vulnerabilityRepository.findByAssetId(lowRiskAsset.getId())).thenReturn(List.of());

        RiskAssessmentResponse response = riskAssessmentService.calculateRiskAssessment(lowRiskAsset.getId());

        assertEquals(BigDecimal.valueOf(62.5).setScale(2), response.getAssetContextScore());
        assertEquals(RiskLevel.LOW, response.getAssetRiskLevel());
    }

    @Test
    void finalScoreIsDeterministicAndRoundedToTwoDecimalPlaces() {
        Vulnerability vulnerability = vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.HIGH, BigDecimal.valueOf(8.765));
        givenVulnerabilities(vulnerability);

        RiskAssessmentResponse first = riskAssessmentService.calculateRiskAssessment(asset.getId());
        RiskAssessmentResponse second = riskAssessmentService.calculateRiskAssessment(asset.getId());

        assertEquals(first.getRiskScore(), second.getRiskScore());
        assertEquals(2, first.getRiskScore().scale());
    }

    @Test
    void scoreNeverExceeds100() {
        List<Vulnerability> vulnerabilities = java.util.stream.IntStream.range(0, 15)
                .mapToObj(index -> vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.CRITICAL, BigDecimal.TEN))
                .toList();
        givenVulnerabilities(vulnerabilities.toArray(new Vulnerability[0]));

        assertTrue(riskAssessmentService.calculateRiskAssessment(asset.getId()).getRiskScore()
                .compareTo(BigDecimal.valueOf(100)) <= 0);
    }

    @Test
    void categoryThresholdsAreApplied() {
        Asset mediumAsset = asset(RiskLevel.LOW, Environment.TESTING);
        when(assetService.getOwnedAsset(mediumAsset.getId())).thenReturn(mediumAsset);
        when(vulnerabilityRepository.findByAssetId(mediumAsset.getId()))
                .thenReturn(List.of(vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.MEDIUM, null)));
        assertEquals(RiskLevel.MEDIUM, riskAssessmentService.calculateRiskAssessment(mediumAsset.getId()).getRiskCategory());

        Asset highAsset = asset(RiskLevel.LOW, Environment.TESTING);
        when(assetService.getOwnedAsset(highAsset.getId())).thenReturn(highAsset);
        when(vulnerabilityRepository.findByAssetId(highAsset.getId()))
                .thenReturn(List.of(vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.HIGH, null)));
        assertEquals(RiskLevel.HIGH, riskAssessmentService.calculateRiskAssessment(highAsset.getId()).getRiskCategory());

        Asset criticalAsset = asset(RiskLevel.HIGH, Environment.PRODUCTION);
        when(assetService.getOwnedAsset(criticalAsset.getId())).thenReturn(criticalAsset);
        when(vulnerabilityRepository.findByAssetId(criticalAsset.getId()))
                .thenReturn(List.of(vulnerability(VulnerabilityStatus.OPEN, VulnerabilitySeverity.CRITICAL, null)));
        assertEquals(RiskLevel.CRITICAL, riskAssessmentService.calculateRiskAssessment(criticalAsset.getId()).getRiskCategory());
    }

    @Test
    void calculatesAllOwnedAssets() {
        Asset secondAsset = asset(RiskLevel.LOW, Environment.DEVELOPMENT);
        when(assetService.getAllAssets()).thenReturn(List.of(asset, secondAsset));
        when(vulnerabilityRepository.findByAssetId(asset.getId())).thenReturn(List.of());
        when(vulnerabilityRepository.findByAssetId(secondAsset.getId())).thenReturn(List.of());

        assertEquals(2, riskAssessmentService.calculateAllRiskAssessments().size());
    }

    @Test
    void crossUserAssetAccessIsRejectedByOwnedAssetResolution() {
        UUID assetId = UUID.randomUUID();
        when(assetService.getOwnedAsset(assetId)).thenThrow(new RuntimeException("Asset not found"));

        assertThrows(RuntimeException.class, () -> riskAssessmentService.calculateRiskAssessment(assetId));
    }

    private void assertFallbackImpact(VulnerabilitySeverity severity, int expectedImpact) {
        givenVulnerabilities(vulnerability(VulnerabilityStatus.OPEN, severity, null));

        assertEquals(BigDecimal.valueOf(expectedImpact).setScale(2),
                riskAssessmentService.calculateRiskAssessment(asset.getId()).getVulnerabilityImpact());
    }

    private void givenVulnerabilities(Vulnerability... vulnerabilities) {
        when(vulnerabilityRepository.findByAssetId(asset.getId())).thenReturn(List.of(vulnerabilities));
    }

    private Asset asset(RiskLevel riskLevel, Environment environment) {
        Asset result = new Asset();
        result.setId(UUID.randomUUID());
        result.setOwnerUser(new User("Alice", "alice@example.com", "password", "USER", true));
        result.setIdentifier("asset-" + result.getId());
        result.setName("Test asset");
        result.setRiskLevel(riskLevel);
        result.setEnvironment(environment);
        return result;
    }

    private Vulnerability vulnerability(
            VulnerabilityStatus status,
            VulnerabilitySeverity severity,
            BigDecimal cvssScore) {
        Vulnerability result = new Vulnerability();
        result.setAsset(asset);
        result.setStatus(status);
        result.setSeverity(severity);
        if (cvssScore != null) {
            com.sentinelcore.assetservice.entity.CveRecord cveRecord = new com.sentinelcore.assetservice.entity.CveRecord();
            cveRecord.setCvssScore(cvssScore);
            result.setCveRecord(cveRecord);
        }
        return result;
    }
}