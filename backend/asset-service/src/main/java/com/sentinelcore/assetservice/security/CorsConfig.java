package com.sentinelcore.assetservice.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "http://localhost:5175",
                        "http://127.0.0.1:5173",
                        "http://127.0.0.1:5174",
                        "http://127.0.0.1:5175"
                )
        );

        configuration.setAllowedOriginPatterns(
                List.of(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "http://[::1]:*",
                        "http://10.*:*",
                        "http://172.16.*:*",
                        "http://172.17.*:*",
                        "http://172.18.*:*",
                        "http://172.19.*:*",
                        "http://172.20.*:*",
                        "http://172.21.*:*",
                        "http://172.22.*:*",
                        "http://172.23.*:*",
                        "http://172.24.*:*",
                        "http://172.25.*:*",
                        "http://172.26.*:*",
                        "http://172.27.*:*",
                        "http://172.28.*:*",
                        "http://172.29.*:*",
                        "http://172.30.*:*",
                        "http://172.31.*:*",
                        "http://192.168.*:*"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}
