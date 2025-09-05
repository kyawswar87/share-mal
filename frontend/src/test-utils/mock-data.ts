import { 
  BillDto, 
  PersonDto, 
  BillCreateRequest, 
  BillUpdateRequest,
  BillStatus, 
  OperatorType, 
  PaymentStatus 
} from '../types';

// Mock person data
export const mockPerson1: PersonDto = {
  id: 1,
  name: 'John Doe',
  amount: 25.50,
  paymentStatus: PaymentStatus.UNPAID,
  billId: 1
};

export const mockPerson2: PersonDto = {
  id: 2,
  name: 'Jane Smith',
  amount: 25.50,
  paymentStatus: PaymentStatus.PAID,
  billId: 1
};

export const mockPerson3: PersonDto = {
  id: 3,
  name: 'Bob Johnson',
  amount: 30.00,
  paymentStatus: PaymentStatus.UNPAID,
  billId: 2
};

// Mock bill data
export const mockBill1: BillDto = {
  id: 1,
  title: 'Dinner at Restaurant',
  totalAmount: 51.00,
  operator: OperatorType.EQUALLY,
  billDate: '2024-01-15',
  status: BillStatus.INCOMPLETE,
  persons: [mockPerson1, mockPerson2],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z'
};

export const mockBill2: BillDto = {
  id: 2,
  title: 'Grocery Shopping',
  totalAmount: 90.00,
  operator: OperatorType.CUSTOM,
  billDate: '2024-01-16',
  status: BillStatus.COMPLETE,
  persons: [mockPerson3],
  createdAt: '2024-01-16T14:30:00Z',
  updatedAt: '2024-01-16T14:30:00Z'
};

export const mockBill3: BillDto = {
  id: 3,
  title: 'Movie Tickets',
  totalAmount: 45.00,
  operator: OperatorType.EQUALLY,
  billDate: '2024-01-17',
  status: BillStatus.PAID,
  persons: [
    { id: 4, name: 'Alice Brown', amount: 15.00, paymentStatus: PaymentStatus.PAID, billId: 3 },
    { id: 5, name: 'Charlie Wilson', amount: 15.00, paymentStatus: PaymentStatus.PAID, billId: 3 },
    { id: 6, name: 'Diana Lee', amount: 15.00, paymentStatus: PaymentStatus.PAID, billId: 3 }
  ],
  createdAt: '2024-01-17T19:00:00Z',
  updatedAt: '2024-01-17T19:00:00Z'
};

// Mock bills array
export const mockBills: BillDto[] = [mockBill1, mockBill2, mockBill3];

// Mock create request
export const mockBillCreateRequest: BillCreateRequest = {
  title: 'Test Bill',
  totalAmount: 100.00,
  operator: OperatorType.EQUALLY,
  billDate: '2024-01-20',
  persons: [
    { name: 'Person 1' },
    { name: 'Person 2' },
    { name: 'Person 3' }
  ]
};

// Mock update request
export const mockBillUpdateRequest: BillUpdateRequest = {
  title: 'Updated Test Bill',
  totalAmount: 120.00,
  operator: OperatorType.CUSTOM,
  billDate: '2024-01-21',
  persons: [
    { name: 'Updated Person 1', amount: 40 },
    { name: 'Updated Person 2', amount: 40 },
    { name: 'Updated Person 3', amount: 40 }
  ]
};

// Factory functions for generating test data
export const createMockPerson = (overrides: Partial<PersonDto> = {}): PersonDto => ({
  id: Math.floor(Math.random() * 1000),
  name: 'Test Person',
  amount: 25.00,
  paymentStatus: PaymentStatus.UNPAID,
  billId: 1,
  ...overrides
});

export const createMockBill = (overrides: Partial<BillDto> = {}): BillDto => ({
  id: Math.floor(Math.random() * 1000),
  title: 'Test Bill',
  totalAmount: 100.00,
  operator: OperatorType.EQUALLY,
  billDate: '2024-01-20',
  status: BillStatus.INCOMPLETE,
  persons: [createMockPerson()],
  createdAt: '2024-01-20T10:00:00Z',
  updatedAt: '2024-01-20T10:00:00Z',
  ...overrides
});

// Mock API responses
export const mockApiResponse = <T>(data: T) => ({
  status: 'SUCCESS' as const,
  data,
  message: 'Operation successful',
  timestamp: new Date().toISOString()
});

export const mockErrorResponse = (message: string = 'An error occurred') => ({
  status: 'ERROR' as const,
  data: null,
  message,
  timestamp: new Date().toISOString()
});
