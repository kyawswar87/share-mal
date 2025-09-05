// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

// Status colors for UI
export const STATUS_COLORS = {
  INCOMPLETE: '#ffc107', // Yellow/Orange
  COMPLETE: '#28a745',   // Green
  PAID: '#007bff'        // Blue
};

// Status labels
export const STATUS_LABELS = {
  INCOMPLETE: 'Incomplete',
  COMPLETE: 'Complete',
  PAID: 'Paid'
};

// Payment status colors
export const PAYMENT_STATUS_COLORS = {
  PAID: '#28a745',   // Green
  UNPAID: '#dc3545'  // Red
};

// Payment status labels
export const PAYMENT_STATUS_LABELS = {
  PAID: 'Paid',
  UNPAID: 'Unpaid'
};

// Operator type labels
export const OPERATOR_LABELS = {
  EQUALLY: 'Split Equally',
  CUSTOM: 'Custom Amounts'
};

// Form validation
export const VALIDATION_RULES = {
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 255,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  MIN_AMOUNT: 0.01
};

// Date format
export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'MMM dd, yyyy';
