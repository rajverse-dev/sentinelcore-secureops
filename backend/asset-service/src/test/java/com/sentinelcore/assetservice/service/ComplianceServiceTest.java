package com.sentinelcore.assetservice.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;

import com.sentinelcore.assetservice.entity.ComplianceControl;
import com.sentinelcore.assetservice.entity.ComplianceFramework;
import com.sentinelcore.assetservice.entity.ComplianceStatus;
import com.sentinelcore.assetservice.repository.ComplianceControlRepository;
import com.sentinelcore.assetservice.repository.ComplianceEvidenceRepository;
import com.sentinelcore.assetservice.repository.ComplianceFrameworkRepository;

class ComplianceServiceTest {
    @Test
    void calculatesComplianceFromControlStatuses() {
        ComplianceFrameworkRepository frameworks = org.mockito.Mockito.mock(ComplianceFrameworkRepository.class);
        ComplianceControlRepository controls = org.mockito.Mockito.mock(ComplianceControlRepository.class);
        ComplianceEvidenceRepository evidence = org.mockito.Mockito.mock(ComplianceEvidenceRepository.class);
        ComplianceFramework framework = new ComplianceFramework();
        UUID id = UUID.randomUUID(); framework.setId(id); framework.setName("PCI DSS");
        ComplianceControl compliant = control(ComplianceStatus.COMPLIANT);
        ComplianceControl partial = control(ComplianceStatus.PARTIALLY_COMPLIANT);
        when(frameworks.findById(id)).thenReturn(java.util.Optional.of(framework));
        when(controls.findByFrameworkId(id)).thenReturn(List.of(compliant, partial));
        var summary = new ComplianceService(frameworks, controls, evidence).summary(id);
        assertEquals(2, summary.controls()); assertEquals(75.0, summary.percentage());
    }
    private ComplianceControl control(ComplianceStatus status) { ComplianceControl control = new ComplianceControl(); control.setStatus(status); return control; }
}