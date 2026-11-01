<div align="center">

# ⚡ StuTu-APP · EEE Department Portal
### Smart Mobile, Desktop & Web Academic Management Hub
**Sri Ramakrishna Engineering College (SREC) · Department of Electrical & Electronics Engineering**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)
[![React](https://img.shields.io/badge/React-19.2.7-61dafb.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646cff.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.4.1-119eff.svg?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Electron](https://img.shields.io/badge/Electron-43.1.0-47848F.svg?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Database](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

<br/>

<a href="https://github.com/Surya-Narayanan-K-S/StuTu-APP/raw/main/public/EEE-SREC-Portal.apk">
  <img src="https://img.shields.io/badge/📥_Download_Android_APK-Direct_Download_(30MB)-0052cc?style=for-the-badge&logo=android&logoColor=white" height="42" alt="Download APK" />
</a>

<br/><br/>

</div>

---

## 📱 Direct Android Installation (.APK)

You can download and install the native Android APK directly on any Android smartphone:

- 🚀 **Direct Download Link**: [**Download EEE-SREC-Portal.apk**](https://github.com/Surya-Narayanan-K-S/StuTu-APP/raw/main/public/EEE-SREC-Portal.apk)
- **File Size**: ~30 MB
- **Target OS**: Android 8.0 (Oreo) through Android 15+
- **Offline Capable**: Fully functional offline with automated local storage caching and state persistence.

---

## 🌟 Key Application Features

### 🎓 1. Academic Hub
- **CGPA & Grade Calculator**: Real-time SGPA calculation, semester grade radars, and cumulative CGPA projections.
- **Interactive Timetable**: Dynamic daily period schedules filtered by semester with faculty associations.
- **Official Academic Calendar**: Anna University milestone calendar with integrated CIA-1, CIA-2, practicals, and holiday schedules.
- **NPTEL & MOOC Tracker**: Registration tracking for SWAYAM / NPTEL certifications and exam deadlines.
- **Curriculum & Syllabus Explorer**: Comprehensive regulation course outlines and credit breakdowns.

### ⚡ 2. Student Services & Smart Utilities
- **Attendance & OD Tracker**: Period-by-period attendance tracking with automated on-duty (OD) percentage calculation.
- **Official Letter & OD Requests**: Bonafide, Leave, and On-Duty request forms with administrative workflow and PDF export.
- **Smart Lab & Seat Finder**: Laboratory seat allocations, system numbers, batch assignments, and supervisor schedules.
- **Confidential Suggestion Box**: Secure grievance submission directly forwarded to HOD & faculty administration.
- **Career & Placement Radar**: Curated domain roadmaps (Core Electrical, EV Systems, Embedded Systems, IoT, Software).

### 🤖 3. AI Academic Tutor & Brain Games
- **EEE AI Chatbot**: Interactive engineering assistant for formula lookups, syllabus doubts, and concept explanations.
- **Mind & Brain Puzzles**: Circuit logic quizzes, pattern matching, and memory games designed for engineering students.

---

## 🛠️ Technology Stack

| Domain | Technology |
|---|---|
| **Frontend Core** | React 19, Modern JavaScript (ESNext), JSX |
| **Bundler & Build Tool** | Vite 8 + Rolldown / Oxc high-speed pipeline |
| **Styling & Effects** | Pure CSS3, Custom Parallax 3D Perspective, Glassmorphism, Responsive Mobile Shell |
| **Mobile Runtime** | Capacitor 8 (Native Android & iOS wrapper) |
| **Desktop Runtime** | Electron 43 + Electron Builder (Portable Windows binary) |
| **Database & Auth** | Supabase (PostgreSQL 15, Row Level Security, Secure Session JWT) |
| **Data Resiliency** | Zero-Crash Dual-Engine (Supabase remote sync + localStorage offline cache) |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Surya-Narayanan-K-S/StuTu-APP.git
cd StuTu-APP
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Provide your Supabase URL and public publishable key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Building Across Platforms

### Web Production Bundle
```bash
npm run build
```
Generates optimized static assets in the `dist/` directory.

### Native Android (Capacitor)
```bash
npm run build
npx cap sync
npx cap open android
```

### Windows Desktop (Electron)
```bash
npm run electron:start   # Dev mode
npm run electron:build   # Build portable .exe
```

---

## 🔒 Security & Architecture Documentation

For in-depth architectural diagrams, database schemas, and developer standards, refer to:
- 📖 [**DEVELOPER.md**](DEVELOPER.md): Development guidelines, debugging, and scripts.
- 🏛️ [**ARCHITECTURE.md**](ARCHITECTURE.md): System architecture diagrams, component trees, and RLS security matrices.

---

## 📄 License
This project is licensed under the MIT License. Developed for the Department of Electrical & Electronics Engineering, Sri Ramakrishna Engineering College.
