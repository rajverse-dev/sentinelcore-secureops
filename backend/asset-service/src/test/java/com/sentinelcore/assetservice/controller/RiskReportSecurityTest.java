package com.sentinelcore.assetservice.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sentinelcore.assetservice.service.RiskReportService;

@SpringBootTest
@AutoConfigureMockMvc
class RiskReportSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RiskReportService riskReportService;

    @Test
    void getCurrentReportRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/risk-reports/current"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void exportReportRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/risk-reports/export"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void downloadReportRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/risk-reports/download"))
                .andExpect(status().isUnauthorized());
    }
}