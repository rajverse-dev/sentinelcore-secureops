package com.sentinelcore.assetservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record AuditEventMessage(
        UUID eventId,
        UUID actorId,
        String actorEmail,
        String role,
        String action,
        String entityType,
        UUID entityId,
        String result,
        String severity,
        String description,
        String beforeState,
        String afterState,
        LocalDateTime timestamp,
        String source,
        String eventType,
        String ipAddress,
        String correlationId) {
}
