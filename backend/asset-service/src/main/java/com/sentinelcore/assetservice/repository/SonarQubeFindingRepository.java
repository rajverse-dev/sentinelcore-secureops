package com.sentinelcore.assetservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sentinelcore.assetservice.entity.SonarQubeFinding;
import com.sentinelcore.assetservice.entity.User;

public interface SonarQubeFindingRepository extends JpaRepository<SonarQubeFinding, UUID> {

    List<SonarQubeFinding> findByOwnerUser(User ownerUser);

    List<SonarQubeFinding> findByOwnerUserAndProjectKey(User ownerUser, String projectKey);

    Optional<SonarQubeFinding> findByOwnerUserAndIssueKey(User ownerUser, String issueKey);
}
