package com.sentinelcore.assetservice.controller;

import com.sentinelcore.assetservice.dto.UserSummaryResponse;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> getAllUsers() {
        List<UserSummaryResponse> users = userRepository.findAll().stream()
                .map(u -> new UserSummaryResponse(
                        u.getId().toString(),
                        u.getName(),
                        u.getEmail(),
                        u.getUsername(),
                        u.getRole(),
                        u.isEnabled(),
                        u.getCreatedAt() != null ? u.getCreatedAt().toLocalDate().toString() : null
                ))
                .toList();
        return ResponseEntity.ok(users);
    }
}
