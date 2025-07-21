// gemini.js
export async function askGemini(prompt) {
  const response = await fetch("/ask-gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();
  return data.text;
}
