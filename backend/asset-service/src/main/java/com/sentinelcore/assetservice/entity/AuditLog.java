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

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) private User actor;
    @Column(nullable = false, length = 100) private String action;
    @Column(nullable = false, length = 100) private String entityType;
    private UUID entityId;
    @Column(nullable = false, length = 30) private String role;
    @Column(nullable = false, length = 20) private String result;
    @Column(length = 30) private String severity;
    @Column(length = 4000) private String description;
    @Column(length = 4000) private String beforeState;
    @Column(length = 4000) private String afterState;
    @Column(nullable = false, updatable = false) private LocalDateTime occurredAt;
    @Column(nullable = false, updatable = false, length = 64) private String eventHash;

    @PrePersist protected void onCreate() {
        if (occurredAt == null) occurredAt = LocalDateTime.now();
    }
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public User getActor() { return actor; } public void setActor(User actor) { this.actor = actor; }
    public String getAction() { return action; } public void setAction(String action) { this.action = action; }
    public String getEntityType() { return entityType; } public void setEntityType(String entityType) { this.entityType = entityType; }
    public UUID getEntityId() { return entityId; } public void setEntityId(UUID entityId) { this.entityId = entityId; }
    public String getRole() { return role; } public void setRole(String role) { this.role = role; }
    public String getResult() { return result; } public void setResult(String result) { this.result = result; }
    public String getSeverity() { return severity; } public void setSeverity(String severity) { this.severity = severity; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public String getBeforeState() { return beforeState; } public void setBeforeState(String beforeState) { this.beforeState = beforeState; }
    public String getAfterState() { return afterState; } public void setAfterState(String afterState) { this.afterState = afterState; }
    public LocalDateTime getOccurredAt() { return occurredAt; } public void setOccurredAt(LocalDateTime occurredAt) { this.occurredAt = occurredAt; }
    public String getEventHash() { return eventHash; } public void setEventHash(String eventHash) { this.eventHash = eventHash; }
}