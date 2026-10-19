package com.sentinelcore.assetservice.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sentinelcore.assetservice.entity.CveRecord;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

public interface CveRecordRepository extends JpaRepository<CveRecord, UUID> {

    Optional<CveRecord> findByIdAndOwnerUser(UUID id, User ownerUser);

    Optional<CveRecord> findByCveIdIgnoreCaseAndOwnerUser(String cveId, User ownerUser);

    List<CveRecord> findByOwnerUser(User ownerUser);

    List<CveRecord> findByOwnerUserAndSeverity(User ownerUser, VulnerabilitySeverity severity);

    boolean existsByCveIdIgnoreCaseAndOwnerUser(String cveId, User ownerUser);

    boolean existsByCveIdIgnoreCaseAndOwnerUserAndIdNot(String cveId, User ownerUser, UUID id);

    @Query("SELECT c FROM CveRecord c WHERE c.ownerUser = :ownerUser AND (" +
           "LOWER(c.cveId) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.affectedSoftware) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<CveRecord> searchByOwnerUser(@Param("ownerUser") User ownerUser, @Param("query") String query);
}
