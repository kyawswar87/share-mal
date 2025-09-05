package com.sharemal.dto;

import com.sharemal.enums.BillStatus;
import com.sharemal.enums.OperatorType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO for updating an existing bill
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillUpdateRequest {
    
    @Size(min = 1, max = 255, message = "Bill title must be between 1 and 255 characters")
    private String title;
    
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;
    
    private OperatorType operator;
    
    private LocalDate billDate;
    
    private BillStatus status;
}
