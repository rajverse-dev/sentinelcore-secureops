package com.sentinelcore.assetservice.controller;
import java.util.*; import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import com.sentinelcore.assetservice.dto.*;
import com.sentinelcore.assetservice.service.SecurityReviewService;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController @RequestMapping("/api/security-reviews")
public class SecurityReviewController {
    private final SecurityReviewService service;
    public SecurityReviewController(SecurityReviewService s) { service = s; }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<List<SecurityReviewResponse>> all() { return ResponseEntity.ok(service.all()); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<SecurityReviewResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id)); }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<SecurityReviewResponse> create(@RequestBody SecurityReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request)); }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<SecurityReviewResponse> update(@PathVariable UUID id, @RequestBody SecurityReviewRequest request) {
        return ResponseEntity.ok(service.update(id, request)); }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<SecurityReviewResponse> approve(@PathVariable UUID id,
            @RequestParam(required=false) String comments) {
        return ResponseEntity.ok(service.approve(id, comments)); }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'SECURITY_ADMIN', 'AUDITOR', 'ADMIN', 'USER')")
    public ResponseEntity<SecurityReviewResponse> reject(@PathVariable UUID id,
            @RequestParam(required=false) String reason) {
        return ResponseEntity.ok(service.reject(id, reason)); }
}

