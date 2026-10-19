package com.sentinelcore.assetservice.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sentinelcore.assetservice.dto.CveRequest;
import com.sentinelcore.assetservice.dto.CveResponse;
import com.sentinelcore.assetservice.dto.VulnerabilityResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.CveRecord;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.CveInUseException;
import com.sentinelcore.assetservice.exception.CveNotFoundException;
import com.sentinelcore.assetservice.exception.DuplicateCveException;
import com.sentinelcore.assetservice.repository.CveRecordRepository;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@Service
public class CveService {

    private final CveRecordRepository cveRecordRepository;
    private final VulnerabilityRepository vulnerabilityRepository;
    private final AssetService assetService;

    public CveService(
            CveRecordRepository cveRecordRepository,
            VulnerabilityRepository vulnerabilityRepository,
            AssetService assetService) {
        this.cveRecordRepository = cveRecordRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
        this.assetService = assetService;
    }

    @Transactional
    public CveResponse createCve(CveRequest request) {
        User user = currentUser();
        String normalizedCveId = normalizeCveId(request.getCveId());

        if (cveRecordRepository.existsByCveIdIgnoreCaseAndOwnerUser(normalizedCveId, user)) {
            throw new DuplicateCveException("CVE already exists: " + normalizedCveId);
        }

        CveRecord cve = new CveRecord();
        cve.setOwnerUser(user);
        applyRequest(cve, request, normalizedCveId);

        return toResponse(cveRecordRepository.save(cve));
    }

    @Transactional(readOnly = true)
    public List<CveResponse> getAllCves() {
        return cveRecordRepository.findByOwnerUser(currentUser()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CveResponse getCveById(UUID id) {
        return toResponse(findOwnedCveById(id));
    }

    @Transactional(readOnly = true)
    public CveResponse getCveByCveId(String cveId) {
        String normalizedCveId = normalizeCveId(cveId);
        return toResponse(cveRecordRepository.findByCveIdIgnoreCaseAndOwnerUser(normalizedCveId, currentUser())
                .orElseThrow(() -> new CveNotFoundException("CVE not found with identifier: " + normalizedCveId)));
    }

    @Transactional(readOnly = true)
    public List<CveResponse> searchCves(String query) {
        return cveRecordRepository.searchByOwnerUser(currentUser(), query).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CveResponse> getCvesBySeverity(VulnerabilitySeverity severity) {
        return cveRecordRepository.findByOwnerUserAndSeverity(currentUser(), severity).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CveResponse updateCve(UUID id, CveRequest request) {
        CveRecord cve = findOwnedCveById(id);
        User user = currentUser();
        String normalizedCveId = normalizeCveId(request.getCveId());

        if (cveRecordRepository.existsByCveIdIgnoreCaseAndOwnerUserAndIdNot(normalizedCveId, user, id)) {
            throw new DuplicateCveException("Another record with CVE ID already exists: " + normalizedCveId);
        }

        applyRequest(cve, request, normalizedCveId);
        return toResponse(cveRecordRepository.save(cve));
    }

    @Transactional
    public void deleteCve(UUID id) {
        CveRecord cve = findOwnedCveById(id);

        if (vulnerabilityRepository.existsByCveRecord(cve)) {
            throw new CveInUseException("Cannot delete CVE because it is referenced by existing vulnerabilities");
        }

        cveRecordRepository.delete(cve);
    }

    @Transactional(readOnly = true)
    public List<VulnerabilityResponse> getVulnerabilitiesForCve(UUID id) {
        CveRecord cve = findOwnedCveById(id);
        return vulnerabilityRepository.findByCveRecordAndAssetOwnerUser(cve, currentUser()).stream()
                .map(this::toVulnerabilityResponse)
                .toList();
    }

    private CveRecord findOwnedCveById(UUID id) {
        return cveRecordRepository.findByIdAndOwnerUser(id, currentUser())
                .orElseThrow(() -> new CveNotFoundException("CVE not found with id: " + id));
    }

    private User currentUser() {
        return assetService.getCurrentUser();
    }

    private String normalizeCveId(String cveId) {
        if (cveId == null) {
            return null;
        }
        return cveId.trim().toUpperCase();
    }

    private void applyRequest(CveRecord cve, CveRequest request, String normalizedCveId) {
        cve.setCveId(normalizedCveId);
        cve.setCvssScore(request.getCvssScore());
        cve.setSeverity(request.getSeverity() != null
                ? request.getSeverity()
                : deriveSeverity(request.getCvssScore()));
        cve.setDescription(request.getDescription());
        cve.setAffectedSoftware(request.getAffectedSoftware());
        cve.setAffectedVersion(request.getAffectedVersion());
        cve.setRemediation(request.getRemediation());
        cve.setReferences(request.getReferences());
        cve.setPublishedAt(request.getPublishedAt());
        cve.setLastModifiedAt(request.getLastModifiedAt());
    }

    private VulnerabilitySeverity deriveSeverity(BigDecimal score) {
        if (score == null) {
            return VulnerabilitySeverity.LOW;
        }
        double value = score.doubleValue();
        if (value >= 9.0) {
            return VulnerabilitySeverity.CRITICAL;
        }
        if (value >= 7.0) {
            return VulnerabilitySeverity.HIGH;
        }
        if (value >= 4.0) {
            return VulnerabilitySeverity.MEDIUM;
        }
        return VulnerabilitySeverity.LOW;
    }

    private CveResponse toResponse(CveRecord cve) {
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

    private VulnerabilityResponse toVulnerabilityResponse(Vulnerability vulnerability) {
        Asset asset = vulnerability.getAsset();
        UUID cveRecordId = vulnerability.getCveRecord() != null ? vulnerability.getCveRecord().getId() : null;
        String cveId = vulnerability.getCveRecord() != null ? vulnerability.getCveRecord().getCveId() : null;
        return new VulnerabilityResponse(
                vulnerability.getId(),
                asset.getId(),
                asset.getIdentifier(),
                asset.getName(),
                vulnerability.getVulnerabilityIdentifier(),
                vulnerability.getTitle(),
                vulnerability.getDescription(),
                vulnerability.getSeverity(),
                vulnerability.getStatus(),
                vulnerability.getAffectedComponent(),
                vulnerability.getDetectedAt(),
                vulnerability.getDueDate(),
                vulnerability.getRemediation(),
                vulnerability.getResolvedAt(),
                vulnerability.getCreatedAt(),
                vulnerability.getUpdatedAt(),
                cveRecordId,
                cveId,
                vulnerability.getPatchStatus(),
                vulnerability.getPatchStartedAt(),
                vulnerability.getPatchCompletedAt(),
                vulnerability.getVerificationDate(),
                vulnerability.getPatchVersion(),
                vulnerability.getVerificationNotes(),
                vulnerability.getAssignedRemediationOwner());
    }
}
