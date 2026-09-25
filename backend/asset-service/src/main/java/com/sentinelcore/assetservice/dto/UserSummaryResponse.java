package com.sentinelcore.assetservice.dto;

public record UserSummaryResponse(
        String id,
        String name,
        String email,
        String username,
        String role,
        boolean enabled,
        String createdAt
) {}
