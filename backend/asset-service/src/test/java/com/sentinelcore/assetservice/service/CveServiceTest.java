package com.sentinelcore.assetservice.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.sentinelcore.assetservice.dto.CveRequest;
import com.sentinelcore.assetservice.dto.CveResponse;
import com.sentinelcore.assetservice.dto.VulnerabilityResponse;
import com.sentinelcore.assetservice.entity.Asset;
import com.sentinelcore.assetservice.entity.CveRecord;
import com.sentinelcore.assetservice.entity.User;
import com.sentinelcore.assetservice.entity.Vulnerability;
import com.sentinelcore.assetservice.entity.VulnerabilitySeverity;
import com.sentinelcore.assetservice.exception.CveInUseException;
import com.sentinelcore.assetservice.exception.CveNotFoundException;
import com.sentinelcore.assetservice.exception.DuplicateCveException;
import com.sentinelcore.assetservice.repository.CveRecordRepository;
import com.sentinelcore.assetservice.repository.VulnerabilityRepository;

@ExtendWith(MockitoExtension.class)
class CveServiceTest {

    @Mock
    private CveRecordRepository cveRecordRepository;

    @Mock
    private VulnerabilityRepository vulnerabilityRepository;

    @Mock
    private AssetService assetService;

    @InjectMocks
    private CveService cveService;

    private User currentUser;

    @BeforeEach
    void setUp() {
        currentUser = new User("Alice", "alice@example.com", "password", "USER", true);
    }

    @Test
    void createCve_Success() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRequest request = sampleRequest();
        when(cveRecordRepository.existsByCveIdIgnoreCaseAndOwnerUser("CVE-2024-3094", currentUser)).thenReturn(false);
        when(cveRecordRepository.save(any(CveRecord.class))).thenAnswer(inv -> {
            CveRecord record = inv.getArgument(0);
            record.setId(UUID.randomUUID());
            return record;
        });

        CveResponse response = cveService.createCve(request);

        assertNotNull(response.getId());
        assertEquals("CVE-2024-3094", response.getCveId());
        assertEquals(BigDecimal.valueOf(10.0), response.getCvssScore());
        assertEquals(VulnerabilitySeverity.CRITICAL, response.getSeverity());
        assertEquals("xz-utils", response.getAffectedSoftware());
    }

    @Test
    void createCve_NormalizesCveId() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRequest request = sampleRequest();
        request.setCveId("cve-2024-3094"); // lowercase
        when(cveRecordRepository.existsByCveIdIgnoreCaseAndOwnerUser("CVE-2024-3094", currentUser)).thenReturn(false);
        when(cveRecordRepository.save(any(CveRecord.class))).thenAnswer(inv -> {
            CveRecord record = inv.getArgument(0);
            record.setId(UUID.randomUUID());
            return record;
        });

        CveResponse response = cveService.createCve(request);

        assertEquals("CVE-2024-3094", response.getCveId());
    }

    @Test
    void createCve_Duplicate_ThrowsException() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRequest request = sampleRequest();
        when(cveRecordRepository.existsByCveIdIgnoreCaseAndOwnerUser("CVE-2024-3094", currentUser)).thenReturn(true);

        assertThrows(DuplicateCveException.class, () -> cveService.createCve(request));
        verify(cveRecordRepository, never()).save(any());
    }

    @Test
    void getCveById_Success() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord record = sampleRecord();
        when(cveRecordRepository.findByIdAndOwnerUser(record.getId(), currentUser)).thenReturn(Optional.of(record));

        CveResponse response = cveService.getCveById(record.getId());

        assertEquals(record.getId(), response.getId());
        assertEquals("CVE-2024-3094", response.getCveId());
    }

    @Test
    void getCveById_NotFound() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        UUID id = UUID.randomUUID();
        when(cveRecordRepository.findByIdAndOwnerUser(id, currentUser)).thenReturn(Optional.empty());

        assertThrows(CveNotFoundException.class, () -> cveService.getCveById(id));
    }

    @Test
    void getCveByCveId_Success() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord record = sampleRecord();
        when(cveRecordRepository.findByCveIdIgnoreCaseAndOwnerUser("CVE-2024-3094", currentUser))
                .thenReturn(Optional.of(record));

        CveResponse response = cveService.getCveByCveId("cve-2024-3094");

        assertEquals(record.getId(), response.getId());
        assertEquals("CVE-2024-3094", response.getCveId());
    }

    @Test
    void getCveByCveId_NotFound() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        when(cveRecordRepository.findByCveIdIgnoreCaseAndOwnerUser("CVE-2024-9999", currentUser))
                .thenReturn(Optional.empty());

        assertThrows(CveNotFoundException.class, () -> cveService.getCveByCveId("CVE-2024-9999"));
    }

    @Test
    void updateCve_Success() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord record = sampleRecord();
        CveRequest request = sampleRequest();
        request.setDescription("Updated description");

        when(cveRecordRepository.findByIdAndOwnerUser(record.getId(), currentUser)).thenReturn(Optional.of(record));
        when(cveRecordRepository.existsByCveIdIgnoreCaseAndOwnerUserAndIdNot("CVE-2024-3094", currentUser, record.getId()))
                .thenReturn(false);
        when(cveRecordRepository.save(any(CveRecord.class))).thenAnswer(inv -> inv.getArgument(0));

        CveResponse response = cveService.updateCve(record.getId(), request);

        assertEquals("Updated description", response.getDescription());
    }

    @Test
    void updateCve_Duplicate_ThrowsException() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord record = sampleRecord();
        CveRequest request = sampleRequest();

        when(cveRecordRepository.findByIdAndOwnerUser(record.getId(), currentUser)).thenReturn(Optional.of(record));
        when(cveRecordRepository.existsByCveIdIgnoreCaseAndOwnerUserAndIdNot("CVE-2024-3094", currentUser, record.getId()))
                .thenReturn(true);

        assertThrows(DuplicateCveException.class, () -> cveService.updateCve(record.getId(), request));
        verify(cveRecordRepository, never()).save(any());
    }

    @Test
    void deleteCve_Success() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord record = sampleRecord();
        when(cveRecordRepository.findByIdAndOwnerUser(record.getId(), currentUser)).thenReturn(Optional.of(record));
        when(vulnerabilityRepository.existsByCveRecord(record)).thenReturn(false);

        cveService.deleteCve(record.getId());

        verify(cveRecordRepository).delete(record);
    }

    @Test
    void deleteCve_WhenInUse_ThrowsException() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord record = sampleRecord();
        when(cveRecordRepository.findByIdAndOwnerUser(record.getId(), currentUser)).thenReturn(Optional.of(record));
        when(vulnerabilityRepository.existsByCveRecord(record)).thenReturn(true);

        assertThrows(CveInUseException.class, () -> cveService.deleteCve(record.getId()));
        verify(cveRecordRepository, never()).delete(any());
    }

    @Test
    void searchCves_Success() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord record = sampleRecord();
        when(cveRecordRepository.searchByOwnerUser(currentUser, "xz")).thenReturn(List.of(record));

        List<CveResponse> results = cveService.searchCves("xz");

        assertEquals(1, results.size());
        assertEquals("CVE-2024-3094", results.get(0).getCveId());
    }

    @Test
    void getCvesBySeverity_Success() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord record = sampleRecord();
        when(cveRecordRepository.findByOwnerUserAndSeverity(currentUser, VulnerabilitySeverity.CRITICAL))
                .thenReturn(List.of(record));

        List<CveResponse> results = cveService.getCvesBySeverity(VulnerabilitySeverity.CRITICAL);

        assertEquals(1, results.size());
        assertEquals(VulnerabilitySeverity.CRITICAL, results.get(0).getSeverity());
    }

    @Test
    void preventsCrossUserAccess() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        UUID otherUserCveId = UUID.randomUUID();
        when(cveRecordRepository.findByIdAndOwnerUser(otherUserCveId, currentUser)).thenReturn(Optional.empty());

        assertThrows(CveNotFoundException.class, () -> cveService.getCveById(otherUserCveId));
    }

    @Test
    void getVulnerabilitiesForCve_ReturnsUserScopedVulnerabilities() {
        when(assetService.getCurrentUser()).thenReturn(currentUser);
        CveRecord cve = sampleRecord();
        Asset asset = new Asset();
        asset.setId(UUID.randomUUID());
        asset.setIdentifier("web-prod-1");
        asset.setName("Web Server");

        Vulnerability vuln = new Vulnerability();
        vuln.setId(UUID.randomUUID());
        vuln.setAsset(asset);
        vuln.setCveRecord(cve);
        vuln.setVulnerabilityIdentifier("CVE-2024-3094");
        vuln.setTitle("Backdoor in xz");
        vuln.setDescription("Critical malicious backdoor");
        vuln.setSeverity(VulnerabilitySeverity.CRITICAL);
        vuln.setAffectedComponent("xz-utils");

        when(cveRecordRepository.findByIdAndOwnerUser(cve.getId(), currentUser)).thenReturn(Optional.of(cve));
        when(vulnerabilityRepository.findByCveRecordAndAssetOwnerUser(cve, currentUser)).thenReturn(List.of(vuln));

        List<VulnerabilityResponse> vulnerabilities = cveService.getVulnerabilitiesForCve(cve.getId());

        assertEquals(1, vulnerabilities.size());
        assertEquals("CVE-2024-3094", vulnerabilities.get(0).getVulnerabilityIdentifier());
        assertEquals(cve.getId(), vulnerabilities.get(0).getCveRecordId());
    }

    private CveRequest sampleRequest() {
        CveRequest request = new CveRequest();
        request.setCveId("CVE-2024-3094");
        request.setCvssScore(BigDecimal.valueOf(10.0));
        request.setSeverity(VulnerabilitySeverity.CRITICAL);
        request.setDescription("Backdoor in upstream xz-utils");
        request.setAffectedSoftware("xz-utils");
        request.setAffectedVersion("5.6.0, 5.6.1");
        request.setRemediation("Downgrade to 5.4.x");
        request.setReferences("https://nvd.nist.gov/vuln/detail/CVE-2024-3094");
        request.setPublishedAt(LocalDate.of(2024, 3, 29));
        request.setLastModifiedAt(LocalDate.of(2024, 4, 1));
        return request;
    }

    private CveRecord sampleRecord() {
        CveRecord record = new CveRecord();
        record.setId(UUID.randomUUID());
        record.setOwnerUser(currentUser);
        record.setCveId("CVE-2024-3094");
        record.setCvssScore(BigDecimal.valueOf(10.0));
        record.setSeverity(VulnerabilitySeverity.CRITICAL);
        record.setDescription("Backdoor in upstream xz-utils");
        record.setAffectedSoftware("xz-utils");
        record.setAffectedVersion("5.6.0, 5.6.1");
        record.setRemediation("Downgrade to 5.4.x");
        record.setReferences("https://nvd.nist.gov/vuln/detail/CVE-2024-3094");
        record.setPublishedAt(LocalDate.of(2024, 3, 29));
        record.setLastModifiedAt(LocalDate.of(2024, 4, 1));
        return record;
    }
}
