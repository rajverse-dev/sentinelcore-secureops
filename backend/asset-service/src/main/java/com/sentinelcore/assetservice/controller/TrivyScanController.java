package com.sentinelcore.assetservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sentinelcore.assetservice.dto.TrivyScanRequest;
import com.sentinelcore.assetservice.dto.TrivyScanSummaryResponse;
import com.sentinelcore.assetservice.service.TrivyScanService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/scans")
public class TrivyScanController {

    private final TrivyScanService trivyScanService;

    public TrivyScanController(TrivyScanService trivyScanService) {
        this.trivyScanService = trivyScanService;
    }

    @PostMapping("/trivy")
    public ResponseEntity<TrivyScanSummaryResponse> processTrivyScan(
            @Valid @RequestBody TrivyScanRequest request) {
        return ResponseEntity.ok(trivyScanService.processScan(request));
    }
}
