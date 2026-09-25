package com.sentinelcore.assetservice.service;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.sentinelcore.assetservice.dto.AuditLogResponse;

@Service
public class SseEventService {

    private static final Logger log = LoggerFactory.getLogger(SseEventService.class);
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L); // Infinite timeout
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        try {
            emitter.send(SseEmitter.event().name("INIT").data("Connected to SentinelCore Real-Time Event Stream"));
        } catch (Exception e) {
            emitters.remove(emitter);
        }

        return emitter;
    }

    public void broadcastAuditEvent(AuditLogResponse auditLog) {
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("AUDIT_EVENT").data(auditLog));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }
}
