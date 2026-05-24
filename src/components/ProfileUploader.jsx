import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set up pdfjs worker using local import (solves CDN and path issues)
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const conferenceToCategory = {
  nips: 'Artificial Intelligence', icml: 'Artificial Intelligence', aaai: 'Artificial Intelligence', ijcai: 'Artificial Intelligence', cvpr: 'Artificial Intelligence', iccv: 'Artificial Intelligence', eccv: 'Artificial Intelligence', icra: 'Artificial Intelligence', iros: 'Artificial Intelligence', iclr: 'Artificial Intelligence', neurips: 'Artificial Intelligence', chex: 'Artificial Intelligence',
  osdi: 'Systems', sosp: 'Systems', usenix: 'Systems', nsdi: 'Systems', eurosys: 'Systems', sos: 'Systems',
  ndss: 'Security', ccs: 'Security', ieee: 'Security',
  stoc: 'Theory', focs: 'Theory', soda: 'Theory'
};

const stopwords = new Set(['the','and','of','in','to','a','for','with','on','by','an','is','are','this','that','as','from','at','be','or']);

const extractKeywords = (text) => {
  if (!text) return [];
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const freq = {};
  for (const w of words) {
    if (stopwords.has(w) || w.length < 3) continue;
    freq[w] = (freq[w] || 0) + 1;
  }
  return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,30).map(e=>e[0]);
};

const ProfileUploader = ({ universities, onRecommend }) => {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('masters');

  const handleFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    
    try {
      if (f.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await f.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(' ') + '\n';
        }
        setText(fullText);
      } else {
        const txt = await f.text();
        setText(txt);
      }
    } catch (err) {
      console.error('Failed to read file', err);
      setError('Failed to extract text from file.');
    }
  };

  const handleRecommend = async () => {
    if (!text) {
      setError('Please provide some resume text first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults(null);
    onRecommend(null); // Clear previous recommendations in App.jsx if any

    try {
      // 1. Pre-filter the universities to avoid hitting payload size limits
      const keywords = extractKeywords(text);
      const mapped = new Set();
      const keyStr = keywords.join(' ');
      const keyChecks = ['ai','machine','learning','nlp','vision','robot','robotics','systems','network','security','crypto','algorithm','theory','database','data','hci','graphics','bio','bioinformatics'];
      for (const k of keyChecks) if (keyStr.includes(k)) mapped.add(k);

      const scores = universities.map(u => {
        let score = 0;
        const matches = [];
        for (const f of (u.faculties||[])) {
          const areas = (f.areas||[]).map(a=>a.toLowerCase());
          for (const a of areas) {
            const cat = conferenceToCategory[a];
            if (cat) {
              for (const k of mapped) {
                if (cat.toLowerCase().includes(k) || k.includes(cat.toLowerCase())) {
                  score += 1;
                  matches.push(f);
                  break;
                }
              }
            }
          }
        }
        if (keyStr.includes('research') || keyStr.includes('professor')) score += (u.faculties||[]).length > 0 ? 1 : 0;
        return { name: u.name, region: u.region, country: u.country, score, faculties: Array.from(new Set(matches)).slice(0, 10) };
      });

      // Send the top 15 candidates
      const candidateUniversities = scores.sort((a,b) => b.score - a.score).slice(0, 15);

      // 2. Send to our local backend /recommend-profile
      const res = await fetch('/recommend-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, candidateUniversities })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to fetch recommendations from AI');
      }

      const jsonString = await res.text();
      let aiResponse;
      try {
        aiResponse = JSON.parse(jsonString);
      } catch (e) {
        throw new Error('AI returned an invalid JSON response.');
      }

      setResults(aiResponse);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid #333' }}>
      <h3>Resume Matcher</h3>
      <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1rem' }}>Upload your resume (PDF or TXT) to get AI-powered university and professor recommendations based on your interests.</p>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <input type="file" accept=".txt,.pdf" onChange={handleFile} style={{ marginBottom: '0.5rem' }} />
          <textarea 
            placeholder="Extracted resume text will appear here..." 
            value={text} 
            onChange={(e)=>setText(e.target.value)} 
            style={{ width: '100%', height: 120, padding: '0.5rem', borderRadius: 4, background: '#111', color: '#eee', border: '1px solid #444' }} 
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '0 0 auto' }}>
          <button 
            onClick={handleRecommend} 
            disabled={isLoading || !text}
            style={{ 
              background: 'var(--color-primary)', 
              color: '#fff', 
              padding: '0.6rem 1.2rem', 
              borderRadius: 8, 
              cursor: isLoading || !text ? 'not-allowed' : 'pointer',
              opacity: isLoading || !text ? 0.7 : 1,
              fontWeight: 'bold'
            }}
          >
            {isLoading ? 'Analyzing Profile...' : 'Recommend Matches'}
          </button>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{fileName || 'No file selected'}</div>
          {error && <div style={{ color: '#ff6b6b', fontSize: '0.85rem', maxWidth: 200 }}>{error}</div>}
        </div>
      </div>

      {results && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #444', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              onClick={() => setActiveTab('masters')}
              style={{
                padding: '0.5rem 1rem',
                background: activeTab === 'masters' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'masters' ? '#fff' : '#aaa',
                border: `1px solid ${activeTab === 'masters' ? 'var(--color-primary)' : '#444'}`,
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Masters Programs
            </button>
            <button 
              onClick={() => setActiveTab('phd')}
              style={{
                padding: '0.5rem 1rem',
                background: activeTab === 'phd' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'phd' ? '#fff' : '#aaa',
                border: `1px solid ${activeTab === 'phd' ? 'var(--color-primary)' : '#444'}`,
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              PhD Programs
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results[activeTab]?.length > 0 ? (
              results[activeTab].map((rec, idx) => (
                <div key={idx} style={{ background: '#1a1a1a', padding: '1rem', borderRadius: 8, borderLeft: '4px solid var(--color-primary)' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>{rec.university}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#ccc', margin: '0 0 0.5rem 0' }}>
                    <strong>Why it's a good fit:</strong> {rec.reason}
                  </p>
                  <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
                    <strong>Recommended Professors:</strong>
                    <ul style={{ margin: '0.3rem 0 0 0', paddingLeft: '1.2rem' }}>
                      {rec.professors?.map((prof, pIdx) => <li key={pIdx}>{prof}</li>)}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#aaa' }}>No specific recommendations found for this level.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUploader;
