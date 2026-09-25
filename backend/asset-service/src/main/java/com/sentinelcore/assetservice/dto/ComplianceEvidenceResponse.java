package com.sentinelcore.assetservice.dto;
import java.time.LocalDateTime; import java.util.UUID;
public record ComplianceEvidenceResponse(
        UUID id, UUID controlId, String controlTitle,
        String evidenceType, String description, String reference,
        String status, LocalDateTime createdAt, LocalDateTime reviewedAt) {}
