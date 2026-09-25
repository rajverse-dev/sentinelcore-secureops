package com.sentinelcore.assetservice.config;
import java.time.LocalDateTime;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.sentinelcore.assetservice.entity.*;
import com.sentinelcore.assetservice.repository.*;

@Component
public class ComplianceSeedRunner implements CommandLineRunner {
    private final ComplianceFrameworkRepository frameworks;
    private final ComplianceControlRepository controls;
    public ComplianceSeedRunner(ComplianceFrameworkRepository f, ComplianceControlRepository c) {
        frameworks = f; controls = c;
    }
    @Override
    public void run(String... args) {
        if (frameworks.count() > 0) return; // already seeded
        seedPciDss(); seedSoc2(); seedIso27001();
    }
    private void seedPciDss() {
        ComplianceFramework f = new ComplianceFramework();
        f.setName("PCI DSS"); f.setVersion("v4.0");
        f.setDescription("Payment Card Industry Data Security Standard"); f.setActive(true);
        f = frameworks.save(f);
        String[][] pciControls = {
            {"1.1","Install and maintain network security controls","Network Security"},
            {"2.2","Apply vendor-supplied security patches","Configuration Management"},
            {"3.4","Render PAN unreadable anywhere it is stored","Data Protection"},
            {"6.3","Security vulnerabilities are identified and addressed","Vulnerability Management"},
            {"8.2","User identification and authentication management","Access Control"},
            {"10.1","All user access to system components is logged","Logging & Monitoring"},
            {"11.3","External and internal vulnerabilities are regularly identified","Testing"},
            {"12.1","Documented information security policy","Policy"}
        };
        for (String[] c : pciControls) {
            ComplianceControl ctrl = new ComplianceControl();
            ctrl.setFramework(f); ctrl.setControlId(c[0]); ctrl.setTitle(c[1]); ctrl.setDescription(c[2]);
            ctrl.setStatus(ComplianceStatus.NOT_ASSESSED);
            ctrl.setNextReviewAt(LocalDateTime.now().plusMonths(3));
            controls.save(ctrl);
        }
    }
    private void seedSoc2() {
        ComplianceFramework f = new ComplianceFramework();
        f.setName("SOC 2"); f.setVersion("Type II");
        f.setDescription("Service Organization Control 2"); f.setActive(true);
        f = frameworks.save(f);
        String[][] soc2Controls = {
            {"CC1.1","The entity demonstrates a commitment to integrity and ethical values","Control Environment"},
            {"CC6.1","Logical and physical access controls","Access Control"},
            {"CC7.1","Detection and monitoring of security threats","Monitoring"},
            {"CC8.1","Change management process","Change Management"},
            {"A1.1","Availability policies and procedures","Availability"}
        };
        for (String[] c : soc2Controls) {
            ComplianceControl ctrl = new ComplianceControl();
            ctrl.setFramework(f); ctrl.setControlId(c[0]); ctrl.setTitle(c[1]); ctrl.setDescription(c[2]);
            ctrl.setStatus(ComplianceStatus.NOT_ASSESSED);
            ctrl.setNextReviewAt(LocalDateTime.now().plusMonths(6));
            controls.save(ctrl);
        }
    }
    private void seedIso27001() {
        ComplianceFramework f = new ComplianceFramework();
        f.setName("ISO 27001"); f.setVersion("2022");
        f.setDescription("Information Security Management System"); f.setActive(true);
        f = frameworks.save(f);
        String[][] isoControls = {
            {"5.1","Information security policies","Organizational Controls"},
            {"6.1","Actions to address risks and opportunities","Risk Management"},
            {"8.2","Information security risk assessment","Risk Assessment"},
            {"9.1","Monitoring, measurement, analysis and evaluation","Performance Evaluation"},
            {"A.8.3","Information access restriction","Access Control"}
        };
        for (String[] c : isoControls) {
            ComplianceControl ctrl = new ComplianceControl();
            ctrl.setFramework(f); ctrl.setControlId(c[0]); ctrl.setTitle(c[1]); ctrl.setDescription(c[2]);
            ctrl.setStatus(ComplianceStatus.NOT_ASSESSED);
            ctrl.setNextReviewAt(LocalDateTime.now().plusMonths(6));
            controls.save(ctrl);
        }
    }
}
