package com.sharemal.service;

import com.sharemal.dto.PersonDto;
import com.sharemal.enums.PaymentStatus;
import com.sharemal.exception.ResourceNotFoundException;
import com.sharemal.exception.ValidationException;
import com.sharemal.model.Person;
import com.sharemal.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service class for Person business logic
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PersonService {
    
    private final PersonRepository personRepository;
    private final BillService billService;
    
    /**
     * Get all persons
     */
    public List<PersonDto> getAllPersons() {
        log.debug("Fetching all persons");
        return personRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get person by ID
     */
    public PersonDto getPersonById(Long id) {
        log.debug("Fetching person with id: {}", id);
        Person person = personRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + id));
        return convertToDto(person);
    }
    
    /**
     * Get persons by bill ID
     */
    public List<PersonDto> getPersonsByBillId(Long billId) {
        log.debug("Fetching persons for bill id: {}", billId);
        return personRepository.findByBillId(billId)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get persons by payment status
     */
    public List<PersonDto> getPersonsByPaymentStatus(PaymentStatus paymentStatus) {
        log.debug("Fetching persons with payment status: {}", paymentStatus);
        return personRepository.findByPaymentStatus(paymentStatus)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Create person entity (used internally by BillService)
     * Note: Person cannot be created without a bill - this method is deprecated
     */
    @Deprecated
    @Transactional
    public Person createPerson(PersonDto personDto) {
        if (personDto.getBillId() == null) {
            throw new ValidationException("Person cannot be created without a bill");
        }
        log.debug("Creating person with name: {}", personDto.getName());
        Person person = convertToEntity(personDto);
        return personRepository.save(person);
    }
    
    /**
     * Update person payment status and automatically update bill status
     */
    @Transactional
    public PersonDto updatePersonPaymentStatus(Long personId, PaymentStatus status) {
        log.debug("Updating payment status for person id: {} to {}", personId, status);
        
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found with id: " + personId));
        
        person.setPaymentStatus(status);
        Person updatedPerson = personRepository.save(person);
        
        // Automatically update bill status based on all person payment statuses
        if (person.getBill() != null) {
            billService.updateBillStatus(person.getBill().getId());
        }
        
        log.info("Payment status updated successfully for person id: {}", personId);
        return convertToDto(updatedPerson);
    }
    
    /**
     * Delete person
     */
    @Transactional
    public void deletePerson(Long id) {
        log.debug("Deleting person with id: {}", id);
        
        if (!personRepository.existsById(id)) {
            throw new ResourceNotFoundException("Person not found with id: " + id);
        }
        
        personRepository.deleteById(id);
        log.info("Person deleted successfully with id: {}", id);
    }
    
    /**
     * Count persons by bill ID
     */
    public long countPersonsByBillId(Long billId) {
        return personRepository.countByBillId(billId);
    }
    
    /**
     * Count persons by bill ID and payment status
     */
    public long countPersonsByBillIdAndPaymentStatus(Long billId, PaymentStatus paymentStatus) {
        return personRepository.countByBillIdAndPaymentStatus(billId, paymentStatus);
    }
    
    /**
     * Convert Entity to DTO
     */
    private PersonDto convertToDto(Person person) {
        return PersonDto.builder()
                .id(person.getId())
                .name(person.getName())
                .amount(person.getAmount())
                .paymentStatus(person.getPaymentStatus())
                .billId(person.getBill() != null ? person.getBill().getId() : null)
                .build();
    }
    
    /**
     * Convert DTO to Entity
     */
    private Person convertToEntity(PersonDto personDto) {
        return Person.builder()
                .name(personDto.getName())
                .amount(personDto.getAmount())
                .paymentStatus(personDto.getPaymentStatus() != null ? personDto.getPaymentStatus() : PaymentStatus.UNPAID)
                .build();
    }
}
