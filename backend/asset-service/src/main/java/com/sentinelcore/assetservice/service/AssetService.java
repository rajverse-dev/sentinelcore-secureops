package com.sentinelcore.assetservice.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.sentinelcore.assetservice.dto.AssetRequest;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.AssetStatus;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.exception.AssetNotFoundException;
import com.sentinelcore.assetservice.repository.AssetRepository;
import com.sentinelcore.assetservice.repository.UserRepository;


@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    public AssetService(AssetRepository assetRepository, UserRepository userRepository) {
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
    }

    // CREATE ASSET
    public Asset createAsset(AssetRequest request) {
        User owner = currentUser();

        if (assetRepository.existsByIdentifierAndOwnerUser(request.getIdentifier(), owner)) {
            throw new RuntimeException(
                    "Asset with identifier already exists"
            );
        }

        Asset asset = new Asset();
        asset.setOwnerUser(owner);

        asset.setName(request.getName());
        asset.setType(request.getType());
        asset.setProvider(request.getProvider());
        asset.setRegion(request.getRegion());
        asset.setEnvironment(request.getEnvironment());
        asset.setIdentifier(request.getIdentifier());
        asset.setOwner(request.getOwner());

        // Default values for a new asset
        asset.setStatus(
                request.getStatus() != null
                        ? request.getStatus()
                        : AssetStatus.ACTIVE
        );

        asset.setRiskLevel(
                request.getRiskLevel() != null
                        ? request.getRiskLevel()
                        : RiskLevel.LOW
        );

        return assetRepository.save(asset);
    }

    // GET ALL ASSETS
    public List<Asset> getAllAssets() {
        return assetRepository.findByOwnerUser(currentUser());
    }

    // GET ASSET BY ID
    public Asset getAssetById(UUID id) {

        return assetRepository.findByIdAndOwnerUser(id, currentUser())
                .orElseThrow(() ->
                        new AssetNotFoundException(
                                "Asset not found with id: " + id
                        )
                );
    }

    // UPDATE ASSET
    public Asset updateAsset(UUID id, AssetRequest request) {

        Asset asset = getAssetById(id);

        // Check whether identifier belongs to another asset
        if (!asset.getIdentifier().equals(request.getIdentifier())
                && assetRepository.existsByIdentifierAndOwnerUser(request.getIdentifier(), currentUser())) {

            throw new RuntimeException(
                    "Another asset with this identifier already exists"
            );
        }

        asset.setName(request.getName());
        asset.setType(request.getType());
        asset.setProvider(request.getProvider());
        asset.setRegion(request.getRegion());
        asset.setEnvironment(request.getEnvironment());
        asset.setIdentifier(request.getIdentifier());
        asset.setOwner(request.getOwner());

        if (request.getStatus() != null) {
            asset.setStatus(request.getStatus());
        }

        if (request.getRiskLevel() != null) {
            asset.setRiskLevel(request.getRiskLevel());
        }

        return assetRepository.save(asset);
    }

    // DELETE ASSET
    public void deleteAsset(UUID id) {

        Asset asset = getAssetById(id);

        assetRepository.delete(asset);
    }

    // SEARCH ASSETS
    public List<Asset> searchAssets(String name) {
        return assetRepository
                .findByOwnerUserAndNameContainingIgnoreCase(currentUser(), name);
    }

    // GET ASSETS BY STATUS
    public List<Asset> getAssetsByStatus(AssetStatus status) {
        return assetRepository.findByOwnerUserAndStatus(currentUser(), status);
    }

    // GET ASSETS BY RISK
    public List<Asset> getAssetsByRisk(RiskLevel riskLevel) {
        return assetRepository.findByOwnerUserAndRiskLevel(currentUser(), riskLevel);
    }

    public Asset getOwnedAsset(UUID id) {
        return getAssetById(id);
    }

    public User getCurrentUser() {
        return currentUser();
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }
}
