package com.sentinelcore.assetservice.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sentinelcore.assetservice.dto.CveResponse;
import com.sentinelcore.assetservice.dto.RemediationItemResponse;
import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.dto.RiskReportResponse;
import com.sentinelcore.assetservice.dto.SonarQubeFindingResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.CveRecord;
import com.sentinelcore.assetservice.entity.PatchStatus;
import com.sentinelcore.assetservice.entity.RiskLevel;
import com.sentinelcore.assetservice.entity.SonarQubeFinding;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;
import com.sentinelcore.assetservice.repository.CveRecordRepository;
import com.sentinelcore.assetservice.repository.SonarQubeFindingRepository;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@Service
public class RiskReportService {

    private final AssetService assetService;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final RiskAssessmentService riskAssessmentService;
    private final CveRecordRepository cveRecordRepository;
    private final SonarQubeFindingRepository sonarQubeFindingRepository;

    public RiskReportService(
            AssetService assetService,
            VulnerabilityRepository vulnerabilityRepository,
            RiskAssessmentService riskAssessmentService,
            CveRecordRepository cveRecordRepository,
            SonarQubeFindingRepository sonarQubeFindingRepository) {
        this.assetService = assetService;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.riskAssessmentService = riskAssessmentService;
        this.cveRecordRepository = cveRecordRepository;
        this.sonarQubeFindingRepository = sonarQubeFindingRepository;
    }

    @Transactional(readOnly = true)
    public RiskReportResponse generateCurrentReport() {
        User user = assetService.getCurrentUser();
        List<Asset> assets = assetService.getAllAssets();
        List<RiskAssessmentResponse> riskAssessments = riskAssessmentService.calculateAllRiskAssessments();
        List<Vulnerability> vulnerabilities = vulnerabilityRepository.findByAssetOwnerUser(user);
        List<CveRecord> cveRecords = cveRecordRepository.findByOwnerUser(user);
        List<SonarQubeFinding> sonarQubeFindings = sonarQubeFindingRepository.findByOwnerUser(user);

        UUID reportId = UUID.randomUUID();
        LocalDateTime generatedAt = LocalDateTime.now();
        String generatedBy = user.getEmail();
        String scope = "Enterprise Infrastructure & Vulnerability Posture";

        int totalAssetsAssessed = assets.size();
        int totalVulnerabilities = vulnerabilities.size();

        int criticalVulnerabilities = 0;
        int highVulnerabilities = 0;
        int mediumVulnerabilities = 0;
        int lowVulnerabilities = 0;
        int openVulnerabilities = 0;
        int patchedVulnerabilities = 0;
        int pendingPatches = 0;

        for (Vulnerability v : vulnerabilities) {
            if (v.getSeverity() == VulnerabilitySeverity.CRITICAL) {
                criticalVulnerabilities++;
            } else if (v.getSeverity() == VulnerabilitySeverity.HIGH) {
                highVulnerabilities++;
            } else if (v.getSeverity() == VulnerabilitySeverity.MEDIUM) {
                mediumVulnerabilities++;
            } else if (v.getSeverity() == VulnerabilitySeverity.LOW) {
                lowVulnerabilities++;
            }

            boolean isResolved = v.getStatus() == VulnerabilityStatus.RESOLVED;
            boolean isPatchedOrVerified = v.getPatchStatus() == PatchStatus.PATCHED || v.getPatchStatus() == PatchStatus.VERIFIED;

            if (isResolved || isPatchedOrVerified) {
                patchedVulnerabilities++;
            } else {
                openVulnerabilities++;
            }

            if (v.getPatchStatus() == PatchStatus.OPEN || v.getPatchStatus() == PatchStatus.PATCHING) {
                pendingPatches++;
            }
        }

        // CVSS calculations
        BigDecimal highestCvssScore = null;
        BigDecimal cvssSum = BigDecimal.ZERO;
        int cvssCount = 0;

        for (CveRecord cve : cveRecords) {
            if (cve.getCvssScore() != null) {
                if (highestCvssScore == null || cve.getCvssScore().compareTo(highestCvssScore) > 0) {
                    highestCvssScore = cve.getCvssScore();
                }
                cvssSum = cvssSum.add(cve.getCvssScore());
                cvssCount++;
            }
        }

        BigDecimal averageCvssScore = cvssCount > 0
                ? cvssSum.divide(BigDecimal.valueOf(cvssCount), 2, RoundingMode.HALF_UP)
                : null;

        // Overall risk score
        BigDecimal overallRiskScore = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        if (!riskAssessments.isEmpty()) {
            BigDecimal scoreSum = BigDecimal.ZERO;
            for (RiskAssessmentResponse ra : riskAssessments) {
                if (ra.getRiskScore() != null) {
                    scoreSum = scoreSum.add(ra.getRiskScore());
                }
            }
            overallRiskScore = scoreSum.divide(BigDecimal.valueOf(riskAssessments.size()), 2, RoundingMode.HALF_UP);
        }

        RiskLevel overallRiskCategory = determineRiskCategory(overallRiskScore);

        // Highest risk assets (sorted descending by risk score)
        List<RiskAssessmentResponse> highestRiskAssets = riskAssessments.stream()
                .sorted(Comparator.comparing(RiskAssessmentResponse::getRiskScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();

        // CVE Responses
        List<CveResponse> cveResponses = cveRecords.stream()
                .map(this::toCveResponse)
                .toList();

        // Pending Remediations
        List<RemediationItemResponse> pendingRemediations = new ArrayList<>();
        for (Vulnerability v : vulnerabilities) {
            boolean isResolved = v.getStatus() == VulnerabilityStatus.RESOLVED;
            boolean isPatchedOrVerified = v.getPatchStatus() == PatchStatus.PATCHED || v.getPatchStatus() == PatchStatus.VERIFIED;
            if (!isResolved && !isPatchedOrVerified) {
                pendingRemediations.add(toRemediationItem(v));
            }
        }
        pendingRemediations.sort(Comparator.comparing(RemediationItemResponse::getSeverity, Comparator.nullsLast(Comparator.naturalOrder())));

        // SonarQube Responses
        List<SonarQubeFindingResponse> sonarQubeResponses = sonarQubeFindings.stream()
                .map(this::toSonarQubeResponse)
                .toList();

        int trivyFindingsCount = (int) vulnerabilities.stream()
                .filter(v -> v.getCveRecord() != null || (v.getVulnerabilityIdentifier() != null && v.getVulnerabilityIdentifier().toUpperCase().startsWith("CVE-")))
                .count();

        String executiveSummary = buildExecutiveSummary(
                totalAssetsAssessed,
                totalVulnerabilities,
                criticalVulnerabilities,
                highVulnerabilities,
                overallRiskScore,
                overallRiskCategory,
                patchedVulnerabilities,
                pendingPatches);

        return new RiskReportResponse(
                reportId,
                generatedAt,
                generatedBy,
                scope,
                executiveSummary,
                overallRiskScore,
                overallRiskCategory,
                totalAssetsAssessed,
                totalVulnerabilities,
                criticalVulnerabilities,
                highVulnerabilities,
                mediumVulnerabilities,
                lowVulnerabilities,
                openVulnerabilities,
                patchedVulnerabilities,
                pendingPatches,
                highestCvssScore,
                averageCvssScore,
                highestRiskAssets,
                cveResponses,
                pendingRemediations,
                sonarQubeResponses,
                trivyFindingsCount);
    }

    public String exportReportAsMarkdown(RiskReportResponse report) {
        StringBuilder sb = new StringBuilder();
        sb.append("# SentinelCore SecureOps - Risk Assessment Report\n\n");
        sb.append("**Report ID:** ").append(report.getReportId()).append("\n");
        sb.append("**Generated At:** ").append(report.getGeneratedAt()).append("\n");
        sb.append("**Generated By:** ").append(report.getGeneratedBy()).append("\n");
        sb.append("**Overall Risk Score:** ").append(report.getOverallRiskScore()).append(" / 100 (")
                .append(report.getOverallRiskCategory()).append(" Risk)\n\n");

        sb.append("## Executive Summary\n\n");
        sb.append(report.getExecutiveSummary()).append("\n\n");

        sb.append("## Key Security Metrics\n\n");
        sb.append("| Metric | Count |\n");
        sb.append("| --- | --- |\n");
        sb.append("| Total Assets Assessed | ").append(report.getTotalAssetsAssessed()).append(" |\n");
        sb.append("| Total Vulnerabilities | ").append(report.getTotalVulnerabilities()).append(" |\n");
        sb.append("| Critical Severity | ").append(report.getCriticalVulnerabilities()).append(" |\n");
        sb.append("| High Severity | ").append(report.getHighVulnerabilities()).append(" |\n");
        sb.append("| Medium Severity | ").append(report.getMediumVulnerabilities()).append(" |\n");
        sb.append("| Low Severity | ").append(report.getLowVulnerabilities()).append(" |\n");
        sb.append("| Active / Open Vulnerabilities | ").append(report.getOpenVulnerabilities()).append(" |\n");
        sb.append("| Patched / Resolved | ").append(report.getPatchedVulnerabilities()).append(" |\n");
        sb.append("| Pending Patches | ").append(report.getPendingPatches()).append(" |\n");
        sb.append("| Highest CVSS Score | ").append(report.getHighestCvssScore() != null ? report.getHighestCvssScore() : "N/A").append(" |\n");
        sb.append("| Average CVSS Score | ").append(report.getAverageCvssScore() != null ? report.getAverageCvssScore() : "N/A").append(" |\n\n");

        sb.append("## Highest-Risk Assets\n\n");
        if (report.getHighestRiskAssets() == null || report.getHighestRiskAssets().isEmpty()) {
            sb.append("_No monitored assets found._\n\n");
        } else {
            sb.append("| Asset | Environment | Risk Score | Risk Category | Open Vulns | Highest CVSS |\n");
            sb.append("| --- | --- | --- | --- | --- | --- |\n");
            for (RiskAssessmentResponse a : report.getHighestRiskAssets()) {
                sb.append("| ").append(a.getAssetName()).append(" (").append(a.getAssetIdentifier()).append(") | ")
                        .append(a.getEnvironment()).append(" | ")
                        .append(a.getRiskScore()).append(" | ")
                        .append(a.getRiskCategory()).append(" | ")
                        .append(a.getOpenVulnerabilityCount()).append(" | ")
                        .append(a.getHighestCvssScore() != null ? a.getHighestCvssScore() : "N/A").append(" |\n");
            }
            sb.append("\n");
        }

        sb.append("## Pending Remediations\n\n");
        if (report.getPendingRemediations() == null || report.getPendingRemediations().isEmpty()) {
            sb.append("_No pending remediations required. All vulnerabilities are patched or resolved._\n\n");
        } else {
            sb.append("| Vulnerability | Asset | Severity | Patch Status | Remediation Action | Due Date |\n");
            sb.append("| --- | --- | --- | --- | --- | --- |\n");
            for (RemediationItemResponse item : report.getPendingRemediations()) {
                sb.append("| ").append(item.getVulnerabilityIdentifier()).append(" - ").append(item.getTitle()).append(" | ")
                        .append(item.getAssetName()).append(" | ")
                        .append(item.getSeverity()).append(" | ")
                        .append(item.getPatchStatus() != null ? item.getPatchStatus() : "OPEN").append(" | ")
                        .append(item.getRemediation() != null ? item.getRemediation().replace("|", "/") : "Review security advisories").append(" | ")
                        .append(item.getDueDate() != null ? item.getDueDate() : "Not set").append(" |\n");
            }
            sb.append("\n");
        }

        sb.append("## Integration Findings Summary\n\n");
        sb.append("- **SonarQube Security Issues:** ").append(report.getSonarQubeFindings() != null ? report.getSonarQubeFindings().size() : 0).append(" finding(s) imported\n");
        sb.append("- **Trivy Container Scan Findings:** ").append(report.getTrivyFindingsCount()).append(" finding(s) parsed\n\n");

        return sb.toString();
    }

    private String buildExecutiveSummary(
            int totalAssets,
            int totalVulns,
            int criticalCount,
            int highCount,
            BigDecimal overallRiskScore,
            RiskLevel overallRiskCategory,
            int patchedCount,
            int pendingPatches) {
        if (totalAssets == 0) {
            return "No monitored assets or vulnerability findings are currently registered in your SentinelCore SecureOps environment. To establish an enterprise risk baseline, register infrastructure assets and execute automated vulnerability scans.";
        }

        return String.format(
                "Enterprise security assessment evaluated %d infrastructure asset(s) with %d total vulnerability finding(s). The enterprise posture reflects an overall risk score of %s/100 (%s risk category). Critical exposures include %d critical-severity vulnerability(ies) and %d high-severity finding(s). Currently, %d finding(s) have verified/completed patches, while %d vulnerability patch(es) remain in the active remediation queue.",
                totalAssets,
                totalVulns,
                overallRiskScore,
                overallRiskCategory,
                criticalCount,
                highCount,
                patchedCount,
                pendingPatches);
    }

    private RiskLevel determineRiskCategory(BigDecimal score) {
        if (score.compareTo(BigDecimal.valueOf(75)) >= 0) {
            return RiskLevel.CRITICAL;
        }
        if (score.compareTo(BigDecimal.valueOf(50)) >= 0) {
            return RiskLevel.HIGH;
        }
        if (score.compareTo(BigDecimal.valueOf(25)) >= 0) {
            return RiskLevel.MEDIUM;
        }
        return RiskLevel.LOW;
    }

    private CveResponse toCveResponse(CveRecord cve) {
        return new CveResponse(
                cve.getId(),
                cve.getCveId(),
                cve.getCvssScore(),
                cve.getSeverity(),
                cve.getDescription(),
                cve.getAffectedSoftware(),
                cve.getAffectedVersion(),
                cve.getRemediation(),
                cve.getReferences(),
                cve.getPublishedAt(),
                cve.getLastModifiedAt(),
                cve.getCreatedAt(),
                cve.getUpdatedAt());
    }

    private RemediationItemResponse toRemediationItem(Vulnerability v) {
        Asset asset = v.getAsset();
        String cveId = v.getCveRecord() != null ? v.getCveRecord().getCveId() : null;
        return new RemediationItemResponse(
                v.getId(),
                asset.getId(),
                asset.getIdentifier(),
                asset.getName(),
                v.getVulnerabilityIdentifier(),
                v.getTitle(),
                v.getSeverity(),
                v.getStatus(),
                v.getPatchStatus() != null ? v.getPatchStatus() : PatchStatus.OPEN,
                v.getAffectedComponent(),
                v.getRemediation(),
                v.getDueDate(),
                v.getAssignedRemediationOwner(),
                cveId,
                v.getPatchVersion(),
                v.getDetectedAt());
    }

    private SonarQubeFindingResponse toSonarQubeResponse(SonarQubeFinding f) {
        Asset asset = f.getAsset();
        UUID assetId = asset != null ? asset.getId() : null;
        String assetIdentifier = asset != null ? asset.getIdentifier() : null;
        return new SonarQubeFindingResponse(
                f.getId(),
                assetId,
                assetIdentifier,
                f.getIssueKey(),
                f.getRule(),
                f.getSeverity(),
                f.getMessage(),
                f.getComponent(),
                f.getLineNumber(),
                f.getStatus(),
                f.getProjectKey(),
                f.getSonarCreatedAt(),
                f.getSonarUpdatedAt(),
                f.getCreatedAt(),
                f.getUpdatedAt());
    }
}