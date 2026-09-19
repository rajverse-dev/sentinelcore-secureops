package com.sentinelcore.assetservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.sentinelcore.assetservice.entity.IncidentSeverity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class IncidentRequest {

    @NotBlank(message = "Incident identifier is required")
    @Size(max = 50, message = "Incident identifier must not exceed 50 characters")
    private String incidentIdentifier;

    private UUID assetId;

    @NotBlank(message = "Incident title is required")
    @Size(max = 255, message = "Incident title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Incident description is required")
    @Size(max = 4000, message = "Incident description must not exceed 4000 characters")
    private String description;

    @NotNull(message = "Incident severity is required")
    private IncidentSeverity severity;

    private String assignedTeam;
    private String assignedUser;
    private LocalDateTime detectedAt;
    private LocalDateTime slaDueAt;
    private String resolutionNotes;

    public String getIncidentIdentifier() { return incidentIdentifier; }
    public void setIncidentIdentifier(String incidentIdentifier) { this.incidentIdentifier = incidentIdentifier; }
    public UUID getAssetId() { return assetId; }
    public void setAssetId(UUID assetId) { this.assetId = assetId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public IncidentSeverity getSeverity() { return severity; }
    public void setSeverity(IncidentSeverity severity) { this.severity = severity; }
    public String getAssignedTeam() { return assignedTeam; }
    public void setAssignedTeam(String assignedTeam) { this.assignedTeam = assignedTeam; }
    public String getAssignedUser() { return assignedUser; }
    public void setAssignedUser(String assignedUser) { this.assignedUser = assignedUser; }
    public LocalDateTime getDetectedAt() { return detectedAt; }
    public void setDetectedAt(LocalDateTime detectedAt) { this.detectedAt = detectedAt; }
    public LocalDateTime getSlaDueAt() { return slaDueAt; }
    public void setSlaDueAt(LocalDateTime slaDueAt) { this.slaDueAt = slaDueAt; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}