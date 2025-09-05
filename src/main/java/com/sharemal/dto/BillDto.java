package com.sharemal.dto;

import com.sharemal.enums.BillStatus;
import com.sharemal.enums.OperatorType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for Bill entity
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BillDto {
    
    private Long id;
    private String title;
    private BigDecimal totalAmount;
    private OperatorType operator;
    private LocalDate billDate;
    private BillStatus status;
    private List<PersonDto> persons;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
