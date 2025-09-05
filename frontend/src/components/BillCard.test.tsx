import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import BillCard from './BillCard';
import { mockBill1, mockBill2 } from '../test-utils/mock-data';
import { BillStatus, OperatorType, PaymentStatus } from '../types';

describe('BillCard', () => {
  const mockOnView = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders bill information correctly', () => {
    render(
      <BillCard
        bill={mockBill1}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Dinner at Restaurant')).toBeInTheDocument();
    expect(screen.getByText('$51.00')).toBeInTheDocument();
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    expect(screen.getByText('Split Equally')).toBeInTheDocument();
    expect(screen.getByText('1/2 paid')).toBeInTheDocument();
  });

  it('displays correct status badge for INCOMPLETE status', () => {
    render(
      <BillCard
        bill={mockBill1}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const statusBadge = screen.getByText('Incomplete');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveStyle('background-color: #ffc107');
  });

  it('displays correct status badge for COMPLETE status', () => {
    render(
      <BillCard
        bill={mockBill2}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const statusBadge = screen.getByText('Complete');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveStyle('background-color: #28a745');
  });

  it('displays correct operator type', () => {
    render(
      <BillCard
        bill={mockBill2}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Custom Amounts')).toBeInTheDocument();
  });

  it('calls onView when view button is clicked', () => {
    render(
      <BillCard
        bill={mockBill1}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const viewButton = screen.getByTitle('View details');
    fireEvent.click(viewButton);

    expect(mockOnView).toHaveBeenCalledWith(mockBill1);
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <BillCard
        bill={mockBill1}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByTitle('Edit bill');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockBill1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <BillCard
        bill={mockBill1}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByTitle('Delete bill');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockBill1);
  });

  it('displays correct payment count', () => {
    const billWithMixedPayments = {
      ...mockBill1,
      persons: [
        { ...mockBill1.persons[0], paymentStatus: PaymentStatus.PAID },
        { ...mockBill1.persons[1], paymentStatus: PaymentStatus.UNPAID }
      ]
    };

    render(
      <BillCard
        bill={billWithMixedPayments}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('1/2 paid')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(
      <BillCard
        bill={mockBill1}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$51.00')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(
      <BillCard
        bill={mockBill1}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('displays created date', () => {
    render(
      <BillCard
        bill={mockBill1}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Created: Jan 15, 2024')).toBeInTheDocument();
  });
});
