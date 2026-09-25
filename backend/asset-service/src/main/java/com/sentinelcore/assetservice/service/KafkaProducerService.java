package com.sentinelcore.assetservice.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.sentinelcore.assetservice.dto.AuditEventMessage;
import com.sentinelcore.assetservice.entity.User;

@Service
public class KafkaProducerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaProducerService.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String topic;
    private final boolean kafkaEnabled;
    private final AuditService auditService;
    private final SseEventService sseEventService;

    public KafkaProducerService(

            @Value("${sentinelcore.kafka.topic:sentinelcore-audit-events}") String topic,
            @Value("${sentinelcore.kafka.enabled:true}") boolean kafkaEnabled,
            @Autowired(required = false) KafkaTemplate<String, Object> kafkaTemplate,
            AuditService auditService,
            SseEventService sseEventService) {

        this.topic = topic;
        this.kafkaEnabled = kafkaEnabled;
        this.kafkaTemplate = kafkaTemplate;
        this.auditService = auditService;
        this.sseEventService = sseEventService;
    }

    public void publishAuditEvent(User actor, String action, String entityType, UUID entityId,
                                  String result, String severity, String description,
                                  String beforeState, String afterState,
                                  String source, String eventType, String ipAddress, String correlationId) {

        UUID eventId = UUID.randomUUID();
        String actorEmail = actor == null ? "SYSTEM" : actor.getEmail();
        String role = actor == null ? "SYSTEM" : actor.getRole();

        // Mask secrets if present in state or description
        String cleanDesc = maskSensitiveData(description);
        String cleanBefore = maskSensitiveData(beforeState);
        String cleanAfter = maskSensitiveData(afterState);

        AuditEventMessage eventMessage = new AuditEventMessage(
                eventId,
                actor == null ? null : actor.getId(),
                actorEmail,
                role,
                action,
                entityType,
                entityId,
                result,
                severity,
                cleanDesc,
                cleanBefore,
                cleanAfter,
                LocalDateTime.now(),
                source,
                eventType != null ? eventType : action,
                ipAddress,
                correlationId
        );

        String messageKey = entityId != null ? entityId.toString() : actorEmail;

        boolean publishedToKafka = false;
        if (kafkaEnabled && kafkaTemplate != null) {
            try {
                kafkaTemplate.send(topic, messageKey, eventMessage);
                publishedToKafka = true;
                log.info("Published audit event {} to Kafka topic {}", eventMessage.eventId(), topic);
            } catch (Exception e) {
                log.warn("Kafka broker unavailable or publish failed: {}. Falling back to synchronous audit recording.", e.getMessage());
            }
        }

        // If Kafka is not running / disabled or publish failed, record synchronously to DB & broadcast SSE
        if (!publishedToKafka) {
            try {
                var auditLog = auditService.record(actor, action, entityType, entityId, result, severity, cleanDesc, cleanBefore, cleanAfter, source, eventType, ipAddress, correlationId);
                if (sseEventService != null) {
                    sseEventService.broadcastAuditEvent(new com.sentinelcore.assetservice.dto.AuditLogResponse(
                            auditLog.getId(),
                            actor == null ? null : actor.getId(),
                            actorEmail,
                            role,
                            action,
                            entityType,
                            entityId,
                            result,
                            severity,
                            cleanDesc,
                            cleanBefore,
                            cleanAfter,
                            auditLog.getOccurredAt(),
                            auditLog.getEventHash(),
                            source,
                            eventType,
                            ipAddress,
                            correlationId
                    ));
                }
            } catch (Exception ex) {
                log.error("Failed to record audit log locally: {}", ex.getMessage(), ex);
            }
        }
    }

    private String maskSensitiveData(String input) {
        if (input == null) return null;
        return input.replaceAll("(?i)(password|token|secret|jwt)=\\S+", "$1=***MASKED***");
    }
}
