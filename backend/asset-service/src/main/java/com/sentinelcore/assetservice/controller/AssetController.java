package com.sentinelcore.assetservice.controller;

import com.sentinelcore.assetservice.dto.AssetRequest;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.AssetStatus;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    // CREATE ASSET
    @PostMapping
    public ResponseEntity<Asset> createAsset(
            @Valid @RequestBody AssetRequest request) {

        Asset asset = assetService.createAsset(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(asset);
    }

    // GET ALL ASSETS
    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets() {

        return ResponseEntity.ok(
                assetService.getAllAssets()
        );
    }

    // GET ASSET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(
            @PathVariable UUID id) {

        return ResponseEntity.ok(
                assetService.getAssetById(id)
        );
    }

    // UPDATE ASSET
    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(
            @PathVariable UUID id,
            @Valid @RequestBody AssetRequest request) {

        return ResponseEntity.ok(
                assetService.updateAsset(id, request)
        );
    }

    // DELETE ASSET
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAsset(
            @PathVariable UUID id) {

        assetService.deleteAsset(id);

        return ResponseEntity.ok(
                "Asset deleted successfully"
        );
    }

    // SEARCH ASSETS
    @GetMapping("/search")
    public ResponseEntity<List<Asset>> searchAssets(
            @RequestParam String name) {

        return ResponseEntity.ok(
                assetService.searchAssets(name)
        );
    }

    // FILTER BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Asset>> getAssetsByStatus(
            @PathVariable AssetStatus status) {

        return ResponseEntity.ok(
                assetService.getAssetsByStatus(status)
        );
    }

    // FILTER BY RISK
    @GetMapping("/risk/{riskLevel}")
    public ResponseEntity<List<Asset>> getAssetsByRisk(
            @PathVariable RiskLevel riskLevel) {

        return ResponseEntity.ok(
                assetService.getAssetsByRisk(riskLevel)
        );
    }
}
