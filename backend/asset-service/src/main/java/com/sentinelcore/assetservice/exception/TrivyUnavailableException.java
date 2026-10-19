package com.sentinelcore.assetservice.exception;

public class TrivyUnavailableException extends RuntimeException {

    public TrivyUnavailableException(String message) {
        super(message);
    }

    public TrivyUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
