package com.sentinelcore.assetservice.service;
import java.time.LocalDateTime; import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sentinelcore.assetservice.dto.*;
import com.sentinelcore.assetservice.entity.*;
import com.sentinelcore.assetservice.repository.*;

@Service
public class ComplianceService {

    private final ComplianceFrameworkRepository frameworkRepo;
    private final ComplianceControlRepository controlRepo;
    private final ComplianceEvidenceRepository evidenceRepo;
    private final AuditService auditService;
    private final AssetService assetService;

    @org.springframework.beans.factory.annotation.Autowired
    public ComplianceService(ComplianceFrameworkRepository f, ComplianceControlRepository c,
                             ComplianceEvidenceRepository e, AuditService auditService,
                             AssetService assetService) {
        frameworkRepo = f; controlRepo = c; evidenceRepo = e;
        this.auditService = auditService; this.assetService = assetService;
    }


    public ComplianceService(ComplianceFrameworkRepository f, ComplianceControlRepository c,
                             ComplianceEvidenceRepository e) {
        this(f, c, e, null, null);
    }


    @Transactional(readOnly = true)
    public List<ComplianceFramework> frameworks() { return frameworkRepo.findAll(); }

    @Transactional(readOnly = true)
    public List<ComplianceControlResponse> controls(UUID frameworkId) {
        List<ComplianceControl> list = frameworkId == null ? controlRepo.findAll() : controlRepo.findByFrameworkId(frameworkId);
        return list.stream().map(this::toControlResponse).toList();
    }

    @Transactional(readOnly = true)
    public ComplianceControlResponse getControl(UUID id) {
        return toControlResponse(controlRepo.findById(id).orElseThrow(() -> new RuntimeException("Control not found: " + id)));
    }

    @Transactional(readOnly = true)
    public ComplianceSummaryResponse summary(UUID frameworkId) {
        ComplianceFramework f = frameworkRepo.findById(frameworkId).orElseThrow();
        List<ComplianceControl> list = controlRepo.findByFrameworkId(frameworkId);
        long compliant = list.stream().filter(x -> x.getStatus() == ComplianceStatus.COMPLIANT).count();
        long partial = list.stream().filter(x -> x.getStatus() == ComplianceStatus.PARTIALLY_COMPLIANT).count();
        long non = list.stream().filter(x -> x.getStatus() == ComplianceStatus.NON_COMPLIANT).count();
        long not = list.size() - compliant - partial - non;
        double pct = list.isEmpty() ? 0 : ((compliant + partial * 0.5) / list.size()) * 100;
        return new ComplianceSummaryResponse(f.getId(), f.getName(), list.size(), compliant, partial, non, not, pct);
    }

    @Transactional
    public ComplianceControlResponse updateControlStatus(UUID controlId, ControlStatusUpdateRequest request) {
        ComplianceControl control = controlRepo.findById(controlId).orElseThrow(() -> new RuntimeException("Control not found: " + controlId));
        String before = control.getStatus() != null ? control.getStatus().name() : null;
        control.setStatus(request.getStatus());
        if (request.getOwner() != null) control.setOwner(request.getOwner());
        control.setLastReviewedAt(LocalDateTime.now());
        ComplianceControl saved = controlRepo.save(control);
        User actor = auditService != null ? tryGetCurrentUser() : null;
        if (auditService != null) auditService.record(actor, "CONTROL_STATUS_UPDATED", "COMPLIANCE_CONTROL", controlId,
                "SUCCESS", "MEDIUM", "Compliance control status updated: " + saved.getControlId(),
                before, saved.getStatus().name(), "COMPLIANCE", "CONTROL_STATUS_UPDATED", null, null);
        return toControlResponse(saved);
    }

    @Transactional
    public ComplianceEvidenceResponse addEvidence(UUID controlId, EvidenceRequest request) {
        ComplianceControl control = controlRepo.findById(controlId).orElseThrow(() -> new RuntimeException("Control not found: " + controlId));
        ComplianceEvidence evidence = new ComplianceEvidence();
        evidence.setControl(control);
        evidence.setEvidenceType(request.getEvidenceType());
        evidence.setDescription(request.getDescription());
        evidence.setReference(request.getReference());
        evidence.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");
        ComplianceEvidence saved = evidenceRepo.save(evidence);
        User actor = tryGetCurrentUser();
        if (auditService != null) auditService.record(actor, "EVIDENCE_ADDED", "COMPLIANCE_EVIDENCE", saved.getId(),
                "SUCCESS", "LOW", "Evidence added for control: " + control.getControlId(),
                null, saved.getStatus(), "COMPLIANCE", "EVIDENCE_ADDED", null, null);
        return toEvidenceResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ComplianceEvidenceResponse> getEvidence(UUID controlId) {
        controlRepo.findById(controlId).orElseThrow(() -> new RuntimeException("Control not found: " + controlId));
        return evidenceRepo.findByControlId(controlId).stream().map(this::toEvidenceResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ComplianceGapItem> gapAnalysis(UUID frameworkId) {
        List<ComplianceControl> list = controlRepo.findByFrameworkId(frameworkId);
        List<ComplianceGapItem> gaps = new ArrayList<>();
        for (ComplianceControl c : list) {
            long evidenceCount = evidenceRepo.countByControlId(c.getId());
            String reason = null;
            if (c.getStatus() == ComplianceStatus.NON_COMPLIANT) reason = "Control is non-compliant";
            else if (c.getStatus() == ComplianceStatus.NOT_ASSESSED) reason = "Control has not been assessed";
            else if (evidenceCount == 0) reason = "No evidence attached";
            else if (c.getNextReviewAt() != null && c.getNextReviewAt().isBefore(LocalDateTime.now())) reason = "Review overdue";
            if (reason != null) {
                gaps.add(new ComplianceGapItem(c.getId(), c.getControlId(), c.getTitle(), c.getStatus(), evidenceCount, c.getLastReviewedAt(), reason));
            }
        }
        return gaps;
    }

    private ComplianceControlResponse toControlResponse(ComplianceControl c) {
        long evidenceCount = evidenceRepo.countByControlId(c.getId());
        return new ComplianceControlResponse(c.getId(), c.getFramework().getId(), c.getFramework().getName(),
                c.getControlId(), c.getTitle(), c.getDescription(), c.getStatus(), c.getOwner(),
                c.getLastReviewedAt(), c.getNextReviewAt(), evidenceCount);
    }

    private ComplianceEvidenceResponse toEvidenceResponse(ComplianceEvidence e) {
        return new ComplianceEvidenceResponse(e.getId(), e.getControl().getId(), e.getControl().getTitle(),
                e.getEvidenceType(), e.getDescription(), e.getReference(), e.getStatus(),
                e.getCreatedAt(), e.getReviewedAt());
    }

    private User tryGetCurrentUser() {
        try { return assetService.getCurrentUser(); } catch (Exception ex) { return null; }
    }
}
