package com.sentinelcore.assetservice.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sentinelcore.assetservice.dto.SonarQubeFindingResponse;
import com.sentinelcore.assetservice.dto.SonarQubeImportRequest;
import com.sentinelcore.assetservice.dto.SonarQubeImportSummaryResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.SonarQubeFinding;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.repository.SonarQubeFindingRepository;

@Service
public class SonarQubeIntegrationService {

    private final SonarQubeClient sonarQubeClient;
    private final SonarQubeFindingRepository findingRepository;
    private final AssetService assetService;

    public SonarQubeIntegrationService(
            SonarQubeClient sonarQubeClient,
            SonarQubeFindingRepository findingRepository,
            AssetService assetService) {
        this.sonarQubeClient = sonarQubeClient;
        this.findingRepository = findingRepository;
        this.assetService = assetService;
    }

    @Transactional
    public SonarQubeImportSummaryResponse importFindings(SonarQubeImportRequest request) {
        User owner = assetService.getCurrentUser();
        Asset asset = request.getAssetId() != null
                ? assetService.getOwnedAsset(request.getAssetId())
                : null;

        List<SonarQubeIssue> issues = sonarQubeClient.fetchSecurityIssues(request.getProjectKey());
        int created = 0;
        int updated = 0;
        List<SonarQubeFindingResponse> responses = new ArrayList<>();

        for (SonarQubeIssue issue : issues) {
            SonarQubeFinding finding = findingRepository
                    .findByOwnerUserAndIssueKey(owner, issue.issueKey())
                    .orElse(null);

            boolean isCreated = finding == null;
            if (isCreated) {
                finding = new SonarQubeFinding();
                finding.setOwnerUser(owner);
                finding.setIssueKey(issue.issueKey());
                created++;
            } else {
                updated++;
            }

            applyIssue(finding, asset, issue);
            responses.add(toResponse(findingRepository.save(finding)));
        }

        return new SonarQubeImportSummaryResponse(
                request.getProjectKey(),
                issues.size(),
                created,
                updated,
                updated,
                responses);
    }

    @Transactional(readOnly = true)
    public List<SonarQubeFindingResponse> getFindings() {
        return findingRepository.findByOwnerUser(assetService.getCurrentUser()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SonarQubeFindingResponse> getProjectFindings(String projectKey) {
        return findingRepository.findByOwnerUserAndProjectKey(assetService.getCurrentUser(), projectKey).stream()
                .map(this::toResponse)
                .toList();
    }

    private void applyIssue(SonarQubeFinding finding, Asset asset, SonarQubeIssue issue) {
        if (asset != null) {
            finding.setAsset(asset);
        }
        finding.setRule(truncate(issue.rule(), 255));
        finding.setSeverity(issue.severity());
        finding.setMessage(truncate(issue.message(), 4000));
        finding.setComponent(truncate(issue.component(), 1000));
        finding.setLineNumber(issue.lineNumber());
        finding.setStatus(truncate(issue.status(), 100));
        finding.setProjectKey(truncate(issue.projectKey(), 255));
        finding.setSonarCreatedAt(issue.sonarCreatedAt());
        finding.setSonarUpdatedAt(issue.sonarUpdatedAt());
    }

    private SonarQubeFindingResponse toResponse(SonarQubeFinding finding) {
        Asset asset = finding.getAsset();
        return new SonarQubeFindingResponse(
                finding.getId(),
                asset != null ? asset.getId() : null,
                asset != null ? asset.getIdentifier() : null,
                finding.getIssueKey(),
                finding.getRule(),
                finding.getSeverity(),
                finding.getMessage(),
                finding.getComponent(),
                finding.getLineNumber(),
                finding.getStatus(),
                finding.getProjectKey(),
                finding.getSonarCreatedAt(),
                finding.getSonarUpdatedAt(),
                finding.getCreatedAt(),
                finding.getUpdatedAt());
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }
}
