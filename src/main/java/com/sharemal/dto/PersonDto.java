package com.sharemal.dto;

import com.sharemal.enums.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Data Transfer Object for Person entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonDto {
    
    private Long id;
    
    @NotBlank(message = "Person name is required")
    @Size(min = 1, max = 100, message = "Person name must be between 1 and 100 characters")
    private String name;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    private PaymentStatus paymentStatus;
    
    private Long billId;
}
