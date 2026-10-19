package com.sentinelcore.assetservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.dto.TrivyScanRequest;
import com.sentinelcore.assetservice.dto.TrivyScanSummaryResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.Environment;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.CveRecord;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.AssetNotFoundException;
import com.sentinelcore.assetservice.repository.CveRecordRepository;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@ExtendWith(MockitoExtension.class)
class TrivyScanServiceTest {

    @Mock
    private AssetService assetService;

    @Mock
    private CveRecordRepository cveRecordRepository;

    @Mock
    private VulnerabilityRepository vulnerabilityRepository;

    @Mock
    private RiskAssessmentService riskAssessmentService;

    @Mock
    private TrivyExecutionService trivyExecutionService;

    private TrivyScanService trivyScanService;
    private User currentUser;
    private Asset asset;

    @BeforeEach
    void setUp() {
        trivyScanService = new TrivyScanService(
                new TrivyJsonParser(),
                trivyExecutionService,
                assetService,
                cveRecordRepository,
                vulnerabilityRepository,
                riskAssessmentService);
        currentUser = new User("Alice", "alice@example.com", "password", "USER", true);
        currentUser.setId(UUID.randomUUID());
        asset = asset();
    }

    @Test
    void createsCveAndVulnerabilityFromTrivyFinding() {
        TrivyScanRequest request = request(sampleJson("HIGH"));
        when(assetService.getOwnedAsset(asset.getId())).thenReturn(asset);
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(cveRecordRepository.findByCveIdIgnoreCaseAndOwnerUser("CVE-2026-1234", currentUser))
                .thenReturn(Optional.empty());
        when(cveRecordRepository.save(any(CveRecord.class))).thenAnswer(invocation -> {
            CveRecord cve = invocation.getArgument(0);
            cve.setId(UUID.randomUUID());
            return cve;
        });
        when(vulnerabilityRepository.findByAssetIdAndVulnerabilityIdentifierAndAffectedComponent(
                asset.getId(), "CVE-2026-1234", "openssl"))
                .thenReturn(Optional.empty());
        when(vulnerabilityRepository.save(any(Vulnerability.class))).thenAnswer(invocation -> {
            Vulnerability vulnerability = invocation.getArgument(0);
            vulnerability.setId(UUID.randomUUID());
            return vulnerability;
        });
        when(riskAssessmentService.calculateRiskAssessment(asset.getId())).thenReturn(riskResponse());

        TrivyScanSummaryResponse response = trivyScanService.processScan(request);

        assertEquals(1, response.getParsedFindings());
        assertEquals(1, response.getCreatedFindings());
        assertEquals(0, response.getUpdatedFindings());
        assertEquals("1.1.1u", response.getFindings().get(0).getFixedVersion());
        verify(vulnerabilityRepository).save(any(Vulnerability.class));
    }

    @Test
    void correlatesExistingCveAndPreventsDuplicateVulnerability() {
        TrivyScanRequest request = request(sampleJson("CRITICAL"));
        CveRecord existingCve = cve("CVE-2026-1234");
        Vulnerability existingVulnerability = vulnerability(existingCve);

        when(assetService.getOwnedAsset(asset.getId())).thenReturn(asset);
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(cveRecordRepository.findByCveIdIgnoreCaseAndOwnerUser("CVE-2026-1234", currentUser))
                .thenReturn(Optional.of(existingCve));
        when(cveRecordRepository.save(existingCve)).thenReturn(existingCve);
        when(vulnerabilityRepository.findByAssetIdAndVulnerabilityIdentifierAndAffectedComponent(
                asset.getId(), "CVE-2026-1234", "openssl"))
                .thenReturn(Optional.of(existingVulnerability));
        when(vulnerabilityRepository.save(existingVulnerability)).thenReturn(existingVulnerability);
        when(riskAssessmentService.calculateRiskAssessment(asset.getId())).thenReturn(riskResponse());

        TrivyScanSummaryResponse response = trivyScanService.processScan(request);

        assertEquals(0, response.getCreatedFindings());
        assertEquals(1, response.getUpdatedFindings());
        assertEquals(1, response.getDuplicateFindingsPrevented());
        assertEquals(VulnerabilitySeverity.CRITICAL, existingVulnerability.getSeverity());
        assertEquals("1.1.1u", existingVulnerability.getPatchVersion());
    }

    @Test
    void ownerIsolationRequiresOwnedAsset() {
        UUID otherAssetId = UUID.randomUUID();
        TrivyScanRequest request = request(sampleJson("LOW"));
        request.setAssetId(otherAssetId);
        when(assetService.getOwnedAsset(otherAssetId))
                .thenThrow(new AssetNotFoundException("Asset not found with id: " + otherAssetId));

        assertThrows(AssetNotFoundException.class, () -> trivyScanService.processScan(request));
        verify(vulnerabilityRepository, never()).save(any());
    }

    @Test
    void calculatesRiskAssessmentAfterScan() {
        TrivyScanRequest request = request(sampleJson("MEDIUM"));
        when(assetService.getOwnedAsset(asset.getId())).thenReturn(asset);
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(cveRecordRepository.findByCveIdIgnoreCaseAndOwnerUser("CVE-2026-1234", currentUser))
                .thenReturn(Optional.empty());
        when(cveRecordRepository.save(any(CveRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(vulnerabilityRepository.findByAssetIdAndVulnerabilityIdentifierAndAffectedComponent(
                eq(asset.getId()), eq("CVE-2026-1234"), eq("openssl")))
                .thenReturn(Optional.empty());
        when(vulnerabilityRepository.save(any(Vulnerability.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(riskAssessmentService.calculateRiskAssessment(asset.getId())).thenReturn(riskResponse());

        TrivyScanSummaryResponse response = trivyScanService.processScan(request);

        assertEquals(RiskLevel.HIGH, response.getRiskAssessment().getRiskCategory());
        verify(riskAssessmentService).calculateRiskAssessment(asset.getId());
    }

    @Test
    void executesTrivyWhenJsonOmitted() {
        TrivyScanRequest request = new TrivyScanRequest();
        request.setAssetId(asset.getId());
        request.setScanTarget("image-prod-1");

        when(assetService.getOwnedAsset(asset.getId())).thenReturn(asset);
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(trivyExecutionService.executeScan("image-prod-1")).thenReturn(sampleJson("HIGH"));
        when(cveRecordRepository.findByCveIdIgnoreCaseAndOwnerUser("CVE-2026-1234", currentUser))
                .thenReturn(Optional.empty());
        when(cveRecordRepository.save(any(CveRecord.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(vulnerabilityRepository.findByAssetIdAndVulnerabilityIdentifierAndAffectedComponent(
                eq(asset.getId()), eq("CVE-2026-1234"), eq("openssl")))
                .thenReturn(Optional.empty());
        when(vulnerabilityRepository.save(any(Vulnerability.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(riskAssessmentService.calculateRiskAssessment(asset.getId())).thenReturn(riskResponse());

        TrivyScanSummaryResponse response = trivyScanService.processScan(request);

        assertEquals(1, response.getParsedFindings());
        verify(trivyExecutionService).executeScan("image-prod-1");
    }

    private TrivyScanRequest request(String trivyJson) {
        TrivyScanRequest request = new TrivyScanRequest();
        request.setAssetId(asset.getId());
        request.setScanTarget("approved-image");
        request.setTrivyJson(trivyJson);
        return request;
    }

    private Asset asset() {
        Asset testAsset = new Asset();
        testAsset.setId(UUID.randomUUID());
        testAsset.setIdentifier("image-prod-1");
        testAsset.setName("Production image");
        testAsset.setEnvironment(Environment.PRODUCTION);
        testAsset.setRiskLevel(RiskLevel.HIGH);
        testAsset.setOwnerUser(currentUser);
        return testAsset;
    }

    private CveRecord cve(String cveId) {
        CveRecord cve = new CveRecord();
        cve.setId(UUID.randomUUID());
        cve.setOwnerUser(currentUser);
        cve.setCveId(cveId);
        cve.setCvssScore(BigDecimal.valueOf(7.5));
        cve.setSeverity(VulnerabilitySeverity.HIGH);
        cve.setDescription("Existing description");
        cve.setAffectedSoftware("openssl");
        return cve;
    }

    private Vulnerability vulnerability(CveRecord cve) {
        Vulnerability vulnerability = new Vulnerability();
        vulnerability.setId(UUID.randomUUID());
        vulnerability.setAsset(asset);
        vulnerability.setCveRecord(cve);
        vulnerability.setVulnerabilityIdentifier(cve.getCveId());
        vulnerability.setTitle("Existing title");
        vulnerability.setDescription("Existing description");
        vulnerability.setSeverity(VulnerabilitySeverity.HIGH);
        vulnerability.setAffectedComponent("openssl");
        return vulnerability;
    }

    private RiskAssessmentResponse riskResponse() {
        return new RiskAssessmentResponse(
                asset.getId(),
                asset.getIdentifier(),
                asset.getName(),
                RiskLevel.HIGH,
                Environment.PRODUCTION,
                BigDecimal.valueOf(64.20),
                RiskLevel.HIGH,
                1,
                BigDecimal.valueOf(9.8),
                VulnerabilitySeverity.CRITICAL,
                BigDecimal.valueOf(98),
                BigDecimal.valueOf(2),
                BigDecimal.valueOf(87.5));
    }

    private String sampleJson(String severity) {
        return """
                {
                  "Results": [
                    {
                      "Vulnerabilities": [
                        {
                          "VulnerabilityID": "CVE-2026-1234",
                          "PkgName": "openssl",
                          "InstalledVersion": "1.1.1k",
                          "FixedVersion": "1.1.1u",
                          "Severity": "%s",
                          "Title": "OpenSSL issue",
                          "Description": "OpenSSL needs a security update",
                          "CVSS": {
                            "nvd": {
                              "V3Score": 9.8
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
                """.formatted(severity);
    }
}
