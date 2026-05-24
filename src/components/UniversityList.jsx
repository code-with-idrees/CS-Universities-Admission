import React, { useState, useMemo } from 'react';
import { fetchAdmissionInsights } from '../services/groqService';
import { countryNames, countryFlags, areaToInterest, interestColors } from '../data/programs';

const InterestTag = ({ interest }) => {
  const colors = interestColors[interest] || { bg: 'rgba(148,163,184,0.15)', border: '#94a3b8', text: '#cbd5e1' };
  return (
    <span
      className="interest-tag"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
    >
      {interest}
    </span>
  );
};

const UniversityCard = ({ u, isExpanded, onToggleExpand, selectedInterests }) => {
  const [insightData, setInsightData] = useState(null);
  const [insightSource, setInsightSource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Compute the interests for this university
  const uniInterests = useMemo(() => {
    const interests = new Set();
    (u.faculties || []).forEach((f) => {
      (f.areas || []).forEach((area) => {
        const interest = areaToInterest[area.toLowerCase()];
        if (interest) interests.add(interest);
      });
    });
    return Array.from(interests).sort();
  }, [u]);

  // Get professors matching selected interests
  const matchedProfessors = useMemo(() => {
    if (selectedInterests.size === 0) return [];
    return (u.faculties || []).filter((f) => {
      return (f.areas || []).some((area) => {
        const interest = areaToInterest[area.toLowerCase()];
        return interest && selectedInterests.has(interest);
      });
    });
  }, [u, selectedInterests]);

  const handleAskGemini = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchAdmissionInsights(u.name);
    
    if (result.error) {
      setError(result.error);
    } else {
      setInsightData(result.data);
      setInsightSource(result.source || 'gemini');
    }
    setIsLoading(false);
  };

  const flag = countryFlags[u.country] || '';
  const countryDisplay = countryNames[u.country] || u.country || '';

  return (
    <div className={`card ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={onToggleExpand}>
        <div>
          <h3>{u.name}</h3>
          <p>
            <span className="country-badge">
              {flag && <span className="country-flag">{flag}</span>}
              <span className="country-name">{countryDisplay}</span>
            </span>
            <span className="region-badge">{u.region}</span>
          </p>
          <p>
            <a href={u.homepage} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              Visit Homepage ↗
            </a>
          </p>
          <p className="faculty-count-line">
            <strong>{u.faculties?.length || 0}</strong> Faculty Members
          </p>

          {/* Interest tags */}
          {uniInterests.length > 0 && (
            <div className="interest-tags">
              {uniInterests.slice(0, isExpanded ? undefined : 5).map((interest) => (
                <InterestTag key={interest} interest={interest} />
              ))}
              {!isExpanded && uniInterests.length > 5 && (
                <span className="interest-tag interest-tag--more">+{uniInterests.length - 5} more</span>
              )}
            </div>
          )}

          {/* Matched professors summary */}
          {selectedInterests.size > 0 && matchedProfessors.length > 0 && !isExpanded && (
            <div className="matched-badge">
              ✨ {matchedProfessors.length} matching professor{matchedProfessors.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        <button className="expand-btn">
          {isExpanded ? '⯅ Hide Details' : '⯆ View Faculty & Admission Details'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="details-section">
          <hr />

          {/* Matched Professors Section (when interest is selected) */}
          {selectedInterests.size > 0 && matchedProfessors.length > 0 && (
            <>
              <h4 className="section-heading section-heading--highlight">
                ✨ Professors Matching Your Interests ({matchedProfessors.length})
              </h4>
              <div className="faculty-list faculty-list--highlighted">
                {matchedProfessors.map((faculty, fIdx) => (
                  <div key={fIdx} className="faculty-item faculty-item--matched">
                    <a href={faculty.homepage || '#'} target="_blank" rel="noopener noreferrer">
                      <strong>{faculty.name}</strong>
                    </a>
                    {faculty.areas && faculty.areas.length > 0 && (
                      <div className="faculty-areas">
                        {faculty.areas.map((area) => {
                          const interest = areaToInterest[area.toLowerCase()];
                          const isMatched = interest && selectedInterests.has(interest);
                          return (
                            <span
                              key={area}
                              className={`faculty-area-tag ${isMatched ? 'faculty-area-tag--matched' : ''}`}
                            >
                              {interest || area}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <h4 className="section-heading">Graduate Admission Insights (AI Generated)</h4>
          <div className="insight-box">
            {insightData ? (
              <>
                {insightSource === 'sample' && (
                  <div style={{ background: '#2a2a2a', padding: '0.5rem', borderRadius: 6, marginBottom: '0.5rem', color: '#ddd' }}>
                    Sample response (local fallback). To enable live responses set VITE_GEMINI_API_KEY in .env.
                  </div>
                )}
                <div dangerouslySetInnerHTML={{ __html: insightData }} />
              </>
            ) : (
              <>
                <p style={{ color: '#aaa', marginBottom: '1rem' }}>
                  Click below to dynamically fetch real admission requirements (Degree Programs, GRE, TOEFL, GPA) using Gemini AI.
                </p>
                {error && <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>{error}</p>}
                <button 
                  className="gemini-btn" 
                  onClick={handleAskGemini}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating Insights...' : `Ask Gemini for Specifics for ${u.name}`}
                </button>
              </>
            )}
          </div>

          <h4 className="section-heading">All Faculty & Research Areas (from CSrankings)</h4>
          <div className="faculty-list">
            {u.faculties && u.faculties.length > 0 ? (
              u.faculties.map((faculty, fIdx) => (
                <div key={fIdx} className="faculty-item">
                  <a href={faculty.homepage || '#'} target="_blank" rel="noopener noreferrer"><strong>{faculty.name}</strong></a>
                  {faculty.areas && faculty.areas.length > 0 && (
                    <div className="faculty-areas">{faculty.areas.join(', ')}</div>
                  )}
                </div>
              ))
            ) : (
              <p>No faculty data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const UniversityList = ({ universities, selectedInterests = new Set() }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!universities || universities.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">🔍</div>
        <h3>No universities match your filters</h3>
        <p>Try adjusting your region, country, or interest filters to see more results.</p>
      </div>
    );
  }

  const toggleExpand = (idx) => {
    setExpandedId(expandedId === idx ? null : idx);
  };

  return (
    <div className="grid">
      {universities.map((u, idx) => (
        <UniversityCard 
          key={idx} 
          u={u} 
          isExpanded={expandedId === idx} 
          onToggleExpand={() => toggleExpand(idx)}
          selectedInterests={selectedInterests}
        />
      ))}
    </div>
  );
};

export default UniversityList;
