package com.sentinelcore.assetservice.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.sentinelcore.assetservice.exception.InvalidTrivyScanException;
import com.sentinelcore.assetservice.exception.TrivyExecutionException;
import com.sentinelcore.assetservice.exception.TrivyUnavailableException;

@Service
public class TrivyExecutionService {

    private static final Logger log = LoggerFactory.getLogger(TrivyExecutionService.class);
    private static final Pattern SAFE_TARGET_PATTERN = Pattern.compile("^[a-zA-Z0-9_.:/@\\-]+$");

    private final String trivyExecutable;
    private final int timeoutSeconds;
    private final String defaultTarget;

    public TrivyExecutionService(
            @Value("${trivy.executable:trivy}") String trivyExecutable,
            @Value("${trivy.timeout-seconds:60}") int timeoutSeconds,
            @Value("${trivy.default-target:}") String defaultTarget) {
        this.trivyExecutable = trivyExecutable;
        this.timeoutSeconds = timeoutSeconds;
        this.defaultTarget = defaultTarget;
    }

    public String executeScan(String target) {
        String resolvedTarget = resolveTarget(target);
        validateTarget(resolvedTarget);

        List<String> command = List.of(
                trivyExecutable,
                "image",
                "--format", "json",
                "--quiet",
                resolvedTarget
        );

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(false);

        Process process;
        try {
            process = processBuilder.start();
        } catch (IOException exception) {
            log.error("Failed to start Trivy process: {}", exception.getMessage());
            throw new TrivyUnavailableException("Trivy scanner is unavailable on the server.", exception);
        }

        StringBuilder stdout = new StringBuilder();
        StringBuilder stderr = new StringBuilder();

        Thread stdoutThread = new Thread(() -> readStream(process.getInputStream(), stdout), "trivy-stdout-reader");
        Thread stderrThread = new Thread(() -> readStream(process.getErrorStream(), stderr), "trivy-stderr-reader");
        stdoutThread.start();
        stderrThread.start();

        boolean finished;
        try {
            finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            process.destroyForcibly();
            throw new TrivyExecutionException("Trivy scan was interrupted.", exception);
        }

        if (!finished) {
            process.destroyForcibly();
            throw new TrivyExecutionException("Trivy scan timed out.");
        }

        try {
            stdoutThread.join(2000);
            stderrThread.join(2000);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
        }

        int exitCode = process.exitValue();
        String output = stdout.toString().trim();

        if (output.isEmpty() && exitCode != 0) {
            log.error("Trivy exited with code {} and stderr: {}", exitCode, stderr.toString().trim());
            throw new TrivyExecutionException("Trivy scan execution failed.");
        }

        if (output.isEmpty()) {
            throw new InvalidTrivyScanException("Unable to parse Trivy scan results.");
        }

        return output;
    }

    private void readStream(InputStream inputStream, StringBuilder output) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
            }
        } catch (IOException exception) {
            log.warn("Error reading Trivy process stream: {}", exception.getMessage());
        }
    }

    private String resolveTarget(String target) {
        if (target != null && !target.isBlank()) {
            return target.trim();
        }
        if (defaultTarget != null && !defaultTarget.isBlank()) {
            return defaultTarget.trim();
        }
        return "alpine:latest";
    }

    private void validateTarget(String target) {
        if (!SAFE_TARGET_PATTERN.matcher(target).matches()) {
            throw new InvalidTrivyScanException("Invalid characters in scan target.");
        }
    }
}
