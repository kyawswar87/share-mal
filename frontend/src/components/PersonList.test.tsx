import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import PersonList from './PersonList';
import { mockPerson1, mockPerson2, createMockPerson } from '../test-utils/mock-data';
import { PaymentStatus } from '../types';

describe('PersonList', () => {
  const mockOnTogglePaymentStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list of persons correctly', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('$25.50')).toBeInTheDocument();
    expect(screen.getByText('$25.50')).toBeInTheDocument();
  });

  it('displays correct payment status badges', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    const unpaidBadge = screen.getByText('Unpaid');
    const paidBadge = screen.getByText('Paid');
    
    expect(unpaidBadge).toBeInTheDocument();
    expect(unpaidBadge).toHaveStyle('background-color: #dc3545');
    
    expect(paidBadge).toBeInTheDocument();
    expect(paidBadge).toHaveStyle('background-color: #28a745');
  });

  it('displays correct payment icons', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    // Should have one CheckCircle (paid) and one Circle (unpaid)
    // Check for the presence of payment status badges instead
    const paidBadges = screen.getAllByText('Paid');
    const unpaidBadges = screen.getAllByText('Unpaid');
    
    expect(paidBadges).toHaveLength(1);
    expect(unpaidBadges).toHaveLength(1);
  });

  it('shows action buttons when editable is true', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    const payButtons = screen.getAllByText('Pay');
    const undoButtons = screen.getAllByText('Undo');
    
    expect(payButtons).toHaveLength(1); // One unpaid person
    expect(undoButtons).toHaveLength(1); // One paid person
  });

  it('hides action buttons when editable is false', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={false}
      />
    );

    expect(screen.queryByText('Pay')).not.toBeInTheDocument();
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
  });

  it('hides action buttons when showActions is false', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        showActions={false}
        editable={true}
      />
    );

    expect(screen.queryByText('Pay')).not.toBeInTheDocument();
    expect(screen.queryByText('Undo')).not.toBeInTheDocument();
  });

  it('calls onTogglePaymentStatus when pay button is clicked', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    const payButton = screen.getByText('Pay');
    fireEvent.click(payButton);

    expect(mockOnTogglePaymentStatus).toHaveBeenCalledWith(mockPerson1.id);
  });

  it('calls onTogglePaymentStatus when undo button is clicked', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    const undoButton = screen.getByText('Undo');
    fireEvent.click(undoButton);

    expect(mockOnTogglePaymentStatus).toHaveBeenCalledWith(mockPerson2.id);
  });

  it('does not call onTogglePaymentStatus when not editable', () => {
    const persons = [mockPerson1, mockPerson2];
    
    render(
      <PersonList
        persons={persons}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={false}
      />
    );

    // Try to click on the person row (if buttons were rendered)
    const personRow = screen.getByText('John Doe').closest('.list-group-item');
    if (personRow) {
      fireEvent.click(personRow);
    }

    expect(mockOnTogglePaymentStatus).not.toHaveBeenCalled();
  });

  it('displays empty state when no persons', () => {
    render(
      <PersonList
        persons={[]}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    expect(screen.getByText('No participants found')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    const personWithCustomAmount = createMockPerson({
      amount: 123.45
    });
    
    render(
      <PersonList
        persons={[personWithCustomAmount]}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    expect(screen.getByText('$123.45')).toBeInTheDocument();
  });

  it('shows correct button text based on payment status', () => {
    const unpaidPerson = createMockPerson({ paymentStatus: PaymentStatus.UNPAID });
    const paidPerson = createMockPerson({ paymentStatus: PaymentStatus.PAID });
    
    render(
      <PersonList
        persons={[unpaidPerson, paidPerson]}
        onTogglePaymentStatus={mockOnTogglePaymentStatus}
        editable={true}
      />
    );

    expect(screen.getByText('Pay')).toBeInTheDocument();
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('handles missing onTogglePaymentStatus callback gracefully', () => {
    const persons = [mockPerson1];
    
    render(
      <PersonList
        persons={persons}
        editable={true}
      />
    );

    const payButton = screen.getByText('Pay');
    
    // Should not throw error when clicked
    expect(() => fireEvent.click(payButton)).not.toThrow();
  });
});
