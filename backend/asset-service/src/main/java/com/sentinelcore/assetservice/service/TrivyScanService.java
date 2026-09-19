package com.sentinelcore.assetservice.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sentinelcore.assetservice.dto.RiskAssessmentResponse;
import com.sentinelcore.assetservice.dto.TrivyFindingResponse;
import com.sentinelcore.assetservice.dto.TrivyScanRequest;
import com.sentinelcore.assetservice.dto.TrivyScanSummaryResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.CveRecord;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilityStatus;
import com.sentinelcore.assetservice.repository.CveRecordRepository;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@Service
public class TrivyScanService {

    private final TrivyJsonParser trivyJsonParser;
    private final TrivyExecutionService trivyExecutionService;
    private final AssetService assetService;
    private final CveRecordRepository cveRecordRepository;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final RiskAssessmentService riskAssessmentService;

    public TrivyScanService(
            TrivyJsonParser trivyJsonParser,
            TrivyExecutionService trivyExecutionService,
            AssetService assetService,
            CveRecordRepository cveRecordRepository,
            VulnerabilityRepository vulnerabilityRepository,
            RiskAssessmentService riskAssessmentService) {
        this.trivyJsonParser = trivyJsonParser;
        this.trivyExecutionService = trivyExecutionService;
        this.assetService = assetService;
        this.cveRecordRepository = cveRecordRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.riskAssessmentService = riskAssessmentService;
    }

    @Transactional
    public TrivyScanSummaryResponse processScan(TrivyScanRequest request) {
        Asset asset = assetService.getOwnedAsset(request.getAssetId());
        User owner = assetService.getCurrentUser();

        String rawJson = request.getTrivyJson();
        String target = request.getScanTarget();
        if (target == null || target.isBlank()) {
            target = asset.getIdentifier();
        }

        if (rawJson == null || rawJson.isBlank()) {
            rawJson = trivyExecutionService.executeScan(target);
        }

        List<TrivyFinding> parsedFindings = trivyJsonParser.parse(rawJson);

        int created = 0;
        int updated = 0;
        List<TrivyFindingResponse> findingResponses = new ArrayList<>();

        for (TrivyFinding finding : parsedFindings) {
            CveRecord cveRecord = upsertCve(owner, finding);
            Vulnerability vulnerability = vulnerabilityRepository
                    .findByAssetIdAndVulnerabilityIdentifierAndAffectedComponent(
                            asset.getId(),
                            finding.cveId(),
                            finding.component())
                    .orElse(null);

            boolean createdFinding = vulnerability == null;
            if (createdFinding) {
                vulnerability = new Vulnerability();
                vulnerability.setAsset(asset);
                vulnerability.setVulnerabilityIdentifier(finding.cveId());
                vulnerability.setStatus(VulnerabilityStatus.OPEN);
                vulnerability.setDetectedAt(LocalDateTime.now());
                created++;
            } else {
                updated++;
            }

            applyFinding(vulnerability, cveRecord, finding);
            Vulnerability saved = vulnerabilityRepository.save(vulnerability);
            findingResponses.add(new TrivyFindingResponse(
                    saved.getId(),
                    finding.cveId(),
                    finding.severity(),
                    finding.component(),
                    finding.installedVersion(),
                    finding.fixedVersion(),
                    createdFinding,
                    finding.title(),
                    finding.description(),
                    finding.cvssScore(),
                    remediationText(finding.fixedVersion()),
                    finding.references()));
        }

        RiskAssessmentResponse riskAssessment = riskAssessmentService.calculateRiskAssessment(asset.getId());

        return new TrivyScanSummaryResponse(
                asset.getId(),
                asset.getIdentifier(),
                target,
                parsedFindings.size(),
                created,
                updated,
                updated,
                riskAssessment,
                findingResponses);
    }

    private CveRecord upsertCve(User owner, TrivyFinding finding) {
        CveRecord cveRecord = cveRecordRepository
                .findByCveIdIgnoreCaseAndOwnerUser(finding.cveId(), owner)
                .orElseGet(() -> {
                    CveRecord created = new CveRecord();
                    created.setOwnerUser(owner);
                    created.setCveId(finding.cveId());
                    return created;
                });

        cveRecord.setCvssScore(finding.cvssScore());
        cveRecord.setSeverity(finding.severity());
        cveRecord.setDescription(finding.description());
        cveRecord.setAffectedSoftware(finding.component());
        cveRecord.setAffectedVersion(finding.installedVersion());
        cveRecord.setRemediation(remediationText(finding.fixedVersion()));
        cveRecord.setReferences(finding.references());
        return cveRecordRepository.save(cveRecord);
    }

    private void applyFinding(
            Vulnerability vulnerability,
            CveRecord cveRecord,
            TrivyFinding finding) {
        vulnerability.setCveRecord(cveRecord);
        vulnerability.setTitle(truncate(finding.title(), 255));
        vulnerability.setDescription(truncate(finding.description(), 4000));
        vulnerability.setSeverity(finding.severity());
        vulnerability.setAffectedComponent(truncate(finding.component(), 255));
        vulnerability.setRemediation(remediationText(finding.fixedVersion()));
        vulnerability.setPatchVersion(truncate(finding.fixedVersion(), 255));
    }

    private String remediationText(String fixedVersion) {
        if (fixedVersion == null || fixedVersion.isBlank()) {
            return "Review vendor guidance and apply the appropriate package update.";
        }
        return truncate("Upgrade to fixed version: " + fixedVersion, 4000);
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }
}
