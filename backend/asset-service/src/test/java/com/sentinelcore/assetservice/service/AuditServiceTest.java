package com.sentinelcore.assetservice.service;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.sentinelcore.assetservice.entity.AuditLog;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.repository.AuditLogRepository;

class AuditServiceTest {
    @Test
    void recordsEventWithIntegrityHash() {
        AuditLogRepository repository = org.mockito.Mockito.mock(AuditLogRepository.class);
        when(repository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));
        AuditService service = new AuditService(repository);
        AuditLog log = service.record(new User("A", "a@example.com", "p", "USER", true), "LOGIN", "AUTH", null, "SUCCESS", "INFO", "Login succeeded", null, null);
        assertTrue(log.getEventHash() != null && log.getEventHash().length() == 64);
    }

    @Test
    void integrityPassesForHashedEvents() {
        AuditLogRepository repository = org.mockito.Mockito.mock(AuditLogRepository.class);
        AuditService service = new AuditService(repository);
        User user = new User("A", "a@example.com", "p", "USER", true);
        when(repository.save(any(AuditLog.class))).thenAnswer(invocation -> invocation.getArgument(0));
        AuditLog log = service.record(user, "LOGIN", "AUTH", null, "SUCCESS", "INFO", "Login succeeded", null, null);
        when(repository.findTop100ByOrderByOccurredAtDesc()).thenReturn(List.of(log));
        assertTrue(service.verifyIntegrity());
    }
}