import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import axios from 'axios';
import debounce from 'lodash/debounce';

// Function to normalize input by removing diacritics
const normalizeInput = (input) => {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const DistrictAutocomplete = ({ value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debounced function to fetch districts
  const fetchDistricts = useCallback(
    debounce(async (inputValue) => {
      if (inputValue.length < 3) return; // Fetch when input is more than 2 characters

      setIsLoading(true);
      try {
        const normalizedInput = normalizeInput(inputValue);
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/mesta/districts?q=${normalizedInput}`);
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchDistricts(inputValue);
  }, [inputValue, fetchDistricts]);

  useEffect(() => {
    if (value === null) {
      setInputValue('');
      setOptions([]);
    }
  }, [value]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
    if (newValue === '') {
      setOptions([]);
    }
  };

  const handleChange = (selectedOption) => {
    onChange(selectedOption ? selectedOption.value : '');
  };

  return (
    <Select
      options={options}
      value={options.find(option => option.value === value)}
      onChange={handleChange}
      onInputChange={handleInputChange}
      placeholder="Vyberte okres"
      isClearable
      isLoading={isLoading}
      noOptionsMessage={() => (isLoading ? 'Načítanie...' : 'Žiadne možnosti')}
    />
  );
};

export default DistrictAutocomplete;
