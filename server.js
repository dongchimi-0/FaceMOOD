// ===========================================
// 🎭 FaceMuse - Node.js Express Server
// ===========================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // .env 파일 읽기

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("public")); // HTML/CSS/JS 제공

// 🔐 유튜브 API 키를 프런트엔드에 전달
app.get("/api/key", (req, res) => {
  res.json({ key: process.env.YOUTUBE_API_KEY });
});

app.listen(PORT, () => {
  console.log(`✅ FaceMuse 서버 실행 중 → http://localhost:${PORT}`);
});
