package com.sentinelcore.assetservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.IncidentSeverity;
import com.sentinelcore.assetservice.entity.IncidentStatus;

public class IncidentResponse {

    private UUID id;
    private String incidentIdentifier;
    private UUID assetId;
    private String assetIdentifier;
    private String assetName;
    private String title;
    private String description;
    private IncidentSeverity severity;
    private IncidentStatus status;
    private String assignedTeam;
    private String assignedUser;
    private LocalDateTime detectedAt;
    private LocalDateTime slaDueAt;
    private boolean slaBreached;
    private LocalDateTime resolvedAt;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public IncidentResponse() {
    }

    public IncidentResponse(UUID id, String incidentIdentifier, UUID assetId, String assetIdentifier,
            String assetName, String title, String description, IncidentSeverity severity,
            IncidentStatus status, String assignedTeam, String assignedUser, LocalDateTime detectedAt,
            LocalDateTime slaDueAt, boolean slaBreached, LocalDateTime resolvedAt, String resolutionNotes,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.incidentIdentifier = incidentIdentifier;
        this.assetId = assetId;
        this.assetIdentifier = assetIdentifier;
        this.assetName = assetName;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.assignedTeam = assignedTeam;
        this.assignedUser = assignedUser;
        this.detectedAt = detectedAt;
        this.slaDueAt = slaDueAt;
        this.slaBreached = slaBreached;
        this.resolvedAt = resolvedAt;
        this.resolutionNotes = resolutionNotes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public String getIncidentIdentifier() { return incidentIdentifier; }
    public UUID getAssetId() { return assetId; }
    public String getAssetIdentifier() { return assetIdentifier; }
    public String getAssetName() { return assetName; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public IncidentSeverity getSeverity() { return severity; }
    public IncidentStatus getStatus() { return status; }
    public String getAssignedTeam() { return assignedTeam; }
    public String getAssignedUser() { return assignedUser; }
    public LocalDateTime getDetectedAt() { return detectedAt; }
    public LocalDateTime getSlaDueAt() { return slaDueAt; }
    public boolean isSlaBreached() { return slaBreached; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public String getResolutionNotes() { return resolutionNotes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}