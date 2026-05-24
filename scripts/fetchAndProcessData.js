import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchCsv(url) {
  const response = await fetch(url);
  const text = await response.text();
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true
  });
}

async function run() {
  console.log('Fetching data from CSrankings...');
  
  try {
    // Read local institutions file
    const institutionsPath = path.join(__dirname, '..', 'public', 'data', 'institutions.csv');
    const institutionsRaw = fs.readFileSync(institutionsPath, 'utf-8');
    const localInstitutions = parse(institutionsRaw, { columns: true, skip_empty_lines: true });

    // Fetch remote files for authors and their areas
    const csrankingsData = await fetchCsv('https://raw.githubusercontent.com/emeryberger/CSrankings/master/csrankings.csv');
    const authorData = await fetchCsv('https://raw.githubusercontent.com/emeryberger/CSrankings/master/generated-author-info.csv');

    console.log(`Read ${localInstitutions.length} local institutions.`);
    console.log(`Fetched ${csrankingsData.length} authors, ${authorData.length} author info records.`);

    // Group faculties by institution
    const institutionsMap = new Map();
    
    // Process local institutions
    localInstitutions.forEach(row => {
      const name = row.institution.trim();
      institutionsMap.set(name, {
        id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: name,
        region: row.region ? row.region.trim() : 'Unknown',
        country: row.countryabbrv ? row.countryabbrv.trim() : 'Unknown',
        homepage: row.homepage ? row.homepage.trim() : '',
        faculties: []
      });
    });

    // Group author areas by name for O(1) lookup
    const authorAreasMap = new Map();
    authorData.forEach(a => {
      if (!authorAreasMap.has(a.name)) {
        authorAreasMap.set(a.name, new Set());
      }
      authorAreasMap.get(a.name).add(a.area);
    });

    // Map authors to institutions
    csrankingsData.forEach(row => {
      const instName = row.affiliation.trim();
      if (!institutionsMap.has(instName)) {
        institutionsMap.set(instName, {
          id: instName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: instName,
          region: 'Unknown',
          country: 'Unknown',
          homepage: '',
          faculties: []
        });
      }
      const inst = institutionsMap.get(instName);
      
      // Find author areas
      const areasSet = authorAreasMap.get(row.name);
      const areas = areasSet ? Array.from(areasSet) : [];

      inst.faculties.push({
        name: row.name,
        homepage: row.homepage,
        scholarid: row.scholarid,
        areas: areas
      });
    });

    const finalData = Array.from(institutionsMap.values())
      // .filter(inst => inst.faculties.length > 0) // Keep all, even with 0 parsed faculties
      .sort((a, b) => b.faculties.length - a.faculties.length);

    const outPath = path.join(__dirname, '..', 'public', 'data', 'processed-universities.json');
    fs.writeFileSync(outPath, JSON.stringify(finalData, null, 2));
    
    console.log(`Successfully processed ${finalData.length} universities and saved to ${outPath}`);
  } catch (err) {
    console.error('Error fetching or processing data:', err);
  }
}

run();
