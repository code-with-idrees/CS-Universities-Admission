import React, { useState } from 'react';
import { fetchAdmissionInsights } from '../services/geminiService';

const UniversityCard = ({ u, isExpanded, onToggleExpand }) => {
  const [insightData, setInsightData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAskGemini = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchAdmissionInsights(u.name);
    
    if (result.error) {
      setError(result.error);
    } else {
      setInsightData(result.data);
    }
    setIsLoading(false);
  };

  return (
    <div className={`card ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={onToggleExpand}>
        <div>
          <h3>{u.name}</h3>
          <p><strong>Region:</strong> {u.region}</p>
          <p><strong>Country:</strong> {u.country}</p>
          <p><a href={u.homepage} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Visit Homepage ↗</a></p>
          <p style={{ marginTop: '0.5rem', color: '#fff' }}><strong>Faculty count:</strong> {u.faculties?.length || 0}</p>
        </div>
        <button className="expand-btn">
          {isExpanded ? '⯅ Hide Details' : '⯆ View Faculty & Admission Details'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="details-section">
          <hr />
          <h4>Graduate Admission Insights (AI Generated)</h4>
          <div className="insight-box">
            {insightData ? (
              <div dangerouslySetInnerHTML={{ __html: insightData }} />
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

          <h4>Faculty & Research Areas (from CSrankings)</h4>
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

const UniversityList = ({ universities }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!universities || universities.length === 0) {
    return <p>No universities match the selected filters.</p>;
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
        />
      ))}
    </div>
  );
};

export default UniversityList;
