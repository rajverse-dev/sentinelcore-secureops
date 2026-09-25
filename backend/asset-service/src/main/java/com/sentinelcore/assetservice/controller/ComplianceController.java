package com.sentinelcore.assetservice.controller;
import java.util.*; import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.sentinelcore.assetservice.dto.*;
import com.sentinelcore.assetservice.entity.ComplianceFramework;
import com.sentinelcore.assetservice.service.ComplianceService;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController @RequestMapping("/api/compliance")
public class ComplianceController {
    private final ComplianceService service;
    public ComplianceController(ComplianceService s) { service = s; }

    @GetMapping("/frameworks")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<List<ComplianceFramework>> frameworks() { return ResponseEntity.ok(service.frameworks()); }

    @GetMapping("/controls")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<List<ComplianceControlResponse>> controls(@RequestParam(required=false) UUID frameworkId) {
        return ResponseEntity.ok(service.controls(frameworkId)); }

    @GetMapping("/controls/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<ComplianceControlResponse> getControl(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getControl(id)); }

    @PatchMapping("/controls/{id}/status")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<ComplianceControlResponse> updateStatus(@PathVariable UUID id,
            @RequestBody ControlStatusUpdateRequest request) {
        return ResponseEntity.ok(service.updateControlStatus(id, request)); }

    @GetMapping("/controls/{id}/evidence")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<List<ComplianceEvidenceResponse>> getEvidence(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getEvidence(id)); }

    @PostMapping("/controls/{id}/evidence")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<ComplianceEvidenceResponse> addEvidence(@PathVariable UUID id,
            @RequestBody EvidenceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addEvidence(id, request)); }

    @GetMapping("/frameworks/{id}/gap-analysis")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<List<ComplianceGapItem>> gapAnalysis(@PathVariable UUID id) {
        return ResponseEntity.ok(service.gapAnalysis(id)); }

    @GetMapping("/summary/{frameworkId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<ComplianceSummaryResponse> summary(@PathVariable UUID frameworkId) {
        return ResponseEntity.ok(service.summary(frameworkId)); }
}

