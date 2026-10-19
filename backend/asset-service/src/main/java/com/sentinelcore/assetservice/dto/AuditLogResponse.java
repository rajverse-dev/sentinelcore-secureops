package com.sentinelcore.assetservice.dto;
import java.time.LocalDateTime;
import java.util.UUID;
public record AuditLogResponse(UUID id, UUID actorId, String actor, String role, String action, String entityType, UUID entityId, String result, String severity, String description, String beforeState, String afterState, LocalDateTime occurredAt, String eventHash) {}