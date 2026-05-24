import React from 'react';

const UniversityList = ({ universities }) => {
  if (!universities || universities.length === 0) {
    return <p>No universities match the selected filters.</p>;
  }

  return (
    <div className="grid">
      {universities.map((u, idx) => (
        <div key={idx} className="card">
          <h3>{u.institution}</h3>
          <p><strong>Region:</strong> {u.region}</p>
          <p><strong>Country:</strong> {u.countryabbrv}</p>
          <p><a href={u.homepage} target="_blank" rel="noopener noreferrer">Visit Homepage ↗</a></p>
        </div>
      ))}
    </div>
  );
};

export default UniversityList;
