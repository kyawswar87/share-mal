package com.sharemal.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard error response for API endpoints
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    
    private ErrorDetails error;
    private ResponseStatus status;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
    private LocalDateTime timestamp;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ErrorDetails {
        private String code;
        private String message;
        private List<String> details;
    }
    
    public static ErrorResponse of(String code, String message) {
        return ErrorResponse.builder()
                .error(ErrorDetails.builder()
                        .code(code)
                        .message(message)
                        .build())
                .status(ResponseStatus.ERROR)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public static ErrorResponse of(String code, String message, List<String> details) {
        return ErrorResponse.builder()
                .error(ErrorDetails.builder()
                        .code(code)
                        .message(message)
                        .details(details)
                        .build())
                .status(ResponseStatus.ERROR)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    public enum ResponseStatus {
        ERROR
    }
}
