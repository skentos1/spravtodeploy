// StyledDatePicker.js
import DatePicker from "react-datepicker";
import styled, { createGlobalStyle } from "styled-components";
import "react-datepicker/dist/react-datepicker.css";

// Global styles pre react-datepicker (ak chceš, môžeš ponechať GlobalStyle v inom komponente)
export const GlobalStyleDatepicker = createGlobalStyle`
  /* Celkový kalendár */
  .react-datepicker {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: #ffffff;
    border: none;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    padding: 20px;
    transition: transform 0.2s ease;
  }
  
  .react-datepicker:hover {
    transform: scale(1.02);
  }

  /* Hlavička kalendára */
  .react-datepicker__header {
    background: linear-gradient(135deg, #2d3748, #4a5568);
    border: none;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 16px;
  }

  .react-datepicker__current-month {
    color: #fff;
    font-weight: 600;
    font-size: 1.6rem;
  }

  .react-datepicker__week {
    display: flex;
    justify-content: space-evenly;
  }

  .react-datepicker__day {
    border-radius: 4px;
    transition: background-color 0.2s, transform 0.2s;
    width: 2.8rem;
    height: 2.8rem;
    line-height: 2.8rem;
    text-align: center;
    margin: 0;
    cursor: pointer;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #2d3748;
    color: #fff;
    transform: scale(1.1);
  }

  .react-datepicker__day:hover {
    background-color: #4a5568;
    color: #fff;
  }

  .react-datepicker__triangle {
    display: none;
  }

  /* Časová sekcia */
  .react-datepicker__time-container {
    font-size: 1.2rem;
  }
  
  .react-datepicker__time {
    width: 5rem;
  }
  
  .react-datepicker__time-box {
    width: 5rem;
  }
  
  .react-datepicker__time-list-item {
    height: 2rem;
    line-height: 2rem;
    transition: background-color 0.2s;
    cursor: pointer;
  }
  
  .react-datepicker__time-list-item:hover {
    background-color: #edf2f7;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  background-color: #f7fafc;
  color: #2d3748;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #cbd5e0;
  }
  
  &:focus {
    border-color: #2d3748;
    box-shadow: 0 0 0 3px rgba(45, 55, 72, 0.2);
  }

  &::placeholder {
    color: #a0aec0;
  }
  
  @media (min-width: 1200px) {
    padding: 18px 22px;
    font-size: 18px;
  }
`;

export default StyledDatePicker;
