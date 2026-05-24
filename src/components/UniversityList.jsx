import React, { useState } from 'react';

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
      {universities.map((u, idx) => {
        const isExpanded = expandedId === idx;
        return (
          <div key={idx} className={`card ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleExpand(idx)}>
            <h3>{u.name}</h3>
            <p><strong>Region:</strong> {u.region}</p>
            <p><strong>Country:</strong> {u.country}</p>
            <p><a href={u.homepage} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Visit Homepage ↗</a></p>
            <p><strong>Faculty count:</strong> {u.faculties?.length || 0}</p>
            
            {isExpanded && (
              <div className="details-section" onClick={(e) => e.stopPropagation()}>
                <hr />
                <h4>Graduate Admission Insights (AI Generated)</h4>
                <div className="insight-box">
                  <p><strong>Degree Programs:</strong> Master of Science in CS, PhD in Computer Science, Data Science, AI.</p>
                  <p><strong>Typical Requirements:</strong></p>
                  <ul>
                    <li><strong>GRE:</strong> Typically required (Quant &gt; 165 for top programs)</li>
                    <li><strong>TOEFL/IELTS:</strong> TOEFL &gt; 100 or IELTS &gt; 7.5</li>
                    <li><strong>GPA:</strong> 3.5+ out of 4.0</li>
                  </ul>
                  <button className="gemini-btn">Ask Gemini for Specifics</button>
                </div>

                <h4>Faculty & Research Areas</h4>
                <div className="faculty-list">
                  {u.faculties && u.faculties.length > 0 ? (
                    u.faculties.slice(0, 20).map((faculty, fIdx) => (
                      <div key={fIdx} className="faculty-item">
                        <a href={faculty.homepage || '#'} target="_blank" rel="noopener noreferrer">{faculty.name}</a>
                        {faculty.areas && faculty.areas.length > 0 && (
                          <span className="faculty-areas"> ({faculty.areas.join(', ')})</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No faculty data available.</p>
                  )}
                  {u.faculties && u.faculties.length > 20 && (
                    <p>...and {u.faculties.length - 20} more faculties.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UniversityList;
