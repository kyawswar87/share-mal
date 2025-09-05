import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { BillDto, BillStatus, OperatorType } from '../types';
import { STATUS_COLORS, STATUS_LABELS, OPERATOR_LABELS } from '../utils/constants';
import { format } from 'date-fns';
import { Eye, Pencil, Trash, People } from 'react-bootstrap-icons';

interface BillCardProps {
  bill: BillDto;
  onView: (bill: BillDto) => void;
  onEdit: (bill: BillDto) => void;
  onDelete: (bill: BillDto) => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onView, onEdit, onDelete }) => {
  const getStatusBadge = (status: BillStatus) => {
    const color = STATUS_COLORS[status];
    return (
      <Badge 
        bg="custom" 
        style={{ backgroundColor: color, color: 'white' }}
        className="px-2 py-1"
      >
        {STATUS_LABELS[status]}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const getPaidCount = () => {
    return bill.persons.filter(person => person.paymentStatus === 'PAID').length;
  };

  return (
    <Card className="h-100 shadow-sm bill-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <h6 className="mb-0 me-2">{bill.title}</h6>
          {getStatusBadge(bill.status)}
        </div>
        <div className="d-flex gap-1">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onView(bill)}
            title="View details"
          >
            <Eye size={16} />
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => onEdit(bill)}
            title="Edit bill"
          >
            <Pencil size={16} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(bill)}
            title="Delete bill"
          >
            <Trash size={16} />
          </Button>
        </div>
      </Card.Header>
      
      <Card.Body className="d-flex flex-column">
        <Row className="mb-2">
          <Col xs={6}>
            <small className="text-muted">Total Amount</small>
            <div className="fw-bold text-primary">
              {formatCurrency(bill.totalAmount)}
            </div>
          </Col>
          <Col xs={6}>
            <small className="text-muted">Date</small>
            <div className="fw-bold">
              {formatDate(bill.billDate)}
            </div>
          </Col>
        </Row>
        
        <Row className="mb-2">
          <Col xs={6}>
            <small className="text-muted">Split Type</small>
            <div className="fw-bold">
              {OPERATOR_LABELS[bill.operator]}
            </div>
          </Col>
          <Col xs={6}>
            <small className="text-muted">Participants</small>
            <div className="d-flex align-items-center">
              <People size={16} className="me-1" />
              <span className="fw-bold">
                {getPaidCount()}/{bill.persons.length} paid
              </span>
            </div>
          </Col>
        </Row>
        
        <div className="mt-auto">
          <small className="text-muted">
            Created: {formatDate(bill.createdAt)}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default BillCard;
