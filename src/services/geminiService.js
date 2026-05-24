import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

try {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
} catch (e) {
  console.warn("Gemini API key is not set or accessible.");
}

export const fetchAdmissionInsights = async (universityName) => {
  if (!genAI) {
    return {
      error: "Please set your VITE_GEMINI_API_KEY in the .env file to view real insights."
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Provide the typical Graduate Computer Science admission requirements for ${universityName}. 
Include:
1. Degree Programs offered (e.g., MS in CS, PhD, Data Science)
2. GRE Requirements (e.g., typically required, optional, specific scores)
3. English Proficiency (TOEFL/IELTS minimums)
4. GPA expectations
Format the response using simple HTML tags like <ul>, <li>, and <strong> so it can be safely injected into a React dangerouslySetInnerHTML div. Do not use markdown syntax like **, use HTML tags. Keep it concise.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { data: response.text() };
  } catch (err) {
    console.error("Error fetching Gemini insights:", err);
    return { error: "Failed to load admission insights from Gemini API. " + err.message };
  }
};
