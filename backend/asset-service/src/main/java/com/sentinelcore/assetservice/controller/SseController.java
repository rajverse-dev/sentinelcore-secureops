package com.sentinelcore.assetservice.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.sentinelcore.assetservice.service.SseEventService;

@RestController
@RequestMapping("/api/events")
public class SseController {

    private final SseEventService sseEventService;

    public SseController(SseEventService sseEventService) {
        this.sseEventService = sseEventService;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents() {
        return sseEventService.subscribe();
    }
}
