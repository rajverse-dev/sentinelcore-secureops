package com.sentinelcore.assetservice.service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.sentinelcore.assetservice.dto.AuditEventMessage;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.repository.UserRepository;

@Service
@ConditionalOnProperty(name = "sentinelcore.kafka.enabled", havingValue = "true", matchIfMissing = true)
public class KafkaConsumerService {

    private static final Logger log = LoggerFactory.getLogger(KafkaConsumerService.class);

    private final AuditService auditService;
    private final UserRepository userRepository;
    private final SseEventService sseEventService;
    private final Set<String> processedEvents = ConcurrentHashMap.newKeySet();

    public KafkaConsumerService(AuditService auditService, UserRepository userRepository, SseEventService sseEventService) {
        this.auditService = auditService;
        this.userRepository = userRepository;
        this.sseEventService = sseEventService;
    }

    @KafkaListener(
            topics = "${sentinelcore.kafka.topic:sentinelcore-audit-events}",
            groupId = "${spring.kafka.consumer.group-id:sentinelcore-audit-group}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeAuditEvent(AuditEventMessage message) {
        if (message == null || message.eventId() == null) {
            return;
        }

        String eventKey = message.eventId().toString();

        // Idempotency check — prevent processing duplicate messages
        if (processedEvents.contains(eventKey)) {
            log.info("Duplicate event ignored: {}", eventKey);
            return;
        }

        log.info("Received Kafka Audit Event [{}]: action={}, entity={}", eventKey, message.action(), message.entityType());

        try {
            User actor = null;
            if (message.actorEmail() != null && !"SYSTEM".equalsIgnoreCase(message.actorEmail())) {
                actor = userRepository.findByEmail(message.actorEmail()).orElse(null);
            }

            var auditLog = auditService.record(
                    actor,
                    message.action(),
                    message.entityType(),
                    message.entityId(),
                    message.result(),
                    message.severity(),
                    message.description(),
                    message.beforeState(),
                    message.afterState(),
                    message.source(),
                    message.eventType(),
                    message.ipAddress(),
                    message.correlationId()
            );

            processedEvents.add(eventKey);

            // Limit in-memory set size to prevent memory leak
            if (processedEvents.size() > 10000) {
                processedEvents.clear();
            }

            // Real-time broadcast to connected frontend SSE clients
            if (sseEventService != null && auditLog != null) {
                sseEventService.broadcastAuditEvent(new com.sentinelcore.assetservice.dto.AuditLogResponse(
                        auditLog.getId(),
                        actor == null ? null : actor.getId(),
                        message.actorEmail(),
                        message.role(),
                        message.action(),
                        message.entityType(),
                        message.entityId(),
                        message.result(),
                        message.severity(),
                        message.description(),
                        message.beforeState(),
                        message.afterState(),
                        auditLog.getOccurredAt(),
                        auditLog.getEventHash(),
                        message.source(),
                        message.eventType(),
                        message.ipAddress(),
                        message.correlationId()
                ));
            }
        } catch (Exception e) {
            log.error("Error processing Kafka audit event {}: {}", eventKey, e.getMessage(), e);
        }
    }
}
