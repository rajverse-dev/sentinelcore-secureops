package com.sentinelcore.assetservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.IncidentStatus;

public class IncidentHistoryResponse {

    private UUID id;
    private IncidentStatus fromStatus;
    private IncidentStatus toStatus;
    private String action;
    private String notes;
    private String changedBy;
    private LocalDateTime changedAt;

    public IncidentHistoryResponse(UUID id, IncidentStatus fromStatus, IncidentStatus toStatus,
            String action, String notes, String changedBy, LocalDateTime changedAt) {
        this.id = id;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.action = action;
        this.notes = notes;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
    }

    public UUID getId() { return id; }
    public IncidentStatus getFromStatus() { return fromStatus; }
    public IncidentStatus getToStatus() { return toStatus; }
    public String getAction() { return action; }
    public String getNotes() { return notes; }
    public String getChangedBy() { return changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
}