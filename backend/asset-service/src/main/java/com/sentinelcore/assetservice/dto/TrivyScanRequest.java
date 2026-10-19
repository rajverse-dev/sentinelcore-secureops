package com.sentinelcore.assetservice.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class TrivyScanRequest {

    @NotNull(message = "Asset is required")
    private UUID assetId;

    private String trivyJson;

    @Size(max = 255, message = "Scan target must not exceed 255 characters")
    private String scanTarget;

    public UUID getAssetId() {
        return assetId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
    }

    public String getTrivyJson() {
        return trivyJson;
    }

    public void setTrivyJson(String trivyJson) {
        this.trivyJson = trivyJson;
    }

    public String getScanTarget() {
        return scanTarget;
    }

    public void setScanTarget(String scanTarget) {
        this.scanTarget = scanTarget;
    }
}
