// ==========================================
// 🎭 FaceMuse v3 (API Key .env + External APIs)
// ==========================================

let YOUTUBE_API_KEY = "";

async function loadAPIKey() {
  const res = await fetch("/api/key");
  const data = await res.json();
  YOUTUBE_API_KEY = data.key;
}

const emotionColors = {
  happy: "#FFE066",
  sad: "#74A4FF",
  angry: "#FF6B6B",
  surprised: "#C77DFF",
  neutral: "#C0C0C0",
};

// 🎬 명언 API (Quotable)
async function getRandomQuote(emotion) {
  const tags = {
    happy: "happiness|smile|positive",
    sad: "sad|life|pain",
    angry: "anger|control|patience",
    surprised: "inspiration|change|growth",
    neutral: "wisdom|peace|mindfulness",
  };
  try {
    const res = await fetch(
      `https://api.quotable.io/random?tags=${tags[emotion] || "life"}`
    );
    const data = await res.json();
    return `"${data.content}" — ${data.author}`;
  } catch (err) {
    console.error("명언 API 오류:", err);
    return "오늘은 당신이 직접 명언을 만들어보세요 🌿";
  }
}

// 🎵 유튜브 API
async function getRandomMusic(emotion) {
  try {
    const query = `${emotion} music playlist`;
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&maxResults=10&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await res.json();
    const videos = data.items;
    if (!videos || videos.length === 0) return null;
    const random = videos[Math.floor(Math.random() * videos.length)];
    return random.id.videoId;
  } catch (err) {
    console.error("YouTube API 오류:", err);
    return null;
  }
}

async function init() {
  await loadAPIKey(); // ✅ 서버에서 키 불러오기

  const video = document.getElementById("cam");
  const emotionText = document.getElementById("emotion");
  const quoteText = document.getElementById("quote");
  const musicFrame = document.getElementById("music");

  await faceapi.nets.tinyFaceDetector.loadFromUri(
    "https://cdn.jsdelivr.net/npm/face-api.js/models"
  );
  await faceapi.nets.faceExpressionNet.loadFromUri(
    "https://cdn.jsdelivr.net/npm/face-api.js/models"
  );

  navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
    video.srcObject = stream;
  });

  video.addEventListener("play", async () => {
    setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detection) return;
      const sorted = Object.entries(detection.expressions).sort(
        (a, b) => b[1] - a[1]
      );
      const topEmotion = sorted[0][0];

      document.body.style.backgroundColor =
        emotionColors[topEmotion] || "#C0C0C0";
      emotionText.innerText = `지금 감정: ${topEmotion}`;

      const [quote, videoId] = await Promise.all([
        getRandomQuote(topEmotion),
        getRandomMusic(topEmotion),
      ]);

      quoteText.innerText = quote;
      quoteText.classList.add("fade-in");
      if (videoId)
        musicFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }, 6000);
  });
}

init();
