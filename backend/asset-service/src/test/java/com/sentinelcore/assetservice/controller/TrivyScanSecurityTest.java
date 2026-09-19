package com.sentinelcore.assetservice.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.sentinelcore.assetservice.service.TrivyScanService;

@SpringBootTest
@AutoConfigureMockMvc
class TrivyScanSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TrivyScanService trivyScanService;

    @Test
    void trivyScanRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/api/scans/trivy")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validRequest()))
                .andExpect(status().isUnauthorized());
    }

    private String validRequest() {
        return """
                {
                  "assetId": "%s",
                  "scanTarget": "approved-image",
                  "trivyJson": "{\\"Results\\":[]}"
                }
                """.formatted(UUID.randomUUID());
    }
}
