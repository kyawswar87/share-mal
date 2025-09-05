import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import BillList from './BillList';
import { mockBills, mockBill1, mockBill2, mockBill3 } from '../test-utils/mock-data';
import { BillStatus } from '../types';

// Mock the BillCard component
jest.mock('./BillCard', () => {
  return function MockBillCard({ bill, onView, onEdit, onDelete }: any) {
    return (
      <div data-testid={`bill-card-${bill.id}`}>
        <h3>{bill.title}</h3>
        <button onClick={() => onView(bill)}>View</button>
        <button onClick={() => onEdit(bill)}>Edit</button>
        <button onClick={() => onDelete(bill)}>Delete</button>
      </div>
    );
  };
});

describe('BillList', () => {
  const mockOnViewBill = jest.fn();
  const mockOnEditBill = jest.fn();
  const mockOnDeleteBill = jest.fn();
  const mockOnCreateBill = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnFilterByStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders bills list with correct count', () => {
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByText('Bills')).toBeInTheDocument();
      expect(screen.getByText('3 bills found')).toBeInTheDocument();
      expect(screen.getByText('Create Bill')).toBeInTheDocument();
    });

    it('renders singular form for single bill', () => {
      render(
        <BillList
          bills={[mockBill1]}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByText('1 bill found')).toBeInTheDocument();
    });

    it('renders all bill cards', () => {
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByTestId('bill-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('bill-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('bill-card-3')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading spinner when isLoading is true', () => {
      render(
        <BillList
          bills={[]}
          isLoading={true}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByText('Loading bills...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message when error is provided', () => {
      const errorMessage = 'Failed to load bills';
      
      render(
        <BillList
          bills={[]}
          error={errorMessage}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no bills and no filter', () => {
      render(
        <BillList
          bills={[]}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByText('No bills found')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating your first bill.')).toBeInTheDocument();
      expect(screen.getByText('Create Your First Bill')).toBeInTheDocument();
    });

    it('shows filtered empty state when no bills with current filter', () => {
      render(
        <BillList
          bills={[]}
          currentFilter={BillStatus.PAID}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByText('No bills found')).toBeInTheDocument();
      expect(screen.getByText('No bills with status "Paid" found.')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('renders SearchBar component', () => {
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByPlaceholderText('Search bills by title...')).toBeInTheDocument();
    });
  });

  describe('Filter Functionality', () => {
    it('renders filter dropdown with all status options', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const filterButton = screen.getByText('All Bills');
      await user.click(filterButton);

      expect(screen.getByText('All Bills')).toBeInTheDocument();
      expect(screen.getByText('Incomplete')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByText('Paid')).toBeInTheDocument();
    });

    it('shows current filter in dropdown button', () => {
      render(
        <BillList
          bills={mockBills}
          currentFilter={BillStatus.INCOMPLETE}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      expect(screen.getByText('Incomplete')).toBeInTheDocument();
    });

    it('calls onFilterByStatus when filter option is selected', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const filterButton = screen.getByText('All Bills');
      await user.click(filterButton);

      const incompleteOption = screen.getByText('Incomplete');
      await user.click(incompleteOption);

      expect(mockOnFilterByStatus).toHaveBeenCalledWith(BillStatus.INCOMPLETE);
    });

    it('calls onFilterByStatus with null when All Bills is selected', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          currentFilter={BillStatus.INCOMPLETE}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const filterButton = screen.getByText('Incomplete');
      await user.click(filterButton);

      const allBillsOption = screen.getByText('All Bills');
      await user.click(allBillsOption);

      expect(mockOnFilterByStatus).toHaveBeenCalledWith(null);
    });
  });

  describe('Create Bill Functionality', () => {
    it('calls onCreateBill when create button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const createButton = screen.getByText('Create Bill');
      await user.click(createButton);

      expect(mockOnCreateBill).toHaveBeenCalled();
    });

    it('calls onCreateBill when create first bill button is clicked in empty state', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={[]}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const createFirstBillButton = screen.getByText('Create Your First Bill');
      await user.click(createFirstBillButton);

      expect(mockOnCreateBill).toHaveBeenCalled();
    });
  });

  describe('Delete Confirmation', () => {
    it('shows delete confirmation modal when delete is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const deleteButton = screen.getAllByText('Delete')[0];
      await user.click(deleteButton);

      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete the bill/)).toBeInTheDocument();
      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });

    it('calls onDeleteBill when delete is confirmed', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const deleteButton = screen.getAllByText('Delete')[0];
      await user.click(deleteButton);

      const confirmDeleteButton = screen.getByText('Delete Bill');
      await user.click(confirmDeleteButton);

      expect(mockOnDeleteBill).toHaveBeenCalledWith(mockBill1);
    });

    it('closes modal when cancel is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const deleteButton = screen.getAllByText('Delete')[0];
      await user.click(deleteButton);

      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
  });

  describe('Bill Card Interactions', () => {
    it('calls onViewBill when view button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const viewButton = screen.getAllByText('View')[0];
      await user.click(viewButton);

      expect(mockOnViewBill).toHaveBeenCalledWith(mockBill1);
    });

    it('calls onEditBill when edit button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BillList
          bills={mockBills}
          onViewBill={mockOnViewBill}
          onEditBill={mockOnEditBill}
          onDeleteBill={mockOnDeleteBill}
          onCreateBill={mockOnCreateBill}
          onSearch={mockOnSearch}
          onFilterByStatus={mockOnFilterByStatus}
        />
      );

      const editButton = screen.getAllByText('Edit')[0];
      await user.click(editButton);

      expect(mockOnEditBill).toHaveBeenCalledWith(mockBill1);
    });
  });
});
