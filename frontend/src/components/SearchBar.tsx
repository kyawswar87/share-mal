import React, { useState, useEffect, useCallback } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { Search, X } from 'react-bootstrap-icons';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search bills by title...",
  debounceMs = 300 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, debounceMs]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar mb-3">
      <InputGroup>
        <InputGroup.Text>
          <Search />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          className="border-end-0"
        />
        {searchTerm && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            className="border-start-0"
            title="Clear search"
          >
            <X />
          </Button>
        )}
      </InputGroup>
    </div>
  );
};

export default SearchBar;
