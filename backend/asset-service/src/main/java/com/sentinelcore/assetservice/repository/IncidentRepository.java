package com.sentinelcore.assetservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sentinelcore.assetservice.entity.Incident;
import com.sentinelcore.assetservice.entity.IncidentSeverity;
import com.sentinelcore.assetservice.entity.IncidentStatus;
import com.sentinelcore.assetservice.entity.User;

public interface IncidentRepository extends JpaRepository<Incident, UUID> {

    List<Incident> findByOwnerUserOrderByDetectedAtDesc(User ownerUser);

    Optional<Incident> findByIdAndOwnerUser(UUID id, User ownerUser);

    boolean existsByIncidentIdentifierAndOwnerUser(String incidentIdentifier, User ownerUser);

    List<Incident> findByOwnerUserAndStatusOrderByDetectedAtDesc(User ownerUser, IncidentStatus status);

    List<Incident> findByOwnerUserAndSeverityOrderByDetectedAtDesc(User ownerUser, IncidentSeverity severity);
}