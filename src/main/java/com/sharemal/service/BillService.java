package com.sharemal.service;

import com.sharemal.dto.BillCreateRequest;
import com.sharemal.dto.BillDto;
import com.sharemal.dto.BillUpdateRequest;
import com.sharemal.dto.PersonDto;
import com.sharemal.enums.BillStatus;
import com.sharemal.enums.OperatorType;
import com.sharemal.enums.PaymentStatus;
import com.sharemal.exception.ResourceNotFoundException;
import com.sharemal.exception.ValidationException;
import com.sharemal.model.Bill;
import com.sharemal.model.Person;
import com.sharemal.repository.BillRepository;
import com.sharemal.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Bill business logic
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BillService {
    
    private final BillRepository billRepository;
    private final PersonRepository personRepository;
    
    /**
     * Get all bills
     */
    public List<BillDto> getAllBills() {
        log.debug("Fetching all bills");
        return billRepository.findAllWithPersons()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get bill by ID
     */
    public BillDto getBillById(Long id) {
        log.debug("Fetching bill with id: {}", id);
        Bill bill = billRepository.findByIdWithPersons(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        return convertToDto(bill);
    }
    
    /**
     * Get bills by status
     */
    public List<BillDto> getBillsByStatus(BillStatus status) {
        log.debug("Fetching bills with status: {}", status);
        return billRepository.findByStatus(status)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get bills by title containing text
     */
    public List<BillDto> getBillsByTitle(String title) {
        log.debug("Fetching bills with title containing: {}", title);
        return billRepository.findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Create a new bill
     */
    @Transactional
    public BillDto createBill(BillCreateRequest request) {
        log.debug("Creating new bill with title: {}", request.getTitle());
        
        // Validate request
        validateBillCreateRequest(request);
        
        // Create bill entity
        Bill bill = new Bill();
        bill.setTitle(request.getTitle());
        bill.setTotalAmount(request.getTotalAmount());
        bill.setOperator(request.getOperator());
        bill.setBillDate(request.getBillDate());
        bill.setStatus(BillStatus.INCOMPLETE);
        
        // Create persons and add them to the bill
        List<Person> persons = new ArrayList<>();
        for (BillCreateRequest.PersonCreateRequest personRequest : request.getPersons()) {
            Person person = new Person();
            person.setName(personRequest.getName());
            person.setPaymentStatus(PaymentStatus.UNPAID);
            person.setBill(bill);
            persons.add(person);
            // Add person to bill's persons list to establish bidirectional relationship
            bill.addPerson(person);
        }
        
        // Distribute amounts based on operator type
        if (request.getOperator() == OperatorType.EQUALLY) {
            distributeAmountEqually(bill, persons);
        } else {
            distributeAmountCustom(bill, persons, request.getPersons());
        }
        
        // Save bill (persons will be saved automatically due to cascade)
        Bill savedBill = billRepository.save(bill);
        
        log.info("Bill created successfully with id: {}", savedBill.getId());
        
        // Return bill with persons
        return getBillById(savedBill.getId());
    }
    
    /**
     * Update an existing bill
     */
    @Transactional
    public BillDto updateBill(Long id, BillUpdateRequest request) {
        log.debug("Updating bill with id: {}", id);
        
        Bill existingBill = billRepository.findByIdWithPersons(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        
        // Update fields if provided
        if (request.getTitle() != null) {
            existingBill.setTitle(request.getTitle());
        }
        if (request.getTotalAmount() != null) {
            existingBill.setTotalAmount(request.getTotalAmount());
        }
        if (request.getOperator() != null) {
            existingBill.setOperator(request.getOperator());
        }
        if (request.getBillDate() != null) {
            existingBill.setBillDate(request.getBillDate());
        }
        if (request.getStatus() != null) {
            existingBill.setStatus(request.getStatus());
        }
        
        Bill updatedBill = billRepository.save(existingBill);
        log.info("Bill updated successfully with id: {}", updatedBill.getId());
        
        return getBillById(updatedBill.getId());
    }
    
    /**
     * Delete a bill
     */
    @Transactional
    public void deleteBill(Long id) {
        log.debug("Deleting bill with id: {}", id);
        
        Bill bill = billRepository.findByIdWithPersons(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));
        
        // Delete bill (persons will be deleted automatically due to cascade)
        billRepository.deleteById(id);
        log.info("Bill deleted successfully with id: {}", id);
    }
    
    /**
     * Distribute amount equally among all persons
     */
    private void distributeAmountEqually(Bill bill, List<Person> persons) {
        if (persons.isEmpty()) {
            throw new ValidationException("At least one person is required for bill creation");
        }
        
        BigDecimal totalAmount = bill.getTotalAmount();
        int numberOfPersons = persons.size();
        BigDecimal amountPerPerson = totalAmount.divide(BigDecimal.valueOf(numberOfPersons), 2, RoundingMode.DOWN);
        BigDecimal remainingAmount = totalAmount.subtract(amountPerPerson.multiply(BigDecimal.valueOf(numberOfPersons)));
        
        // Distribute equal amounts to all persons except the last one
        for (int i = 0; i < numberOfPersons - 1; i++) {
            persons.get(i).setAmount(amountPerPerson);
        }
        
        // Assign remaining amount to the last person to handle rounding differences
        persons.get(numberOfPersons - 1).setAmount(amountPerPerson.add(remainingAmount));
        
        log.debug("Distributed {} equally among {} persons", totalAmount, numberOfPersons);
    }
    
    /**
     * Distribute amount with custom amounts for each person
     */
    private void distributeAmountCustom(Bill bill, List<Person> persons, List<BillCreateRequest.PersonCreateRequest> personRequests) {
        BigDecimal totalCustomAmount = BigDecimal.ZERO;
        
        log.debug("Validating custom amounts for bill total: {}", bill.getTotalAmount());
        
        for (int i = 0; i < persons.size(); i++) {
            Person person = persons.get(i);
            BillCreateRequest.PersonCreateRequest personRequest = personRequests.get(i);
            
            if (personRequest.getAmount() == null) {
                throw new ValidationException("Amount is required for person: " + person.getName() + " when using CUSTOM operator");
            }
            
            if (personRequest.getAmount().compareTo(BigDecimal.ZERO) < 0) {
                throw new ValidationException("Amount cannot be negative for person: " + person.getName());
            }
            
            person.setAmount(personRequest.getAmount());
            totalCustomAmount = totalCustomAmount.add(personRequest.getAmount());
            
            log.debug("Person: {} - Amount: {}", person.getName(), personRequest.getAmount());
        }
        
        log.debug("Total custom amount calculated: {}", totalCustomAmount);
        
        // Validate that custom amounts sum to total bill amount
        if (totalCustomAmount.compareTo(bill.getTotalAmount()) != 0) {
            String errorMessage = String.format(
                "Custom amounts validation failed: Sum of individual amounts (%s) does not equal total bill amount (%s). Please ensure all amounts add up correctly.",
                totalCustomAmount, 
                bill.getTotalAmount()
            );
            log.error(errorMessage);
            throw new ValidationException(errorMessage);
        }
        
        log.debug("Successfully distributed {} with custom amounts", bill.getTotalAmount());
    }
    
    /**
     * Validate bill creation request
     */
    private void validateBillCreateRequest(BillCreateRequest request) {
        if (request.getPersons() == null || request.getPersons().isEmpty()) {
            throw new ValidationException("At least one person is required for bill creation");
        }
        
        if (request.getTotalAmount() == null || request.getTotalAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Total bill amount must be greater than zero");
        }
        
        if (request.getOperator() == OperatorType.CUSTOM) {
            BigDecimal totalCustomAmount = BigDecimal.ZERO;
            
            for (BillCreateRequest.PersonCreateRequest personRequest : request.getPersons()) {
                if (personRequest.getAmount() == null) {
                    throw new ValidationException("Amount is required for person: " + personRequest.getName() + 
                            " when using CUSTOM operator");
                }
                
                if (personRequest.getAmount().compareTo(BigDecimal.ZERO) < 0) {
                    throw new ValidationException("Amount cannot be negative for person: " + personRequest.getName());
                }
                
                totalCustomAmount = totalCustomAmount.add(personRequest.getAmount());
            }
            
            // Early validation of custom amounts sum
            if (totalCustomAmount.compareTo(request.getTotalAmount()) != 0) {
                String errorMessage = String.format(
                    "Custom amounts validation failed: Sum of individual amounts (%s) does not equal total bill amount (%s). Please ensure all amounts add up correctly.",
                    totalCustomAmount, 
                    request.getTotalAmount()
                );
                log.error("Early validation failed: {}", errorMessage);
                throw new ValidationException(errorMessage);
            }
        }
    }
    
    /**
     * Convert Entity to DTO
     */
    private BillDto convertToDto(Bill bill) {
        List<PersonDto> personDtos = bill.getPersons() != null ? 
                bill.getPersons().stream()
                        .map(this::convertPersonToDto)
                        .collect(Collectors.toList()) : new ArrayList<>();
        
        return BillDto.builder()
                .id(bill.getId())
                .title(bill.getTitle())
                .totalAmount(bill.getTotalAmount())
                .operator(bill.getOperator())
                .billDate(bill.getBillDate())
                .status(bill.getStatus())
                .persons(personDtos)
                .createdAt(bill.getCreatedAt())
                .updatedAt(bill.getUpdatedAt())
                .build();
    }
    
    /**
     * Update bill status based on person payment statuses
     */
    @Transactional
    public BillDto updateBillStatus(Long billId) {
        log.debug("Updating bill status for bill id: {}", billId);
        
        Bill bill = billRepository.findByIdWithPersons(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + billId));
        
        // Count paid and unpaid persons
        long paidCount = bill.getPersons().stream()
                .mapToLong(person -> person.getPaymentStatus() == PaymentStatus.PAID ? 1 : 0)
                .sum();
        long totalCount = bill.getPersons().size();
        
        // Update bill status based on payment statuses
        if (paidCount == 0) {
            bill.setStatus(BillStatus.INCOMPLETE);
        } else if (paidCount == totalCount) {
            bill.setStatus(BillStatus.COMPLETE);
        } else {
            bill.setStatus(BillStatus.INCOMPLETE);
        }
        
        Bill updatedBill = billRepository.save(bill);
        log.info("Bill status updated to {} for bill id: {}", updatedBill.getStatus(), billId);
        
        return convertToDto(updatedBill);
    }
    
    /**
     * Toggle payment status for a specific person in a bill
     */
    @Transactional
    public BillDto togglePersonPaymentStatus(Long billId, Long personId) {
        log.debug("Toggling payment status for person id: {} in bill id: {}", personId, billId);
        
        // Find the bill with persons eagerly loaded
        Bill bill = billRepository.findByIdWithPersons(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + billId));
        
        // Find the person in the bill
        Person person = bill.getPersons().stream()
                .filter(p -> p.getId().equals(personId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Person not found with id: " + personId + " in bill: " + billId));
        
        // Toggle payment status
        PaymentStatus newStatus = person.getPaymentStatus() == PaymentStatus.PAID 
                ? PaymentStatus.UNPAID 
                : PaymentStatus.PAID;
        
        person.setPaymentStatus(newStatus);
        personRepository.save(person);
        
        log.info("Payment status toggled to {} for person id: {} in bill id: {}", newStatus, personId, billId);
        
        // Update bill status based on all person payment statuses
        return updateBillStatus(billId);
    }
    
    /**
     * Convert Person Entity to PersonDto
     */
    private PersonDto convertPersonToDto(Person person) {
        return PersonDto.builder()
                .id(person.getId())
                .name(person.getName())
                .amount(person.getAmount())
                .paymentStatus(person.getPaymentStatus())
                .billId(person.getBill() != null ? person.getBill().getId() : null)
                .build();
    }
}
