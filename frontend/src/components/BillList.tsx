import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Button, Dropdown, Alert, Spinner } from 'react-bootstrap';
import { BillDto, BillStatus } from '../types';
import { STATUS_LABELS } from '../utils/constants';
import BillCard from './BillCard';
import SearchBar from './SearchBar';
import { Plus, Filter } from 'react-bootstrap-icons';

interface BillListProps {
  bills: BillDto[];
  isLoading?: boolean;
  error?: string;
  onViewBill: (bill: BillDto) => void;
  onEditBill: (bill: BillDto) => void;
  onDeleteBill: (bill: BillDto) => void;
  onCreateBill: () => void;
  onSearch: (searchTerm: string) => void;
  onFilterByStatus: (status: BillStatus | null) => void;
  currentFilter?: BillStatus | null;
}

const BillList: React.FC<BillListProps> = ({
  bills,
  isLoading = false,
  error,
  onViewBill,
  onEditBill,
  onDeleteBill,
  onCreateBill,
  onSearch,
  onFilterByStatus,
  currentFilter
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<BillDto | null>(null);

  const handleDeleteClick = useCallback((bill: BillDto) => {
    setShowDeleteConfirm(bill);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (showDeleteConfirm) {
      onDeleteBill(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  }, [showDeleteConfirm, onDeleteBill]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(null);
  }, []);

  const getFilterLabel = (status: BillStatus | null | undefined) => {
    if (status === null || status === undefined) return 'All Bills';
    return STATUS_LABELS[status];
  };

  const getBillsCount = () => {
    return bills.length;
  };

  if (isLoading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading bills...</span>
          </Spinner>
          <p className="mt-2">Loading bills...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Bills</h2>
              <p className="text-muted mb-0">
                {getBillsCount()} {getBillsCount() === 1 ? 'bill' : 'bills'} found
              </p>
            </div>
            <Button
              variant="primary"
              onClick={onCreateBill}
              className="d-flex align-items-center"
            >
              <Plus size={20} className="me-2" />
              Create Bill
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={8}>
          <SearchBar onSearch={onSearch} />
        </Col>
        <Col md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-between">
              <Filter size={16} className="me-2" />
              {getFilterLabel(currentFilter)}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => onFilterByStatus(null)}
                active={currentFilter === null}
              >
                All Bills
              </Dropdown.Item>
              <Dropdown.Divider />
              {Object.values(BillStatus).map((status) => (
                <Dropdown.Item
                  key={status}
                  onClick={() => onFilterByStatus(status)}
                  active={currentFilter === status}
                >
                  {STATUS_LABELS[status]}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Error Display */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">
              <Alert.Heading>Error</Alert.Heading>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Bills Grid */}
      {bills.length === 0 ? (
        <Row>
          <Col>
            <div className="text-center py-5">
              <div className="mb-3">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
              </div>
              <h4 className="text-muted">No bills found</h4>
              <p className="text-muted">
                {currentFilter ? 
                  `No bills with status "${getFilterLabel(currentFilter)}" found.` :
                  'Get started by creating your first bill.'
                }
              </p>
              <Button variant="primary" onClick={onCreateBill}>
                <Plus size={20} className="me-2" />
                Create Your First Bill
              </Button>
            </div>
          </Col>
        </Row>
      ) : (
        <Row>
          {bills.map((bill) => (
            <Col key={bill.id} lg={4} md={6} className="mb-4">
              <BillCard
                bill={bill}
                onView={onViewBill}
                onEdit={onEditBill}
                onDelete={handleDeleteClick}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete the bill <strong>"{showDeleteConfirm.title}"</strong>?
                </p>
                <p className="text-muted mb-0">
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={handleDeleteCancel}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteConfirm}>
                  Delete Bill
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default BillList;
