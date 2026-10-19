package com.sentinelcore.assetservice.exception;

public class CveInUseException extends RuntimeException {

    public CveInUseException(String message) {
        super(message);
    }
}
