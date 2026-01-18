import express from "express";
import OpenAI from "openai";
import cors from "cors"
import multer from "multer";
const upload = multer();
import { extractText } from "unpdf";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";
dotenv.config();
const app = express();

const corsOption={
  origin: ["process.env.CORS_URL"],
  methods: ["GET" , "POST"],
  credentials: true

}

app.use(cors(corsOption))

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
});
app.post("/review", upload.single("resume"), async (req, res) => {
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
  console.log(feedback);

  res.json({ feedback });
});

app.listen(3055, () => console.log("API running on port 3055"));
