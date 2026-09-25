package com.sentinelcore.assetservice.dto;
import java.time.LocalDateTime; import java.util.UUID;
import com.sentinelcore.assetservice.entity.ComplianceStatus;
public record ComplianceControlResponse(
        UUID id, UUID frameworkId, String frameworkName,
        String controlId, String title, String description,
        ComplianceStatus status, String owner,
        LocalDateTime lastReviewedAt, LocalDateTime nextReviewAt,
        long evidenceCount) {}
