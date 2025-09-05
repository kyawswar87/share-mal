package com.sharemal.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base exception class for all custom exceptions in the application
 */
@Getter
public abstract class BaseException extends RuntimeException {
    
    private final String errorCode;
    private final HttpStatus httpStatus;
    
    protected BaseException(String message, String errorCode, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
    
    protected BaseException(String message, String errorCode, HttpStatus httpStatus, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
}
