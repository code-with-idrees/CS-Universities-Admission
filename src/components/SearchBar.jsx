import React, { useState, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ value, onChange, resultCount, totalCount }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  const handleChange = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={`searchbar${isFocused ? ' searchbar--focused' : ''}`}>
      <div className="searchbar-input-wrapper">
        <Search
          size={18}
          className={`searchbar-icon${isFocused ? ' searchbar-icon--focused' : ''}`}
        />

        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          placeholder="Search universities, countries, or programs..."
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          spellCheck={false}
          autoComplete="off"
        />

        {value.length > 0 && (
          <button
            className="searchbar-clear"
            onClick={handleClear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="searchbar-meta">
        <span className="searchbar-result-count">
          Showing{' '}
          <span className="searchbar-count-highlight">{resultCount}</span> of{' '}
          <span className="searchbar-count-total">{totalCount}</span>{' '}
          universities
        </span>
      </div>
    </div>
  );
}

export default SearchBar;
