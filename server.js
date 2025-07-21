// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();
const app = express();
const port = 3000;

// Needed to serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (like index.html, js/, css/, etc.)
app.use(express.static(path.join(__dirname)));

// Route to serve index.html on "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Gemini API proxy route
app.post("/ask-gemini", async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent(req.body.prompt);
    const response = await result.response;
    res.json({ text: response.text() });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Gemini API failed." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
