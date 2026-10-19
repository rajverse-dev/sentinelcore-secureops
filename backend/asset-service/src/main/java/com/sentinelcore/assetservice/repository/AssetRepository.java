package com.sentinelcore.assetservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.AssetStatus;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.User;


public interface AssetRepository extends JpaRepository<Asset, UUID> {
    // Custom query methods can be defined here if needed
    boolean existsByIdentifierAndOwnerUser(String identifier, User ownerUser);

    Optional<Asset> findByIdAndOwnerUser(UUID id, User ownerUser);

    List<Asset> findByOwnerUser(User ownerUser);

    List<Asset> findByOwnerUserAndStatus(User ownerUser, AssetStatus status);



    List<Asset> findByOwnerUserAndRiskLevel(User ownerUser, RiskLevel riskLevel);



    List<Asset> findByOwnerUserAndNameContainingIgnoreCase(User ownerUser, String name);

}
