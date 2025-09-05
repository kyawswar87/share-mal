import React from 'react';
import { render, screen, fireEvent, waitFor } from '../test-utils';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('Search bills by title...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'Custom search placeholder';
    render(<SearchBar onSearch={mockOnSearch} placeholder={customPlaceholder} />);

    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('calls onSearch with debounced input', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);

    const input = screen.getByPlaceholderText('Search bills by title...');
    fireEvent.change(input, { target: { value: 'test search' } });

    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward time by 300ms
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test search');
    });
  });

  it('debounces multiple rapid input changes', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);

    const input = screen.getByPlaceholderText('Search bills by title...');
    
    fireEvent.change(input, { target: { value: 't' } });
    fireEvent.change(input, { target: { value: 'te' } });
    fireEvent.change(input, { target: { value: 'tes' } });
    fireEvent.change(input, { target: { value: 'test' } });

    // Fast-forward time by 300ms
    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  it('shows clear button when input has value', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search bills by title...');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getByTitle('Clear search')).toBeInTheDocument();
  });

  it('hides clear button when input is empty', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.queryByTitle('Clear search')).not.toBeInTheDocument();
  });

  it('clears input when clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search bills by title...');
    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByTitle('Clear search');
    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
  });

  it('calls onSearch with empty string when cleared', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);

    const input = screen.getByPlaceholderText('Search bills by title...');
    fireEvent.change(input, { target: { value: 'test' } });

    // Fast-forward to trigger the first search
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });

    // Clear the input
    const clearButton = screen.getByTitle('Clear search');
    fireEvent.click(clearButton);

    // Fast-forward to trigger the second search
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });

  it('uses custom debounce time', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={500} />);

    const input = screen.getByPlaceholderText('Search bills by title...');
    fireEvent.change(input, { target: { value: 'test' } });

    // Should not call after 300ms
    jest.advanceTimersByTime(300);
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Should call after 500ms
    jest.advanceTimersByTime(200);
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  it('cancels previous timer when new input is entered', async () => {
    render(<SearchBar onSearch={mockOnSearch} debounceMs={300} />);

    const input = screen.getByPlaceholderText('Search bills by title...');
    
    fireEvent.change(input, { target: { value: 'first' } });
    jest.advanceTimersByTime(200); // Not enough time to trigger

    fireEvent.change(input, { target: { value: 'second' } });
    jest.advanceTimersByTime(300); // Should trigger with 'second'

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledWith('second');
    });
  });
});
