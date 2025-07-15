// js/gemini.js
export async function askGemini(prompt) {
  const GEMINI_KEY = AIzaSyBxSb1E2_0eWY6FkL6A4Km2B4T_d9dCWnc;
  const res = await fetch('/gemini', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const json = await res.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}
