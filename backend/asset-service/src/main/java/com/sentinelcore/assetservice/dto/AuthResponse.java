package com.sentinelcore.assetservice.dto;


import java.util.UUID;

public class AuthResponse {

    private UUID id;
    private String name;
    private String email;
    private String role;
    private String token;

    public AuthResponse(
            UUID id,
            String name,
            String email,
            String role,
            String token) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}
