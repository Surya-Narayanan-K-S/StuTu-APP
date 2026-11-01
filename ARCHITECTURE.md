# 🏛️ EEE Department App - System Architecture

This document describes the high-level system architecture, component taxonomy, data flow, security model, and deployment patterns of the **EEE SREC Smart Mobile & Desktop Application**.

---

## 1. High-Level System Architecture

The application is engineered as a **Cross-Platform Progressive Client (SPA)** with hybrid bindings for Web browsers, Native Android/iOS (Capacitor), and Native Desktop (Electron).

```mermaid
graph TD
    subgraph ClientLayer ["Client Presentation Layer (React + Pure JavaScript)"]
        UI["UI View Components (Cards, Trackers, Modals)"]
        Router["App Shell & Hash Router (App.js)"]
        State["Client State & Auth Session"]
    end

    subgraph AbstractionLayer ["Data Access & Security Layer"]
        DB["dbService (src/services/db.js)"]
        SupaClient["supabaseClient (src/services/supabaseClient.js)"]
        LocalMock["Local Storage & Offline Mock Engine"]
    end

    subgraph BackendLayer ["Supabase Cloud & Database Layer"]
        Auth["Supabase Auth (JWT & Session)"]
        Postgres["PostgreSQL Database Engine"]
        RLS["Row Level Security Policies & is_faculty()"]
        Storage["Supabase Storage (eee_uploads bucket)"]
    end

    subgraph NativeRuntimes ["Deployment Targets"]
        Web["Web / Mobile Browser"]
        Capacitor["Capacitor (Android / iOS)"]
        Electron["Electron (Windows / Desktop)"]
    end

    UI --> Router
    Router --> State
    State --> DB
    DB --> SupaClient
    DB -.->|Offline / Fallback| LocalMock
    SupaClient --> Auth
    SupaClient --> Postgres
    Postgres --> RLS
    SupaClient --> Storage
    Router -.-> Web
    Router -.-> Capacitor
    Router -.-> Electron
```

---

## 2. Authentication & Role-Based Authorization

The application distinguishes between two primary user personas:
1. **Student**: Can view public notices, timetables, and their own private records (documents, grades, attendance, OD forms, letters).
2. **Faculty / Admin**: Has elevated rights to create announcements, update student dossiers, approve letter requests, upload calendar files, and view grievance submissions.

```mermaid
sequenceDiagram
    autonumber
    actor User as Student / Faculty
    participant UI as App Component
    participant Auth as Supabase Auth
    participant DB as Supabase DB
    participant RLS as PostgreSQL RLS

    User->>UI: Enters Credentials / Demo Login
    UI->>Auth: signInWithPassword(email, password)
    Auth-->>UI: Returns JWT & Session Token (with email)
    UI->>DB: Query student profile or faculty status
    DB->>RLS: Evaluates is_faculty() or user email match
    RLS-->>DB: Authorized result
    DB-->>UI: Populates UserProfile State
    UI-->>User: Renders personalized Student or Faculty Dashboard
```

---

## 3. Database Security & Access Control Matrix

Row Level Security is enabled on **all 16 relational tables** to enforce least-privilege data access:

| Table Name | Public Read | Student Read | Student Write | Faculty / Admin Write | RLS Policy Mechanism |
|---|:---:|:---:|:---:|:---:|---|
| `announcements` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `courses` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `faculty` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `rules` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `milestones` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `labs` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `calendar_files` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `timetable_files` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `timetable_entries` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `lab_seats` | ✅ | ✅ | ❌ | ✅ | `is_faculty()` |
| `student_profiles` | ❌ | Own profile | Own profile | All profiles | `email = auth.jwt() ->> 'email' OR is_faculty()` |
| `student_documents` | ❌ | Own documents | Own documents | All documents | `student_email = auth.jwt() ->> 'email' OR is_faculty()` |
| `letter_requests` | ❌ | Own requests | Own (Pending only) | All (Approve/Reject) | `student_email = auth.jwt() ->> 'email' OR is_faculty()` |
| `od_requests` | ❌ | Own ODs | Own (Pending only) | All (Approve/Reject) | `student_email = auth.jwt() ->> 'email' OR is_faculty()` |
| `attendance_logs` | ❌ | Own roll number | ❌ | All logs | Roll number lookup OR `is_faculty()` |
| `suggestions` | ❌ | ❌ | Any student | Full review | `INSERT: true, SELECT/DELETE: is_faculty()` |

---

## 4. Insecure Direct Object Reference (IDOR) Defense

To prevent IDOR vulnerabilities (e.g., student A accessing student B's records by tampering with query parameters or IDs):
1. **Server-Side Filtering**: Database queries in `src/services/db.js` explicitly append `.eq('student_email', currentUser.email)` on Supabase rather than filtering client-side.
2. **Database-Enforced Authorization**: Even if a malicious client bypasses the frontend and queries Supabase directly, PostgreSQL RLS immediately rejects any read, update, or delete on rows where the JWT email does not match the record owner.

---

## 5. Component Taxonomy & Layout Tree

```mermaid
graph TD
    App["App.js (Root Shell)"]
    App --> Shell["Adaptive Responsive Shell"]
    Shell --> TopBar["Mobile Top Bar / Brand (Clickable Logo)"]
    Shell --> Sidebar["Desktop Sidebar (Desktop View)"]
    Shell --> MainArea["Main View Body"]
    MainArea --> HomeView["Dashboard View (Category Folders)"]
    MainArea --> DedicatedPage["Dedicated Modal / Page View"]
    HomeView --> DetailsCard["StudentDetailsCard"]
    HomeView --> Banner["AnnouncementBanner (Parallax)"]
    HomeView --> CatGrid["Category Tiles (Grid of 4)"]
    HomeView --> Footer["AppGlobalFooter (Links & Dynamic Copyright)"]
    DedicatedPage --> AcademicsTracker["AcademicsTracker & GpaCalculator"]
    DedicatedPage --> AttendanceTracker["AttendanceTracker"]
    DedicatedPage --> Timetable["Timetable & Calendar"]
    DedicatedPage --> ProfileDocs["ProfileDocs & Certificates"]
    DedicatedPage --> Services["LabFinder / Career / MindGames / Letters"]
    DedicatedPage --> NotFound["404 Feature Not Found Fallback"]
    App --> Chatbot["AIChatbot (Floating Action Widget)"]
    App --> BottomNav["Mobile Bottom Navigation Bar"]
```

---

## 6. Offline-First & Resilient Fallback Strategy

The application is structured to ensure 100% uptime for students even under poor network conditions:
- When network is connected, Supabase updates seamlessly.
- If network drops or Supabase credentials are unavailable during offline lab sessions, `db.js` stores updates in `localStorage` under namespaced keys (`eee_students`, `eee_letter_requests`, `eee_od_requests`).
- Upon connection restoration, the user can continue without application crashes or white-screens.
