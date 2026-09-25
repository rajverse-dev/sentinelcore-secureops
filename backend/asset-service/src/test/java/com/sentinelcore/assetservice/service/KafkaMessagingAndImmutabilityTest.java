package com.sentinelcore.assetservice.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.kafka.core.KafkaTemplate;

import com.sentinelcore.assetservice.dto.AuditEventMessage;
import com.sentinelcore.assetservice.dto.AuditLogResponse;
import com.sentinelcore.assetservice.entity.AuditLog;
import com.sentinelcore.assetservice.entity.AuditLogImmutabilityListener;
import com.sentinelcore.assetservice.entity.User;

class KafkaMessagingAndImmutabilityTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Mock
    private AuditService auditService;

    @Mock
    private SseEventService sseEventService;

    private KafkaProducerService producerService;
    private PdfReportGenerator pdfReportGenerator;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        producerService = new KafkaProducerService("sentinelcore-audit-events", true, kafkaTemplate, auditService, sseEventService);
        pdfReportGenerator = new PdfReportGenerator();
    }

    @Test
    void testKafkaProducerPublishesAuditEvent() {
        User user = new User("Test User", "test@sentinelcore.com", "testuser", "pass", "ADMIN", true);
        UUID assetId = UUID.randomUUID();

        producerService.publishAuditEvent(user, "ASSET_CREATED", "ASSET", assetId,
                "SUCCESS", "LOW", "Asset created with password=secret123",
                null, "active", "ASSET", "ASSET_CREATED", "127.0.0.1", "corr-123");

        verify(kafkaTemplate, times(1)).send(eq("sentinelcore-audit-events"), eq(assetId.toString()), any(AuditEventMessage.class));
    }

    @Test
    void testAuditImmutabilityListenerBlocksUpdateAndDelete() {
        AuditLogImmutabilityListener listener = new AuditLogImmutabilityListener();
        AuditLog log = new AuditLog();

        assertThrows(IllegalStateException.class, () -> listener.onPreUpdate(log));
        assertThrows(IllegalStateException.class, () -> listener.onPreRemove(log));
    }

    @Test
    void testPdfReportGeneratorProducesNonEmptyPdfBytes() {
        Map<String, Object> complianceReport = Map.of(
                "frameworkName", "PCI DSS v4.0",
                "compliancePercentage", 87.5,
                "totalControls", 8,
                "compliantControls", 7,
                "partialControls", 0,
                "nonCompliantControls", 1,
                "notAssessedControls", 0,
                "disclaimer", "Posture evaluation report"
        );

        byte[] pdfBytes = pdfReportGenerator.generateCompliancePdf(complianceReport, java.util.List.of());
        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 100);
    }
}
