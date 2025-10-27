const emotionColors = {
  happy: "#FFE066",
  sad: "#74A4FF",
  angry: "#FF6B6B",
  surprised: "#C77DFF",
  neutral: "#C0C0C0",
};

// 🎬 ZenQuotes 명언 API
async function getRandomQuote() {
  try {
    const res = await fetch("/api/quote");
    const data = await res.json();
    return `"${data.q}" — ${data.a}`;
  } catch (err) {
    console.error("명언 API 오류:", err);
    return "오늘은 당신이 직접 명언을 만들어보세요 🌿";
  }
}

async function init() {
  const video = document.getElementById("cam");
  const emotionText = document.getElementById("emotion");
  const quoteText = document.getElementById("quote");
  const musicFrame = document.getElementById("music");

  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

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

      const quote = await getRandomQuote();
      quoteText.innerText = quote;

      // 🎵 감정별 음악
      const mood = {
        happy: "happy music playlist",
        sad: "sad music playlist",
        angry: "calm piano music",
        surprised: "inspiring soundtrack",
        neutral: "relaxing background music",
      }[topEmotion];

      musicFrame.src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
        mood
      )}&autoplay=1`;
    }, 7000);
  });
}

init();
