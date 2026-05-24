const sampleHtml = (name) => `
<div style="line-height: 1.6;">
  <p style="font-size: 1.05rem; margin-bottom: 12px;"><strong>Graduate Admission Requirements for ${name}</strong></p>
  
  <h4 style="margin: 12px 0 8px 0; color: #1976d2;">Degree Programs</h4>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li>MS in Computer Science (1-2 years)</li>
    <li>PhD in Computer Science (4-6 years)</li>
    <li>MS in Data Science / Artificial Intelligence</li>
  </ul>

  <h4 style="margin: 12px 0 8px 0; color: #1976d2;">GRE Requirement</h4>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li><strong>Status:</strong> Often optional or waived for recent cycles</li>
    <li><strong>Competitive Scores:</strong> Quantitative 165+, Verbal 155+ (170 scale)</li>
  </ul>

  <h4 style="margin: 12px 0 8px 0; color: #1976d2;">English Proficiency (International)</h4>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li><strong>TOEFL:</strong> 90-110 (Waivers available for some cases)</li>
    <li><strong>IELTS:</strong> 6.5-7.5</li>
  </ul>

  <h4 style="margin: 12px 0 8px 0; color: #1976d2;">GPA Expectation</h4>
  <ul style="margin: 8px 0; padding-left: 24px;">
    <li><strong>Competitive Range:</strong> 3.3 - 3.8 (4.0 scale)</li>
    <li><strong>Top Programs:</strong> 3.6+</li>
  </ul>

  <p style="color: #f57c00; font-size: 0.9rem; margin-top: 16px; border-left: 3px solid #f57c00; padding-left: 10px;">
    <strong>Note:</strong> This is a sample template. For live AI‑powered responses, set VITE_GEMINI_API_KEY in .env.
  </p>
</div>`;

/**
 * Fetch admission insights via the backend /generate route which proxies to Gemini.
 * If the Gemini API key is not set and fallback is disabled, an error object is returned.
 */
export const fetchAdmissionInsights = async (universityName) => {
  // The frontend always POSTs to /generate – the Vite middleware handles the Gemini request.
  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ universityName })
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody?.error || `Server error ${response.status}`);
    }

    const result = await response.json();
    return { data: result.data || "", source: "gemini" };
  } catch (err) {
    console.error("Gemini request failed:", err);
    // Fallback to sample if allowed
    const allowFallback = import.meta.env.VITE_GEMINI_ALLOW_FALLBACK === "true";
    if (allowFallback) {
      return { data: sampleHtml(universityName), source: "sample" };
    }
    return { error: "Gemini API call failed. Verify VITE_GEMINI_API_KEY in .env and restart npm run dev" };
  }
};
