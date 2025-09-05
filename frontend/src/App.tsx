import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import BillList from './components/BillList';
import BillForm from './components/BillForm';
import PersonList from './components/PersonList';

// Services and Types
import BillApiService from './services/billApi';
import { 
  BillDto, 
  BillCreateRequest, 
  BillUpdateRequest, 
  BillStatus, 
  PaymentStatus 
} from './types';

// App State
interface AppState {
  bills: BillDto[];
  currentBill: BillDto | null;
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  statusFilter: BillStatus | null;
  showForm: boolean;
  showBillDetail: boolean;
  editingBill: BillDto | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    bills: [],
    currentBill: null,
    isLoading: false,
    error: null,
    searchTerm: '',
    statusFilter: null,
    showForm: false,
    showBillDetail: false,
    editingBill: null
  });

  // Load bills on component mount
  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let bills: BillDto[];
      
      if (state.searchTerm) {
        bills = await BillApiService.searchBillsByTitle(state.searchTerm);
      } else if (state.statusFilter) {
        bills = await BillApiService.getBillsByStatus(state.statusFilter);
      } else {
        bills = await BillApiService.getAllBills();
      }
      
      setState(prev => ({ ...prev, bills, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load bills',
        isLoading: false 
      }));
    }
  }, [state.searchTerm, state.statusFilter]);

  // Reload bills when search or filter changes
  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const handleSearch = useCallback((searchTerm: string) => {
    setState(prev => ({ ...prev, searchTerm }));
  }, []);

  const handleFilterByStatus = useCallback((status: BillStatus | null) => {
    setState(prev => ({ ...prev, statusFilter: status }));
  }, []);

  const handleCreateBill = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      showForm: true, 
      editingBill: null,
      showBillDetail: false 
    }));
  }, []);

  const handleEditBill = useCallback((bill: BillDto) => {
    setState(prev => ({ 
      ...prev, 
      showForm: true, 
      editingBill: bill,
      showBillDetail: false 
    }));
  }, []);

  const handleViewBill = useCallback((bill: BillDto) => {
    setState(prev => ({ 
      ...prev, 
      currentBill: bill,
      showBillDetail: true,
      showForm: false 
    }));
  }, []);

  const handleDeleteBill = useCallback(async (bill: BillDto) => {
    try {
      await BillApiService.deleteBill(bill.id);
      await loadBills(); // Reload bills after deletion
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to delete bill'
      }));
    }
  }, [loadBills]);

  const handleSubmitBill = useCallback(async (data: BillCreateRequest | BillUpdateRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      if (state.editingBill) {
        await BillApiService.updateBill(state.editingBill.id, data as BillUpdateRequest);
      } else {
        await BillApiService.createBill(data as BillCreateRequest);
      }
      
      setState(prev => ({ 
        ...prev, 
        showForm: false, 
        editingBill: null,
        isLoading: false 
      }));
      
      await loadBills(); // Reload bills after create/update
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to save bill',
        isLoading: false 
      }));
    }
  }, [state.editingBill, loadBills]);

  const handleCancelForm = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      showForm: false, 
      editingBill: null,
      error: null 
    }));
  }, []);

  const handleCloseBillDetail = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      showBillDetail: false,
      currentBill: null 
    }));
  }, []);

  const handleTogglePaymentStatus = useCallback(async (personId: number) => {
    if (!state.currentBill) return;
    
    try {
      // Call the payBill API to update payment status on server
      const updatedBill = await BillApiService.payBill(state.currentBill.id, personId);
      
      // Update the current bill with the response from server
      setState(prev => ({
        ...prev,
        currentBill: updatedBill
      }));
      
      // Reload bills to get updated data
      await loadBills();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to update payment status'
      }));
    }
  }, [state.currentBill, loadBills]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand href="/">
              <strong>Share Mal</strong> - Bill Splitting
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setState(prev => ({ 
                      ...prev, 
                      showForm: false, 
                      showBillDetail: false,
                      editingBill: null,
                      currentBill: null 
                    }));
                  }}
                >
                  All Bills
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          {state.error && (
            <Alert variant="danger" dismissible onClose={clearError} className="mb-4">
              {state.error}
            </Alert>
          )}

          {state.showForm ? (
            <BillForm
              bill={state.editingBill || undefined}
              onSubmit={handleSubmitBill}
              onCancel={handleCancelForm}
              isLoading={state.isLoading}
              error={state.error || undefined}
            />
          ) : state.showBillDetail && state.currentBill ? (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2>{state.currentBill.title}</h2>
                  <p className="text-muted mb-0">
                    Created on {new Date(state.currentBill.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={handleCloseBillDetail}
                  >
                    Back to Bills
                  </button>
                  <button 
                    className="btn btn-primary me-2"
                    onClick={() => handleEditBill(state.currentBill!)}
                  >
                    Edit Bill
                  </button>
                </div>
              </div>
              
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Bill Details</h5>
                    </div>
                    <div className="card-body">
                      <p><strong>Total Amount:</strong> ${state.currentBill.totalAmount}</p>
                      <p><strong>Split Type:</strong> {state.currentBill.operator}</p>
                      <p><strong>Status:</strong> {state.currentBill.status}</p>
                      <p><strong>Date:</strong> {new Date(state.currentBill.billDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Payment Summary</h5>
                    </div>
                    <div className="card-body">
                      <p><strong>Total Participants:</strong> {state.currentBill.persons.length}</p>
                      <p><strong>Paid:</strong> {state.currentBill.persons.filter(p => p.paymentStatus === PaymentStatus.PAID).length}</p>
                      <p><strong>Unpaid:</strong> {state.currentBill.persons.filter(p => p.paymentStatus === PaymentStatus.UNPAID).length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Participants</h5>
                </div>
                <div className="card-body">
                  <PersonList
                    persons={state.currentBill.persons}
                    onTogglePaymentStatus={handleTogglePaymentStatus}
                    editable={true}
                  />
                </div>
              </div>
            </div>
          ) : (
            <BillList
              bills={state.bills}
              isLoading={state.isLoading}
              error={state.error || undefined}
              onViewBill={handleViewBill}
              onEditBill={handleEditBill}
              onDeleteBill={handleDeleteBill}
              onCreateBill={handleCreateBill}
              onSearch={handleSearch}
              onFilterByStatus={handleFilterByStatus}
              currentFilter={state.statusFilter}
            />
          )}
        </Container>
      </div>
    </Router>
  );
};

export default App;
