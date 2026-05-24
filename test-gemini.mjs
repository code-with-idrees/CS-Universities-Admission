const API_KEY = 'AIzaSyBuhxgxt08iRWZfdhV-dXEgXuxdbLLXR7k';
const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];

for (const model of modelsToTry) {
  console.log(`\n=== Testing: ${model} ===`);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Say hello in one sentence.' }] }],
        }),
      }
    );
    const json = await res.json();
    if (res.ok) {
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '(no text)';
      console.log(`  ✅ SUCCESS! Response: ${text.trim()}`);
      break; // Stop at first success
    } else {
      console.log(`  ❌ ${res.status}: ${json?.error?.message?.substring(0, 150)}`);
    }
  } catch (e) {
    console.log(`  ❌ ERROR: ${e.message}`);
  }
}
