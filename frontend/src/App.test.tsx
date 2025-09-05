import React from 'react';
import { render, screen, waitFor } from './test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from './App';
import { handlers } from './test-utils/mock-handlers';
import { mockBills, mockBill1 } from './test-utils/mock-data';

// Setup MSW server
const server = setupServer(...handlers);

// Mock the child components to focus on App logic
jest.mock('./components/BillList', () => {
  return function MockBillList({ 
    bills, 
    isLoading, 
    error, 
    onViewBill, 
    onEditBill, 
    onDeleteBill, 
    onCreateBill, 
    onSearch, 
    onFilterByStatus 
  }: any) {
    return (
      <div data-testid="bill-list">
        <div data-testid="bills-count">{bills.length}</div>
        <div data-testid="loading">{isLoading ? 'loading' : 'not-loading'}</div>
        <div data-testid="error">{error || 'no-error'}</div>
        <button onClick={() => onViewBill(mockBill1)}>View Bill</button>
        <button onClick={() => onEditBill(mockBill1)}>Edit Bill</button>
        <button onClick={() => onDeleteBill(mockBill1)}>Delete Bill</button>
        <button onClick={onCreateBill}>Create Bill</button>
        <button onClick={() => onSearch('test')}>Search</button>
        <button onClick={() => onFilterByStatus('INCOMPLETE')}>Filter</button>
      </div>
    );
  };
});

jest.mock('./components/BillForm', () => {
  return function MockBillForm({ bill, onSubmit, onCancel, isLoading, error }: any) {
    return (
      <div data-testid="bill-form">
        <div data-testid="form-mode">{bill ? 'edit' : 'create'}</div>
        <div data-testid="form-loading">{isLoading ? 'loading' : 'not-loading'}</div>
        <div data-testid="form-error">{error || 'no-error'}</div>
        <button onClick={() => onSubmit({ title: 'Test Bill' })}>Submit</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    );
  };
});

jest.mock('./components/PersonList', () => {
  return function MockPersonList({ persons, onTogglePaymentStatus, editable }: any) {
    return (
      <div data-testid="person-list">
        <div data-testid="persons-count">{persons.length}</div>
        <div data-testid="editable">{editable ? 'editable' : 'not-editable'}</div>
        <button onClick={() => onTogglePaymentStatus(1)}>Toggle Payment</button>
      </div>
    );
  };
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App', () => {
  it('renders app with navigation', () => {
    render(<App />);

    expect(screen.getByText('Share Mal - Bill Splitting')).toBeInTheDocument();
    expect(screen.getByText('All Bills')).toBeInTheDocument();
  });

  it('loads and displays bills on mount', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bills-count')).toHaveTextContent('3');
    });
  });

  it('shows bill list by default', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });
  });

  it('switches to create bill form when create button is clicked', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    const createButton = screen.getByText('Create Bill');
    createButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-mode')).toHaveTextContent('create');
    });
  });

  it('switches to edit bill form when edit button is clicked', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit Bill');
    editButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-mode')).toHaveTextContent('edit');
    });
  });

  it('switches to bill detail view when view button is clicked', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    const viewButton = screen.getByText('View Bill');
    viewButton.click();

    await waitFor(() => {
      expect(screen.getByText('Dinner at Restaurant')).toBeInTheDocument();
      expect(screen.getByTestId('person-list')).toBeInTheDocument();
    });
  });

  it('handles bill creation successfully', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    // Navigate to create form
    const createButton = screen.getByText('Create Bill');
    createButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-form')).toBeInTheDocument();
    });

    // Submit form
    const submitButton = screen.getByText('Submit');
    submitButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });
  });

  it('handles bill update successfully', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    // Navigate to edit form
    const editButton = screen.getByText('Edit Bill');
    editButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-form')).toBeInTheDocument();
    });

    // Submit form
    const submitButton = screen.getByText('Submit');
    submitButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });
  });

  it('handles bill deletion successfully', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete Bill');
    deleteButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    const searchButton = screen.getByText('Search');
    searchButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });
  });

  it('handles filter functionality', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    const filterButton = screen.getByText('Filter');
    filterButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });
  });

  it('handles payment status toggle in bill detail view', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    // Navigate to bill detail
    const viewButton = screen.getByText('View Bill');
    viewButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('person-list')).toBeInTheDocument();
    });

    // Toggle payment status
    const toggleButton = screen.getByText('Toggle Payment');
    toggleButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('person-list')).toBeInTheDocument();
    });
  });

  it('handles form cancellation', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    // Navigate to create form
    const createButton = screen.getByText('Create Bill');
    createButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-form')).toBeInTheDocument();
    });

    // Cancel form
    const cancelButton = screen.getByText('Cancel');
    cancelButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    server.use(
      rest.get('http://localhost:8080/api/v1/bills', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to load bills');
    });
  });

  it('navigates back to bills list from navigation', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });

    // Navigate to create form
    const createButton = screen.getByText('Create Bill');
    createButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-form')).toBeInTheDocument();
    });

    // Click navigation link
    const navLink = screen.getByText('All Bills');
    navLink.click();

    await waitFor(() => {
      expect(screen.getByTestId('bill-list')).toBeInTheDocument();
    });
  });
});
