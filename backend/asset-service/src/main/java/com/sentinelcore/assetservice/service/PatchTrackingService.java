package com.sentinelcore.assetservice.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sentinelcore.assetservice.dto.PatchStatusUpdateRequest;
import com.sentinelcore.assetservice.dto.PatchTrackingResponse;
import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.exception.InvalidPatchTransitionException;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@Service
public class PatchTrackingService {

    private final VulnerabilityRepository vulnerabilityRepository;
    private final VulnerabilityService vulnerabilityService;

    public PatchTrackingService(
            VulnerabilityRepository vulnerabilityRepository,
            VulnerabilityService vulnerabilityService) {
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.vulnerabilityService = vulnerabilityService;
    }

    @Transactional
    public PatchTrackingResponse updatePatchStatus(
            UUID vulnerabilityId,
            PatchStatusUpdateRequest request) {
        Vulnerability vulnerability = vulnerabilityService.getOwnedVulnerability(vulnerabilityId);
        PatchStatus currentStatus = effectiveStatus(vulnerability);
        PatchStatus nextStatus = request.getStatus();

        validateTransition(currentStatus, nextStatus);

        if (request.getPatchVersion() != null) {
            vulnerability.setPatchVersion(request.getPatchVersion());
        }
        if (request.getRemediationNotes() != null) {
            vulnerability.setRemediation(request.getRemediationNotes());
        }
        if (request.getVerificationNotes() != null) {
            vulnerability.setVerificationNotes(request.getVerificationNotes());
        }
        if (request.getAssignedRemediationOwner() != null) {
            vulnerability.setAssignedRemediationOwner(request.getAssignedRemediationOwner());
        }

        LocalDateTime now = LocalDateTime.now();
        if (currentStatus != nextStatus) {
            switch (nextStatus) {
                case PATCHING -> vulnerability.setPatchStartedAt(now);
                case PATCHED -> vulnerability.setPatchCompletedAt(now);
                case VERIFIED -> vulnerability.setVerificationDate(now);
                case OPEN -> {
                }
            }
        }
        vulnerability.setPatchStatus(nextStatus);

        return toResponse(vulnerabilityRepository.save(vulnerability));
    }

    @Transactional(readOnly = true)
    public PatchTrackingResponse getPatchTracking(UUID vulnerabilityId) {
        return toResponse(vulnerabilityService.getOwnedVulnerability(vulnerabilityId));
    }

    private PatchStatus effectiveStatus(Vulnerability vulnerability) {
        return vulnerability.getPatchStatus() == null
                ? PatchStatus.OPEN
                : vulnerability.getPatchStatus();
    }

    private void validateTransition(PatchStatus currentStatus, PatchStatus nextStatus) {
        if (currentStatus == nextStatus) {
            return;
        }

        boolean valid = (currentStatus == PatchStatus.OPEN && nextStatus == PatchStatus.PATCHING)
                || (currentStatus == PatchStatus.PATCHING && nextStatus == PatchStatus.PATCHED)
                || (currentStatus == PatchStatus.PATCHED && nextStatus == PatchStatus.VERIFIED);

        if (!valid) {
            throw new InvalidPatchTransitionException(
                    "Invalid patch status transition: " + currentStatus + " -> " + nextStatus);
        }
    }

    private PatchTrackingResponse toResponse(Vulnerability vulnerability) {
        return new PatchTrackingResponse(
                vulnerability.getId(),
                vulnerability.getStatus(),
                effectiveStatus(vulnerability),
                vulnerability.getPatchStartedAt(),
                vulnerability.getPatchCompletedAt(),
                vulnerability.getVerificationDate(),
                vulnerability.getPatchVersion(),
                vulnerability.getRemediation(),
                vulnerability.getVerificationNotes(),
                vulnerability.getAssignedRemediationOwner());
    }
}