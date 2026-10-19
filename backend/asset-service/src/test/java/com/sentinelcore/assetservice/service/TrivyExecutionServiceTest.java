package com.sentinelcore.assetservice.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import com.sentinelcore.assetservice.exception.InvalidTrivyScanException;
import com.sentinelcore.assetservice.exception.TrivyUnavailableException;

class TrivyExecutionServiceTest {

    @Test
    void rejectsInvalidTargetCharacters() {
        TrivyExecutionService service = new TrivyExecutionService("trivy", 10, "alpine:latest");

        assertThrows(InvalidTrivyScanException.class, () -> service.executeScan("test; rm -rf /"));
        assertThrows(InvalidTrivyScanException.class, () -> service.executeScan("image $(whoami)"));
        assertThrows(InvalidTrivyScanException.class, () -> service.executeScan("image`cat /etc/passwd`"));
        assertThrows(InvalidTrivyScanException.class, () -> service.executeScan("image|nc localhost 4444"));
    }

    @Test
    void handlesMissingTrivyExecutableSafely() {
        TrivyExecutionService service = new TrivyExecutionService("non_existent_trivy_bin_xyz", 5, "alpine:latest");

        TrivyUnavailableException exception = assertThrows(
                TrivyUnavailableException.class,
                () -> service.executeScan("alpine:latest")
        );
        assertTrue(exception.getMessage().contains("Trivy scanner is unavailable"));
    }
}
