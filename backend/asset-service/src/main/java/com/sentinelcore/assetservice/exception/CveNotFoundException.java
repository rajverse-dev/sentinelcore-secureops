package com.sentinelcore.assetservice.exception;

public class CveNotFoundException extends RuntimeException {

    public CveNotFoundException(String message) {
        super(message);
    }
}
