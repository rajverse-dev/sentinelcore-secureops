package com.sentinelcore.assetservice.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.dto.RiskReportResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.CveRecord;
import com.sentinelcore.assetservice.entity.Environment;
import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.SonarQubeFinding;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;
import com.sentinelcore.assetservice.repository.CveRecordRepository;
import com.sentinelcore.assetservice.repository.SonarQubeFindingRepository;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@ExtendWith(MockitoExtension.class)
class RiskReportServiceTest {

    @Mock
    private AssetService assetService;

    @Mock
    private VulnerabilityRepository vulnerabilityRepository;

    @Mock
    private RiskAssessmentService riskAssessmentService;

    @Mock
    private CveRecordRepository cveRecordRepository;

    @Mock
    private SonarQubeFindingRepository sonarQubeFindingRepository;

    @InjectMocks
    private RiskReportService riskReportService;

    private User currentUser;
    private Asset asset1;
    private Asset asset2;

    @BeforeEach
    void setUp() {
        currentUser = new User();
        currentUser.setId(UUID.randomUUID());
        currentUser.setEmail("security-officer@sentinelcore.com");

        asset1 = new Asset();
        asset1.setId(UUID.randomUUID());
        asset1.setIdentifier("PROD-SRV-001");
        asset1.setName("Payment Gateway Server");
        asset1.setEnvironment(Environment.PRODUCTION);
        asset1.setRiskLevel(RiskLevel.CRITICAL);
        asset1.setOwnerUser(currentUser);

        asset2 = new Asset();
        asset2.setId(UUID.randomUUID());
        asset2.setIdentifier("DEV-SRV-002");
        asset2.setName("Development Sandbox");
        asset2.setEnvironment(Environment.DEVELOPMENT);
        asset2.setRiskLevel(RiskLevel.LOW);
        asset2.setOwnerUser(currentUser);
    }

    @Test
    void generateCurrentReportPopulatesFullMetricsCorrectly() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(assetService.getAllAssets()).thenReturn(List.of(asset1, asset2));

        RiskAssessmentResponse ra1 = new RiskAssessmentResponse(
                asset1.getId(), asset1.getIdentifier(), asset1.getName(),
                RiskLevel.CRITICAL, Environment.PRODUCTION, BigDecimal.valueOf(85.50),
                RiskLevel.CRITICAL, 2, BigDecimal.valueOf(9.8), VulnerabilitySeverity.CRITICAL,
                BigDecimal.valueOf(98), BigDecimal.valueOf(4), BigDecimal.valueOf(87.5));

        RiskAssessmentResponse ra2 = new RiskAssessmentResponse(
                asset2.getId(), asset2.getIdentifier(), asset2.getName(),
                RiskLevel.LOW, Environment.DEVELOPMENT, BigDecimal.valueOf(25.00),
                RiskLevel.LOW, 1, BigDecimal.valueOf(5.0), VulnerabilitySeverity.LOW,
                BigDecimal.valueOf(20), BigDecimal.valueOf(2), BigDecimal.valueOf(37.5));

        when(riskAssessmentService.calculateAllRiskAssessments()).thenReturn(List.of(ra1, ra2));

        CveRecord cve1 = new CveRecord();
        cve1.setId(UUID.randomUUID());
        cve1.setCveId("CVE-2024-3094");
        cve1.setCvssScore(BigDecimal.valueOf(9.8));
        cve1.setSeverity(VulnerabilitySeverity.CRITICAL);
        cve1.setDescription("Backdoor in XZ Utils");
        cve1.setAffectedSoftware("xz-utils");
        cve1.setAffectedVersion("5.6.0");
        cve1.setOwnerUser(currentUser);

        CveRecord cve2 = new CveRecord();
        cve2.setId(UUID.randomUUID());
        cve2.setCveId("CVE-2024-21626");
        cve2.setCvssScore(BigDecimal.valueOf(8.6));
        cve2.setSeverity(VulnerabilitySeverity.HIGH);
        cve2.setDescription("runc container breakout");
        cve2.setAffectedSoftware("runc");
        cve2.setOwnerUser(currentUser);

        when(cveRecordRepository.findByOwnerUser(currentUser)).thenReturn(List.of(cve1, cve2));

        Vulnerability v1 = new Vulnerability();
        v1.setId(UUID.randomUUID());
        v1.setAsset(asset1);
        v1.setVulnerabilityIdentifier("CVE-2024-3094");
        v1.setTitle("Critical XZ Backdoor");
        v1.setSeverity(VulnerabilitySeverity.CRITICAL);
        v1.setStatus(VulnerabilityStatus.OPEN);
        v1.setPatchStatus(PatchStatus.OPEN);
        v1.setCveRecord(cve1);
        v1.setDueDate(LocalDate.now().plusDays(2));
        v1.setRemediation("Upgrade xz-utils to 5.6.1");

        Vulnerability v2 = new Vulnerability();
        v2.setId(UUID.randomUUID());
        v2.setAsset(asset1);
        v2.setVulnerabilityIdentifier("CVE-2024-21626");
        v2.setTitle("High container breakout");
        v2.setSeverity(VulnerabilitySeverity.HIGH);
        v2.setStatus(VulnerabilityStatus.IN_PROGRESS);
        v2.setPatchStatus(PatchStatus.PATCHING);
        v2.setCveRecord(cve2);
        v2.setDueDate(LocalDate.now().plusDays(5));
        v2.setRemediation("Update runc to 1.1.12");

        Vulnerability v3 = new Vulnerability();
        v3.setId(UUID.randomUUID());
        v3.setAsset(asset2);
        v3.setVulnerabilityIdentifier("VULN-003");
        v3.setTitle("Medium info disclosure");
        v3.setSeverity(VulnerabilitySeverity.MEDIUM);
        v3.setStatus(VulnerabilityStatus.RESOLVED);
        v3.setPatchStatus(PatchStatus.VERIFIED);

        when(vulnerabilityRepository.findByAssetOwnerUser(currentUser)).thenReturn(List.of(v1, v2, v3));

        SonarQubeFinding sqf = new SonarQubeFinding();
        sqf.setId(UUID.randomUUID());
        sqf.setAsset(asset1);
        sqf.setIssueKey("SQ-101");
        sqf.setRule("java:S2077");
        sqf.setSeverity(VulnerabilitySeverity.HIGH);
        sqf.setMessage("SQL Injection Vulnerability");
        sqf.setStatus("OPEN");
        sqf.setOwnerUser(currentUser);

        when(sonarQubeFindingRepository.findByOwnerUser(currentUser)).thenReturn(List.of(sqf));

        RiskReportResponse report = riskReportService.generateCurrentReport();

        assertNotNull(report);
        assertNotNull(report.getReportId());
        assertEquals(currentUser.getEmail(), report.getGeneratedBy());
        assertEquals(2, report.getTotalAssetsAssessed());
        assertEquals(3, report.getTotalVulnerabilities());

        // Severity Breakdown
        assertEquals(1, report.getCriticalVulnerabilities());
        assertEquals(1, report.getHighVulnerabilities());
        assertEquals(1, report.getMediumVulnerabilities());
        assertEquals(0, report.getLowVulnerabilities());

        // Status & Patch Breakdown
        assertEquals(2, report.getOpenVulnerabilities());
        assertEquals(1, report.getPatchedVulnerabilities());
        assertEquals(2, report.getPendingPatches());

        // CVSS
        assertEquals(BigDecimal.valueOf(9.8), report.getHighestCvssScore());
        assertEquals(BigDecimal.valueOf(9.20).setScale(2), report.getAverageCvssScore());

        // Overall risk score ( (85.50 + 25.00) / 2 = 55.25 )
        assertEquals(BigDecimal.valueOf(55.25), report.getOverallRiskScore());
        assertEquals(RiskLevel.HIGH, report.getOverallRiskCategory());

        // Lists
        assertEquals(2, report.getHighestRiskAssets().size());
        assertEquals("PROD-SRV-001", report.getHighestRiskAssets().get(0).getAssetIdentifier());
        assertEquals(2, report.getCveRecords().size());
        assertEquals(2, report.getPendingRemediations().size());
        assertEquals(1, report.getSonarQubeFindings().size());
        assertEquals(2, report.getTrivyFindingsCount());

        assertTrue(report.getExecutiveSummary().contains("Enterprise security assessment evaluated 2 infrastructure asset(s)"));
    }

    @Test
    void generateReportWithEmptyDatasetHandlesGracefully() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(assetService.getAllAssets()).thenReturn(List.of());
        when(riskAssessmentService.calculateAllRiskAssessments()).thenReturn(List.of());
        when(vulnerabilityRepository.findByAssetOwnerUser(currentUser)).thenReturn(List.of());
        when(cveRecordRepository.findByOwnerUser(currentUser)).thenReturn(List.of());
        when(sonarQubeFindingRepository.findByOwnerUser(currentUser)).thenReturn(List.of());

        RiskReportResponse report = riskReportService.generateCurrentReport();

        assertNotNull(report);
        assertEquals(0, report.getTotalAssetsAssessed());
        assertEquals(0, report.getTotalVulnerabilities());
        assertEquals(0, report.getCriticalVulnerabilities());
        assertEquals(0, report.getHighVulnerabilities());
        assertEquals(0, report.getOpenVulnerabilities());
        assertEquals(0, report.getPatchedVulnerabilities());
        assertEquals(BigDecimal.ZERO.setScale(2), report.getOverallRiskScore());
        assertEquals(RiskLevel.LOW, report.getOverallRiskCategory());
        assertNull(report.getHighestCvssScore());
        assertNull(report.getAverageCvssScore());
        assertTrue(report.getHighestRiskAssets().isEmpty());
        assertTrue(report.getCveRecords().isEmpty());
        assertTrue(report.getPendingRemediations().isEmpty());
        assertTrue(report.getExecutiveSummary().contains("No monitored assets"));
    }

    @Test
    void exportReportAsMarkdownProducesFormattedDocument() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(assetService.getAllAssets()).thenReturn(List.of(asset1));
        RiskAssessmentResponse ra = new RiskAssessmentResponse(
                asset1.getId(), asset1.getIdentifier(), asset1.getName(),
                RiskLevel.HIGH, Environment.PRODUCTION, BigDecimal.valueOf(70.0),
                RiskLevel.HIGH, 0, null, null, null, null, null);
        when(riskAssessmentService.calculateAllRiskAssessments()).thenReturn(List.of(ra));
        when(vulnerabilityRepository.findByAssetOwnerUser(currentUser)).thenReturn(List.of());
        when(cveRecordRepository.findByOwnerUser(currentUser)).thenReturn(List.of());
        when(sonarQubeFindingRepository.findByOwnerUser(currentUser)).thenReturn(List.of());

        RiskReportResponse report = riskReportService.generateCurrentReport();
        String markdown = riskReportService.exportReportAsMarkdown(report);

        assertNotNull(markdown);
        assertTrue(markdown.contains("# SentinelCore SecureOps - Risk Assessment Report"));
        assertTrue(markdown.contains("Payment Gateway Server"));
        assertTrue(markdown.contains("Total Assets Assessed | 1"));
    }

    @Test
    void ownerIsolationVerifiesOnlyCurrentUserScopedQueriesAreExecuted() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(assetService.getAllAssets()).thenReturn(List.of());
        when(riskAssessmentService.calculateAllRiskAssessments()).thenReturn(List.of());
        when(vulnerabilityRepository.findByAssetOwnerUser(currentUser)).thenReturn(List.of());
        when(cveRecordRepository.findByOwnerUser(currentUser)).thenReturn(List.of());
        when(sonarQubeFindingRepository.findByOwnerUser(currentUser)).thenReturn(List.of());

        riskReportService.generateCurrentReport();

        verify(vulnerabilityRepository).findByAssetOwnerUser(currentUser);
        verify(cveRecordRepository).findByOwnerUser(currentUser);
        verify(sonarQubeFindingRepository).findByOwnerUser(currentUser);
    }
}