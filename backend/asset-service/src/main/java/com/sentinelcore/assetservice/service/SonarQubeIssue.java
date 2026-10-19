package com.sentinelcore.assetservice.service;

import java.time.LocalDateTime;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

public record SonarQubeIssue(
        String issueKey,
        String rule,
        VulnerabilitySeverity severity,
        String message,
        String component,
        Integer lineNumber,
        String status,
        String projectKey,
        LocalDateTime sonarCreatedAt,
        LocalDateTime sonarUpdatedAt) {
}
