package com.sentinelcore.assetservice.exception;

public class TrivyExecutionException extends RuntimeException {

    public TrivyExecutionException(String message) {
        super(message);
    }

    public TrivyExecutionException(String message, Throwable cause) {
        super(message, cause);
    }
}
