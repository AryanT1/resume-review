import express from "express";
import OpenAI from "openai";
import cors from "cors"
import multer from "multer";
const upload = multer();
import { extractText } from "unpdf";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOption={
  origin: ["process.env.CORS_URL"],
  methods: ["GET" , "POST"],
  credentials: true

}
const PORT = process.env.PORT || 3000

app.use(cors(corsOption))

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});
app.post("/api/review", upload.single("resume"), async (req, res) => {
  const buffer = req.file?.buffer;
if (!buffer) {
  return res.status(400).json({ error: "No file uploaded" });
}

const uint8Array = new Uint8Array(buffer);

const extracted = await extractText(uint8Array);
  const resumeText = extracted.text.join("\n");
  const Promt = `Review this resume and provide feedback for improvement: ${resumeText}`;
  const response = await openai.chat.completions.create({
    model: "openai/gpt-4o",
    messages: [{ role: "user", content: Promt }],
  });
  const feedback = response.choices[0]?.message.content ?? "";

  res.json({ feedback });
});

app.listen(PORT, () => console.log(`API running on port ${PORT} `));
