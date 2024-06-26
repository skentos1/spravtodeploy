import React, { useState } from 'react';
import Select from 'react-select';

const categories = [
  { value: 'zahradne prace', label: 'Záhradné práce' },
  { value: 'stavebne prace', label: 'Stavebné práce' },
  { value: 'rubanie dreva', label: 'Rubanie dreva' },
  { value: 'oprava spotrebicov', label: 'Oprava spotrebičov' },
  { value: 'ine', label: 'Ine' },
  // Add more categories as needed
];

const dateCreatedOptions = [
  { value: 'newest', label: 'Nove' },
  { value: 'oldest', label: 'Stare' },
];

const priceRanges = [
  { value: '0-100', label: '$0 - $100' },
  { value: '101-500', label: '$101 - $500' },
  { value: '501-1000', label: '$501 - $1000' },
  // Add more price ranges as needed
];

const estimatedTimes = [
  { value: '0-2', label: '0 - 2 hodiny' },
  { value: '2-5', label: '2 - 5 hodin' },
  { value: '5-10', label: '5 - 10 hodin' },
  // Add more time ranges as needed
];

const FilterBar = ({ onFilterChange, onResetFilters }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedEstimatedTime, setSelectedEstimatedTime] = useState(null);
  const [selectedDateCreated, setSelectedDateCreated] = useState(null);

  const handleChange = (selectedOption, actionMeta) => {
    switch (actionMeta.name) {
      case 'category':
        setSelectedCategory(selectedOption);
        break;
      case 'priceRange':
        setSelectedPriceRange(selectedOption);
        break;
      case 'estimatedTime':
        setSelectedEstimatedTime(selectedOption);
        break;
      case 'dateCreated':
        setSelectedDateCreated(selectedOption);
        break;
      default:
        break;
    }
    onFilterChange(actionMeta.name, selectedOption);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    setSelectedEstimatedTime(null);
    setSelectedDateCreated(null);
    onResetFilters();
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700 shadow-lg rounded-lg mb-8">
      <Select
        name="category"
        options={categories}
        value={selectedCategory}
        onChange={handleChange}
        placeholder="Kategoria"
        className="w-1/5"
      />
      <Select
        name="priceRange"
        options={priceRanges}
        value={selectedPriceRange}
        onChange={handleChange}
        placeholder="Cena"
        className="w-1/5"
      />
      <Select
        name="estimatedTime"
        options={estimatedTimes}
        value={selectedEstimatedTime}
        onChange={handleChange}
        placeholder="Odhadovany cas"
        className="w-1/5"
      />
      <Select
        name="dateCreated"
        options={dateCreatedOptions}
        value={selectedDateCreated}
        onChange={handleChange}
        placeholder="Datum vytvorenia"
        className="w-1/5"
      />
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Reset
      </button>
    </div>
  );
};

export default FilterBar;
