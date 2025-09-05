import React from 'react';
import { ListGroup, Badge, Button, Row, Col } from 'react-bootstrap';
import { PersonDto, PaymentStatus } from '../types';
import { PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../utils/constants';
import { CheckCircle, Circle } from 'react-bootstrap-icons';

interface PersonListProps {
  persons: PersonDto[];
  onTogglePaymentStatus?: (personId: number) => void;
  showActions?: boolean;
  editable?: boolean;
}

const PersonList: React.FC<PersonListProps> = ({ 
  persons, 
  onTogglePaymentStatus, 
  showActions = true,
  editable = false 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const color = PAYMENT_STATUS_COLORS[status];
    return (
      <Badge 
        bg="custom" 
        style={{ backgroundColor: color, color: 'white' }}
        className="px-2 py-1"
      >
        {PAYMENT_STATUS_LABELS[status]}
      </Badge>
    );
  };

  const handleTogglePayment = (personId: number) => {
    if (onTogglePaymentStatus && editable) {
      onTogglePaymentStatus(personId);
    }
  };

  const getPaymentIcon = (status: PaymentStatus) => {
    return status === PaymentStatus.PAID ? (
      <CheckCircle size={20} className="text-success" />
    ) : (
      <Circle size={20} className="text-muted" />
    );
  };

  if (persons.length === 0) {
    return (
      <div className="text-center text-muted py-3">
        <p>No participants found</p>
      </div>
    );
  }

  return (
    <ListGroup variant="flush">
      {persons.map((person) => (
        <ListGroup.Item key={person.id} className="px-0">
          <Row className="align-items-center">
            <Col xs={1} className="d-flex justify-content-center">
              {getPaymentIcon(person.paymentStatus)}
            </Col>
            <Col xs={4}>
              <div className="fw-bold">{person.name}</div>
            </Col>
            <Col xs={3}>
              <div className="text-primary fw-bold">
                {formatCurrency(person.amount)}
              </div>
            </Col>
            <Col xs={3}>
              {getPaymentStatusBadge(person.paymentStatus)}
            </Col>
            {showActions && editable && (
              <Col xs={1} className="d-flex justify-content-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleTogglePayment(person.id)}
                  title={`Mark as ${person.paymentStatus === PaymentStatus.PAID ? 'unpaid' : 'paid'}`}
                >
                  {person.paymentStatus === PaymentStatus.PAID ? 'Undo' : 'Pay'}
                </Button>
              </Col>
            )}
          </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default PersonList;
