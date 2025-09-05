package com.sharemal.repository;

import com.sharemal.enums.BillStatus;
import com.sharemal.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Bill entity operations
 */
@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    
    /**
     * Find bills by status
     */
    List<Bill> findByStatus(BillStatus status);
    
    /**
     * Find bills by title containing the given text (case-insensitive)
     */
    List<Bill> findByTitleContainingIgnoreCase(String title);
    
    /**
     * Find bills created between the given dates
     */
    List<Bill> findByBillDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * Find bills with total amount greater than the given amount
     */
    List<Bill> findByTotalAmountGreaterThan(java.math.BigDecimal amount);
    
    /**
     * Find bills with total amount less than the given amount
     */
    List<Bill> findByTotalAmountLessThan(java.math.BigDecimal amount);
    
    /**
     * Find bill by ID with persons eagerly loaded
     */
    @Query("SELECT b FROM Bill b LEFT JOIN FETCH b.persons WHERE b.id = :id")
    Optional<Bill> findByIdWithPersons(@Param("id") Long id);
    
    /**
     * Find all bills with persons eagerly loaded
     */
    @Query("SELECT b FROM Bill b LEFT JOIN FETCH b.persons")
    List<Bill> findAllWithPersons();
    
    /**
     * Count bills by status
     */
    long countByStatus(BillStatus status);
}
