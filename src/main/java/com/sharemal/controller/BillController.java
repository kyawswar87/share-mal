package com.sharemal.controller;

import com.sharemal.dto.ApiResponse;
import com.sharemal.dto.BillCreateRequest;
import com.sharemal.dto.BillDto;
import com.sharemal.dto.BillUpdateRequest;
import com.sharemal.enums.BillStatus;
import com.sharemal.service.BillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Bill operations
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/bills")
@RequiredArgsConstructor
@Tag(name = "Bill Management", description = "APIs for managing bills and bill splitting")
public class BillController {
    
    private final BillService billService;
    
    /**
     * Get all bills
     */
    @GetMapping
    @Operation(summary = "Get all bills", description = "Retrieve a list of all bills")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved bills"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<BillDto>>> getAllBills() {
        log.debug("GET /api/v1/bills - Fetching all bills");
        List<BillDto> bills = billService.getAllBills();
        return ResponseEntity.ok(ApiResponse.success(bills, "Bills retrieved successfully"));
    }
    
    /**
     * Get bill by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get bill by ID", description = "Retrieve a specific bill by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved bill"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Bill not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<BillDto>> getBillById(
            @Parameter(description = "Bill ID") @PathVariable Long id) {
        log.debug("GET /api/v1/bills/{} - Fetching bill by ID", id);
        BillDto bill = billService.getBillById(id);
        return ResponseEntity.ok(ApiResponse.success(bill, "Bill retrieved successfully"));
    }
    
    /**
     * Create new bill
     */
    @PostMapping
    @Operation(summary = "Create new bill", description = "Create a new bill with participants and amount distribution")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Bill created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<BillDto>> createBill(
            @Parameter(description = "Bill creation information") @Valid @RequestBody BillCreateRequest request) {
        log.debug("POST /api/v1/bills - Creating new bill with title: {}", request.getTitle());
        BillDto createdBill = billService.createBill(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdBill, "Bill created successfully"));
    }
    
    /**
     * Update bill
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update bill", description = "Update an existing bill with the provided information")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Bill updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Bill not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<BillDto>> updateBill(
            @Parameter(description = "Bill ID") @PathVariable Long id,
            @Parameter(description = "Updated bill information") @Valid @RequestBody BillUpdateRequest request) {
        log.debug("PUT /api/v1/bills/{} - Updating bill", id);
        BillDto updatedBill = billService.updateBill(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedBill, "Bill updated successfully"));
    }
    
    /**
     * Delete bill
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete bill", description = "Delete a bill by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Bill deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Bill not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<Void>> deleteBill(
            @Parameter(description = "Bill ID") @PathVariable Long id) {
        log.debug("DELETE /api/v1/bills/{} - Deleting bill", id);
        billService.deleteBill(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Bill deleted successfully"));
    }
    
    /**
     * Get bills by status
     */
    @GetMapping("/status/{status}")
    @Operation(summary = "Get bills by status", description = "Retrieve bills filtered by their status")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved bills"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<BillDto>>> getBillsByStatus(
            @Parameter(description = "Bill status") @PathVariable BillStatus status) {
        log.debug("GET /api/v1/bills/status/{} - Fetching bills by status", status);
        List<BillDto> bills = billService.getBillsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(bills, "Bills retrieved successfully"));
    }
    
    /**
     * Get bills by title
     */
    @GetMapping("/search")
    @Operation(summary = "Search bills by title", description = "Retrieve bills that contain the specified text in their title")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved bills"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<BillDto>>> searchBillsByTitle(
            @Parameter(description = "Title search term") @RequestParam String title) {
        log.debug("GET /api/v1/bills/search?title={} - Searching bills by title", title);
        List<BillDto> bills = billService.getBillsByTitle(title);
        return ResponseEntity.ok(ApiResponse.success(bills, "Bills retrieved successfully"));
    }
    
    /**
     * Pay bill for a specific person
     */
    @PatchMapping("/{id}/pay")
    @Operation(summary = "Pay bill for person", description = "Toggle payment status for a specific person in the bill")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Payment status updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Bill or person not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<BillDto>> payBill(
            @Parameter(description = "Bill ID") @PathVariable Long id,
            @Parameter(description = "Person ID") @RequestParam Long personId) {
        log.debug("PATCH /api/v1/bills/{}/pay - Toggling payment status for person {}", id, personId);
        BillDto updatedBill = billService.togglePersonPaymentStatus(id, personId);
        return ResponseEntity.ok(ApiResponse.success(updatedBill, "Payment status updated successfully"));
    }

    /**
     * Update bill status based on person payment statuses
     */
    @PutMapping("/{id}/status")
    @Operation(summary = "Update bill status", description = "Update bill status based on person payment statuses")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Bill status updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Bill not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<BillDto>> updateBillStatus(
            @Parameter(description = "Bill ID") @PathVariable Long id) {
        log.debug("PUT /api/v1/bills/{}/status - Updating bill status", id);
        BillDto updatedBill = billService.updateBillStatus(id);
        return ResponseEntity.ok(ApiResponse.success(updatedBill, "Bill status updated successfully"));
    }
}
