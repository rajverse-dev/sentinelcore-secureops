package com.sentinelcore.assetservice.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.assetservice.dto.CveRequest;
import com.sentinelcore.assetservice.dto.CveResponse;
import com.sentinelcore.assetservice.dto.VulnerabilityResponse;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.service.CveService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cves")
public class CveController {

    private final CveService cveService;

    public CveController(CveService cveService) {
        this.cveService = cveService;
    }

    @PostMapping
    public ResponseEntity<CveResponse> createCve(@Valid @RequestBody CveRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cveService.createCve(request));
    }

    @GetMapping
    public ResponseEntity<List<CveResponse>> getAllCves() {
        return ResponseEntity.ok(cveService.getAllCves());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CveResponse> getCveById(@PathVariable UUID id) {
        return ResponseEntity.ok(cveService.getCveById(id));
    }

    @GetMapping("/cve-id/{cveId}")
    public ResponseEntity<CveResponse> getCveByCveId(@PathVariable String cveId) {
        return ResponseEntity.ok(cveService.getCveByCveId(cveId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CveResponse>> searchCves(@RequestParam String query) {
        return ResponseEntity.ok(cveService.searchCves(query));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<CveResponse>> getCvesBySeverity(@PathVariable VulnerabilitySeverity severity) {
        return ResponseEntity.ok(cveService.getCvesBySeverity(severity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CveResponse> updateCve(
            @PathVariable UUID id,
            @Valid @RequestBody CveRequest request) {
        return ResponseEntity.ok(cveService.updateCve(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCve(@PathVariable UUID id) {
        cveService.deleteCve(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/vulnerabilities")
    public ResponseEntity<List<VulnerabilityResponse>> getVulnerabilitiesForCve(@PathVariable UUID id) {
        return ResponseEntity.ok(cveService.getVulnerabilitiesForCve(id));
    }
}
