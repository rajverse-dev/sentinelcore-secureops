package com.sentinelcore.assetservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import com.sentinelcore.assetservice.dto.IncidentHistoryResponse;
import com.sentinelcore.assetservice.dto.IncidentRequest;
import com.sentinelcore.assetservice.dto.IncidentResponse;
import com.sentinelcore.assetservice.dto.IncidentStatusRequest;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.Incident;
import com.sentinelcore.assetservice.entity.IncidentHistory;
import com.sentinelcore.assetservice.entity.IncidentSeverity;
import com.sentinelcore.assetservice.entity.IncidentStatus;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.exception.DuplicateIncidentException;
import com.sentinelcore.assetservice.exception.IncidentNotFoundException;
import com.sentinelcore.assetservice.exception.InvalidIncidentTransitionException;
import com.sentinelcore.assetservice.repository.IncidentHistoryRepository;
import com.sentinelcore.assetservice.repository.IncidentRepository;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentHistoryRepository historyRepository;
    private final AssetService assetService;
    private final AuditService auditService;

    @Autowired
    public IncidentService(
            IncidentRepository incidentRepository,
            IncidentHistoryRepository historyRepository,
            AssetService assetService,
            AuditService auditService) {
        this.incidentRepository = incidentRepository;
        this.historyRepository = historyRepository;
        this.assetService = assetService;
        this.auditService = auditService;
    }

    public IncidentService(
            IncidentRepository incidentRepository,
            IncidentHistoryRepository historyRepository,
            AssetService assetService) {
        this(incidentRepository, historyRepository, assetService, null);
    }

    @Transactional
    public IncidentResponse createIncident(IncidentRequest request) {
        User owner = currentUser();
        if (incidentRepository.existsByIncidentIdentifierAndOwnerUser(request.getIncidentIdentifier(), owner)) {
            throw new DuplicateIncidentException("Incident already exists: " + request.getIncidentIdentifier());
        }

        Incident incident = new Incident();
        incident.setOwnerUser(owner);
        applyRequest(incident, request);
        incident.setStatus(IncidentStatus.NEW);
        Incident saved = incidentRepository.save(incident);
        recordHistory(saved, null, IncidentStatus.NEW, "CREATED", "Incident created");
        if (auditService != null) auditService.record(owner, "INCIDENT_CREATED", "INCIDENT", saved.getId(), "SUCCESS", saved.getSeverity().name(), "Incident created", null, saved.getStatus().name());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidents(IncidentStatus status, IncidentSeverity severity) {
        User owner = currentUser();
        List<Incident> incidents;
        if (status != null) {
            incidents = incidentRepository.findByOwnerUserAndStatusOrderByDetectedAtDesc(owner, status);
        } else if (severity != null) {
            incidents = incidentRepository.findByOwnerUserAndSeverityOrderByDetectedAtDesc(owner, severity);
        } else {
            incidents = incidentRepository.findByOwnerUserOrderByDetectedAtDesc(owner);
        }
        return incidents.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public IncidentResponse getIncident(UUID id) {
        return toResponse(findOwnedIncident(id));
    }

    @Transactional
    public IncidentResponse updateIncident(UUID id, IncidentRequest request) {
        Incident incident = findOwnedIncident(id);
        if (!incident.getIncidentIdentifier().equals(request.getIncidentIdentifier())
                && incidentRepository.existsByIncidentIdentifierAndOwnerUser(
                        request.getIncidentIdentifier(), currentUser())) {
            throw new DuplicateIncidentException("Incident already exists: " + request.getIncidentIdentifier());
        }
        applyRequest(incident, request);
        Incident saved = incidentRepository.save(incident);
        recordHistory(saved, saved.getStatus(), saved.getStatus(), "UPDATED", "Incident details updated");
        return toResponse(saved);
    }

    @Transactional
    public IncidentResponse updateStatus(UUID id, IncidentStatusRequest request) {
        Incident incident = findOwnedIncident(id);
        IncidentStatus current = incident.getStatus();
        IncidentStatus next = request.getStatus();
        validateTransition(current, next);

        incident.setStatus(next);
        if (next == IncidentStatus.RESOLVED && incident.getResolvedAt() == null) {
            incident.setResolvedAt(LocalDateTime.now());
        } else if (next != IncidentStatus.RESOLVED) {
            incident.setResolvedAt(null);
        }
        Incident saved = incidentRepository.save(incident);
        recordHistory(saved, current, next, "STATUS_CHANGED", request.getNotes());
        if (auditService != null) auditService.record(currentUser(), "INCIDENT_STATUS_CHANGED", "INCIDENT", saved.getId(), "SUCCESS", saved.getSeverity().name(), "Incident status changed", current.name(), next.name());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<IncidentHistoryResponse> getHistory(UUID id) {
        findOwnedIncident(id);
        return historyRepository.findByIncidentIdOrderByChangedAtDesc(id).stream()
                .map(history -> new IncidentHistoryResponse(
                        history.getId(), history.getFromStatus(), history.getToStatus(),
                        history.getAction(), history.getNotes(), history.getChangedBy().getEmail(),
                        history.getChangedAt()))
                .toList();
    }

    private void applyRequest(Incident incident, IncidentRequest request) {
        incident.setIncidentIdentifier(request.getIncidentIdentifier().trim());
        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());
        incident.setAssignedTeam(request.getAssignedTeam());
        incident.setAssignedUser(request.getAssignedUser());
        incident.setDetectedAt(request.getDetectedAt());
        incident.setSlaDueAt(request.getSlaDueAt());
        incident.setResolutionNotes(request.getResolutionNotes());
        if (request.getAssetId() != null) {
            incident.setAsset(assetService.getOwnedAsset(request.getAssetId()));
        } else {
            incident.setAsset(null);
        }
    }

    private void validateTransition(IncidentStatus current, IncidentStatus next) {
        if (current == next) {
            return;
        }
        boolean valid = (current == IncidentStatus.NEW && next == IncidentStatus.INVESTIGATING)
                || (current == IncidentStatus.INVESTIGATING && next == IncidentStatus.CONTAINED)
                || (current == IncidentStatus.CONTAINED && next == IncidentStatus.RESOLVED);
        if (!valid) {
            throw new InvalidIncidentTransitionException(
                    "Invalid incident status transition: " + current + " -> " + next);
        }
    }

    private void recordHistory(Incident incident, IncidentStatus from, IncidentStatus to,
            String action, String notes) {
        IncidentHistory history = new IncidentHistory();
        history.setIncident(incident);
        history.setChangedBy(currentUser());
        history.setFromStatus(from);
        history.setToStatus(to);
        history.setAction(action);
        history.setNotes(notes);
        historyRepository.save(history);
    }

    private Incident findOwnedIncident(UUID id) {
        return incidentRepository.findByIdAndOwnerUser(id, currentUser())
                .orElseThrow(() -> new IncidentNotFoundException("Incident not found with id: " + id));
    }

    private User currentUser() {
        return assetService.getCurrentUser();
    }

    private IncidentResponse toResponse(Incident incident) {
        Asset asset = incident.getAsset();
        boolean slaBreached = incident.getSlaDueAt() != null
                && incident.getStatus() != IncidentStatus.RESOLVED
                && LocalDateTime.now().isAfter(incident.getSlaDueAt());
        return new IncidentResponse(
                incident.getId(), incident.getIncidentIdentifier(),
                asset != null ? asset.getId() : null,
                asset != null ? asset.getIdentifier() : null,
                asset != null ? asset.getName() : null,
                incident.getTitle(), incident.getDescription(), incident.getSeverity(),
                incident.getStatus(), incident.getAssignedTeam(), incident.getAssignedUser(),
                incident.getDetectedAt(), incident.getSlaDueAt(), slaBreached,
                incident.getResolvedAt(), incident.getResolutionNotes(),
                incident.getCreatedAt(), incident.getUpdatedAt());
    }
}