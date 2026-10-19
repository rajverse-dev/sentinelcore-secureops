package com.sentinelcore.assetservice.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;

public class RemediationItemResponse {

    private UUID vulnerabilityId;
    private UUID assetId;
    private String assetIdentifier;
    private String assetName;
    private String vulnerabilityIdentifier;
    private String title;
    private VulnerabilitySeverity severity;
    private VulnerabilityStatus status;
    private PatchStatus patchStatus;
    private String affectedComponent;
    private String remediation;
    private LocalDate dueDate;
    private String assignedRemediationOwner;
    private String cveId;
    private String patchVersion;
    private LocalDateTime detectedAt;

    public RemediationItemResponse() {
    }

    public RemediationItemResponse(
            UUID vulnerabilityId,
            UUID assetId,
            String assetIdentifier,
            String assetName,
            String vulnerabilityIdentifier,
            String title,
            VulnerabilitySeverity severity,
            VulnerabilityStatus status,
            PatchStatus patchStatus,
            String affectedComponent,
            String remediation,
            LocalDate dueDate,
            String assignedRemediationOwner,
            String cveId,
            String patchVersion,
            LocalDateTime detectedAt) {
        this.vulnerabilityId = vulnerabilityId;
        this.assetId = assetId;
        this.assetIdentifier = assetIdentifier;
        this.assetName = assetName;
        this.vulnerabilityIdentifier = vulnerabilityIdentifier;
        this.title = title;
        this.severity = severity;
        this.status = status;
        this.patchStatus = patchStatus;
        this.affectedComponent = affectedComponent;
        this.remediation = remediation;
        this.dueDate = dueDate;
        this.assignedRemediationOwner = assignedRemediationOwner;
        this.cveId = cveId;
        this.patchVersion = patchVersion;
        this.detectedAt = detectedAt;
    }

    public UUID getVulnerabilityId() {
        return vulnerabilityId;
    }

    public void setVulnerabilityId(UUID vulnerabilityId) {
        this.vulnerabilityId = vulnerabilityId;
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

    public String getVulnerabilityIdentifier() {
        return vulnerabilityIdentifier;
    }

    public void setVulnerabilityIdentifier(String vulnerabilityIdentifier) {
        this.vulnerabilityIdentifier = vulnerabilityIdentifier;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public VulnerabilitySeverity getSeverity() {
        return severity;
    }

    public void setSeverity(VulnerabilitySeverity severity) {
        this.severity = severity;
    }

    public VulnerabilityStatus getStatus() {
        return status;
    }

    public void setStatus(VulnerabilityStatus status) {
        this.status = status;
    }

    public PatchStatus getPatchStatus() {
        return patchStatus;
    }

    public void setPatchStatus(PatchStatus patchStatus) {
        this.patchStatus = patchStatus;
    }

    public String getAffectedComponent() {
        return affectedComponent;
    }

    public void setAffectedComponent(String affectedComponent) {
        this.affectedComponent = affectedComponent;
    }

    public String getRemediation() {
        return remediation;
    }

    public void setRemediation(String remediation) {
        this.remediation = remediation;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getAssignedRemediationOwner() {
        return assignedRemediationOwner;
    }

    public void setAssignedRemediationOwner(String assignedRemediationOwner) {
        this.assignedRemediationOwner = assignedRemediationOwner;
    }

    public String getCveId() {
        return cveId;
    }

    public void setCveId(String cveId) {
        this.cveId = cveId;
    }

    public String getPatchVersion() {
        return patchVersion;
    }

    public void setPatchVersion(String patchVersion) {
        this.patchVersion = patchVersion;
    }

    public LocalDateTime getDetectedAt() {
        return detectedAt;
    }

    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }
}