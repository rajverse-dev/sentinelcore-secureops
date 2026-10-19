package com.sentinelcore.assetservice.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sentinelcore.assetservice.entity.IncidentHistory;

public interface IncidentHistoryRepository extends JpaRepository<IncidentHistory, UUID> {

    List<IncidentHistory> findByIncidentIdOrderByChangedAtDesc(UUID incidentId);
}