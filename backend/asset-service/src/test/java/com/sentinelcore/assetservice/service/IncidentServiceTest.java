package com.sentinelcore.assetservice.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.lenient;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sentinelcore.assetservice.dto.IncidentRequest;
import com.sentinelcore.assetservice.dto.IncidentResponse;
import com.sentinelcore.assetservice.dto.IncidentStatusRequest;
import com.sentinelcore.assetservice.entity.Incident;
import com.sentinelcore.assetservice.entity.IncidentHistory;
import com.sentinelcore.assetservice.entity.IncidentSeverity;
import com.sentinelcore.assetservice.entity.IncidentStatus;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.exception.IncidentNotFoundException;
import com.sentinelcore.assetservice.exception.InvalidIncidentTransitionException;
import com.sentinelcore.assetservice.repository.IncidentHistoryRepository;
import com.sentinelcore.assetservice.repository.IncidentRepository;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;

    @Mock
    private IncidentHistoryRepository historyRepository;

    @Mock
    private AssetService assetService;

    private IncidentService incidentService;
    private User currentUser;

    @BeforeEach
    void setUp() {
        incidentService = new IncidentService(incidentRepository, historyRepository, assetService);
        currentUser = new User("Alice", "alice@example.com", "password", "USER", true);
        currentUser.setId(UUID.randomUUID());
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        lenient().when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> {
            Incident incident = invocation.getArgument(0);
            if (incident.getId() == null) {
                incident.setId(UUID.randomUUID());
            }
            if (incident.getDetectedAt() == null) {
                incident.setDetectedAt(LocalDateTime.now());
            }
            return incident;
        });
    }

    @Test
    void createIncidentStoresOwnerAndAuditEntry() {
        when(incidentRepository.existsByIncidentIdentifierAndOwnerUser("INC-2024-1247", currentUser)).thenReturn(false);

        IncidentResponse response = incidentService.createIncident(request());

        assertNotNull(response.getId());
        assertEquals("INC-2024-1247", response.getIncidentIdentifier());
        assertEquals(IncidentStatus.NEW, response.getStatus());
        verify(historyRepository).save(any(IncidentHistory.class));
    }

    @Test
    void duplicateIncidentIsRejected() {
        when(incidentRepository.existsByIncidentIdentifierAndOwnerUser("INC-2024-1247", currentUser)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> incidentService.createIncident(request()));
        verify(incidentRepository, never()).save(any(Incident.class));
    }

    @Test
    void lifecycleTransitionsAreValidated() {
        Incident incident = storedIncident(IncidentStatus.NEW);
        when(incidentRepository.findByIdAndOwnerUser(incident.getId(), currentUser)).thenReturn(Optional.of(incident));

        IncidentStatusRequest investigating = statusRequest(IncidentStatus.INVESTIGATING);
        assertEquals(IncidentStatus.INVESTIGATING, incidentService.updateStatus(incident.getId(), investigating).getStatus());

        incident.setStatus(IncidentStatus.INVESTIGATING);
        assertEquals(IncidentStatus.CONTAINED, incidentService.updateStatus(incident.getId(), statusRequest(IncidentStatus.CONTAINED)).getStatus());

        incident.setStatus(IncidentStatus.CONTAINED);
        IncidentResponse resolved = incidentService.updateStatus(incident.getId(), statusRequest(IncidentStatus.RESOLVED));
        assertEquals(IncidentStatus.RESOLVED, resolved.getStatus());
        assertNotNull(resolved.getResolvedAt());
    }

    @Test
    void invalidLifecycleTransitionIsRejected() {
        Incident incident = storedIncident(IncidentStatus.NEW);
        when(incidentRepository.findByIdAndOwnerUser(incident.getId(), currentUser)).thenReturn(Optional.of(incident));

        assertThrows(InvalidIncidentTransitionException.class,
                () -> incidentService.updateStatus(incident.getId(), statusRequest(IncidentStatus.RESOLVED)));
    }

    @Test
    void slaBreachIsCalculatedFromCurrentTime() {
        Incident incident = storedIncident(IncidentStatus.INVESTIGATING);
        incident.setSlaDueAt(LocalDateTime.now().minusMinutes(1));
        when(incidentRepository.findByIdAndOwnerUser(incident.getId(), currentUser)).thenReturn(Optional.of(incident));

        assertEquals(true, incidentService.getIncident(incident.getId()).isSlaBreached());
    }

    @Test
    void crossUserIncidentIsNotReturned() {
        UUID id = UUID.randomUUID();
        when(incidentRepository.findByIdAndOwnerUser(id, currentUser)).thenReturn(Optional.empty());

        assertThrows(IncidentNotFoundException.class, () -> incidentService.getIncident(id));
    }

    @Test
    void filtersIncidentsByStatus() {
        when(incidentRepository.findByOwnerUserAndStatusOrderByDetectedAtDesc(currentUser, IncidentStatus.INVESTIGATING))
                .thenReturn(List.of(storedIncident(IncidentStatus.INVESTIGATING)));

        assertEquals(1, incidentService.getIncidents(IncidentStatus.INVESTIGATING, null).size());
    }

    private IncidentRequest request() {
        IncidentRequest request = new IncidentRequest();
        request.setIncidentIdentifier("INC-2024-1247");
        request.setTitle("Failed login attempts");
        request.setDescription("Multiple failed login attempts detected");
        request.setSeverity(IncidentSeverity.HIGH);
        request.setAssignedTeam("Security Team");
        request.setSlaDueAt(LocalDateTime.now().plusHours(2));
        return request;
    }

    private IncidentStatusRequest statusRequest(IncidentStatus status) {
        IncidentStatusRequest request = new IncidentStatusRequest();
        request.setStatus(status);
        return request;
    }

    private Incident storedIncident(IncidentStatus status) {
        Incident incident = new Incident();
        incident.setId(UUID.randomUUID());
        incident.setOwnerUser(currentUser);
        incident.setIncidentIdentifier("INC-2024-1247");
        incident.setTitle("Failed login attempts");
        incident.setDescription("Multiple failed login attempts detected");
        incident.setSeverity(IncidentSeverity.HIGH);
        incident.setStatus(status);
        incident.setDetectedAt(LocalDateTime.now().minusMinutes(30));
        return incident;
    }
}