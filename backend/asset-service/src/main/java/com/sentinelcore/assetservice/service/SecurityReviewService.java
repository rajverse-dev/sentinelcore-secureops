package com.sentinelcore.assetservice.service;
import java.util.*; import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sentinelcore.assetservice.dto.*;
import com.sentinelcore.assetservice.entity.*;
import com.sentinelcore.assetservice.repository.SecurityReviewRepository;

@Service
public class SecurityReviewService {
    private final SecurityReviewRepository repository;
    private final AssetService assetService;
    private final AuditService auditService;
    private final KafkaProducerService kafkaProducerService;


    @org.springframework.beans.factory.annotation.Autowired
    public SecurityReviewService(SecurityReviewRepository r, AssetService a, AuditService audit,
                                 @org.springframework.beans.factory.annotation.Autowired(required = false) KafkaProducerService kafka) {
        repository = r; assetService = a; auditService = audit; kafkaProducerService = kafka;
    }

    public SecurityReviewService(SecurityReviewRepository r, AssetService a, AuditService audit) {
        this(r, a, audit, null);
    }


    @Transactional
    public SecurityReviewResponse create(SecurityReviewRequest request) {
        User user = assetService.getCurrentUser();
        SecurityReview review = new SecurityReview();
        review.setReviewer(user);
        apply(review, request);
        SecurityReview saved = repository.save(review);
        if (kafkaProducerService != null) {
            kafkaProducerService.publishAuditEvent(user, "SECURITY_REVIEW_CREATED", "SECURITY_REVIEW", saved.getId(),
                    "SUCCESS", "HIGH", "Security review created", null, saved.getStatus().name(),
                    "SECURITY_REVIEW", "REVIEW_CREATED", null, null);
        } else {
            auditService.record(user, "SECURITY_REVIEW_CREATED", "SECURITY_REVIEW", saved.getId(),
                    "SUCCESS", "HIGH", "Security review created", null, saved.getStatus().name(),
                    "SECURITY_REVIEW", "REVIEW_CREATED", null, null);
        }
        return response(saved);
    }

    @Transactional(readOnly = true)
    public List<SecurityReviewResponse> all() {
        return repository.findAllByOrderByReviewDateDesc().stream().map(this::response).toList();
    }

    @Transactional(readOnly = true)
    public SecurityReviewResponse getById(UUID id) {
        return response(repository.findById(id).orElseThrow(() -> new RuntimeException("Security review not found: " + id)));
    }

    @Transactional
    public SecurityReviewResponse update(UUID id, SecurityReviewRequest request) {
        SecurityReview review = repository.findById(id).orElseThrow();
        String before = review.getStatus().name();
        apply(review, request);
        SecurityReview saved = repository.save(review);
        User current = assetService.getCurrentUser();
        if (kafkaProducerService != null) {
            kafkaProducerService.publishAuditEvent(current, "SECURITY_REVIEW_UPDATED", "SECURITY_REVIEW", id,
                    "SUCCESS", "HIGH", "Security review updated", before, saved.getStatus().name(),
                    "SECURITY_REVIEW", "REVIEW_UPDATED", null, null);
        } else {
            auditService.record(current, "SECURITY_REVIEW_UPDATED", "SECURITY_REVIEW", id,
                    "SUCCESS", "HIGH", "Security review updated", before, saved.getStatus().name(),
                    "SECURITY_REVIEW", "REVIEW_UPDATED", null, null);
        }
        return response(saved);
    }

    @Transactional
    public SecurityReviewResponse approve(UUID id, String comments) {
        SecurityReview review = repository.findById(id).orElseThrow(() -> new RuntimeException("Security review not found: " + id));
        User currentUser = assetService.getCurrentUser();

        // Enforcement of Separation of Duties
        boolean isSuperAdmin = currentUser != null && ("SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole()) || "ADMIN".equalsIgnoreCase(currentUser.getRole()));
        if (review.getReviewer() != null && currentUser != null
                && review.getReviewer().getId().equals(currentUser.getId())
                && !isSuperAdmin) {
            throw new IllegalStateException("Separation of duties violation: Reviewer cannot approve their own security review request.");
        }

        String before = review.getStatus().name();
        review.setStatus(SecurityReviewStatus.APPROVED);
        if (comments != null && !comments.isBlank()) review.setComments(comments);
        SecurityReview saved = repository.save(review);
        if (kafkaProducerService != null) {
            kafkaProducerService.publishAuditEvent(currentUser, "SECURITY_REVIEW_APPROVED", "SECURITY_REVIEW", id,
                    "SUCCESS", "HIGH", "Security review approved", before, "APPROVED",
                    "SECURITY_REVIEW", "REVIEW_APPROVED", null, null);
        } else {
            auditService.record(currentUser, "SECURITY_REVIEW_APPROVED", "SECURITY_REVIEW", id,
                    "SUCCESS", "HIGH", "Security review approved", before, "APPROVED",
                    "SECURITY_REVIEW", "REVIEW_APPROVED", null, null);
        }
        return response(saved);
    }

    @Transactional
    public SecurityReviewResponse reject(UUID id, String reason) {
        SecurityReview review = repository.findById(id).orElseThrow(() -> new RuntimeException("Security review not found: " + id));
        User currentUser = assetService.getCurrentUser();

        String before = review.getStatus().name();
        review.setStatus(SecurityReviewStatus.REJECTED);
        if (reason != null && !reason.isBlank()) review.setComments(reason);
        SecurityReview saved = repository.save(review);
        if (kafkaProducerService != null) {
            kafkaProducerService.publishAuditEvent(currentUser, "SECURITY_REVIEW_REJECTED", "SECURITY_REVIEW", id,
                    "SUCCESS", "HIGH", "Security review rejected. Reason: " + reason, before, "REJECTED",
                    "SECURITY_REVIEW", "REVIEW_REJECTED", null, null);
        } else {
            auditService.record(currentUser, "SECURITY_REVIEW_REJECTED", "SECURITY_REVIEW", id,
                    "SUCCESS", "HIGH", "Security review rejected. Reason: " + reason, before, "REJECTED",
                    "SECURITY_REVIEW", "REVIEW_REJECTED", null, null);
        }
        return response(saved);
    }


    private void apply(SecurityReview r, SecurityReviewRequest q) {
        r.setScope(q.getScope()); r.setReviewPeriod(q.getReviewPeriod());
        r.setFindings(q.getFindings()); r.setAnomalies(q.getAnomalies());
        r.setComments(q.getComments());
        if (q.getStatus() != null) r.setStatus(q.getStatus());
    }

    private SecurityReviewResponse response(SecurityReview r) {
        return new SecurityReviewResponse(r.getId(), r.getReviewer().getEmail(),
                r.getScope(), r.getReviewPeriod(), r.getFindings(), r.getAnomalies(),
                r.getStatus(), r.getComments(), r.getReviewDate());
    }
}
