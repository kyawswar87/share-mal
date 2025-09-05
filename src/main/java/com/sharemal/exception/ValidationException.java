package com.sharemal.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception thrown when validation fails
 */
public class ValidationException extends BaseException {
    
    public ValidationException(String message) {
        super(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST);
    }
    
    public ValidationException(String message, Throwable cause) {
        super(message, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST, cause);
    }
}
