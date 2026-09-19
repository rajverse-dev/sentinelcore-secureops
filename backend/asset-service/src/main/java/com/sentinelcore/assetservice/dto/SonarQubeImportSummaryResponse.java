package com.sentinelcore.assetservice.dto;

import java.util.List;

public class SonarQubeImportSummaryResponse {

    private final String projectKey;
    private final int importedFindings;
    private final int createdFindings;
    private final int updatedFindings;
    private final int duplicateFindingsPrevented;
    private final List<SonarQubeFindingResponse> findings;

    public SonarQubeImportSummaryResponse(
            String projectKey,
            int importedFindings,
            int createdFindings,
            int updatedFindings,
            int duplicateFindingsPrevented,
            List<SonarQubeFindingResponse> findings) {
        this.projectKey = projectKey;
        this.importedFindings = importedFindings;
        this.createdFindings = createdFindings;
        this.updatedFindings = updatedFindings;
        this.duplicateFindingsPrevented = duplicateFindingsPrevented;
        this.findings = findings;
    }

    public String getProjectKey() {
        return projectKey;
    }

    public int getImportedFindings() {
        return importedFindings;
    }

    public int getCreatedFindings() {
        return createdFindings;
    }

    public int getUpdatedFindings() {
        return updatedFindings;
    }

    public int getDuplicateFindingsPrevented() {
        return duplicateFindingsPrevented;
    }

    public List<SonarQubeFindingResponse> getFindings() {
        return findings;
    }
}
