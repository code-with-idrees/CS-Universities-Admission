import React from 'react';
import { countryNames } from '../data/programs.js';

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
        {countries.map((c) => {
          const display = c === 'All' ? 'All' : (countryNames[c] || (() => {
            try { const dn = new Intl.DisplayNames(['en'], { type: 'region' }); return dn.of((c||'').toUpperCase()) || c; } catch (e) { return c; }
          })());
          return (
            <option key={c} value={c}>
              {display}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FilterBar;
