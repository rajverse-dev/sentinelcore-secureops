package com.sentinelcore.assetservice.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

public class TrivyFindingResponse {

    private final UUID vulnerabilityId;
    private final String cveId;
    private final VulnerabilitySeverity severity;
    private final String affectedComponent;
    private final String installedVersion;
    private final String fixedVersion;
    private final boolean created;
    private final String title;
    private final String description;
    private final BigDecimal cvssScore;
    private final String remediation;
    private final String references;

    public TrivyFindingResponse(
            UUID vulnerabilityId,
            String cveId,
            VulnerabilitySeverity severity,
            String affectedComponent,
            String installedVersion,
            String fixedVersion,
            boolean created) {
        this(vulnerabilityId, cveId, severity, affectedComponent, installedVersion, fixedVersion, created,
                cveId, null, null, null, null);
    }

    public TrivyFindingResponse(
            UUID vulnerabilityId,
            String cveId,
            VulnerabilitySeverity severity,
            String affectedComponent,
            String installedVersion,
            String fixedVersion,
            boolean created,
            String title,
            String description,
            BigDecimal cvssScore,
            String remediation,
            String references) {
        this.vulnerabilityId = vulnerabilityId;
        this.cveId = cveId;
        this.severity = severity;
        this.affectedComponent = affectedComponent;
        this.installedVersion = installedVersion;
        this.fixedVersion = fixedVersion;
        this.created = created;
        this.title = title;
        this.description = description;
        this.cvssScore = cvssScore;
        this.remediation = remediation;
        this.references = references;
    }

    public UUID getVulnerabilityId() {
        return vulnerabilityId;
    }

    public String getCveId() {
        return cveId;
    }

    public VulnerabilitySeverity getSeverity() {
        return severity;
    }

    public String getAffectedComponent() {
        return affectedComponent;
    }

    public String getInstalledVersion() {
        return installedVersion;
    }

    public String getFixedVersion() {
        return fixedVersion;
    }

    public boolean isCreated() {
        return created;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getCvssScore() {
        return cvssScore;
    }

    public String getRemediation() {
        return remediation;
    }

    public String getReferences() {
        return references;
    }
}
