package com.sentinelcore.assetservice.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import jakarta.persistence.EntityListeners;

/**
 * Immutable audit log record.
 * All columns are marked updatable=false — JPA will never issue UPDATE on these fields.
 * Records must only be created (appended), never modified or deleted via normal API.
 */
@Entity
@EntityListeners(AuditLogImmutabilityListener.class)
@Table(name = "audit_logs")
public class AuditLog {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User actor;

    @Column(nullable = false, length = 100, updatable = false)
    private String action;

    @Column(nullable = false, length = 100, updatable = false)
    private String entityType;

    @Column(updatable = false)
    private UUID entityId;

    @Column(nullable = false, length = 30, updatable = false)
    private String role;

    @Column(nullable = false, length = 20, updatable = false)
    private String result;

    @Column(length = 30, updatable = false)
    private String severity;

    @Column(length = 4000, updatable = false)
    private String description;

    @Column(length = 4000, updatable = false)
    private String beforeState;

    @Column(length = 4000, updatable = false)
    private String afterState;

    @Column(nullable = false, updatable = false)
    private LocalDateTime occurredAt;

    @Column(nullable = false, updatable = false, length = 64)
    private String eventHash;

    /** Source module that produced the event (e.g. AUTH, ASSET, INCIDENT, COMPLIANCE) */
    @Column(length = 50, updatable = false)
    private String source;

    /** Fine-grained event type (e.g. LOGIN_SUCCESS, ASSET_CREATED, CONTROL_STATUS_UPDATED) */
    @Column(length = 100, updatable = false)
    private String eventType;

    /** IP address of the request originator where available */
    @Column(length = 60, updatable = false)
    private String ipAddress;

    /** Correlation / request ID for distributed tracing */
    @Column(length = 64, updatable = false)
    private String correlationId;

    @PrePersist
    protected void onCreate() {
        if (occurredAt == null) occurredAt = LocalDateTime.now();
    }

    // ── Getters & Setters ───────────────────────────────────────────────────
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public User getActor() { return actor; }
    public void setActor(User actor) { this.actor = actor; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public UUID getEntityId() { return entityId; }
    public void setEntityId(UUID entityId) { this.entityId = entityId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getBeforeState() { return beforeState; }
    public void setBeforeState(String beforeState) { this.beforeState = beforeState; }
    public String getAfterState() { return afterState; }
    public void setAfterState(String afterState) { this.afterState = afterState; }
    public LocalDateTime getOccurredAt() { return occurredAt; }
    public void setOccurredAt(LocalDateTime occurredAt) { this.occurredAt = occurredAt; }
    public String getEventHash() { return eventHash; }
    public void setEventHash(String eventHash) { this.eventHash = eventHash; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getCorrelationId() { return correlationId; }
    public void setCorrelationId(String correlationId) { this.correlationId = correlationId; }
}