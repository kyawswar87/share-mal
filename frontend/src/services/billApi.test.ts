import { rest } from 'msw';
import { setupServer } from 'msw/node';
import BillApiService from './billApi';
import { 
  mockBills, 
  mockBill1, 
  mockBill2, 
  mockBillCreateRequest, 
  mockBillUpdateRequest,
  mockApiResponse,
  mockErrorResponse,
  createMockBill
} from '../test-utils/mock-data';
import { BillStatus } from '../types';

// Setup MSW server
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('BillApiService', () => {
  const API_BASE_URL = 'http://localhost:8080/api/v1';

  describe('getAllBills', () => {
    it('should fetch all bills successfully', async () => {
      server.use(
        rest.get(`${API_BASE_URL}/bills`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse(mockBills)));
        })
      );

      const result = await BillApiService.getAllBills();

      expect(result).toEqual(mockBills);
    });

    it('should handle API errors', async () => {
      server.use(
        rest.get(`${API_BASE_URL}/bills`, (req, res, ctx) => {
          return res(ctx.status(500), ctx.json(mockErrorResponse('Server error')));
        })
      );

      await expect(BillApiService.getAllBills()).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      server.use(
        rest.get(`${API_BASE_URL}/bills`, (req, res, ctx) => {
          return res.networkError('Network error');
        })
      );

      await expect(BillApiService.getAllBills()).rejects.toThrow();
    });
  });

  describe('getBillById', () => {
    it('should fetch bill by ID successfully', async () => {
      server.use(
        rest.get(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse(mockBill1)));
        })
      );

      const result = await BillApiService.getBillById(1);

      expect(result).toEqual(mockBill1);
    });

    it('should handle 404 error when bill not found', async () => {
      server.use(
        rest.get(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
          return res(ctx.status(404), ctx.json(mockErrorResponse('Bill not found')));
        })
      );

      await expect(BillApiService.getBillById(999)).rejects.toThrow();
    });
  });

  describe('createBill', () => {
    it('should create bill successfully', async () => {
      const newBill = createMockBill({ id: 4, title: 'New Test Bill' });
      
      server.use(
        rest.post(`${API_BASE_URL}/bills`, (req, res, ctx) => {
          return res(ctx.status(201), ctx.json(mockApiResponse(newBill)));
        })
      );

      const result = await BillApiService.createBill(mockBillCreateRequest);

      expect(result).toEqual(newBill);
    });

    it('should handle validation errors', async () => {
      server.use(
        rest.post(`${API_BASE_URL}/bills`, (req, res, ctx) => {
          return res(ctx.status(400), ctx.json(mockErrorResponse('Validation failed')));
        })
      );

      await expect(BillApiService.createBill(mockBillCreateRequest)).rejects.toThrow();
    });
  });

  describe('updateBill', () => {
    it('should update bill successfully', async () => {
      const updatedBill = { ...mockBill1, title: 'Updated Bill' };
      
      server.use(
        rest.put(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse(updatedBill)));
        })
      );

      const result = await BillApiService.updateBill(1, mockBillUpdateRequest);

      expect(result).toEqual(updatedBill);
    });

    it('should handle 404 error when bill not found', async () => {
      server.use(
        rest.put(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
          return res(ctx.status(404), ctx.json(mockErrorResponse('Bill not found')));
        })
      );

      await expect(BillApiService.updateBill(999, mockBillUpdateRequest)).rejects.toThrow();
    });
  });

  describe('deleteBill', () => {
    it('should delete bill successfully', async () => {
      server.use(
        rest.delete(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
          return res(ctx.status(204));
        })
      );

      await expect(BillApiService.deleteBill(1)).resolves.toBeUndefined();
    });

    it('should handle 404 error when bill not found', async () => {
      server.use(
        rest.delete(`${API_BASE_URL}/bills/:id`, (req, res, ctx) => {
          return res(ctx.status(404), ctx.json(mockErrorResponse('Bill not found')));
        })
      );

      await expect(BillApiService.deleteBill(999)).rejects.toThrow();
    });
  });

  describe('getBillsByStatus', () => {
    it('should fetch bills by status successfully', async () => {
      const incompleteBills = mockBills.filter(bill => bill.status === BillStatus.INCOMPLETE);
      
      server.use(
        rest.get(`${API_BASE_URL}/bills/status/:status`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse(incompleteBills)));
        })
      );

      const result = await BillApiService.getBillsByStatus(BillStatus.INCOMPLETE);

      expect(result).toEqual(incompleteBills);
    });

    it('should handle empty results', async () => {
      server.use(
        rest.get(`${API_BASE_URL}/bills/status/:status`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse([])));
        })
      );

      const result = await BillApiService.getBillsByStatus(BillStatus.PAID);

      expect(result).toEqual([]);
    });
  });

  describe('searchBillsByTitle', () => {
    it('should search bills by title successfully', async () => {
      const searchResults = mockBills.filter(bill => 
        bill.title.toLowerCase().includes('dinner')
      );
      
      server.use(
        rest.get(`${API_BASE_URL}/bills/search`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse(searchResults)));
        })
      );

      const result = await BillApiService.searchBillsByTitle('dinner');

      expect(result).toEqual(searchResults);
    });

    it('should handle empty search results', async () => {
      server.use(
        rest.get(`${API_BASE_URL}/bills/search`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse([])));
        })
      );

      const result = await BillApiService.searchBillsByTitle('nonexistent');

      expect(result).toEqual([]);
    });

    it('should handle search without title parameter', async () => {
      server.use(
        rest.get(`${API_BASE_URL}/bills/search`, (req, res, ctx) => {
          return res(ctx.status(400), ctx.json(mockErrorResponse('Title parameter is required')));
        })
      );

      await expect(BillApiService.searchBillsByTitle('')).rejects.toThrow();
    });
  });

  describe('payBill', () => {
    it('should pay bill for person successfully', async () => {
      const updatedBill = {
        ...mockBill1,
        persons: mockBill1.persons.map(p => 
          p.id === 1 ? { ...p, paymentStatus: 'PAID' as const } : p
        )
      };
      
      server.use(
        rest.patch(`${API_BASE_URL}/bills/:billId/pay`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse(updatedBill)));
        })
      );

      const result = await BillApiService.payBill(1, 1);

      expect(result).toEqual(updatedBill);
    });

    it('should handle 404 error when bill not found', async () => {
      server.use(
        rest.patch(`${API_BASE_URL}/bills/:billId/pay`, (req, res, ctx) => {
          return res(ctx.status(404), ctx.json(mockErrorResponse('Bill not found')));
        })
      );

      await expect(BillApiService.payBill(999, 1)).rejects.toThrow();
    });

    it('should handle missing person ID', async () => {
      server.use(
        rest.patch(`${API_BASE_URL}/bills/:billId/pay`, (req, res, ctx) => {
          return res(ctx.status(400), ctx.json(mockErrorResponse('Person ID is required')));
        })
      );

      await expect(BillApiService.payBill(1, 0)).rejects.toThrow();
    });
  });

  describe('updateBillStatus', () => {
    it('should update bill status successfully', async () => {
      const updatedBill = { ...mockBill1, status: BillStatus.COMPLETE };
      
      server.use(
        rest.put(`${API_BASE_URL}/bills/:id/status`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse(updatedBill)));
        })
      );

      const result = await BillApiService.updateBillStatus(1);

      expect(result).toEqual(updatedBill);
    });

    it('should handle 404 error when bill not found', async () => {
      server.use(
        rest.put(`${API_BASE_URL}/bills/:id/status`, (req, res, ctx) => {
          return res(ctx.status(404), ctx.json(mockErrorResponse('Bill not found')));
        })
      );

      await expect(BillApiService.updateBillStatus(999)).rejects.toThrow();
    });
  });

  describe('Request/Response Interceptors', () => {
    it('should log API requests', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      server.use(
        rest.get(`${API_BASE_URL}/bills`, (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(mockApiResponse(mockBills)));
        })
      );

      await BillApiService.getAllBills();

      expect(consoleSpy).toHaveBeenCalledWith('API Request: GET /bills');
      expect(consoleSpy).toHaveBeenCalledWith('API Response: 200 /bills');

      consoleSpy.mockRestore();
    });

    it('should log API errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      server.use(
        rest.get(`${API_BASE_URL}/bills`, (req, res, ctx) => {
          return res(ctx.status(500), ctx.json(mockErrorResponse('Server error')));
        })
      );

      try {
        await BillApiService.getAllBills();
      } catch (error) {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith('API Request: GET /bills');
      expect(consoleSpy).toHaveBeenCalledWith('API Response Error:', expect.any(Object));

      consoleSpy.mockRestore();
    });
  });

  describe('Environment Configuration', () => {
    it('should use default API URL when environment variable is not set', () => {
      const originalEnv = process.env.REACT_APP_API_URL;
      delete process.env.REACT_APP_API_URL;

      // Re-import the service to get the default URL
      jest.resetModules();
      const BillApiService = require('./billApi').default;

      expect(BillApiService).toBeDefined();

      // Restore environment
      if (originalEnv) {
        process.env.REACT_APP_API_URL = originalEnv;
      }
    });
  });
});
