package com.sentinelcore.assetservice.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sentinelcore.assetservice.dto.AuditLogResponse;
import com.sentinelcore.assetservice.entity.AuditLog;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.repository.AuditLogRepository;

@Service
public class AuditService {

    private final AuditLogRepository repository;

    public AuditService(AuditLogRepository repository) {
        this.repository = repository;
    }

    // ── Write ────────────────────────────────────────────────────────────────

    @Transactional
    public AuditLog record(User actor, String action, String entityType, UUID entityId,
                           String result, String severity, String description,
                           String beforeState, String afterState) {
        return record(actor, action, entityType, entityId, result, severity, description,
                beforeState, afterState, null, null, null, null);
    }

    @Transactional
    public AuditLog record(User actor, String action, String entityType, UUID entityId,
                           String result, String severity, String description,
                           String beforeState, String afterState,
                           String source, String eventType, String ipAddress, String correlationId) {
        AuditLog log = new AuditLog();
        log.setActor(actor);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setRole(actor == null ? "SYSTEM" : actor.getRole());
        log.setResult(result);
        log.setSeverity(severity);
        log.setDescription(description);
        log.setBeforeState(beforeState);
        log.setAfterState(afterState);
        log.setSource(source);
        log.setEventType(eventType != null ? eventType : action);
        log.setIpAddress(ipAddress);
        log.setCorrelationId(correlationId);
        log.setOccurredAt(LocalDateTime.now().truncatedTo(java.time.temporal.ChronoUnit.MICROS));
        log.setEventHash(hash(log));
        return repository.save(log);
    }

    // ── Read ─────────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> find(String query, int page, int size) {
        Page<AuditLog> logs = (query == null || query.isBlank())
                ? repository.findAllByOrderByOccurredAtDesc(PageRequest.of(page, size))
                : repository.findByActionContainingIgnoreCaseOrEntityTypeContainingIgnoreCaseOrderByOccurredAtDesc(
                        query, query, PageRequest.of(page, size));
        return logs.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> findFiltered(
            String action, String entityType, String entityIdStr,
            String actorIdStr, String result, String severity,
            String role, String source, String eventType,
            String from, String to, int page, int size) {

        UUID entityId = parseUuid(entityIdStr);
        UUID actorId = parseUuid(actorIdStr);
        LocalDateTime fromDt = parseDateTime(from, false);
        LocalDateTime toDt = parseDateTime(to, true);

        Page<AuditLog> logs = repository.findFiltered(
                blankToNull(action), blankToNull(entityType), entityId, actorId,
                blankToNull(result), blankToNull(severity), blankToNull(role),
                blankToNull(source), blankToNull(eventType),
                fromDt, toDt,
                PageRequest.of(page, size));
        return logs.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public AuditLogResponse findById(UUID id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Audit log not found: " + id));
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> findByUser(UUID actorId, int page, int size) {
        return repository.findByActorIdOrderByOccurredAtDesc(actorId, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> findByEntity(String entityType, UUID entityId, int page, int size) {
        return repository.findByEntityTypeIgnoreCaseAndEntityIdOrderByOccurredAtDesc(
                entityType, entityId, PageRequest.of(page, size)).map(this::toResponse);
    }

    // ── Summary ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Object> getSummary() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        long total = repository.count();
        long today = repository.countByOccurredAtAfter(todayStart);
        long failed = repository.countByResultIgnoreCase("FAILURE");
        long critical = repository.countBySeverityIgnoreCase("CRITICAL");
        long failedToday = repository.countByResultIgnoreCaseAndOccurredAtAfter("FAILURE", todayStart);
        long activeUsers = 0;
        try {
            activeUsers = repository.countDistinctActorsSince(todayStart);
        } catch (Exception ignored) {}

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("total", total);
        summary.put("today", today);
        summary.put("failedAccessAttempts", failed);
        summary.put("failedAccessToday", failedToday);
        summary.put("criticalActions", critical);
        summary.put("activeUsersToday", activeUsers);
        return summary;
    }

    // ── Integrity ────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public boolean verifyIntegrity() {
        List<AuditLog> logs = repository.findTop100ByOrderByOccurredAtDesc();
        if (logs.isEmpty()) return true;
        return logs.stream().allMatch(log ->
                log.getEventHash() != null && log.getEventHash().length() == 64);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private String hash(AuditLog log) {
        try {
            String value = String.valueOf(log.getActor() == null ? "SYSTEM" : log.getActor().getId())
                    + "|" + log.getAction()
                    + "|" + log.getEntityType()
                    + "|" + log.getEntityId()
                    + "|" + log.getResult()
                    + "|" + log.getOccurredAt();
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Unable to hash audit event", e);
        }
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getActor() == null ? null : log.getActor().getId(),
                log.getActor() == null ? "SYSTEM" : log.getActor().getEmail(),
                log.getRole(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getResult(),
                log.getSeverity(),
                log.getDescription(),
                log.getBeforeState(),
                log.getAfterState(),
                log.getOccurredAt(),
                log.getEventHash(),
                log.getSource(),
                log.getEventType(),
                log.getIpAddress(),
                log.getCorrelationId());
    }

    private UUID parseUuid(String s) {
        if (s == null || s.isBlank()) return null;
        try { return UUID.fromString(s.trim()); } catch (Exception e) { return null; }
    }

    private LocalDateTime parseDateTime(String s, boolean endOfDay) {
        if (s == null || s.isBlank()) return null;
        try {
            LocalDate d = LocalDate.parse(s.trim());
            return endOfDay ? d.atTime(LocalTime.MAX) : d.atStartOfDay();
        } catch (Exception e) {
            try {
                return LocalDateTime.parse(s.trim());
            } catch (Exception e2) {
                return null;
            }
        }
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}