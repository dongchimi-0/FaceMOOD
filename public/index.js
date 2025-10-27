// 🎨 감정별 배경색
const emotionColors = {
  happy: "#FFE066",
  sad: "#74A4FF",
  angry: "#FF6B6B",
  surprised: "#C77DFF",
  neutral: "#C0C0C0",
};

// 🎬 명언 API (서버에서 ZenQuotes 프록시)
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

// 🎵 감정별 랜덤 음악 추천
async function getRandomSong(emotion) {
  try {
    const res = await fetch("/songs.json");
    const data = await res.json();
    const list = data[emotion] || data["neutral"];
    return list[Math.floor(Math.random() * list.length)];
  } catch (err) {
    console.error("노래 데이터 불러오기 오류:", err);
    return { title: "음악을 불러올 수 없습니다", id: "dQw4w9WgXcQ" }; // fallback 😎
  }
}

async function init() {
  const video = document.getElementById("cam");
  const emotionText = document.getElementById("emotion");
  const quoteText = document.getElementById("quote");
  const musicFrame = document.getElementById("music");

  // 📦 모델 로드
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceExpressionNet.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

  // 🎥 카메라 예외 처리 + 안내 메시지
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    emotionText.innerText = "😊 카메라 연결됨 — 표정을 인식 중...";
    quoteText.innerText = "잠시 후 감정에 맞는 음악을 추천드릴게요 🎵";
  } catch (err) {
    console.error("카메라 장치가 없습니다:", err);
    emotionText.innerText = "⚠️ 카메라를 찾을 수 없습니다.";
    quoteText.innerText = "카메라 장치를 연결한 후 다시 시도해주세요.";
    return;
  }

  // 🎯 감정 분석 루프
  video.addEventListener("play", async () => {
    setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detection) {
        emotionText.innerText = "얼굴을 인식 중이에요 👀";
        return;
      }

      // 감정 분류
      const sorted = Object.entries(detection.expressions).sort(
        (a, b) => b[1] - a[1]
      );
      const topEmotion = sorted[0][0];

      // 배경색 변경
      document.body.style.backgroundColor =
        emotionColors[topEmotion] || "#C0C0C0";

      emotionText.innerText = `지금 감정: ${topEmotion}`;

      // 🌿 명언 표시
      const quote = await getRandomQuote();
      quoteText.innerText = quote;

      // 🎵 감정별 음악 랜덤 재생
      const song = await getRandomSong(topEmotion);
      console.log(`🎶 감정: ${topEmotion}, 추천곡: ${song.title}`);
      musicFrame.src = `https://www.youtube.com/embed/${song.id}?autoplay=1`;

    }, 7000);
  });
}

init();
