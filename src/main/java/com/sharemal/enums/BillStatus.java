package com.sharemal.enums;

/**
 * Enum representing the status of a bill
 */
public enum BillStatus {
    /**
     * Bill is created but not all participants have paid
     */
    INCOMPLETE,
    
    /**
     * All participants have paid their share
     */
    COMPLETE,
    
    /**
     * Bill has been fully paid and settled
     */
    PAID
}
