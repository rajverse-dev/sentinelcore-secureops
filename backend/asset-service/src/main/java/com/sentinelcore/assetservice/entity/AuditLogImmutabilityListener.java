package com.sentinelcore.assetservice.entity;

import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;

public class AuditLogImmutabilityListener {

    @PreUpdate
    public void onPreUpdate(AuditLog entity) {
        throw new IllegalStateException("Audit logs are strictly immutable and cannot be updated.");
    }

    @PreRemove
    public void onPreRemove(AuditLog entity) {
        throw new IllegalStateException("Audit logs are strictly immutable and cannot be deleted.");
    }
}
