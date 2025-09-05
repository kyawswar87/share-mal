package com.sharemal.model;

import com.sharemal.enums.BillStatus;
import com.sharemal.enums.OperatorType;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Bill entity representing a bill with multiple participants
 */
@Entity
@Table(name = "bills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Bill extends BaseEntity {
    
    @NotBlank(message = "Bill title is required")
    @Size(min = 1, max = 255, message = "Bill title must be between 1 and 255 characters")
    @Column(name = "title", nullable = false)
    private String title;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @NotNull(message = "Operator type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "operator", nullable = false)
    private OperatorType operator;
    
    @NotNull(message = "Bill date is required")
    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private BillStatus status = BillStatus.INCOMPLETE;
    
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Person> persons = new ArrayList<>();
    
    /**
     * Add a person to this bill
     */
    public void addPerson(Person person) {
        persons.add(person);
        person.setBill(this);
    }
    
    /**
     * Remove a person from this bill
     */
    public void removePerson(Person person) {
        persons.remove(person);
        person.setBill(null);
    }
}
