package com.sentinelcore.assetservice.service;

import java.io.ByteArrayOutputStream;
import java.awt.Color;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.sentinelcore.assetservice.dto.ComplianceGapItem;

@Service
public class PdfReportGenerator {

    private final Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(15, 23, 42));
    private final Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(100, 116, 139));
    private final Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, new Color(124, 58, 237));
    private final Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(51, 65, 85));
    private final Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);

    public byte[] generateCompliancePdf(Map<String, Object> report, List<ComplianceGapItem> gaps) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Header
            Paragraph title = new Paragraph("SentinelCore SecureOps — Compliance Report", titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            document.add(title);

            Paragraph subtitle = new Paragraph("Framework Assessment Posture & Gap Analysis", subtitleFont);
            subtitle.setSpacingAfter(15);
            document.add(subtitle);

            // Summary Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingAfter(15);

            addHeaderCell(table, "Metric");
            addHeaderCell(table, "Value");

            addCell(table, "Framework Name", String.valueOf(report.get("frameworkName")));
            addCell(table, "Compliance Score", String.format("%.1f%%", report.get("compliancePercentage")));
            addCell(table, "Total Controls", String.valueOf(report.get("totalControls")));
            addCell(table, "Compliant Controls", String.valueOf(report.get("compliantControls")));
            addCell(table, "Partially Compliant", String.valueOf(report.get("partialControls")));
            addCell(table, "Non-Compliant Controls", String.valueOf(report.get("nonCompliantControls")));
            addCell(table, "Not Assessed Controls", String.valueOf(report.get("notAssessedControls")));

            document.add(table);

            // Gap Analysis Section
            Paragraph gapTitle = new Paragraph("Compliance Gap Analysis Items", sectionFont);
            gapTitle.setSpacingAfter(10);
            document.add(gapTitle);

            if (gaps != null && !gaps.isEmpty()) {
                PdfPTable gapTable = new PdfPTable(4);
                gapTable.setWidthPercentage(100);
                gapTable.setWidths(new float[]{2, 4, 3, 4});
                gapTable.setSpacingAfter(15);

                addHeaderCell(gapTable, "Ref ID");
                addHeaderCell(gapTable, "Title");
                addHeaderCell(gapTable, "Status");
                addHeaderCell(gapTable, "Gap Reason");

                for (ComplianceGapItem gap : gaps) {
                    addCell(gapTable, gap.controlRef(), gap.controlRef());
                    addCell(gapTable, gap.title(), gap.title());
                    addCell(gapTable, String.valueOf(gap.status()), String.valueOf(gap.status()));
                    addCell(gapTable, gap.gapReason(), gap.gapReason());
                }
                document.add(gapTable);
            } else {
                Paragraph noGaps = new Paragraph("No compliance gaps detected for this framework.", textFont);
                noGaps.setSpacingAfter(15);
                document.add(noGaps);
            }

            // Disclaimer
            Paragraph disclaimer = new Paragraph(String.valueOf(report.get("disclaimer")), subtitleFont);
            document.add(disclaimer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Compliance PDF", e);
        }
    }

    public byte[] generateAccessPdf(Map<String, Object> report) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("SentinelCore SecureOps — Access & Authentication Report", titleFont));
            Paragraph sub = new Paragraph("User login activity and access statistics", subtitleFont);
            sub.setSpacingAfter(15);
            document.add(sub);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingAfter(15);

            addHeaderCell(table, "Access Metric");
            addHeaderCell(table, "Value");

            addCell(table, "Total Registered Users", String.valueOf(report.get("totalUsers")));
            addCell(table, "Successful Logins", String.valueOf(report.get("successfulLogins")));
            addCell(table, "Failed Login Attempts", String.valueOf(report.get("failedLogins")));
            addCell(table, "Login Success Rate", String.format("%.1f%%", report.get("loginSuccessRate")));
            addCell(table, "New User Registrations", String.valueOf(report.get("newRegistrations")));

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Access PDF", e);
        }
    }

    public byte[] generateSecurityPdf(Map<String, Object> report) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("SentinelCore SecureOps — Security Posture Report", titleFont));
            Paragraph sub = new Paragraph("Security events, incidents, and vulnerability posture", subtitleFont);
            sub.setSpacingAfter(15);
            document.add(sub);

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingAfter(15);

            addHeaderCell(table, "Security Posture Domain");
            addHeaderCell(table, "Metric Summary");

            addCell(table, "Generated By", String.valueOf(report.get("generatedBy")));
            addCell(table, "Audit Log Summary", String.valueOf(report.get("auditSummary")));
            addCell(table, "Incidents Summary", String.valueOf(report.get("incidents")));
            addCell(table, "Vulnerabilities Summary", String.valueOf(report.get("vulnerabilities")));

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Security PDF", e);
        }
    }

    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, headerFont));
        cell.setBackgroundColor(new Color(124, 58, 237));
        cell.setPadding(6);
        table.addCell(cell);
    }

    private void addCell(PdfPTable table, String label, String value) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, textFont));
        c1.setPadding(5);
        table.addCell(c1);

        PdfPCell c2 = new PdfPCell(new Phrase(value != null ? value : "N/A", textFont));
        c2.setPadding(5);
        table.addCell(c2);
    }
}
