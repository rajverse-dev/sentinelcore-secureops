package com.sentinelcore.assetservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.InvalidTrivyScanException;

class TrivyJsonParserTest {

    private final TrivyJsonParser parser = new TrivyJsonParser();

    @Test
    void parsesValidTrivyJson() {
        List<TrivyFinding> findings = parser.parse(sampleJson("CRITICAL"));

        assertEquals(1, findings.size());
        TrivyFinding finding = findings.get(0);
        assertEquals("CVE-2026-1234", finding.cveId());
        assertEquals(VulnerabilitySeverity.CRITICAL, finding.severity());
        assertEquals("openssl", finding.component());
        assertEquals("1.1.1k", finding.installedVersion());
        assertEquals("1.1.1u", finding.fixedVersion());
        assertEquals("OpenSSL issue", finding.title());
        assertEquals("https://nvd.nist.gov/vuln/detail/CVE-2026-1234", finding.references());
    }

    @Test
    void mapsTrivySeverityValues() {
        assertEquals(VulnerabilitySeverity.CRITICAL, parser.mapSeverity("CRITICAL"));
        assertEquals(VulnerabilitySeverity.HIGH, parser.mapSeverity("HIGH"));
        assertEquals(VulnerabilitySeverity.MEDIUM, parser.mapSeverity("MEDIUM"));
        assertEquals(VulnerabilitySeverity.LOW, parser.mapSeverity("LOW"));
        assertEquals(VulnerabilitySeverity.LOW, parser.mapSeverity("UNKNOWN"));
    }

    @Test
    void rejectsInvalidJson() {
        assertThrows(InvalidTrivyScanException.class, () -> parser.parse("{not-json"));
    }

    @Test
    void rejectsMissingResultsArray() {
        assertThrows(InvalidTrivyScanException.class, () -> parser.parse("{}"));
    }

    private String sampleJson(String severity) {
        return """
                {
                  "SchemaVersion": 2,
                  "Results": [
                    {
                      "Target": "test-image:latest",
                      "Class": "os-pkgs",
                      "Type": "debian",
                      "Vulnerabilities": [
                        {
                          "VulnerabilityID": "CVE-2026-1234",
                          "PkgName": "openssl",
                          "InstalledVersion": "1.1.1k",
                          "FixedVersion": "1.1.1u",
                          "Severity": "%s",
                          "Title": "OpenSSL issue",
                          "Description": "OpenSSL needs a security update",
                          "CVSS": {
                            "nvd": {
                              "V3Score": 9.8
                            }
                          },
                          "References": [
                            "https://nvd.nist.gov/vuln/detail/CVE-2026-1234"
                          ]
                        }
                      ]
                    }
                  ]
                }
                """.formatted(severity);
    }
}
