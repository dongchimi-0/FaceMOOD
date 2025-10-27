// ============================================
// 🎭 FaceMuse - Express 서버 (YouTube + Quotes API)
// ============================================
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("public")); // 정적파일(index.html, JS, CSS 등)

// 🎬 ZenQuotes 명언 API
app.get("/api/quote", async (req, res) => {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    res.json(data[0]);
  } catch (err) {
    console.error("ZenQuotes API 오류:", err);
    res.status(500).json({ q: "명언을 불러오지 못했습니다.", a: "FaceMuse" });
  }
});

// 🎵 YouTube Search API 프록시
app.get("/api/youtubeSearch", async (req, res) => {
  const key = process.env.YOUTUBE_API_KEY;
  const query = req.query.q;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${query}&key=${key}`;

  try {
    const r = await fetch(url);
    const d = await r.json();
    res.json(d);
  } catch (err) {
    console.error("YouTube Search API 오류:", err);
    res.status(500).json({ items: [] });
  }
});

app.listen(PORT, () => {
  console.log(`✅ FaceMuse 서버 실행 중 → http://localhost:${PORT}`);
});
