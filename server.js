import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🎬 ZenQuotes 명언 API
app.get("/api/quote", async (req, res) => {
  try {
    const r = await fetch("https://zenquotes.io/api/random");
    const d = await r.json();
    res.json(d[0]);
  } catch (err) {
    console.error("ZenQuotes API 오류:", err);
    res.status(500).json({
      q: "오늘은 당신이 직접 명언을 만들어보세요 🌿",
      a: "FaceMOOD",
    });
  }
});

// 🎵 YouTube API 프록시
app.get("/api/youtubeSearch", async (req, res) => {
  const key = process.env.YOUTUBE_API_KEY;
  const query = req.query.q || "healing music";
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${query}&key=${key}`;

  try {
    const r = await fetch(url);
    const d = await r.json();
    res.json(d);
  } catch (err) {
    console.error("YouTube Search API 오류:", err);
    res.status(500).json({ items: [] });
  }
});

// ⚙️ 정적 파일 절대경로로 지정
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`✅ FaceMOOD 서버 실행 중 → http://localhost:${PORT}`);
});
