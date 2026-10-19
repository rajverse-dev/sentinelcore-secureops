package com.sentinelcore.assetservice.dto;

import com.sentinelcore.assetservice.entity.IncidentStatus;

import jakarta.validation.constraints.NotNull;

public class IncidentStatusRequest {

    @NotNull(message = "Incident status is required")
    private IncidentStatus status;

    private String notes;

    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}