package com.sentinelcore.assetservice.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
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
    public AuditService(AuditLogRepository repository) { this.repository = repository; }

    @Transactional
    public AuditLog record(User actor, String action, String entityType, UUID entityId, String result, String severity, String description, String beforeState, String afterState) {
        AuditLog log = new AuditLog();
        log.setActor(actor); log.setAction(action); log.setEntityType(entityType); log.setEntityId(entityId);
        log.setRole(actor == null ? "SYSTEM" : actor.getRole()); log.setResult(result); log.setSeverity(severity);
        log.setDescription(description); log.setBeforeState(beforeState); log.setAfterState(afterState);
        log.setOccurredAt(LocalDateTime.now()); log.setEventHash(hash(log));
        return repository.save(log);
    }

    @Transactional(readOnly = true)
    public Page<AuditLogResponse> find(String query, int page, int size) {
        Page<AuditLog> logs = query == null || query.isBlank()
                ? repository.findAllByOrderByOccurredAtDesc(PageRequest.of(page, size))
                : repository.findByActionContainingIgnoreCaseOrEntityTypeContainingIgnoreCaseOrderByOccurredAtDesc(query, query, PageRequest.of(page, size));
        return logs.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public boolean verifyIntegrity() {
        List<AuditLog> logs = repository.findTop100ByOrderByOccurredAtDesc();
        return logs.stream().allMatch(log -> log.getEventHash() != null && log.getEventHash().equals(hash(log)));
    }

    private String hash(AuditLog log) {
        try {
            String value = String.valueOf(log.getActor() == null ? "SYSTEM" : log.getActor().getId()) + "|" + log.getAction() + "|" + log.getEntityType() + "|" + log.getEntityId() + "|" + log.getResult() + "|" + log.getOccurredAt();
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder(); for (byte b : digest) result.append(String.format("%02x", b)); return result.toString();
        } catch (Exception exception) { throw new IllegalStateException("Unable to hash audit event", exception); }
    }
    private AuditLogResponse toResponse(AuditLog log) { return new AuditLogResponse(log.getId(), log.getActor() == null ? null : log.getActor().getId(), log.getActor() == null ? "SYSTEM" : log.getActor().getEmail(), log.getRole(), log.getAction(), log.getEntityType(), log.getEntityId(), log.getResult(), log.getSeverity(), log.getDescription(), log.getBeforeState(), log.getAfterState(), log.getOccurredAt(), log.getEventHash()); }
}