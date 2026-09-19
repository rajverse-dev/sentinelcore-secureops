package com.sentinelcore.assetservice.controller;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.assetservice.dto.AuditLogResponse;
import com.sentinelcore.assetservice.service.AuditService;

@RestController
@RequestMapping("/api/audit")
public class AuditController {
    private final AuditService auditService;
    public AuditController(AuditService auditService) { this.auditService = auditService; }
    @GetMapping public ResponseEntity<Page<AuditLogResponse>> getAudit(@RequestParam(required = false) String query, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "25") int size) { return ResponseEntity.ok(auditService.find(query, page, Math.min(size, 100))); }
    @GetMapping("/integrity") public ResponseEntity<Boolean> integrity() { return ResponseEntity.ok(auditService.verifyIntegrity()); }
}