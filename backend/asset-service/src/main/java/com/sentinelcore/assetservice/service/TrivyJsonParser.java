package com.sentinelcore.assetservice.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.StreamSupport;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.InvalidTrivyScanException;

@Component
public class TrivyJsonParser {

    private static final Pattern CVE_PATTERN = Pattern.compile("(?i)^CVE-\\d{4}-\\d{4,}$");

    private final ObjectMapper objectMapper;

    public TrivyJsonParser() {
        this.objectMapper = new ObjectMapper();
    }

    public List<TrivyFinding> parse(String trivyJson) {
        JsonNode root = readRoot(trivyJson);
        JsonNode results = root.path("Results");

        if (!results.isArray()) {
            throw new InvalidTrivyScanException("Trivy JSON must contain a Results array");
        }

        List<TrivyFinding> findings = new ArrayList<>();
        for (JsonNode result : results) {
            JsonNode vulnerabilities = result.path("Vulnerabilities");
            if (vulnerabilities.isMissingNode() || vulnerabilities.isNull()) {
                continue;
            }
            if (!vulnerabilities.isArray()) {
                throw new InvalidTrivyScanException("Trivy result Vulnerabilities must be an array");
            }
            for (JsonNode vulnerability : vulnerabilities) {
                parseFinding(vulnerability).ifPresent(findings::add);
            }
        }

        return findings;
    }

    private JsonNode readRoot(String trivyJson) {
        try {
            return objectMapper.readTree(trivyJson);
        } catch (JsonProcessingException exception) {
            throw new InvalidTrivyScanException("Invalid Trivy JSON");
        }
    }

    private java.util.Optional<TrivyFinding> parseFinding(JsonNode node) {
        String cveId = text(node, "VulnerabilityID");
        if (cveId == null || !CVE_PATTERN.matcher(cveId).matches()) {
            return java.util.Optional.empty();
        }

        String component = firstText(node, "PkgName", "PackageName");
        if (component == null || component.isBlank()) {
            throw new InvalidTrivyScanException("Trivy finding " + cveId + " is missing package/component name");
        }

        return java.util.Optional.of(new TrivyFinding(
                cveId.trim().toUpperCase(Locale.ROOT),
                mapSeverity(text(node, "Severity")),
                component.trim(),
                text(node, "InstalledVersion"),
                text(node, "FixedVersion"),
                defaultText(text(node, "Title"), cveId),
                defaultText(text(node, "Description"), "Trivy reported " + cveId + " for " + component.trim()),
                extractCvssScore(node),
                extractReferences(node)));
    }

    public VulnerabilitySeverity mapSeverity(String trivySeverity) {
        if (trivySeverity == null) {
            return VulnerabilitySeverity.LOW;
        }
        return switch (trivySeverity.trim().toUpperCase(Locale.ROOT)) {
            case "CRITICAL" -> VulnerabilitySeverity.CRITICAL;
            case "HIGH" -> VulnerabilitySeverity.HIGH;
            case "MEDIUM" -> VulnerabilitySeverity.MEDIUM;
            case "LOW" -> VulnerabilitySeverity.LOW;
            default -> VulnerabilitySeverity.LOW;
        };
    }

    private BigDecimal extractCvssScore(JsonNode node) {
        JsonNode cvss = node.path("CVSS");
        if (!cvss.isObject()) {
            return scoreFromSeverity(mapSeverity(text(node, "Severity")));
        }

        for (JsonNode vendor : cvss) {
            BigDecimal v3 = decimal(vendor.path("V3Score"));
            if (v3 != null) {
                return v3;
            }
            BigDecimal v2 = decimal(vendor.path("V2Score"));
            if (v2 != null) {
                return v2;
            }
        }
        return scoreFromSeverity(mapSeverity(text(node, "Severity")));
    }

    private String extractReferences(JsonNode node) {
        JsonNode references = node.path("References");
        if (!references.isArray()) {
            return null;
        }
        String value = StreamSupport.stream(references.spliterator(), false)
                .filter(JsonNode::isTextual)
                .map(JsonNode::asText)
                .filter(reference -> !reference.isBlank())
                .limit(10)
                .reduce((left, right) -> left + "\n" + right)
                .orElse(null);
        return truncate(value, 4000);
    }

    private BigDecimal scoreFromSeverity(VulnerabilitySeverity severity) {
        return switch (severity) {
            case CRITICAL -> BigDecimal.valueOf(9.0);
            case HIGH -> BigDecimal.valueOf(7.0);
            case MEDIUM -> BigDecimal.valueOf(4.0);
            case LOW -> BigDecimal.valueOf(1.0);
        };
    }

    private BigDecimal decimal(JsonNode node) {
        if (node == null || node.isMissingNode() || node.isNull()) {
            return null;
        }
        if (node.isNumber()) {
            return node.decimalValue();
        }
        if (node.isTextual() && !node.asText().isBlank()) {
            try {
                return new BigDecimal(node.asText());
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private String firstText(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            String value = text(node, fieldName);
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private String text(JsonNode node, String fieldName) {
        JsonNode value = node.path(fieldName);
        if (value.isMissingNode() || value.isNull()) {
            return null;
        }
        String text = value.asText();
        return text == null || text.isBlank() ? null : truncate(text.trim(), 4000);
    }

    private String defaultText(String value, String fallback) {
        return value != null && !value.isBlank() ? value : fallback;
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }
}
