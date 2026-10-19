package com.sentinelcore.assetservice.service;

import java.math.BigDecimal;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;

public record TrivyFinding(
        String cveId,
        VulnerabilitySeverity severity,
        String component,
        String installedVersion,
        String fixedVersion,
        String title,
        String description,
        BigDecimal cvssScore,
        String references) {
}
