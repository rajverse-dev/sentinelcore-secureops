package com.sentinelcore.assetservice.dto;
import java.time.LocalDateTime; import java.util.UUID;
import com.sentinelcore.assetservice.entity.ComplianceStatus;
public record ComplianceGapItem(
        UUID controlId, String controlRef, String title,
        ComplianceStatus status, long evidenceCount,
        LocalDateTime lastReviewedAt, String gapReason) {}
