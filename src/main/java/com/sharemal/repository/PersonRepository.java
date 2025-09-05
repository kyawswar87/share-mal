package com.sharemal.repository;

import com.sharemal.enums.PaymentStatus;
import com.sharemal.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Person entity operations
 */
@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    
    /**
     * Find persons by bill ID
     */
    List<Person> findByBillId(Long billId);
    
    /**
     * Find persons by payment status
     */
    List<Person> findByPaymentStatus(PaymentStatus paymentStatus);
    
    /**
     * Find persons by name containing the given text (case-insensitive)
     */
    List<Person> findByNameContainingIgnoreCase(String name);
    
    /**
     * Find persons by bill ID and payment status
     */
    List<Person> findByBillIdAndPaymentStatus(Long billId, PaymentStatus paymentStatus);
    
    /**
     * Count persons by bill ID
     */
    long countByBillId(Long billId);
    
    /**
     * Count persons by bill ID and payment status
     */
    long countByBillIdAndPaymentStatus(Long billId, PaymentStatus paymentStatus);
    
    /**
     * Find persons with amount greater than the given amount
     */
    List<Person> findByAmountGreaterThan(java.math.BigDecimal amount);
    
    /**
     * Find persons with amount less than the given amount
     */
    List<Person> findByAmountLessThan(java.math.BigDecimal amount);
}
