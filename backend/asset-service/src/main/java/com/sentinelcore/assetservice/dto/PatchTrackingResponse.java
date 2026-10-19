package com.sentinelcore.assetservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;

public class PatchTrackingResponse {

    private UUID vulnerabilityId;
    private VulnerabilityStatus vulnerabilityStatus;
    private PatchStatus patchStatus;
    private LocalDateTime patchStartedAt;
    private LocalDateTime patchCompletedAt;
    private LocalDateTime verificationDate;
    private String patchVersion;
    private String remediationNotes;
    private String verificationNotes;
    private String assignedRemediationOwner;

    public PatchTrackingResponse() {
    }

    public PatchTrackingResponse(
            UUID vulnerabilityId,
            VulnerabilityStatus vulnerabilityStatus,
            PatchStatus patchStatus,
            LocalDateTime patchStartedAt,
            LocalDateTime patchCompletedAt,
            LocalDateTime verificationDate,
            String patchVersion,
            String remediationNotes,
            String verificationNotes,
            String assignedRemediationOwner) {
        this.vulnerabilityId = vulnerabilityId;
        this.vulnerabilityStatus = vulnerabilityStatus;
        this.patchStatus = patchStatus;
        this.patchStartedAt = patchStartedAt;
        this.patchCompletedAt = patchCompletedAt;
        this.verificationDate = verificationDate;
        this.patchVersion = patchVersion;
        this.remediationNotes = remediationNotes;
        this.verificationNotes = verificationNotes;
        this.assignedRemediationOwner = assignedRemediationOwner;
    }

    public UUID getVulnerabilityId() {
        return vulnerabilityId;
    }

    public void setVulnerabilityId(UUID vulnerabilityId) {
        this.vulnerabilityId = vulnerabilityId;
    }

    public VulnerabilityStatus getVulnerabilityStatus() {
        return vulnerabilityStatus;
    }

    public void setVulnerabilityStatus(VulnerabilityStatus vulnerabilityStatus) {
        this.vulnerabilityStatus = vulnerabilityStatus;
    }

    public PatchStatus getPatchStatus() {
        return patchStatus;
    }

    public void setPatchStatus(PatchStatus patchStatus) {
        this.patchStatus = patchStatus;
    }

    public LocalDateTime getPatchStartedAt() {
        return patchStartedAt;
    }

    public void setPatchStartedAt(LocalDateTime patchStartedAt) {
        this.patchStartedAt = patchStartedAt;
    }

    public LocalDateTime getPatchCompletedAt() {
        return patchCompletedAt;
    }

    public void setPatchCompletedAt(LocalDateTime patchCompletedAt) {
        this.patchCompletedAt = patchCompletedAt;
    }

    public LocalDateTime getVerificationDate() {
        return verificationDate;
    }

    public void setVerificationDate(LocalDateTime verificationDate) {
        this.verificationDate = verificationDate;
    }

    public String getPatchVersion() {
        return patchVersion;
    }

    public void setPatchVersion(String patchVersion) {
        this.patchVersion = patchVersion;
    }

    public String getRemediationNotes() {
        return remediationNotes;
    }

    public void setRemediationNotes(String remediationNotes) {
        this.remediationNotes = remediationNotes;
    }

    public String getVerificationNotes() {
        return verificationNotes;
    }

    public void setVerificationNotes(String verificationNotes) {
        this.verificationNotes = verificationNotes;
    }

    public String getAssignedRemediationOwner() {
        return assignedRemediationOwner;
    }

    public void setAssignedRemediationOwner(String assignedRemediationOwner) {
        this.assignedRemediationOwner = assignedRemediationOwner;
    }
}