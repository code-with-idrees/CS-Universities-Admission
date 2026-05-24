import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Check,
  Globe,
  GraduationCap,
  Filter,
} from 'lucide-react';
import { programCategories, regions, degreeTypes } from '../data/programs';
import './Sidebar.css';

function Sidebar({
  selectedAreas,
  onToggleArea,
  selectedRegion,
  onRegionChange,
  selectedDegree,
  onDegreeChange,
}) {
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initial = {};
    programCategories.forEach((cat) => {
      initial[cat.id] = true;
    });
    return initial;
  });

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleSelectAll = (category) => {
    const allSelected = category.areas.every((area) =>
      selectedAreas.has(area.id)
    );
    category.areas.forEach((area) => {
      if (allSelected) {
        if (selectedAreas.has(area.id)) onToggleArea(area.id);
      } else {
        if (!selectedAreas.has(area.id)) onToggleArea(area.id);
      }
    });
  };

  const totalSelectedCount = selectedAreas.size;

  const totalAreasCount = useMemo(
    () => programCategories.reduce((sum, cat) => sum + cat.areas.length, 0),
    []
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        {/* Header */}
        <div className="sidebar-header">
          <Filter size={18} className="sidebar-header-icon" />
          <h2 className="sidebar-title">Filters</h2>
        </div>

        {/* Region Pills */}
        <section className="sidebar-section">
          <div className="section-label">
            <Globe size={14} className="section-label-icon" />
            <span>Region</span>
          </div>
          <div className="region-pills">
            {regions.map((region) => (
              <button
                key={region.id}
                className={`region-pill${
                  selectedRegion === region.id ? ' region-pill--active' : ''
                }`}
                onClick={() => onRegionChange(region.id)}
                title={region.label}
              >
                {region.label}
              </button>
            ))}
          </div>
        </section>

        {/* Degree Toggle */}
        <section className="sidebar-section">
          <div className="section-label">
            <GraduationCap size={14} className="section-label-icon" />
            <span>Degree</span>
          </div>
          <div className="degree-toggles">
            {degreeTypes.map((degree) => (
              <button
                key={degree.id}
                className={`degree-toggle${
                  selectedDegree === degree.id ? ' degree-toggle--active' : ''
                }`}
                onClick={() => onDegreeChange(degree.id)}
              >
                {degree.label}
              </button>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="sidebar-divider" />

        {/* Category Sections */}
        <div className="categories-container">
          {programCategories.map((category) => {
            const isExpanded = expandedCategories[category.id];
            const selectedInCategory = category.areas.filter((a) =>
              selectedAreas.has(a.id)
            ).length;
            const allSelected = selectedInCategory === category.areas.length;
            const someSelected =
              selectedInCategory > 0 && !allSelected;

            return (
              <section key={category.id} className="category-section">
                <div className="category-header">
                  <button
                    className="category-toggle"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} className="chevron-icon" />
                    ) : (
                      <ChevronRight size={16} className="chevron-icon" />
                    )}
                    <span className="category-name">{category.label}</span>
                    <span
                      className={`category-count-badge${
                        selectedInCategory > 0
                          ? ' category-count-badge--active'
                          : ''
                      }`}
                    >
                      {selectedInCategory}/{category.areas.length}
                    </span>
                  </button>
                  <button
                    className={`select-all-btn${
                      allSelected ? ' select-all-btn--clear' : ''
                    }`}
                    onClick={() => handleSelectAll(category)}
                    title={allSelected ? 'Clear all' : 'Select all'}
                  >
                    {allSelected ? 'Clear' : 'All'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="category-areas">
                    {category.areas.map((area) => {
                      const isChecked = selectedAreas.has(area.id);
                      return (
                        <label
                          key={area.id}
                          className={`area-item${
                            isChecked ? ' area-item--checked' : ''
                          }`}
                        >
                          <button
                            className={`custom-checkbox${
                              isChecked ? ' custom-checkbox--checked' : ''
                            }`}
                            onClick={() => onToggleArea(area.id)}
                            role="checkbox"
                            aria-checked={isChecked}
                            aria-label={area.label}
                          >
                            {isChecked && (
                              <Check size={12} className="check-icon" />
                            )}
                          </button>
                          <span
                            className="area-label"
                            onClick={() => onToggleArea(area.id)}
                          >
                            {area.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="sidebar-divider" />
        <div className="sidebar-stats">
          <div className="stats-row">
            <span className="stats-label">Selected Areas</span>
            <span className="stats-value">
              {totalSelectedCount}
              <span className="stats-total"> / {totalAreasCount}</span>
            </span>
          </div>
          <div className="stats-bar">
            <div
              className="stats-bar-fill"
              style={{
                width:
                  totalAreasCount > 0
                    ? `${(totalSelectedCount / totalAreasCount) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
