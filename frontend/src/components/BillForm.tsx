import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, InputGroup } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { BillDto, BillCreateRequest, BillUpdateRequest, OperatorType, PersonFormData } from '../types';
import { OPERATOR_LABELS, VALIDATION_RULES } from '../utils/constants';
import { Plus, Trash, Calculator } from 'react-bootstrap-icons';

interface BillFormProps {
  bill?: BillDto;
  onSubmit: (data: BillCreateRequest | BillUpdateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string;
}

interface FormData {
  title: string;
  totalAmount: string;
  operator: OperatorType;
  billDate: string;
  persons: PersonFormData[];
}

const BillForm: React.FC<BillFormProps> = ({ 
  bill, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  error 
}) => {
  const isEdit = !!bill;
  
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: bill?.title || '',
      totalAmount: bill?.totalAmount?.toString() || '',
      operator: bill?.operator || OperatorType.EQUALLY,
      billDate: bill?.billDate || new Date().toISOString().split('T')[0],
      persons: bill?.persons?.map(p => ({ name: p.name, amount: p.amount.toString() })) || [{ name: '', amount: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'persons'
  });

  const watchedOperator = watch('operator');
  const watchedTotalAmount = watch('totalAmount');
  const watchedPersons = watch('persons');

  // Auto-calculate amounts for EQUALLY operator
  useEffect(() => {
    if (watchedOperator === OperatorType.EQUALLY && watchedTotalAmount && watchedPersons.length > 0) {
      const totalAmount = parseFloat(watchedTotalAmount);
      if (!isNaN(totalAmount) && totalAmount > 0) {
        const amountPerPerson = (totalAmount / watchedPersons.length).toFixed(2);
        watchedPersons.forEach((_, index) => {
          setValue(`persons.${index}.amount`, amountPerPerson);
        });
      }
    }
  }, [watchedOperator, watchedTotalAmount, watchedPersons.length, setValue]);

  const addPerson = () => {
    append({ name: '', amount: '' });
  };

  const removePerson = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateTotal = () => {
    if (watchedOperator === OperatorType.CUSTOM) {
      const total = watchedPersons.reduce((sum, person) => {
        const amount = parseFloat(person.amount || '0');
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      return total.toFixed(2);
    }
    return watchedTotalAmount;
  };

  const onFormSubmit = (data: FormData) => {
    const persons = data.persons.map(person => ({
      name: person.name,
      amount: watchedOperator === OperatorType.EQUALLY ? undefined : parseFloat(person.amount)
    }));

    const submitData = {
      title: data.title,
      totalAmount: parseFloat(data.totalAmount),
      operator: data.operator,
      billDate: data.billDate,
      persons
    };

    onSubmit(submitData);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? '$0.00' : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">{isEdit ? 'Edit Bill' : 'Create New Bill'}</h5>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onFormSubmit)}>
          <Row className="mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Bill Title *</Form.Label>
                <Form.Control
                  type="text"
                  {...register('title', {
                    required: 'Bill title is required',
                    minLength: {
                      value: VALIDATION_RULES.TITLE_MIN_LENGTH,
                      message: `Title must be at least ${VALIDATION_RULES.TITLE_MIN_LENGTH} character`
                    },
                    maxLength: {
                      value: VALIDATION_RULES.TITLE_MAX_LENGTH,
                      message: `Title must be no more than ${VALIDATION_RULES.TITLE_MAX_LENGTH} characters`
                    }
                  })}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Bill Date *</Form.Label>
                <Form.Control
                  type="date"
                  {...register('billDate', { required: 'Bill date is required' })}
                  isInvalid={!!errors.billDate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.billDate?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Total Amount *</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    {...register('totalAmount', {
                      required: 'Total amount is required',
                      min: {
                        value: VALIDATION_RULES.MIN_AMOUNT,
                        message: `Amount must be at least $${VALIDATION_RULES.MIN_AMOUNT}`
                      }
                    })}
                    isInvalid={!!errors.totalAmount}
                  />
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  {errors.totalAmount?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Split Type *</Form.Label>
                <Form.Select
                  {...register('operator', { required: 'Split type is required' })}
                  isInvalid={!!errors.operator}
                >
                  <option value={OperatorType.EQUALLY}>{OPERATOR_LABELS[OperatorType.EQUALLY]}</option>
                  <option value={OperatorType.CUSTOM}>{OPERATOR_LABELS[OperatorType.CUSTOM]}</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.operator?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label>Participants *</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Button
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  onClick={addPerson}
                >
                  <Plus size={16} className="me-1" />
                  Add Person
                </Button>
                {watchedOperator === OperatorType.CUSTOM && (
                  <div className="d-flex align-items-center text-muted">
                    <Calculator size={16} className="me-1" />
                    Total: {formatCurrency(calculateTotal())}
                  </div>
                )}
              </div>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="mb-2">
                <Card.Body className="py-2">
                  <Row className="align-items-center">
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Person name"
                        {...register(`persons.${index}.name`, {
                          required: 'Person name is required',
                          minLength: {
                            value: VALIDATION_RULES.NAME_MIN_LENGTH,
                            message: `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} character`
                          },
                          maxLength: {
                            value: VALIDATION_RULES.NAME_MAX_LENGTH,
                            message: `Name must be no more than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters`
                          }
                        })}
                        isInvalid={!!errors.persons?.[index]?.name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.persons?.[index]?.name?.message}
                      </Form.Control.Feedback>
                    </Col>
                    <Col md={4}>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Amount"
                          {...register(`persons.${index}.amount`, {
                            required: watchedOperator === OperatorType.CUSTOM ? 'Amount is required for custom split' : false,
                            min: {
                              value: VALIDATION_RULES.MIN_AMOUNT,
                              message: `Amount must be at least $${VALIDATION_RULES.MIN_AMOUNT}`
                            }
                          })}
                          readOnly={watchedOperator === OperatorType.EQUALLY}
                          isInvalid={!!errors.persons?.[index]?.amount}
                        />
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {errors.persons?.[index]?.amount?.message}
                      </Form.Control.Feedback>
                    </Col>
                    <Col md={2} className="d-flex justify-content-end">
                      <Button
                        type="button"
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removePerson(index)}
                        disabled={fields.length === 1}
                        title="Remove person"
                      >
                        <Trash size={16} />
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEdit ? 'Update Bill' : 'Create Bill')}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BillForm;
