package com.sharemal.dto;

import com.sharemal.enums.OperatorType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Request DTO for creating a new bill
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillCreateRequest {
    
    @NotBlank(message = "Bill title is required")
    @Size(min = 1, max = 255, message = "Bill title must be between 1 and 255 characters")
    private String title;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;
    
    @NotNull(message = "Operator type is required")
    private OperatorType operator;
    
    @NotNull(message = "Bill date is required")
    private LocalDate billDate;
    
    @NotEmpty(message = "At least one person is required")
    @Valid
    private List<PersonCreateRequest> persons;
    
    /**
     * Inner class for person creation within bill creation
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonCreateRequest {
        
        @NotBlank(message = "Person name is required")
        @Size(min = 1, max = 100, message = "Person name must be between 1 and 100 characters")
        private String name;
        
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        private BigDecimal amount; // Optional for EQUALLY operator, required for CUSTOM operator
    }
}
