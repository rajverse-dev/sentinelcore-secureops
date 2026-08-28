package com.sentinelcore.assetservice.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SecurityTestController {

    @GetMapping("/api/secure-test")
    public String secureTest( 
        Authentication authentication) {

            return "Authenticated as :" +
                authentication.getName();
    }

}
