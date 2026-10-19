package com.sentinelcore.assetservice.service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.InvalidSonarQubeResponseException;
import com.sentinelcore.assetservice.exception.SonarQubeConfigurationException;
import com.sentinelcore.assetservice.exception.SonarQubeUnavailableException;

@Component
public class SonarQubeApiClient implements SonarQubeClient {

    private final String baseUrl;
    private final String token;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public SonarQubeApiClient(
            @Value("${sonarqube.base-url:}") String baseUrl,
            @Value("${sonarqube.token:}") String token) {
        this(baseUrl, token, HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build());
    }

    SonarQubeApiClient(String baseUrl, String token, HttpClient httpClient) {
        this.baseUrl = baseUrl;
        this.token = token;
        this.httpClient = httpClient;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<SonarQubeIssue> fetchSecurityIssues(String projectKey) {
        validateConfiguration();
        List<SonarQubeIssue> allIssues = new ArrayList<>();
        int page = 1;
        int total = Integer.MAX_VALUE;

        while (allIssues.size() < total) {
            SonarQubePage result = fetchPage(projectKey, page);
            allIssues.addAll(result.issues());
            total = result.total();
            if (result.issues().isEmpty()) {
                break;
            }
            page++;
        }
        return allIssues;
    }

    private SonarQubePage fetchPage(String projectKey, int page) {
        HttpRequest request = HttpRequest.newBuilder(buildUri(projectKey, page))
                .timeout(Duration.ofSeconds(15))
                .header("Authorization", "Basic " + basicToken())
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> response;
        try {
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException exception) {
            throw new SonarQubeUnavailableException("SonarQube is unavailable");
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new SonarQubeUnavailableException("SonarQube request was interrupted");
        }

        if (response.statusCode() >= 500) {
            throw new SonarQubeUnavailableException("SonarQube returned status " + response.statusCode());
        }
        if (response.statusCode() == 401 || response.statusCode() == 403) {
            throw new InvalidSonarQubeResponseException("SonarQube rejected the configured credentials");
        }
        if (response.statusCode() >= 400) {
            throw new InvalidSonarQubeResponseException("SonarQube returned status " + response.statusCode());
        }

        return parsePage(response.body(), projectKey);
    }

    private void validateConfiguration() {
        if (baseUrl == null || baseUrl.isBlank()) {
            throw new SonarQubeConfigurationException("SonarQube base URL is not configured");
        }
        if (token == null || token.isBlank()) {
            throw new SonarQubeConfigurationException("SonarQube token is not configured");
        }
    }

    private URI buildUri(String projectKey, int page) {
        String normalizedBaseUrl = baseUrl.endsWith("/")
                ? baseUrl.substring(0, baseUrl.length() - 1)
                : baseUrl;
        String encodedProject = URLEncoder.encode(projectKey, StandardCharsets.UTF_8);
        String query = "componentKeys=" + encodedProject
                + "&types=VULNERABILITY,SECURITY_HOTSPOT"
                + "&p=" + page
                + "&ps=500";
        return URI.create(normalizedBaseUrl + "/api/issues/search?" + query);
    }

    private String basicToken() {
        return Base64.getEncoder()
                .encodeToString((token + ":").getBytes(StandardCharsets.UTF_8));
    }

    private SonarQubePage parsePage(String body, String fallbackProjectKey) {
        JsonNode root;
        try {
            root = objectMapper.readTree(body);
        } catch (JsonProcessingException exception) {
            throw new InvalidSonarQubeResponseException("Invalid SonarQube response JSON");
        }

        JsonNode issues = root.path("issues");
        if (!issues.isArray()) {
            throw new InvalidSonarQubeResponseException("SonarQube response must contain an issues array");
        }

        List<SonarQubeIssue> parsedIssues = new ArrayList<>();
        for (JsonNode issue : issues) {
            parsedIssues.add(parseIssue(issue, fallbackProjectKey));
        }
        JsonNode paging = root.path("paging");
        int total = paging.path("total").canConvertToInt()
                ? paging.path("total").asInt()
                : parsedIssues.size();
        return new SonarQubePage(parsedIssues, total);
    }

    private SonarQubeIssue parseIssue(JsonNode issue, String fallbackProjectKey) {
        String key = requiredText(issue, "key");
        String rule = requiredText(issue, "rule");
        String project = text(issue, "project");
        return new SonarQubeIssue(
                key,
                rule,
                mapSeverity(firstText(issue, "severity", "impactSeverity")),
                text(issue, "message"),
                text(issue, "component"),
                integer(issue, "line"),
                text(issue, "status"),
                project != null ? project : fallbackProjectKey,
                dateTime(text(issue, "creationDate")),
                dateTime(firstText(issue, "updateDate", "updatedAt")));
    }

    VulnerabilitySeverity mapSeverity(String sonarSeverity) {
        if (sonarSeverity == null) {
            return VulnerabilitySeverity.LOW;
        }
        return switch (sonarSeverity.trim().toUpperCase(Locale.ROOT)) {
            case "BLOCKER", "CRITICAL" -> VulnerabilitySeverity.CRITICAL;
            case "HIGH", "MAJOR" -> VulnerabilitySeverity.HIGH;
            case "MEDIUM", "MINOR" -> VulnerabilitySeverity.MEDIUM;
            case "LOW", "INFO" -> VulnerabilitySeverity.LOW;
            default -> VulnerabilitySeverity.LOW;
        };
    }

    private String requiredText(JsonNode node, String fieldName) {
        String value = text(node, fieldName);
        if (value == null) {
            throw new InvalidSonarQubeResponseException("SonarQube issue is missing " + fieldName);
        }
        return value;
    }

    private String firstText(JsonNode node, String... fieldNames) {
        for (String fieldName : fieldNames) {
            String value = text(node, fieldName);
            if (value != null) {
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

    private Integer integer(JsonNode node, String fieldName) {
        JsonNode value = node.path(fieldName);
        if (value.isMissingNode() || value.isNull()) {
            return null;
        }
        if (value.canConvertToInt()) {
            return value.asInt();
        }
        return null;
    }

    private LocalDateTime dateTime(String value) {
        if (value == null) {
            return null;
        }
        try {
            return OffsetDateTime.parse(value, DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            } catch (DateTimeParseException nested) {
                return null;
            }
        }
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }

    private record SonarQubePage(List<SonarQubeIssue> issues, int total) {
    }
}
