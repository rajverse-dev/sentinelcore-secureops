package com.sentinelcore.assetservice.repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sentinelcore.assetservice.entity.AuditLog;

import jakarta.persistence.criteria.Predicate;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID>, JpaSpecificationExecutor<AuditLog> {

    Page<AuditLog> findAllByOrderByOccurredAtDesc(Pageable pageable);

    Page<AuditLog> findByActionContainingIgnoreCaseOrEntityTypeContainingIgnoreCaseOrderByOccurredAtDesc(
            String action, String entityType, Pageable pageable);

    List<AuditLog> findTop100ByOrderByOccurredAtDesc();

    // ── Filtered dynamic queries via JPA Specification ────────────────────────
    default Page<AuditLog> findFiltered(
            String action, String entityType, UUID entityId, UUID actorId,
            String result, String severity, String role, String source,
            String eventType, LocalDateTime from, LocalDateTime to,
            Pageable pageable) {

        return findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (action != null && !action.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("action")), "%" + action.trim().toLowerCase() + "%"));
            }
            if (entityType != null && !entityType.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("entityType")), entityType.trim().toLowerCase()));
            }
            if (entityId != null) {
                predicates.add(cb.equal(root.get("entityId"), entityId));
            }
            if (actorId != null) {
                predicates.add(cb.equal(root.get("actor").get("id"), actorId));
            }
            if (result != null && !result.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("result")), result.trim().toLowerCase()));
            }
            if (severity != null && !severity.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("severity")), severity.trim().toLowerCase()));
            }
            if (role != null && !role.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("role")), role.trim().toLowerCase()));
            }
            if (source != null && !source.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("source")), source.trim().toLowerCase()));
            }
            if (eventType != null && !eventType.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("eventType")), "%" + eventType.trim().toLowerCase() + "%"));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("occurredAt"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("occurredAt"), to));
            }

            if (query != null && !Long.class.equals(query.getResultType()) && !long.class.equals(query.getResultType())) {
                query.orderBy(cb.desc(root.get("occurredAt")));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);
    }

    // ── Summary counts ───────────────────────────────────────────────────────

    long countByOccurredAtAfter(LocalDateTime since);

    long countByResultIgnoreCase(String result);

    long countBySeverityIgnoreCase(String severity);

    long countByResultIgnoreCaseAndOccurredAtAfter(String result, LocalDateTime since);

    @Query("SELECT COUNT(DISTINCT a.actor.id) FROM AuditLog a WHERE a.occurredAt >= :since")
    long countDistinctActorsSince(@Param("since") LocalDateTime since);

    // ── Per actor ────────────────────────────────────────────────────────────

    Page<AuditLog> findByActorIdOrderByOccurredAtDesc(UUID actorId, Pageable pageable);

    // ── Per entity ───────────────────────────────────────────────────────────

    Page<AuditLog> findByEntityTypeIgnoreCaseAndEntityIdOrderByOccurredAtDesc(
            String entityType, UUID entityId, Pageable pageable);
}