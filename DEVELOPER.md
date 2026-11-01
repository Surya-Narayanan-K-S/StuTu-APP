# 🛠️ EEE Department App - Developer Documentation

Welcome to the **EEE Department App (Smart Student & Faculty Hub)** for Sri Ramakrishna Engineering College (SREC). This guide provides everything required to set up, develop, debug, and deploy the application across Web, Mobile (Capacitor Android/iOS), and Desktop (Electron).

---

## 📁 Project Directory Structure

```plaintext
College-App-main/
├── .env.example                # Template for environment variables (copy to .env)
├── .gitignore                  # Git ignore rules (protects credentials, builds, dependencies)
├── capacitor.config.js         # Capacitor cross-platform mobile configuration
├── electron/                   # Electron desktop wrapper
│   ├── main.cjs                # Electron main background process
│   └── preload.js              # Secure IPC bridge preload script
├── eslint.config.js            # ESLint flat configuration for modern JavaScript
├── index.html                  # HTML5 entry with mobile viewport and font assets
├── package.json                # Project dependencies, scripts, and metadata
├── public/                     # Static public assets (icons, splash screens)
├── src/                        # Main JavaScript source directory
│   ├── App.css                 # Supplementary styles
│   ├── App.js                  # Master application orchestrator, router & shell
│   ├── index.css               # Global theme, utilities, parallax & glassmorphism system
│   ├── main.js                 # React DOM root entry point
│   ├── assets/                 # Brand logos, hero images, and background graphics
│   ├── components/             # Reusable UI features & domain modules
│   │   ├── academics/          # AcademicCalendar, AcademicsTracker, GpaCalculator, Timetable, NptelTracker
│   │   ├── admin/              # StudentManager (Faculty dossier manager)
│   │   ├── auth/               # SignInPage, AuthModal, MobileLandingPage
│   │   ├── common/             # AIChatbot, AnnouncementBanner, DashboardGrid, SplashScreen, StudentDetailsCard
│   │   ├── desktop/            # DesktopLandingPage, DesktopLoginPage, DesktopSidebar, DesktopVisionaDashboard
│   │   ├── services/           # AttendanceTracker, CareerHub, LabSeatFinder, ProfileDocs, RequestLetters, TaskList, PuzzleGames
│   │   └── index.js            # Barrel export of all application components
│   ├── routes/
│   │   └── appRoutes.js        # Category definitions, icon mappings, and route keys
│   └── services/
│       ├── db.js               # Data abstraction layer (Supabase query engine + local mock fallback)
│       └── supabaseClient.js   # Supabase client initializer with safe environment loading
├── supabase_schema.sql         # SQL schema, RLS policies, tables & initial seeds
└── vite.config.js              # Vite build configuration
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm** (comes with Node.js) or **bun**
- (Optional for Android): Android Studio & Android SDK
- (Optional for Desktop): Windows Build Tools for Electron packager

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/nithinannamalai/College-App.git
cd College-App
npm install
```

### 3. Environment Variables
Create a local `.env` file in the project root by copying `.env.example`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
```
> ⚠️ **Security Notice**: Never put `service_role` or private database secrets in `.env`. The frontend bundle only uses the public `anon` key, while authorization is enforced through **Row Level Security (RLS)**.

---

## 🚀 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite development server at `http://localhost:5173` |
| `npm run build` | Compiles application bundle into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint analysis across `.js` source files |
| `npm run electron:start` | Launches the app inside an Electron native desktop window |
| `npm run electron:build` | Packages an executable Windows portable installer in `dist/` |

---

## 🗄️ Database & Supabase Setup

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor**.
3. Open `supabase_schema.sql` from the root of this project.
4. Paste the entire script and click **RUN**.
5. The script:
   - Creates 16 core relational tables (`announcements`, `student_profiles`, `attendance_logs`, `letter_requests`, `od_requests`, etc.).
   - Configures least-privilege **Row Level Security (RLS)** policies.
   - Defines the `is_faculty()` authorization helper function.
   - Seeds default department courses, faculty directories, and demo student dossiers.

---

## 🔄 Dual-Layer Data Layer (Resilient Architecture)

The app utilizes a **Zero-Crash Resilient Architecture** via `src/services/db.js`:
- **Primary Data Source**: Supabase PostgreSQL queries with real-time sync.
- **Offline & Mock Fallback**: If Supabase credentials are missing or the network is offline, `db.js` gracefully falls back to `localStorage` and bundled mock datasets without halting the user experience.
- When Supabase is connected, changes persist remotely according to RLS permissions.

---

## 🔒 Security Best Practices

1. **Row Level Security (RLS)**:
   - Every table in `supabase_schema.sql` has RLS enabled.
   - Public resources (Announcements, Syllabus, Faculty) allow public `SELECT`, but only `is_faculty()` can `INSERT`, `UPDATE`, or `DELETE`.
   - Private student data (`student_profiles`, `student_documents`, `letter_requests`) strictly checks `email = auth.jwt() ->> 'email'` to prevent unauthorized reading or tampering.
2. **IDOR & Server-side Query Scoping**:
   - In `src/services/db.js`, methods like `getLetterRequests(email)` and `getODRequests(email)` scope queries at the database query level (`.eq('student_email', email)`), ensuring another user's records are never transmitted over the wire.
3. **Key Rotation**:
   - If an API key or anon token was ever committed to version control, rotate it immediately in the Supabase Dashboard under **Settings > API**.

---

## 📱 Mobile & Desktop Deployment

### Mobile (Capacitor)
```bash
# Build the web bundle
npm run build

# Sync assets to native folders
npx cap sync

# Open in Android Studio / Xcode
npx cap open android
npx cap open ios
```

### Desktop (Electron)
```bash
# Test Electron in dev mode
npm run electron:start

# Build portable Windows binary
npm run electron:build
```
The output executable will be placed in the `dist/` folder.

