import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static("public"));

// 🧘 ZenQuotes API 프록시
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ FaceMuse 서버 실행 중 → http://0.0.0.0:${PORT}`);
});

