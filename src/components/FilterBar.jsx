import React from 'react';

const FilterBar = ({
  regions,
  countries,
  selectedRegion,
  selectedCountry,
  onRegionChange,
  onCountryChange,
}) => {
  return (
    <div className="filter-bar">
      <select value={selectedRegion} onChange={(e) => onRegionChange(e.target.value)}>
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <select value={selectedCountry} onChange={(e) => onCountryChange(e.target.value)}>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
