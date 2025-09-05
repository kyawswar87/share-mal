// Enums matching backend
export enum BillStatus {
  INCOMPLETE = 'INCOMPLETE',
  COMPLETE = 'COMPLETE',
  PAID = 'PAID'
}

export enum OperatorType {
  EQUALLY = 'EQUALLY',
  CUSTOM = 'CUSTOM'
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID'
}

// DTOs matching backend
export interface PersonDto {
  id: number;
  name: string;
  amount: number;
  paymentStatus: PaymentStatus;
  billId: number;
}

export interface BillDto {
  id: number;
  title: string;
  totalAmount: number;
  operator: OperatorType;
  billDate: string;
  status: BillStatus;
  persons: PersonDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonCreateRequest {
  name: string;
  amount?: number; // Required for CUSTOM, optional for EQUALLY
}

export interface BillCreateRequest {
  title: string;
  totalAmount: number;
  operator: OperatorType;
  billDate: string;
  persons: PersonCreateRequest[];
}

export interface BillUpdateRequest {
  title?: string;
  totalAmount?: number;
  operator?: OperatorType;
  billDate?: string;
  persons?: PersonCreateRequest[];
}

export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  data: T;
  message: string;
  timestamp: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string[];
  };
  status: 'ERROR';
  timestamp: string;
}

// UI State types
export interface BillFormData {
  title: string;
  totalAmount: string;
  operator: OperatorType;
  billDate: string;
  persons: PersonFormData[];
}

export interface PersonFormData {
  name: string;
  amount: string;
}

export interface SearchFilters {
  status?: BillStatus;
  title?: string;
}
