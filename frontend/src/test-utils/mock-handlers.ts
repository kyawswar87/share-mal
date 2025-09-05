import { rest } from 'msw';
import { 
  mockBills, 
  mockBill1, 
  mockBill2, 
  mockBill3,
  mockApiResponse,
  mockErrorResponse,
  createMockBill
} from './mock-data';
import { BillStatus } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

export const handlers = [
  // Get all bills
  rest.get(`${API_BASE_URL}/bills`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(mockApiResponse(mockBills))
    );
  }),

  // Get bill by ID
  rest.get(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const bill = mockBills.find(b => b.id === parseInt(id as string));
    
    if (!bill) {
      return res(
        ctx.status(404),
        ctx.json(mockErrorResponse('Bill not found'))
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(mockApiResponse(bill))
    );
  }),

  // Create bill
  rest.post(`${API_BASE_URL}/bills`, (req, res, ctx) => {
    const newBill = createMockBill({
      id: Math.floor(Math.random() * 1000),
      title: 'New Test Bill'
    });
    
    return res(
      ctx.status(201),
      ctx.json(mockApiResponse(newBill))
    );
  }),

  // Update bill
  rest.put(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const existingBill = mockBills.find(b => b.id === parseInt(id as string));
    
    if (!existingBill) {
      return res(
        ctx.status(404),
        ctx.json(mockErrorResponse('Bill not found'))
      );
    }
    
    const updatedBill = { ...existingBill, title: 'Updated Bill' };
    
    return res(
      ctx.status(200),
      ctx.json(mockApiResponse(updatedBill))
    );
  }),

  // Delete bill
  rest.delete(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const billExists = mockBills.some(b => b.id === parseInt(id as string));
    
    if (!billExists) {
      return res(
        ctx.status(404),
        ctx.json(mockErrorResponse('Bill not found'))
      );
    }
    
    return res(
      ctx.status(204)
    );
  }),

  // Get bills by status
  rest.get(`${API_BASE_URL}/bills/status/:status`, (req, res, ctx) => {
    const { status } = req.params;
    const filteredBills = mockBills.filter(b => b.status === status);
    
    return res(
      ctx.status(200),
      ctx.json(mockApiResponse(filteredBills))
    );
  }),

  // Search bills by title
  rest.get(`${API_BASE_URL}/bills/search`, (req, res, ctx) => {
    const url = new URL(req.url);
    const title = url.searchParams.get('title');
    
    if (!title) {
      return res(
        ctx.status(400),
        ctx.json(mockErrorResponse('Title parameter is required'))
      );
    }
    
    const filteredBills = mockBills.filter(b => 
      b.title.toLowerCase().includes(title.toLowerCase())
    );
    
    return res(
      ctx.status(200),
      ctx.json(mockApiResponse(filteredBills))
    );
  }),

  // Pay bill for a person
  rest.patch(`${API_BASE_URL}/bills/:billId/pay`, (req, res, ctx) => {
    const { billId } = req.params;
    const url = new URL(req.url);
    const personId = url.searchParams.get('personId');
    
    const bill = mockBills.find(b => b.id === parseInt(billId as string));
    
    if (!bill) {
      return res(
        ctx.status(404),
        ctx.json(mockErrorResponse('Bill not found'))
      );
    }
    
    if (!personId) {
      return res(
        ctx.status(400),
        ctx.json(mockErrorResponse('Person ID is required'))
      );
    }
    
    // Update the person's payment status
    const updatedBill = {
      ...bill,
      persons: bill.persons.map(p => 
        p.id === parseInt(personId) 
          ? { ...p, paymentStatus: 'PAID' as const }
          : p
      )
    };
    
    return res(
      ctx.status(200),
      ctx.json(mockApiResponse(updatedBill))
    );
  }),

  // Update bill status
  rest.put(`${API_BASE_URL}/bills/:id/status`, (req, res, ctx) => {
    const { id } = req.params;
    const bill = mockBills.find(b => b.id === parseInt(id as string));
    
    if (!bill) {
      return res(
        ctx.status(404),
        ctx.json(mockErrorResponse('Bill not found'))
      );
    }
    
    // Simulate status update logic
    const allPaid = bill.persons.every(p => p.paymentStatus === 'PAID');
    const updatedBill = {
      ...bill,
      status: allPaid ? BillStatus.PAID : BillStatus.COMPLETE
    };
    
    return res(
      ctx.status(200),
      ctx.json(mockApiResponse(updatedBill))
    );
  }),
];

// Error handlers for testing error scenarios
export const errorHandlers = [
  // Network error
  rest.get(`${API_BASE_URL}/bills`, (req, res, ctx) => {
    return res.networkError('Failed to connect');
  }),

  // Server error
  rest.post(`${API_BASE_URL}/bills`, (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json(mockErrorResponse('Internal server error'))
    );
  }),

  // Timeout
  rest.get(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
    return res(
      ctx.delay('infinite')
    );
  }),
];
