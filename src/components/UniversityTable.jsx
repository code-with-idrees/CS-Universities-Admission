// src/components/UniversityTable.jsx
import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const UniversityTable = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/institutions_csrankings.csv")
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
        setData(parsed.data);
      });
  }, []);

  const filteredData = data.filter((row) => {
    if (filter === "all") return true;
    return row.region === filter;
  });

  const regions = ["all", ...new Set(data.map((r) => r.region))];

  return (
    <div className="university-table">
      <div className="filter-bar">
        <label htmlFor="region-select">Region:</label>
        <select
          id="region-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>University</th>
            <th>Region</th>
            <th>Country</th>
            <th>Homepage</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx}>
              <td>{row.institution}</td>
              <td>{row.region}</td>
              <td>{row.countryabbrv}</td>
              <td>
                <a href={row.homepage} target="_blank" rel="noopener noreferrer">
                  link
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UniversityTable;
