# 🎭 FaceMOOD — 감정 인식 기반 음악·명언 추천 웹앱

> **“당신의 표정이 들려주는 이야기를 음악과 명언으로 전합니다.”**

---

## 🌈 프로젝트 개요

**FaceMuse**는 웹캠을 통해 사용자의 얼굴 표정을 인식하고,  
해당 감정에 맞는 **YouTube 음악**과 **명언(ZenQuotes)** 을 실시간으로 추천하는  
**AI 감정 기반 인터랙티브 웹앱**입니다.

---

## 🚀 주요 기능

| 기능 | 설명 |
|------|------|
| 😊 감정 인식 | `face-api.js`의 TinyFaceDetector 모델을 이용해 표정으로 감정을 분류 |
| 🎨 감정별 UI 반응 | 감정에 따라 배경 색상이 자동 변경 (`행복 → 노랑`, `슬픔 → 파랑` 등) |
| 🧘 명언 추천 | ZenQuotes API를 이용해 감정에 맞는 명언을 자동 표시 |
| 🎵 음악 추천 | 감정에 따라 YouTube에서 관련 플레이리스트를 랜덤 재생 |
| ⚙️ 카메라 예외 처리 | 캠이 없을 경우 오류 없이 안내문 출력 |
| ☁️ Render 배포 | Node.js 서버 기반 자동 빌드/배포 지원 |

---

## 🧠 기술 스택

| 분류 | 사용 기술 |
|------|------------|
| **Frontend** | HTML, CSS, JavaScript, TensorFlow.js, face-api.js |
| **Backend** | Node.js (Express, CORS, node-fetch) |
| **API** | ZenQuotes API, YouTube Embed |
| **AI 모델** | TinyFaceDetector, FaceExpressionNet, FaceLandmark68 |
| **배포** | Render Web Service |
| **버전 관리** | GitHub (main 브랜치 자동 배포) |

---

## 🧩 시스템 구조

