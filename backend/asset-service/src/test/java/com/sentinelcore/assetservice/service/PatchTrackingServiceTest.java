package com.sentinelcore.assetservice.service;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sentinelcore.assetservice.dto.PatchStatusUpdateRequest;
import com.sentinelcore.assetservice.dto.PatchTrackingResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;
import com.sentinelcore.assetservice.exception.InvalidPatchTransitionException;
import com.sentinelcore.assetservice.exception.VulnerabilityNotFoundException;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@ExtendWith(MockitoExtension.class)
class PatchTrackingServiceTest {

    @Mock
    private VulnerabilityRepository vulnerabilityRepository;

    @Mock
    private VulnerabilityService vulnerabilityService;

    private PatchTrackingService patchTrackingService;
    private Vulnerability vulnerability;

    @BeforeEach
    void setUp() {
        patchTrackingService = new PatchTrackingService(vulnerabilityRepository, vulnerabilityService);
        vulnerability = vulnerability();
        lenient().when(vulnerabilityService.getOwnedVulnerability(vulnerability.getId())).thenReturn(vulnerability);
        lenient().when(vulnerabilityRepository.save(any(Vulnerability.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void openTransitionsToPatchingAndSetsStartDate() {
        PatchTrackingResponse response = update(PatchStatus.PATCHING);

        assertEquals(PatchStatus.PATCHING, response.getPatchStatus());
        assertNotNull(response.getPatchStartedAt());
    }

    @Test
    void patchingTransitionsToPatchedAndSetsCompletionDate() {
        vulnerability.setPatchStatus(PatchStatus.PATCHING);

        PatchTrackingResponse response = update(PatchStatus.PATCHED);

        assertEquals(PatchStatus.PATCHED, response.getPatchStatus());
        assertNotNull(response.getPatchCompletedAt());
    }

    @Test
    void patchedTransitionsToVerifiedAndSetsVerificationDate() {
        vulnerability.setPatchStatus(PatchStatus.PATCHED);

        PatchTrackingResponse response = update(PatchStatus.VERIFIED);

        assertEquals(PatchStatus.VERIFIED, response.getPatchStatus());
        assertNotNull(response.getVerificationDate());
    }

    @Test
    void invalidLifecycleTransitionIsRejected() {
        assertThrows(InvalidPatchTransitionException.class, () -> update(PatchStatus.PATCHED));
        verify(vulnerabilityRepository, never()).save(any(Vulnerability.class));
    }

    @Test
    void patchMetadataIsStoredAndReturned() {
        PatchStatusUpdateRequest request = request(PatchStatus.PATCHING);
        request.setPatchVersion("1.2.3");
        request.setRemediationNotes("Applied vendor update");
        request.setVerificationNotes("Pending verification");
        request.setAssignedRemediationOwner("security-team");

        PatchTrackingResponse response = patchTrackingService.updatePatchStatus(vulnerability.getId(), request);

        assertEquals("1.2.3", response.getPatchVersion());
        assertEquals("Applied vendor update", response.getRemediationNotes());
        assertEquals("Pending verification", response.getVerificationNotes());
        assertEquals("security-team", response.getAssignedRemediationOwner());
    }

    @Test
    void existingNullPatchStatusIsTreatedAsOpen() {
        PatchTrackingResponse response = patchTrackingService.getPatchTracking(vulnerability.getId());

        assertEquals(PatchStatus.OPEN, response.getPatchStatus());
    }

    @Test
    void missingVulnerabilityIsRejectedByOwnedLookup() {
        UUID id = UUID.randomUUID();
        when(vulnerabilityService.getOwnedVulnerability(id))
                .thenThrow(new VulnerabilityNotFoundException("Vulnerability not found"));

        assertThrows(VulnerabilityNotFoundException.class,
                () -> patchTrackingService.getPatchTracking(id));
    }

    @Test
    void crossUserVulnerabilityIsRejectedByOwnedLookup() {
        UUID id = UUID.randomUUID();
        when(vulnerabilityService.getOwnedVulnerability(id))
                .thenThrow(new VulnerabilityNotFoundException("Vulnerability not found"));

        assertThrows(VulnerabilityNotFoundException.class,
                () -> patchTrackingService.updatePatchStatus(id, request(PatchStatus.PATCHING)));
    }

    private PatchTrackingResponse update(PatchStatus status) {
        return patchTrackingService.updatePatchStatus(vulnerability.getId(), request(status));
    }

    private PatchStatusUpdateRequest request(PatchStatus status) {
        PatchStatusUpdateRequest request = new PatchStatusUpdateRequest();
        request.setStatus(status);
        return request;
    }

    private Vulnerability vulnerability() {
        Asset asset = new Asset();
        asset.setId(UUID.randomUUID());
        asset.setOwnerUser(new com.sentinelcore.assetservice.entity.User());

        Vulnerability result = new Vulnerability();
        result.setId(UUID.randomUUID());
        result.setAsset(asset);
        result.setVulnerabilityIdentifier("CVE-2026-1234");
        result.setTitle("Outdated package");
        result.setDescription("Package needs an update");
        result.setSeverity(VulnerabilitySeverity.HIGH);
        result.setStatus(VulnerabilityStatus.OPEN);
        result.setPatchStatus(PatchStatus.OPEN);
        result.setRemediation("Existing remediation");
        result.setAffectedComponent("nginx");
        return result;
    }
}