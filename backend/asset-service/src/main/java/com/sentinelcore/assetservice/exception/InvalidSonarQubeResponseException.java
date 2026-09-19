package com.sentinelcore.assetservice.exception;

public class InvalidSonarQubeResponseException extends RuntimeException {

    public InvalidSonarQubeResponseException(String message) {
        super(message);
    }
}
