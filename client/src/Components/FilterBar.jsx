import React, { useState } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';
import CityAutocomplete from './CityAutocomplete';
import DistrictAutocomplete from './DistrictAutocomplete';
import useWindowSize from './useWindowSize';

const categories = [
  { value: 'Upratovanie', label: 'Upratovanie' },
  { value: 'Kosenie trávy', label: 'Kosenie trávy' },
  { value: 'Záhradnícke práce', label: 'Záhradnícke práce' },
  { value: 'Oprava spotrebičov', label: 'Oprava spotrebičov' },
  { value: 'Maľovanie a natieranie', label: 'Maľovanie a natieranie' },
  { value: 'Montáž nábytku', label: 'Montáž nábytku' },
  { value: 'Stráženie detí', label: 'Stráženie detí' },
  { value: 'Doučovanie', label: 'Doučovanie' },
  { value: 'Starostlivosť o seniorov', label: 'Starostlivosť o seniorov' },
  { value: 'Prechádzky so psami', label: 'Prechádzky so psami' },
  { value: 'Elektrikárske práce', label: 'Elektrikárske práce' },
  { value: 'Inštalatérske práce', label: 'Inštalatérske práce' },
  { value: 'Oprava elektroniky', label: 'Oprava elektroniky' },
  { value: 'Oprava automobilov', label: 'Oprava automobilov' },
  { value: 'IT podpora', label: 'IT podpora' },
  { value: 'Vývoj webových stránok', label: 'Vývoj webových stránok' },
  { value: 'Grafický dizajn', label: 'Grafický dizajn' },
  { value: 'Správa sociálnych médií', label: 'Správa sociálnych médií' },
  { value: 'Osobné nákupy', label: 'Osobné nákupy' },
  { value: 'Asistenčné služby', label: 'Asistenčné služby' },
  { value: 'Šoférske služby', label: 'Šoférske služby' },
  { value: 'Fotografovanie', label: 'Fotografovanie' },
  { value: 'Videografia', label: 'Videografia' },
  { value: 'Hudobné lekcie', label: 'Hudobné lekcie' },
  { value: 'Výtvarné kurzy', label: 'Výtvarné kurzy' },
  { value: 'Osobný tréning', label: 'Osobný tréning' },
  { value: 'Výživové poradenstvo', label: 'Výživové poradenstvo' },
  { value: 'Masáže', label: 'Masáže' },
  { value: 'Joga a meditácia', label: 'Joga a meditácia' },
  { value: 'Organizačné služby', label: 'Organizačné služby' },
  { value: 'Prekladateľské služby', label: 'Prekladateľské služby' },
  { value: 'Účtovnícke služby', label: 'Účtovnícke služby' }
];

const priceRanges = [
  { value: '0-10', label: '0€ - 10€' },
  { value: '11-20', label: '11€ - 20€' },
  { value: '21-40', label: '21€ - 40€' },
  { value: '41-100', label: '41€ - 100€' },
  { value: '101-500', label: '101€ - 500€' },
];

const estimatedTimes = [
  { value: '0-2', label: '0 - 2 hodiny' },
  { value: '2-5', label: '2 - 5 hodín' },
  { value: '5-10', label: '5 - 10 hodín' },
];

const FilterBar = ({ onFilterChange, onResetFilters }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedEstimatedTime, setSelectedEstimatedTime] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
  const size = useWindowSize();

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
      case 'city':
        setSelectedCity(selectedOption);
        break;
      case 'district':
        setSelectedDistrict(selectedOption);
        break;
      default:
        break;
    }
    onFilterChange(actionMeta.name, selectedOption ? selectedOption.value : '');
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    setSelectedEstimatedTime(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    onFilterChange('category', null);
    onFilterChange('priceRange', null);
    onFilterChange('estimatedTime', null);
    onFilterChange('city', '');
    onFilterChange('district', '');
    onResetFilters();
  };

  return (
    <div className="p-4 bg-gray-700 shadow-lg rounded-lg mb-8">
      {size.width < 768 ? (
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col space-y-2">
            <Select
              name="category"
              options={categories}
              value={selectedCategory}
              onChange={handleChange}
              placeholder="Kategória"
              className="w-full"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '8px',
                  borderColor: '#d1d5db',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#d1d5db',
                  },
                }),
              }}
            />
            <CityAutocomplete
              value={selectedCity}
              onChange={(value) => handleChange({ value, label: value }, { name: 'city' })}
              placeholder="Vyberte mesto"
              className="w-full"
            />
          </div>
          <div className="flex justify-between space-x-2">
            <button
              onClick={() => setShowAdditionalFilters(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Zobraziť viac filtrov
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
            >
              Reset
            </button>
          </div>
          {showAdditionalFilters && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 50 }} 
              className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-gray-200 rounded-lg p-6 w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Filter</h2>
                  <button
                    onClick={() => setShowAdditionalFilters(false)}
                    className="text-2xl font-semibold"
                  >
                    &times;
                  </button>
                </div>
                <div className="space-y-4">
                  <Select
                    name="category"
                    options={categories}
                    value={selectedCategory}
                    onChange={handleChange}
                    placeholder="Kategória"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '8px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#d1d5db',
                        },
                      }),
                    }}
                  />
                  <Select
                    name="priceRange"
                    options={priceRanges}
                    value={selectedPriceRange}
                    onChange={handleChange}
                    placeholder="Cena"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '8px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#d1d5db',
                        },
                      }),
                    }}
                  />
                  <Select
                    name="estimatedTime"
                    options={estimatedTimes}
                    value={selectedEstimatedTime}
                    onChange={handleChange}
                    placeholder="Čas Práce"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '8px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#d1d5db',
                        },
                      }),
                    }}
                  />
                    <CityAutocomplete
                      value={selectedCity}
                      onChange={(value) => handleChange({ value, label: value }, { name: 'city' })}
                      placeholder="Vyberte mesto"
                    />
                  <DistrictAutocomplete
                    value={selectedDistrict}
                    onChange={(value) => handleChange({ value, label: value }, { name: 'district' })}
                    placeholder="Vyberte okres"
                  />
                  <button
                    onClick={() => setShowAdditionalFilters(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg w-full hover:bg-blue-700 transition duration-200"
                  >
                    Potvrdiť
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg w-full hover:bg-red-700 transition duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Select
            name="category"
            options={categories}
            value={selectedCategory}
            onChange={handleChange}
            placeholder="Kategória"
            className="w-1/6"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '8px',
                borderColor: '#d1d5db',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#d1d5db',
                },
              }),
            }}
          />
          <Select
            name="priceRange"
            options={priceRanges}
            value={selectedPriceRange}
            onChange={handleChange}
            placeholder="Cena"
            className="w-1/6"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '8px',
                borderColor: '#d1d5db',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#d1d5db',
                },
              }),
            }}
          />
          <Select
            name="estimatedTime"
            options={estimatedTimes}
            value={selectedEstimatedTime}
            onChange={handleChange}
            placeholder="Čas Práce"
            className="w-1/5"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '8px',
                borderColor: '#d1d5db',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#d1d5db',
                },
              }),
            }}
          />
          <CityAutocomplete
            value={selectedCity}
            onChange={(value) => handleChange({ value, label: value }, { name: 'city' })}
            placeholder="Vyberte mesto"
            className="w-1/5"
          />
          <DistrictAutocomplete
            value={selectedDistrict}
            onChange={(value) => handleChange({ value, label: value }, { name: 'district' })}
            placeholder="Vyberte okres"
            className="w-1/5"
          />
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;