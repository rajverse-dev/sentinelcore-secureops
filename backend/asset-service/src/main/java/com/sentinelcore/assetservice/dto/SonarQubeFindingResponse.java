package com.sentinelcore.assetservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

public class SonarQubeFindingResponse {

    private final UUID id;
    private final UUID assetId;
    private final String assetIdentifier;
    private final String issueKey;
    private final String rule;
    private final VulnerabilitySeverity severity;
    private final String message;
    private final String component;
    private final Integer lineNumber;
    private final String status;
    private final String projectKey;
    private final LocalDateTime sonarCreatedAt;
    private final LocalDateTime sonarUpdatedAt;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public SonarQubeFindingResponse(
            UUID id,
            UUID assetId,
            String assetIdentifier,
            String issueKey,
            String rule,
            VulnerabilitySeverity severity,
            String message,
            String component,
            Integer lineNumber,
            String status,
            String projectKey,
            LocalDateTime sonarCreatedAt,
            LocalDateTime sonarUpdatedAt,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.assetId = assetId;
        this.assetIdentifier = assetIdentifier;
        this.issueKey = issueKey;
        this.rule = rule;
        this.severity = severity;
        this.message = message;
        this.component = component;
        this.lineNumber = lineNumber;
        this.status = status;
        this.projectKey = projectKey;
        this.sonarCreatedAt = sonarCreatedAt;
        this.sonarUpdatedAt = sonarUpdatedAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public UUID getAssetId() {
        return assetId;
    }

    public String getAssetIdentifier() {
        return assetIdentifier;
    }

    public String getIssueKey() {
        return issueKey;
    }

    public String getRule() {
        return rule;
    }

    public VulnerabilitySeverity getSeverity() {
        return severity;
    }

    public String getMessage() {
        return message;
    }

    public String getComponent() {
        return component;
    }

    public Integer getLineNumber() {
        return lineNumber;
    }

    public String getStatus() {
        return status;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public LocalDateTime getSonarCreatedAt() {
        return sonarCreatedAt;
    }

    public LocalDateTime getSonarUpdatedAt() {
        return sonarUpdatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
