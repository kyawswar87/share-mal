import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import userEvent from '@testing-library/user-event';
import BillForm from './BillForm';
import { mockBill1, mockBillCreateRequest } from '../test-utils/mock-data';
import { OperatorType } from '../types';

describe('BillForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('renders create form with default values', () => {
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Create New Bill')).toBeInTheDocument();
      expect(screen.getByDisplayValue('')).toBeInTheDocument(); // title field
      expect(screen.getByDisplayValue('Split Equally')).toBeInTheDocument();
      expect(screen.getByText('Create Bill')).toBeInTheDocument();
    });

    it('submits form with valid data for equally split', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByDisplayValue(''), 'Test Bill');
      await user.type(screen.getAllByDisplayValue('')[1], '100');
      await user.type(screen.getAllByDisplayValue('')[2], '2024-01-20');
      await user.type(screen.getByPlaceholderText('Person name'), 'John Doe');

      const submitButton = screen.getByText('Create Bill');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Test Bill',
          totalAmount: 100,
          operator: OperatorType.EQUALLY,
          billDate: '2024-01-20',
          persons: [{ name: 'John Doe' }]
        });
      });
    });

    it('submits form with valid data for custom split', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByDisplayValue(''), 'Test Bill');
      await user.type(screen.getAllByDisplayValue('')[1], '100');
      await user.type(screen.getAllByDisplayValue('')[2], '2024-01-20');
      
      // Change to custom split
      await user.selectOptions(screen.getByDisplayValue('Split Equally'), OperatorType.CUSTOM);
      
      await user.type(screen.getByPlaceholderText('Person name'), 'John Doe');
      await user.type(screen.getByPlaceholderText('Amount'), '50');

      const submitButton = screen.getByText('Create Bill');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Test Bill',
          totalAmount: 100,
          operator: OperatorType.CUSTOM,
          billDate: '2024-01-20',
          persons: [{ name: 'John Doe', amount: 50 }]
        });
      });
    });
  });

  describe('Edit Mode', () => {
    it('renders edit form with bill data', () => {
      render(
        <BillForm
          bill={mockBill1}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('Edit Bill')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Dinner at Restaurant')).toBeInTheDocument();
      expect(screen.getByDisplayValue('51')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('Update Bill')).toBeInTheDocument();
    });

    it('submits updated data in edit mode', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          bill={mockBill1}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const titleField = screen.getByDisplayValue('Dinner at Restaurant');
      await user.clear(titleField);
      await user.type(titleField, 'Updated Dinner');

      const submitButton = screen.getByText('Update Bill');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Updated Dinner',
          totalAmount: 51,
          operator: OperatorType.EQUALLY,
          billDate: '2024-01-15',
          persons: [{ name: 'John Doe' }, { name: 'Jane Smith' }]
        });
      });
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for required fields', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByText('Create Bill');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Bill title is required')).toBeInTheDocument();
        expect(screen.getByText('Total amount is required')).toBeInTheDocument();
      });
    });

    it('shows validation error for minimum amount', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getAllByDisplayValue('')[1], '0');
      await user.click(screen.getByText('Create Bill'));

      await waitFor(() => {
        expect(screen.getByText('Amount must be at least $0.01')).toBeInTheDocument();
      });
    });

    it('shows validation error for person name in custom split', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.selectOptions(screen.getByDisplayValue('Split Equally'), OperatorType.CUSTOM);
      await user.click(screen.getByText('Create Bill'));

      await waitFor(() => {
        expect(screen.getByText('Person name is required')).toBeInTheDocument();
        expect(screen.getByText('Amount is required for custom split')).toBeInTheDocument();
      });
    });
  });

  describe('Person Management', () => {
    it('adds new person when add button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const addButton = screen.getByText('Add Person');
      await user.click(addButton);

      const personNameFields = screen.getAllByPlaceholderText('Person name');
      expect(personNameFields).toHaveLength(2);
    });

    it('removes person when remove button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      // Add a person first
      await user.click(screen.getByText('Add Person'));
      
      const removeButtons = screen.getAllByTitle('Remove person');
      expect(removeButtons).toHaveLength(2);
      
      await user.click(removeButtons[1]);

      const personNameFields = screen.getAllByPlaceholderText('Person name');
      expect(personNameFields).toHaveLength(1);
    });

    it('disables remove button when only one person remains', () => {
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const removeButton = screen.getByTitle('Remove person');
      expect(removeButton).toBeDisabled();
    });
  });

  describe('Auto-calculation for Equal Split', () => {
    it('auto-calculates amounts when operator is EQUALLY', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getAllByDisplayValue('')[1], '100');
      await user.click(screen.getByText('Add Person')); // Now we have 2 people

      const amountFields = screen.getAllByDisplayValue('50.00');
      expect(amountFields).toHaveLength(2);
    });

    it('makes amount fields read-only for EQUALLY operator', () => {
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const amountField = screen.getByPlaceholderText('Amount');
      expect(amountField).toHaveAttribute('readonly');
    });

    it('makes amount fields editable for CUSTOM operator', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.selectOptions(screen.getByDisplayValue('Split Equally'), OperatorType.CUSTOM);

      const amountField = screen.getByPlaceholderText('Amount');
      expect(amountField).not.toHaveAttribute('readonly');
    });
  });

  describe('Custom Split Total Calculation', () => {
    it('shows calculated total for custom split', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.selectOptions(screen.getByDisplayValue('Split Equally'), OperatorType.CUSTOM);
      await user.type(screen.getByPlaceholderText('Amount'), '30');
      await user.click(screen.getByText('Add Person'));
      await user.type(screen.getAllByPlaceholderText('Amount')[1], '20');

      expect(screen.getByText('Total: $50.00')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('shows loading state on submit button', () => {
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(screen.getByText('Saving...')).toBeDisabled();
    });

    it('disables cancel button when loading', () => {
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      expect(screen.getByText('Cancel')).toBeDisabled();
    });

    it('displays error message', () => {
      const errorMessage = 'Something went wrong';
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          error={errorMessage}
        />
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Cancel Functionality', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <BillForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });
});
