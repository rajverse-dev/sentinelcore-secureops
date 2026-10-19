package com.sentinelcore.assetservice.dto;

import com.sentinelcore.assetservice.entity.AssetStatus;
import com.sentinelcore.assetservice.entity.AssetType;
import com.sentinelcore.assetservice.entity.CloudProvider;
import com.sentinelcore.assetservice.entity.Environment;
import com.sentinelcore.assetservice.entity.RiskLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public class AssetRequest {

    @NotBlank(message = "Asset name is required")
    private String name;

    @NotNull(message = "Asset type is required")
    private AssetType type;

    @NotNull(message = "Cloud provider is required")
    private CloudProvider provider;

    @NotBlank(message = "Region is required")
    private String region;

    @NotNull(message = "Environment is required")
    private Environment environment;

    @NotBlank(message = "Asset identifier is required")
    private String identifier;

    private AssetStatus status;

    private RiskLevel riskLevel;

    private String owner;


    // Getters and Setters

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AssetType getType() {
        return type;
    }

    public void setType(AssetType type) {
        this.type = type;
    }

    public CloudProvider getProvider() {
        return provider;
    }

    public void setProvider(CloudProvider provider) {
        this.provider = provider;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Environment getEnvironment() {
        return environment;
    }

    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public AssetStatus getStatus() {
        return status;
    }

    public void setStatus(AssetStatus status) {
        this.status = status;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
