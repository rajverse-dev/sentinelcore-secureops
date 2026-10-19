package com.sentinelcore.assetservice.dto;

import com.sentinelcore.assetservice.entity.PatchStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PatchStatusUpdateRequest {

    @NotNull(message = "Patch status is required")
    private PatchStatus status;

    @Size(max = 255, message = "Patch version must not exceed 255 characters")
    private String patchVersion;

    @Size(max = 4000, message = "Remediation notes must not exceed 4000 characters")
    private String remediationNotes;

    @Size(max = 4000, message = "Verification notes must not exceed 4000 characters")
    private String verificationNotes;

    @Size(max = 255, message = "Assigned remediation owner must not exceed 255 characters")
    private String assignedRemediationOwner;

    public PatchStatus getStatus() {
        return status;
    }

    public void setStatus(PatchStatus status) {
        this.status = status;
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