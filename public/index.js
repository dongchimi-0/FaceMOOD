// 🚀 초기화
async function init() {
  const video = document.getElementById("cam");
  const emotionText = document.getElementById("emotion");
  const quoteText = document.getElementById("quote");
  const musicFrame = document.getElementById("music");

  // ✅ 모델 완전 로드 후 실행 (await Promise.all)
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  ]);

  console.log("✅ 모든 모델 로드 완료!");

  // ✅ 카메라 접근 (전면 카메라 포함)
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });
    video.srcObject = stream;
    emotionText.innerText = "😊 카메라 연결됨 — 표정을 인식 중...";
  } catch {
    emotionText.innerText = "⚠️ 카메라를 찾을 수 없습니다.";
    quoteText.innerText = "카메라 장치를 연결한 후 다시 시도해주세요.";
    return;
  }

  // ✅ 영상이 실제 재생될 때만 감정 탐지 시작
  video.addEventListener("play", async () => {
    console.log("🎥 감정 인식 시작...");
    setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detection) {
        emotionText.innerText = "얼굴을 인식 중이에요 👀";
        return;
      }

      const sorted = Object.entries(detection.expressions).sort(
        (a, b) => b[1] - a[1]
      );
      const topEmotion = sorted[0][0];

      document.body.style.backgroundColor =
        emotionColors[topEmotion] || "#C0C0C0";
      emotionText.innerText = `지금 감정: ${topEmotion}`;

      quoteText.innerText = await getRandomQuote();
      const song = await getRandomSong(topEmotion);
      musicFrame.src = `https://www.youtube.com/embed/${song.id}?autoplay=1`;
    }, 7000);
  });

  // ✅ 페이지 닫을 때 카메라 종료
  window.addEventListener("beforeunload", () => {
    const tracks = video.srcObject?.getTracks();
    tracks?.forEach((t) => t.stop());
  });
}

init();
