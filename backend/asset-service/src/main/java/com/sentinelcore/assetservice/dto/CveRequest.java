package com.sentinelcore.assetservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CveRequest {

    @NotBlank(message = "CVE ID is required")
    @Pattern(regexp = "^(?i)CVE-[0-9]{4}-[0-9]{4,}$", message = "CVE ID must follow standard format, e.g. CVE-YYYY-NNNN")
    @Size(max = 50, message = "CVE ID must not exceed 50 characters")
    private String cveId;

    @NotNull(message = "CVSS score is required")
    @DecimalMin(value = "0.0", message = "CVSS score must be at least 0.0")
    @DecimalMax(value = "10.0", message = "CVSS score cannot exceed 10.0")
    private BigDecimal cvssScore;

    private VulnerabilitySeverity severity;

    @NotBlank(message = "Vulnerability description is required")
    @Size(max = 4000, message = "Description must not exceed 4000 characters")
    private String description;

    @NotBlank(message = "Affected software is required")
    @Size(max = 255, message = "Affected software must not exceed 255 characters")
    private String affectedSoftware;

    @Size(max = 255, message = "Affected version must not exceed 255 characters")
    private String affectedVersion;

    @Size(max = 4000, message = "Remediation must not exceed 4000 characters")
    private String remediation;

    @Size(max = 4000, message = "References must not exceed 4000 characters")
    private String references;

    private LocalDate publishedAt;

    private LocalDate lastModifiedAt;

    public CveRequest() {
    }

    public String getCveId() {
        return cveId;
    }

    public void setCveId(String cveId) {
        this.cveId = cveId != null ? cveId.trim().toUpperCase() : null;
    }

    public BigDecimal getCvssScore() {
        return cvssScore;
    }

    public void setCvssScore(BigDecimal cvssScore) {
        this.cvssScore = cvssScore;
    }

    public VulnerabilitySeverity getSeverity() {
        return severity;
    }

    public void setSeverity(VulnerabilitySeverity severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAffectedSoftware() {
        return affectedSoftware;
    }

    public void setAffectedSoftware(String affectedSoftware) {
        this.affectedSoftware = affectedSoftware;
    }

    public String getAffectedVersion() {
        return affectedVersion;
    }

    public void setAffectedVersion(String affectedVersion) {
        this.affectedVersion = affectedVersion;
    }

    public String getRemediation() {
        return remediation;
    }

    public void setRemediation(String remediation) {
        this.remediation = remediation;
    }

    public String getReferences() {
        return references;
    }

    public void setReferences(String references) {
        this.references = references;
    }

    public LocalDate getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDate publishedAt) {
        this.publishedAt = publishedAt;
    }

    public LocalDate getLastModifiedAt() {
        return lastModifiedAt;
    }

    public void setLastModifiedAt(LocalDate lastModifiedAt) {
        this.lastModifiedAt = lastModifiedAt;
    }
}
