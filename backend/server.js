// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const OpenAI = require("openai"); // ✅ CommonJS default export (not { OpenAI })

const app = express();

// If your Next dev runs on 3000 or 3001, either allow all or restrict as needed
app.use(cors()); // or: app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));
app.use(express.json({ limit: "1mb" }));

// (Optional) show that the key is loaded (masked)
if (process.env.OPENAI_API_KEY) {
  console.log("Loaded API key:", String(process.env.OPENAI_API_KEY).slice(0, 7) + "...");
}

// Health check
app.get("/", (_req, res) => res.send("Backend OK"));

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  console.log("POST /api/chat", req.body);

  const { message } = req.body || {};
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Field 'message' (non-empty string) is required." });
  }

  const cleanMsg = message.trim();
  const apiKey = process.env.OPENAI_API_KEY;

  // If no usable key, keep UI functional with Echo (and tell why)
  if (!apiKey || !apiKey.startsWith("sk-")) {
    return res.status(200).json({
      reply: `Echo: ${cleanMsg}`,
      error: "Missing or invalid OPENAI_API_KEY in backend/.env",
    });
  }

  try {
    const client = new OpenAI({ apiKey });

    // ✅ Modern Responses API (works with openai@^4)
    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      input: cleanMsg,
      temperature: 0.7,
    });

    // SDK 4.x helper—safe way to get the full text
    const reply =
      (resp.output_text && resp.output_text.trim()) ||
      "Sorry, I couldn’t generate a reply.";

    console.log("OpenAI reply:", reply);
    return res.status(200).json({ reply });
  } catch (err) {
    const status = err?.status || err?.response?.status || 500;
    const detail =
      err?.response?.data ||
      err?.message ||
      (typeof err === "object" ? JSON.stringify(err) : String(err));

    console.error("OpenAI error (status):", status);
    console.error("OpenAI error (detail):", detail);

    // ✅ Do not 500 the UI; return echo + debug error
    return res.status(200).json({
      reply: `Echo: ${cleanMsg}`,
      error: `OpenAI call failed (status ${status}): ${detail}`,
    });
  }
});

// Start server
const PORT = Number(process.env.PORT) || 5000; // ✅ your chosen port
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Safety logs
process.on("uncaughtException", (e) => console.error("UNCAUGHT EXCEPTION:", e));
process.on("unhandledRejection", (e) => console.error("UNHANDLED REJECTION:", e));
