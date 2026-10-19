package com.sentinelcore.assetservice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

public class CveResponse {

    private UUID id;
    private String cveId;
    private BigDecimal cvssScore;
    private VulnerabilitySeverity severity;
    private String description;
    private String affectedSoftware;
    private String affectedVersion;
    private String remediation;
    private String references;
    private LocalDate publishedAt;
    private LocalDate lastModifiedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CveResponse() {
    }

    public CveResponse(
            UUID id,
            String cveId,
            BigDecimal cvssScore,
            VulnerabilitySeverity severity,
            String description,
            String affectedSoftware,
            String affectedVersion,
            String remediation,
            String references,
            LocalDate publishedAt,
            LocalDate lastModifiedAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.cveId = cveId;
        this.cvssScore = cvssScore;
        this.severity = severity;
        this.description = description;
        this.affectedSoftware = affectedSoftware;
        this.affectedVersion = affectedVersion;
        this.remediation = remediation;
        this.references = references;
        this.publishedAt = publishedAt;
        this.lastModifiedAt = lastModifiedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getCveId() {
        return cveId;
    }

    public void setCveId(String cveId) {
        this.cveId = cveId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
