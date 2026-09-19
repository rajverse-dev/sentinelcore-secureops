package com.sentinelcore.assetservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.InvalidSonarQubeResponseException;
import com.sentinelcore.assetservice.exception.SonarQubeConfigurationException;
import com.sentinelcore.assetservice.exception.SonarQubeUnavailableException;

class SonarQubeApiClientTest {

    @Test
    void importsSecurityIssuesAndMapsSeverity() throws Exception {
        HttpClient httpClient = mock(HttpClient.class);
        HttpResponse<String> response = response(200, """
                {
                  "paging": {"total": 1},
                  "issues": [{
                    "key": "AX-1",
                    "rule": "java:S2083",
                    "severity": "BLOCKER",
                    "message": "Review this path",
                    "component": "project:src/Main.java",
                    "line": 42,
                    "status": "OPEN",
                    "project": "project",
                    "creationDate": "2026-09-16T10:00:00+05:30",
                    "updateDate": "2026-09-16T11:00:00+05:30"
                  }]
                }
                """);
        when(httpClient.send(any(), any(HttpResponse.BodyHandler.class))).thenReturn(response);

        List<SonarQubeIssue> issues = new SonarQubeApiClient("http://sonar.test", "token", httpClient)
                .fetchSecurityIssues("project");

        assertEquals(1, issues.size());
        assertEquals("AX-1", issues.get(0).issueKey());
        assertEquals(VulnerabilitySeverity.CRITICAL, issues.get(0).severity());
        assertEquals(42, issues.get(0).lineNumber());
    }

    @Test
    void rejectsMalformedResponse() throws Exception {
        HttpClient httpClient = mock(HttpClient.class);
        HttpResponse<String> response = response(200, "{\"issues\":{}}");
        when(httpClient.send(any(), any(HttpResponse.BodyHandler.class)))
                .thenReturn(response);

        assertThrows(InvalidSonarQubeResponseException.class,
                () -> new SonarQubeApiClient("http://sonar.test", "token", httpClient)
                        .fetchSecurityIssues("project"));
    }

    @Test
    void reportsUnavailableSonarQube() throws Exception {
        HttpClient httpClient = mock(HttpClient.class);
        when(httpClient.send(any(), any(HttpResponse.BodyHandler.class)))
                .thenThrow(new IOException("connection refused"));

        assertThrows(SonarQubeUnavailableException.class,
                () -> new SonarQubeApiClient("http://sonar.test", "token", httpClient)
                        .fetchSecurityIssues("project"));
    }

    @Test
    void rejectsMissingConfiguration() {
        assertThrows(SonarQubeConfigurationException.class,
                () -> new SonarQubeApiClient("", "", mock(HttpClient.class))
                        .fetchSecurityIssues("project"));
    }

    @Test
    void rejectsUnauthorizedSonarQubeCredentials() throws Exception {
        HttpClient httpClient = mock(HttpClient.class);
        HttpResponse<String> response = response(401, "{}");
        when(httpClient.send(any(), any(HttpResponse.BodyHandler.class)))
                .thenReturn(response);

        assertThrows(InvalidSonarQubeResponseException.class,
                () -> new SonarQubeApiClient("http://sonar.test", "token", httpClient)
                        .fetchSecurityIssues("project"));
    }

    @SuppressWarnings("unchecked")
    private HttpResponse<String> response(int status, String body) {
        HttpResponse<String> response = mock(HttpResponse.class);
        when(response.statusCode()).thenReturn(status);
        when(response.body()).thenReturn(body);
        return response;
    }
}
