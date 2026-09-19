package com.sentinelcore.assetservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sentinelcore.assetservice.dto.SonarQubeFindingResponse;
import com.sentinelcore.assetservice.dto.SonarQubeImportRequest;
import com.sentinelcore.assetservice.dto.SonarQubeImportSummaryResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.SonarQubeFinding;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.repository.SonarQubeFindingRepository;

class SonarQubeIntegrationServiceTest {

    @Test
    void importFindingsSuccessfullyCreatesNewFindings() {
        SonarQubeClient client = mock(SonarQubeClient.class);
        SonarQubeFindingRepository repository = mock(SonarQubeFindingRepository.class);
        AssetService assetService = mock(AssetService.class);
        User owner = new User("Alice", "alice@example.com", "password", "USER", true);
        UUID assetId = UUID.randomUUID();
        Asset asset = new Asset();
        asset.setId(assetId);
        asset.setIdentifier("web-app-1");

        when(assetService.getCurrentUser()).thenReturn(owner);
        when(assetService.getOwnedAsset(assetId)).thenReturn(asset);

        LocalDateTime now = LocalDateTime.now();
        when(client.fetchSecurityIssues("sentinel-backend")).thenReturn(List.of(
                new SonarQubeIssue("SQ-101", "java:S2076", VulnerabilitySeverity.CRITICAL,
                        "OS Command Injection", "src/Command.java", 45, "OPEN", "sentinel-backend", now, now)));
        when(repository.findByOwnerUserAndIssueKey(owner, "SQ-101")).thenReturn(Optional.empty());
        when(repository.save(any(SonarQubeFinding.class))).thenAnswer(invocation -> {
            SonarQubeFinding f = invocation.getArgument(0);
            f.setId(UUID.randomUUID());
            return f;
        });

        SonarQubeImportRequest request = new SonarQubeImportRequest();
        request.setProjectKey("sentinel-backend");
        request.setAssetId(assetId);

        SonarQubeImportSummaryResponse summary = new SonarQubeIntegrationService(client, repository, assetService)
                .importFindings(request);

        assertEquals("sentinel-backend", summary.getProjectKey());
        assertEquals(1, summary.getImportedFindings());
        assertEquals(1, summary.getCreatedFindings());
        assertEquals(0, summary.getUpdatedFindings());
        assertEquals(0, summary.getDuplicateFindingsPrevented());
        assertEquals(1, summary.getFindings().size());

        SonarQubeFindingResponse response = summary.getFindings().get(0);
        assertEquals("SQ-101", response.getIssueKey());
        assertEquals("java:S2076", response.getRule());
        assertEquals(VulnerabilitySeverity.CRITICAL, response.getSeverity());
        assertEquals("OS Command Injection", response.getMessage());
        assertEquals(assetId, response.getAssetId());
        assertEquals("web-app-1", response.getAssetIdentifier());
    }

    @Test
    void repeatedImportUpdatesFindingWithoutCreatingAnotherRecord() {
        SonarQubeClient client = mock(SonarQubeClient.class);
        SonarQubeFindingRepository repository = mock(SonarQubeFindingRepository.class);
        AssetService assetService = mock(AssetService.class);
        User owner = new User("Alice", "alice@example.com", "password", "USER", true);
        SonarQubeFinding existing = new SonarQubeFinding();
        existing.setId(UUID.randomUUID());
        existing.setOwnerUser(owner);
        existing.setIssueKey("AX-1");

        when(assetService.getCurrentUser()).thenReturn(owner);
        when(client.fetchSecurityIssues("project")).thenReturn(List.of(
                new SonarQubeIssue("AX-1", "java:S2083", VulnerabilitySeverity.HIGH,
                        "Updated message", "project:Main.java", 12, "OPEN", "project", null, null)));
        when(repository.findByOwnerUserAndIssueKey(owner, "AX-1")).thenReturn(Optional.of(existing));
        when(repository.save(any(SonarQubeFinding.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SonarQubeImportRequest request = new SonarQubeImportRequest();
        request.setProjectKey("project");

        SonarQubeImportSummaryResponse summary = new SonarQubeIntegrationService(client, repository, assetService)
                .importFindings(request);

        assertEquals(0, summary.getCreatedFindings());
        assertEquals(1, summary.getUpdatedFindings());
        assertEquals(1, summary.getDuplicateFindingsPrevented());
        assertEquals(VulnerabilitySeverity.HIGH, summary.getFindings().get(0).getSeverity());
        verify(repository).save(existing);
    }

    @Test
    void getFindingsReturnsOwnerScopedFindings() {
        SonarQubeClient client = mock(SonarQubeClient.class);
        SonarQubeFindingRepository repository = mock(SonarQubeFindingRepository.class);
        AssetService assetService = mock(AssetService.class);
        User owner = new User("Alice", "alice@example.com", "password", "USER", true);

        SonarQubeFinding finding = new SonarQubeFinding();
        finding.setId(UUID.randomUUID());
        finding.setOwnerUser(owner);
        finding.setIssueKey("SQ-1");
        finding.setRule("java:S123");
        finding.setSeverity(VulnerabilitySeverity.MEDIUM);
        finding.setProjectKey("project-a");

        when(assetService.getCurrentUser()).thenReturn(owner);
        when(repository.findByOwnerUser(owner)).thenReturn(List.of(finding));

        List<SonarQubeFindingResponse> findings = new SonarQubeIntegrationService(client, repository, assetService)
                .getFindings();

        assertEquals(1, findings.size());
        assertEquals("SQ-1", findings.get(0).getIssueKey());
    }

    @Test
    void getProjectFindingsReturnsProjectScopedFindings() {
        SonarQubeClient client = mock(SonarQubeClient.class);
        SonarQubeFindingRepository repository = mock(SonarQubeFindingRepository.class);
        AssetService assetService = mock(AssetService.class);
        User owner = new User("Alice", "alice@example.com", "password", "USER", true);

        SonarQubeFinding finding = new SonarQubeFinding();
        finding.setId(UUID.randomUUID());
        finding.setOwnerUser(owner);
        finding.setIssueKey("SQ-2");
        finding.setRule("java:S456");
        finding.setSeverity(VulnerabilitySeverity.LOW);
        finding.setProjectKey("project-b");

        when(assetService.getCurrentUser()).thenReturn(owner);
        when(repository.findByOwnerUserAndProjectKey(owner, "project-b")).thenReturn(List.of(finding));

        List<SonarQubeFindingResponse> findings = new SonarQubeIntegrationService(client, repository, assetService)
                .getProjectFindings("project-b");

        assertEquals(1, findings.size());
        assertEquals("SQ-2", findings.get(0).getIssueKey());
        assertEquals("project-b", findings.get(0).getProjectKey());
    }
}
