import React, { useState, useEffect } from 'react';
// removed csvParse import
import UniversityList from './components/UniversityList.jsx';
import FilterBar from './components/FilterBar.jsx';

const App = () => {
  const [universities, setUniversities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  // Load JSON data on mount
  useEffect(() => {
    fetch('/data/processed-universities.json')
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data);
        setFiltered(data);
        // Extract unique regions & countries
        setRegions(['All', ...Array.from(new Set(data.map(u => u.region)))]);
        setCountries(['All', ...Array.from(new Set(data.map(u => u.country)))]);
      })
      .catch((err) => console.error('Failed to load universities:', err));
  }, []);

  // Apply filters whenever selection changes
  useEffect(() => {
    let result = universities;
    if (selectedRegion !== 'All') {
      result = result.filter(u => u.region === selectedRegion);
    }
    if (selectedCountry !== 'All') {
      result = result.filter(u => u.country === selectedCountry);
    }
    setFiltered(result);
  }, [selectedRegion, selectedCountry, universities]);

  return (
    <div className="container">
      <header>
        <h1>CS Universities Admission Portal</h1>
        <p>Explore graduate admission requirements for computing programs worldwide.</p>
      </header>
      <FilterBar
        regions={regions}
        countries={countries}
        selectedRegion={selectedRegion}
        selectedCountry={selectedCountry}
        onRegionChange={setSelectedRegion}
        onCountryChange={setSelectedCountry}
      />
      <UniversityList universities={filtered} />
    </div>
  );
};

export default App;
