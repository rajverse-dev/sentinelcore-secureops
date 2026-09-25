package com.sentinelcore.assetservice.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.assetservice.dto.AuditLogResponse;
import com.sentinelcore.assetservice.service.AuditService;

import org.springframework.security.access.prepost.PreAuthorize;

/**
 * Audit API — read-only access to the immutable audit trail.
 * All endpoints require authentication. Role-based access is enforced
 * at the service/security level.
 */
@RestController
@RequestMapping("/api/audit")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
public class AuditController {


    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    /** Paginated audit log with optional simple text search (backward compatible). */
    @GetMapping
    public ResponseEntity<Page<AuditLogResponse>> getAudit(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(auditService.find(query, page, Math.min(size, 100)));
    }

    /** Paginated audit log with rich filters. */
    @GetMapping("/search")
    public ResponseEntity<Page<AuditLogResponse>> search(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String entityId,
            @RequestParam(required = false) String actorId,
            @RequestParam(required = false) String result,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String eventType,
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(auditService.findFiltered(
                action, entityType, entityId, actorId, result, severity,
                role, source, eventType, from, to, page, Math.min(size, 100)));
    }

    /** Single audit log by ID. */
    @GetMapping("/{id}")
    public ResponseEntity<AuditLogResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(auditService.findById(id));
    }

    /** Dashboard summary metrics (total, today, failed, critical, active users). */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        return ResponseEntity.ok(auditService.getSummary());
    }

    /** All audit events for a specific user (by their UUID). */
    @GetMapping("/users/{userId}")
    public ResponseEntity<Page<AuditLogResponse>> byUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(auditService.findByUser(userId, page, Math.min(size, 100)));
    }

    /** All audit events for a specific entity (e.g. ASSET / some-uuid). */
    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<Page<AuditLogResponse>> byEntity(
            @PathVariable String entityType,
            @PathVariable UUID entityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return ResponseEntity.ok(auditService.findByEntity(entityType, entityId, page, Math.min(size, 100)));
    }

    /** SHA-256 hash integrity verification of the last 100 audit records. */
    @GetMapping("/integrity")
    public ResponseEntity<Map<String, Object>> integrity() {
        boolean pass = auditService.verifyIntegrity();
        return ResponseEntity.ok(Map.of("pass", pass, "message",
                pass ? "Audit hash chain verified" : "Hash mismatch detected in recent audit records"));
    }
}