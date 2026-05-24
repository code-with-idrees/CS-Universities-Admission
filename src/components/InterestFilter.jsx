import React from 'react';
import { interestColors } from '../data/programs';
import './InterestFilter.css';

const InterestFilter = ({ interests, selectedInterests, onToggle, onClearAll }) => {
  return (
    <div className="interest-filter">
      <div className="interest-filter__header">
        <div className="interest-filter__title">
          <span className="interest-filter__icon">🔬</span>
          <h2>Browse by Research Interest</h2>
        </div>
        {selectedInterests.size > 0 && (
          <button className="interest-filter__clear" onClick={onClearAll}>
            ✕ Clear ({selectedInterests.size})
          </button>
        )}
      </div>
      <div className="interest-filter__grid">
        {interests.map(({ name, count }) => {
          const isSelected = selectedInterests.has(name);
          const colors = interestColors[name] || { bg: 'rgba(148,163,184,0.15)', border: '#94a3b8', text: '#cbd5e1' };
          return (
            <button
              key={name}
              className={`interest-pill ${isSelected ? 'interest-pill--active' : ''}`}
              onClick={() => onToggle(name)}
              style={{
                '--pill-bg': colors.bg,
                '--pill-border': colors.border,
                '--pill-text': colors.text,
              }}
            >
              <span className="interest-pill__name">{name}</span>
              <span className="interest-pill__count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterestFilter;
