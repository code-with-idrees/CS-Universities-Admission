import React, { useState, useEffect, useMemo } from 'react';
import UniversityList from './components/UniversityList.jsx';
import FilterBar from './components/FilterBar.jsx';
import ProfileUploader from './components/ProfileUploader.jsx';
import InterestFilter from './components/InterestFilter.jsx';
import GeminiChat from './components/GeminiChat.jsx';
import { areaToInterest } from './data/programs.js';

const App = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('site-theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const [universities, setUniversities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [visibleCount, setVisibleCount] = useState(100);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

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

  // Apply theme to document
  useEffect(() => {
    try {
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('site-theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // Compute interest counts from university data
  const interestData = useMemo(() => {
    const counts = {};
    universities.forEach((u) => {
      const uniInterests = new Set();
      (u.faculties || []).forEach((f) => {
        (f.areas || []).forEach((area) => {
          const interest = areaToInterest[area.toLowerCase()];
          if (interest && !uniInterests.has(interest)) {
            uniInterests.add(interest);
            counts[interest] = (counts[interest] || 0) + 1;
          }
        });
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [universities]);

  // Apply filters whenever selection changes
  useEffect(() => {
    let result = universities;

    // Region filter
    if (selectedRegion !== 'All') {
      result = result.filter(u => u.region === selectedRegion);
    }

    // Country filter
    if (selectedCountry !== 'All') {
      result = result.filter(u => u.country === selectedCountry);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) ||
        (u.country || '').toLowerCase().includes(q) ||
        (u.region || '').toLowerCase().includes(q) ||
        (u.faculties || []).some(f => f.name.toLowerCase().includes(q))
      );
    }

    // Interest filter
    if (selectedInterests.size > 0) {
      result = result.filter((u) => {
        const uniInterests = new Set();
        (u.faculties || []).forEach((f) => {
          (f.areas || []).forEach((area) => {
            const interest = areaToInterest[area.toLowerCase()];
            if (interest) uniInterests.add(interest);
          });
        });
        // University must have at least one of the selected interests
        for (const si of selectedInterests) {
          if (uniInterests.has(si)) return true;
        }
        return false;
      });
    }

    setFiltered(result);
    setVisibleCount(100); // Reset visible count when filters change
  }, [selectedRegion, selectedCountry, universities, selectedInterests, searchQuery]);

  // compute countries available for the selected region
  const countriesForRegion = useMemo(() => {
    if (!universities || universities.length === 0) return ['All'];
    if (!selectedRegion || selectedRegion === 'All') return ['All', ...Array.from(new Set(universities.map(u => u.country)))];
    const list = universities.filter(u => u.region === selectedRegion).map(u => u.country);
    return ['All', ...Array.from(new Set(list))];
  }, [universities, selectedRegion]);

  // When region changes, reset selected country if it's no longer available
  useEffect(() => {
    if (!countriesForRegion.includes(selectedCountry)) {
      setSelectedCountry('All');
    }
  }, [selectedRegion, countriesForRegion]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) {
        next.delete(interest);
      } else {
        next.add(interest);
      }
      return next;
    });
  };

  const clearAllInterests = () => {
    setSelectedInterests(new Set());
  };

  return (
    <div className="container">
      <header className="app-header">
        <div className="app-header__left">
          <div className="app-header__brand">
            <span className="app-header__logo">🎓</span>
            <div>
              <h1 className="app-header__title">CS Universities Admission Portal</h1>
              <p className="app-header__subtitle">
                Explore graduate admission requirements for computing programs worldwide • 
                <strong> {universities.length}</strong> universities • 
                <strong> {universities.reduce((s, u) => s + (u.faculties?.length || 0), 0).toLocaleString()}</strong> professors
              </p>
            </div>
          </div>
        </div>
        <div className="app-header__actions">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search universities, professors, or countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
        <div className="search-meta">
          Showing <strong>{Math.min(visibleCount, filtered.length)}</strong> of <strong>{filtered.length}</strong> universities
        </div>
      </div>

      <FilterBar
        regions={regions}
        countries={countriesForRegion}
        selectedRegion={selectedRegion}
        selectedCountry={selectedCountry}
        onRegionChange={setSelectedRegion}
        onCountryChange={setSelectedCountry}
      />

      {/* Interest-based filter */}
      <InterestFilter
        interests={interestData}
        selectedInterests={selectedInterests}
        onToggle={toggleInterest}
        onClearAll={clearAllInterests}
      />

      <div style={{ margin: '1rem 0' }}>
        <ProfileUploader universities={filtered} onRecommend={(r)=>setRecommendations(r)} />
      </div>

      <UniversityList
        universities={filtered.slice(0, visibleCount)}
        selectedInterests={selectedInterests}
      />

      {filtered.length > visibleCount && (
        <div className="load-more-container">
          <button
            onClick={() => setVisibleCount(c => c + 100)}
            className="load-more-btn"
          >
            Load more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Gemini AI Chat Drawer */}
      <GeminiChat universities={filtered} />
    </div>
  );
};

export default App;
