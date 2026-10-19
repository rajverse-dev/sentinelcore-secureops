package com.sentinelcore.assetservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sentinelcore.assetservice.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    Page<AuditLog> findAllByOrderByOccurredAtDesc(Pageable pageable);
    Page<AuditLog> findByActionContainingIgnoreCaseOrEntityTypeContainingIgnoreCaseOrderByOccurredAtDesc(String action, String entityType, Pageable pageable);
    List<AuditLog> findTop100ByOrderByOccurredAtDesc();
}