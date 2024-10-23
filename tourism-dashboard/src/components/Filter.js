// Filter.js
import React from 'react';

const Filter = ({ onFilterChange }) => (
  <div className="filter">
    <label>Filter by Sentiment:</label>
    <select onChange={e => onFilterChange(e.target.value)}>
      <option value="all">All</option>
      <option value="positive">Positive</option>
      <option value="negative">Negative</option>
    </select>
  </div>
);

export default Filter;
