import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';
import { 
  mockBills, 
  mockBill1, 
  mockBillCreateRequest,
  mockApiResponse,
  mockErrorResponse,
  createMockBill
} from '../test-utils/mock-data';
import { BillStatus, OperatorType } from '../types';

// Setup MSW server
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Bill CRUD Integration Tests', () => {
  beforeEach(() => {
    // Setup default handlers
    server.use(
      rest.get('http://localhost:8080/api/v1/bills', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockApiResponse(mockBills)));
      }),
      rest.get('http://localhost:8080/api/v1/bills/:id', (req, res, ctx) => {
        const { id } = req.params;
        const bill = mockBills.find(b => b.id === parseInt(id as string));
        return res(ctx.status(200), ctx.json(mockApiResponse(bill || mockBill1)));
      }),
      rest.post('http://localhost:8080/api/v1/bills', (req, res, ctx) => {
        const newBill = createMockBill({ id: 4, title: 'New Test Bill' });
        return res(ctx.status(201), ctx.json(mockApiResponse(newBill)));
      }),
      rest.put('http://localhost:8080/api/v1/bills/:id', (req, res, ctx) => {
        const updatedBill = { ...mockBill1, title: 'Updated Bill' };
        return res(ctx.status(200), ctx.json(mockApiResponse(updatedBill)));
      }),
      rest.delete('http://localhost:8080/api/v1/bills/:id', (req, res, ctx) => {
        return res(ctx.status(204));
      })
    );
  });

  describe('Create Bill Workflow', () => {
    it('should complete full create bill workflow', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Click create bill button
      const createButton = screen.getByText('Create Bill');
      await user.click(createButton);

      // Fill out the form
      await user.type(screen.getByLabelText(/bill title/i), 'Integration Test Bill');
      await user.type(screen.getByLabelText(/total amount/i), '75.50');
      await user.type(screen.getByLabelText(/bill date/i), '2024-01-25');
      await user.type(screen.getByPlaceholderText('Person name'), 'Test Person 1');
      
      // Add another person
      await user.click(screen.getByText('Add Person'));
      await user.type(screen.getAllByPlaceholderText('Person name')[1], 'Test Person 2');

      // Submit the form
      const submitButton = screen.getByText('Create Bill');
      await user.click(submitButton);

      // Verify we're back to the bills list
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });
    });

    it('should handle create bill with custom split', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Click create bill button
      const createButton = screen.getByText('Create Bill');
      await user.click(createButton);

      // Fill out the form
      await user.type(screen.getByLabelText(/bill title/i), 'Custom Split Bill');
      await user.type(screen.getByLabelText(/total amount/i), '100.00');
      await user.type(screen.getByLabelText(/bill date/i), '2024-01-25');
      
      // Change to custom split
      await user.selectOptions(screen.getByLabelText(/split type/i), OperatorType.CUSTOM);
      
      await user.type(screen.getByPlaceholderText('Person name'), 'Person 1');
      await user.type(screen.getByPlaceholderText('Amount'), '60.00');
      
      // Add another person
      await user.click(screen.getByText('Add Person'));
      await user.type(screen.getAllByPlaceholderText('Person name')[1], 'Person 2');
      await user.type(screen.getAllByPlaceholderText('Amount')[1], '40.00');

      // Verify total calculation
      expect(screen.getByText('Total: $100.00')).toBeInTheDocument();

      // Submit the form
      const submitButton = screen.getByText('Create Bill');
      await user.click(submitButton);

      // Verify we're back to the bills list
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });
    });

    it('should handle create bill validation errors', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Click create bill button
      const createButton = screen.getByText('Create Bill');
      await user.click(createButton);

      // Try to submit without filling required fields
      const submitButton = screen.getByText('Create Bill');
      await user.click(submitButton);

      // Verify validation errors are shown
      await waitFor(() => {
        expect(screen.getByText('Bill title is required')).toBeInTheDocument();
        expect(screen.getByText('Total amount is required')).toBeInTheDocument();
        expect(screen.getByText('Bill date is required')).toBeInTheDocument();
      });
    });

    it('should handle create bill API errors', async () => {
      // Mock API error
      server.use(
        rest.post('http://localhost:8080/api/v1/bills', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json(mockErrorResponse('Server error')));
        })
      );

      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Click create bill button
      const createButton = screen.getByText('Create Bill');
      await user.click(createButton);

      // Fill out the form
      await user.type(screen.getByLabelText(/bill title/i), 'Test Bill');
      await user.type(screen.getByLabelText(/total amount/i), '50.00');
      await user.type(screen.getByLabelText(/bill date/i), '2024-01-25');
      await user.type(screen.getByPlaceholderText('Person name'), 'Test Person');

      // Submit the form
      const submitButton = screen.getByText('Create Bill');
      await user.click(submitButton);

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByText('Failed to save bill')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Bill Workflow', () => {
    it('should complete full edit bill workflow', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Find and click edit button for first bill
      const editButtons = screen.getAllByTitle('Edit bill');
      await user.click(editButtons[0]);

      // Verify form is in edit mode
      await waitFor(() => {
        expect(screen.getByText('Edit Bill')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Dinner at Restaurant')).toBeInTheDocument();
      });

      // Update the title
      const titleField = screen.getByDisplayValue('Dinner at Restaurant');
      await user.clear(titleField);
      await user.type(titleField, 'Updated Dinner Bill');

      // Submit the form
      const submitButton = screen.getByText('Update Bill');
      await user.click(submitButton);

      // Verify we're back to the bills list
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });
    });

    it('should handle edit bill API errors', async () => {
      // Mock API error
      server.use(
        rest.put('http://localhost:8080/api/v1/bills/:id', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json(mockErrorResponse('Update failed')));
        })
      );

      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Find and click edit button for first bill
      const editButtons = screen.getAllByTitle('Edit bill');
      await user.click(editButtons[0]);

      // Verify form is in edit mode
      await waitFor(() => {
        expect(screen.getByText('Edit Bill')).toBeInTheDocument();
      });

      // Update the title
      const titleField = screen.getByDisplayValue('Dinner at Restaurant');
      await user.clear(titleField);
      await user.type(titleField, 'Updated Title');

      // Submit the form
      const submitButton = screen.getByText('Update Bill');
      await user.click(submitButton);

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByText('Failed to save bill')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Bill Workflow', () => {
    it('should complete full delete bill workflow', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Find and click delete button for first bill
      const deleteButtons = screen.getAllByTitle('Delete bill');
      await user.click(deleteButtons[0]);

      // Verify confirmation modal appears
      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete the bill/)).toBeInTheDocument();
      });

      // Confirm deletion
      const confirmButton = screen.getByText('Delete Bill');
      await user.click(confirmButton);

      // Verify we're back to the bills list
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });
    });

    it('should cancel delete bill workflow', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Find and click delete button for first bill
      const deleteButtons = screen.getAllByTitle('Delete bill');
      await user.click(deleteButtons[0]);

      // Verify confirmation modal appears
      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });

      // Cancel deletion
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      // Verify modal is closed and we're still on bills list
      await waitFor(() => {
        expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });
    });

    it('should handle delete bill API errors', async () => {
      // Mock API error
      server.use(
        rest.delete('http://localhost:8080/api/v1/bills/:id', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json(mockErrorResponse('Delete failed')));
        })
      );

      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Find and click delete button for first bill
      const deleteButtons = screen.getAllByTitle('Delete bill');
      await user.click(deleteButtons[0]);

      // Verify confirmation modal appears
      await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });

      // Confirm deletion
      const confirmButton = screen.getByText('Delete Bill');
      await user.click(confirmButton);

      // Verify error is displayed
      await waitFor(() => {
        expect(screen.getByText('Failed to delete bill')).toBeInTheDocument();
      });
    });
  });

  describe('View Bill Workflow', () => {
    it('should complete full view bill workflow', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Find and click view button for first bill
      const viewButtons = screen.getAllByTitle('View details');
      await user.click(viewButtons[0]);

      // Verify bill detail view is shown
      await waitFor(() => {
        expect(screen.getByText('Dinner at Restaurant')).toBeInTheDocument();
        expect(screen.getByText('Bill Details')).toBeInTheDocument();
        expect(screen.getByText('Payment Summary')).toBeInTheDocument();
        expect(screen.getByText('Participants')).toBeInTheDocument();
      });

      // Verify bill details are displayed
      expect(screen.getByText('$51.00')).toBeInTheDocument();
      expect(screen.getByText('Split Equally')).toBeInTheDocument();
      expect(screen.getByText('Incomplete')).toBeInTheDocument();

      // Click back to bills
      const backButton = screen.getByText('Back to Bills');
      await user.click(backButton);

      // Verify we're back to the bills list
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });
    });

    it('should navigate to edit from bill detail view', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Find and click view button for first bill
      const viewButtons = screen.getAllByTitle('View details');
      await user.click(viewButtons[0]);

      // Verify bill detail view is shown
      await waitFor(() => {
        expect(screen.getByText('Dinner at Restaurant')).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getByText('Edit Bill');
      await user.click(editButton);

      // Verify we're in edit mode
      await waitFor(() => {
        expect(screen.getByText('Edit Bill')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Dinner at Restaurant')).toBeInTheDocument();
      });
    });
  });

  describe('Form Cancellation', () => {
    it('should cancel create bill form', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Click create bill button
      const createButton = screen.getByText('Create Bill');
      await user.click(createButton);

      // Verify form is shown
      await waitFor(() => {
        expect(screen.getByText('Create New Bill')).toBeInTheDocument();
      });

      // Fill some data
      await user.type(screen.getByLabelText(/bill title/i), 'Test Bill');

      // Cancel the form
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      // Verify we're back to the bills list
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });
    });

    it('should cancel edit bill form', async () => {
      const user = userEvent.setup();
      
      render(<App />);

      // Wait for bills to load
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });

      // Find and click edit button for first bill
      const editButtons = screen.getAllByTitle('Edit bill');
      await user.click(editButtons[0]);

      // Verify form is in edit mode
      await waitFor(() => {
        expect(screen.getByText('Edit Bill')).toBeInTheDocument();
      });

      // Make some changes
      const titleField = screen.getByDisplayValue('Dinner at Restaurant');
      await user.clear(titleField);
      await user.type(titleField, 'Modified Title');

      // Cancel the form
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      // Verify we're back to the bills list
      await waitFor(() => {
        expect(screen.getByText('3 bills found')).toBeInTheDocument();
      });
    });
  });
});
