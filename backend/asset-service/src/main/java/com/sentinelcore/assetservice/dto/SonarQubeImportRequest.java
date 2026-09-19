package com.sentinelcore.assetservice.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SonarQubeImportRequest {

    private UUID assetId;

    @NotBlank(message = "Project key is required")
    @Size(max = 255, message = "Project key must not exceed 255 characters")
    private String projectKey;

    public UUID getAssetId() {
        return assetId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public void setProjectKey(String projectKey) {
        this.projectKey = projectKey;
    }
}
