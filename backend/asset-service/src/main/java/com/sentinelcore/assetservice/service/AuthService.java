package com.sentinelcore.assetservice.service;



import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sentinelcore.assetservice.exception.AuthenticationException;
import com.sentinelcore.assetservice.dto.AuthResponse;
import com.sentinelcore.assetservice.dto.LoginRequest;
import com.sentinelcore.assetservice.dto.RegisterRequest;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.exception.EmailAlreadyExistsExcepiton;
import com.sentinelcore.assetservice.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsExcepiton(
                    "Email is already registered"
            );
        }

        String username = null;
        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            username = request.getUsername().trim();
            if (userRepository.existsByUsername(username)) {
                throw new EmailAlreadyExistsExcepiton(
                        "Username is already taken"
                );
            }
        }

        String hashedPassword =
                passwordEncoder.encode(
                        request.getPassword()
                );

        User user = new User(
                request.getName().trim(),
                email,
                username,
                hashedPassword,
                "USER",
                true
        );

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(
                savedUser.getEmail(),
                savedUser.getRole()
        );

        return new AuthResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getUsername(),
                savedUser.getRole(),
                token
        );
    }

    public AuthResponse login(LoginRequest request) {

        String identifier = request.getIdentifier().toLowerCase();

        if (identifier.isBlank()) {
            throw new AuthenticationException("Email or username is required");
        }

        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByUsername(identifier))
                .orElseThrow(() ->
                        new AuthenticationException(
                                "Invalid email or password"
                        ));

        if (!user.isEnabled()) {
            throw new AuthenticationException(
                    "User account is disabled"
            );
        }

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!passwordMatches) {
            throw new AuthenticationException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getRole(),
                token
        );
    }
}