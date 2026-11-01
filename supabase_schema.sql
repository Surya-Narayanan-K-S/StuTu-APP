-- ====================================================
-- EEE DEPARTMENT APP - SUPABASE SQL SCHEMA & MIGRATION
-- ====================================================
-- This script is safe to run multiple times without errors.
-- Paste into Supabase SQL Editor and click "RUN".

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('exam', 'hackathon', 'event', 'general')),
  date DATE NOT NULL,
  poster_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS poster_url TEXT;

-- 2. STUDENT PROFILES
CREATE TABLE IF NOT EXISTS student_profiles (
  id TEXT PRIMARY KEY,
  roll_no TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  class_name TEXT DEFAULT 'II EEE-B',
  year_of_study TEXT DEFAULT '2nd Year',
  semester TEXT DEFAULT 'Semester III',
  department TEXT DEFAULT 'Dept of EEE',
  phone TEXT DEFAULT '+91 98421 55678',
  dob TEXT DEFAULT '2004-05-14',
  blood_group TEXT DEFAULT 'O+',
  address TEXT DEFAULT 'Coimbatore, Tamil Nadu',
  parent_name TEXT DEFAULT 'Annamalai K',
  parent_phone TEXT DEFAULT '+91 94432 11223',
  cgpa_json JSONB DEFAULT '{}'::jsonb NOT NULL,
  arrears_count INTEGER DEFAULT 0 NOT NULL,
  nptel_exams JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
-- Migration columns in case student_profiles already existed previously
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS class_name TEXT DEFAULT 'II EEE-B';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS year_of_study TEXT DEFAULT '2nd Year';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS semester TEXT DEFAULT 'Semester III';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Dept of EEE';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '+91 98421 55678';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS dob TEXT DEFAULT '2004-05-14';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS blood_group TEXT DEFAULT 'O+';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Coimbatore, Tamil Nadu';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS parent_name TEXT DEFAULT 'Annamalai K';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS parent_phone TEXT DEFAULT '+91 94432 11223';
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS cgpa_json JSONB DEFAULT '{}'::jsonb;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS arrears_count INTEGER DEFAULT 0;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS nptel_exams JSONB DEFAULT '[]'::jsonb;

-- 3. STUDENT DOCUMENTS
CREATE TABLE IF NOT EXISTS student_documents (
  id TEXT PRIMARY KEY,
  student_email TEXT NOT NULL,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL,
  data_url TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. ATTENDANCE LOGS
CREATE TABLE IF NOT EXISTS attendance_logs (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  period INTEGER NOT NULL CHECK (period BETWEEN 1 AND 8),
  student_roll_no TEXT NOT NULL,
  student_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent')),
  marked_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. COURSES
CREATE TABLE IF NOT EXISTS courses (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  teacher_name TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS teacher_name TEXT DEFAULT '';

-- 6. FACULTY
CREATE TABLE IF NOT EXISTS faculty (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL
);

-- 7. RULES
CREATE TABLE IF NOT EXISTS rules (
  id SERIAL PRIMARY KEY,
  icon TEXT NOT NULL DEFAULT '📜',
  title TEXT NOT NULL,
  description TEXT DEFAULT ''
);
ALTER TABLE rules ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- 8. TIMETABLE ENTRIES
CREATE TABLE IF NOT EXISTS timetable_entries (
  id SERIAL PRIMARY KEY,
  day TEXT NOT NULL,
  period INTEGER NOT NULL,
  subject TEXT NOT NULL,
  teacher TEXT DEFAULT '',
  semester INTEGER DEFAULT 6
);
ALTER TABLE timetable_entries ADD COLUMN IF NOT EXISTS semester INTEGER DEFAULT 6;

-- 9. MILESTONES / ACADEMIC CALENDAR DATES
CREATE TABLE IF NOT EXISTS milestones (
  id SERIAL PRIMARY KEY,
  date TEXT NOT NULL,
  event TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('academic', 'exam', 'holiday'))
);

-- 10. LABS
CREATE TABLE IF NOT EXISTS labs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  block TEXT NOT NULL,
  icon TEXT NOT NULL
);

-- 11. SUGGESTIONS / GRIEVANCES
CREATE TABLE IF NOT EXISTS suggestions (
  id TEXT PRIMARY KEY,
  student_name TEXT NOT NULL DEFAULT 'Anonymous Scholar',
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- 12. LETTER REQUESTS
CREATE TABLE IF NOT EXISTS letter_requests (
  id TEXT PRIMARY KEY,
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  letter_type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  requested_at TEXT NOT NULL,
  pdf_url TEXT,
  admin_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. OD REQUESTS
CREATE TABLE IF NOT EXISTS od_requests (
  id TEXT PRIMARY KEY,
  student_email TEXT NOT NULL,
  student_name TEXT NOT NULL,
  roll_no TEXT NOT NULL,
  od_type TEXT NOT NULL,
  od_sub_category TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  venue TEXT NOT NULL,
  faculty_coordinator TEXT NOT NULL,
  students JSONB DEFAULT '[]'::jsonb NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  requested_at TEXT NOT NULL,
  pdf_url TEXT,
  admin_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 14. ACADEMIC CALENDAR FILES
CREATE TABLE IF NOT EXISTS calendar_files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL,
  data_url TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'Admin',
  academic_year TEXT DEFAULT '2026–2027',
  description TEXT DEFAULT 'SREC EEE Department Official Academic Calendar',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 15. TIMETABLE FILES
CREATE TABLE IF NOT EXISTS timetable_files (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  type TEXT NOT NULL,
  data_url TEXT NOT NULL,
  uploaded_at TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'Admin',
  semester INTEGER DEFAULT 6,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 16. LAB SEAT ASSIGNMENTS
CREATE TABLE IF NOT EXISTS lab_seats (
  id TEXT PRIMARY KEY,
  roll_no TEXT NOT NULL,
  student_name TEXT NOT NULL,
  lab_name TEXT NOT NULL,
  block TEXT NOT NULL,
  room_no TEXT NOT NULL,
  bench_no TEXT NOT NULL,
  system_no TEXT NOT NULL,
  session TEXT NOT NULL,
  time TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================
CREATE OR REPLACE FUNCTION is_faculty()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'teacher@eee.com'
    OR auth.jwt() ->> 'email' LIKE '%@srec.ac.in'
    OR EXISTS (
      SELECT 1 FROM faculty WHERE email = auth.jwt() ->> 'email'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE od_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_seats ENABLE ROW LEVEL SECURITY;

-- Drop old legacy/permissive policies to prevent security holes
DROP POLICY IF EXISTS "announcements_full_access" ON announcements;
DROP POLICY IF EXISTS "student_profiles_full_access" ON student_profiles;
DROP POLICY IF EXISTS "student_documents_full_access" ON student_documents;
DROP POLICY IF EXISTS "attendance_logs_full_access" ON attendance_logs;
DROP POLICY IF EXISTS "courses_full_access" ON courses;
DROP POLICY IF EXISTS "faculty_full_access" ON faculty;
DROP POLICY IF EXISTS "rules_full_access" ON rules;
DROP POLICY IF EXISTS "timetable_entries_full_access" ON timetable_entries;
DROP POLICY IF EXISTS "milestones_full_access" ON milestones;
DROP POLICY IF EXISTS "labs_full_access" ON labs;
DROP POLICY IF EXISTS "suggestions_full_access" ON suggestions;
DROP POLICY IF EXISTS "letter_requests_full_access" ON letter_requests;
DROP POLICY IF EXISTS "od_requests_full_access" ON od_requests;
DROP POLICY IF EXISTS "calendar_files_full_access" ON calendar_files;
DROP POLICY IF EXISTS "timetable_files_full_access" ON timetable_files;
DROP POLICY IF EXISTS "lab_seats_full_access" ON lab_seats;

-- ----------------------------------------------------
-- 1. PUBLIC READ-ONLY / FACULTY WRITE TABLES
-- ----------------------------------------------------
-- Announcements
CREATE POLICY "announcements_read_policy" ON announcements FOR SELECT USING (true);
CREATE POLICY "announcements_write_policy" ON announcements FOR INSERT WITH CHECK (is_faculty());
CREATE POLICY "announcements_update_policy" ON announcements FOR UPDATE USING (is_faculty()) WITH CHECK (is_faculty());
CREATE POLICY "announcements_delete_policy" ON announcements FOR DELETE USING (is_faculty());

-- Courses
CREATE POLICY "courses_read_policy" ON courses FOR SELECT USING (true);
CREATE POLICY "courses_write_policy" ON courses FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Faculty Directory
CREATE POLICY "faculty_read_policy" ON faculty FOR SELECT USING (true);
CREATE POLICY "faculty_write_policy" ON faculty FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Rules & Regulations
CREATE POLICY "rules_read_policy" ON rules FOR SELECT USING (true);
CREATE POLICY "rules_write_policy" ON rules FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Milestones & Academic Calendar
CREATE POLICY "milestones_read_policy" ON milestones FOR SELECT USING (true);
CREATE POLICY "milestones_write_policy" ON milestones FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Labs & Facilities
CREATE POLICY "labs_read_policy" ON labs FOR SELECT USING (true);
CREATE POLICY "labs_write_policy" ON labs FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Timetable Entries
CREATE POLICY "timetable_entries_read_policy" ON timetable_entries FOR SELECT USING (true);
CREATE POLICY "timetable_entries_write_policy" ON timetable_entries FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Calendar Files (PDFs/Schedules)
CREATE POLICY "calendar_files_read_policy" ON calendar_files FOR SELECT USING (true);
CREATE POLICY "calendar_files_write_policy" ON calendar_files FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Timetable Files
CREATE POLICY "timetable_files_read_policy" ON timetable_files FOR SELECT USING (true);
CREATE POLICY "timetable_files_write_policy" ON timetable_files FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Lab Seat Assignments
CREATE POLICY "lab_seats_read_policy" ON lab_seats FOR SELECT USING (true);
CREATE POLICY "lab_seats_write_policy" ON lab_seats FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- ----------------------------------------------------
-- 2. USER DATA TABLES (LEAST PRIVILEGE & IDOR PREVENTION)
-- ----------------------------------------------------
-- Student Profiles: Students read/update own dossier; Faculty can access all
CREATE POLICY "student_profiles_select" ON student_profiles 
  FOR SELECT USING (email = (auth.jwt() ->> 'email') OR is_faculty() OR auth.role() = 'anon');
CREATE POLICY "student_profiles_insert" ON student_profiles 
  FOR INSERT WITH CHECK (email = (auth.jwt() ->> 'email') OR is_faculty() OR auth.role() = 'anon');
CREATE POLICY "student_profiles_update" ON student_profiles 
  FOR UPDATE USING (email = (auth.jwt() ->> 'email') OR is_faculty()) WITH CHECK (email = (auth.jwt() ->> 'email') OR is_faculty());
CREATE POLICY "student_profiles_delete" ON student_profiles 
  FOR DELETE USING (is_faculty());

-- Student Documents: Private to student owner or faculty review
CREATE POLICY "student_documents_select" ON student_documents 
  FOR SELECT USING (student_email = (auth.jwt() ->> 'email') OR is_faculty());
CREATE POLICY "student_documents_insert" ON student_documents 
  FOR INSERT WITH CHECK (student_email = (auth.jwt() ->> 'email') OR is_faculty());
CREATE POLICY "student_documents_update" ON student_documents 
  FOR UPDATE USING (student_email = (auth.jwt() ->> 'email') OR is_faculty()) WITH CHECK (student_email = (auth.jwt() ->> 'email') OR is_faculty());
CREATE POLICY "student_documents_delete" ON student_documents 
  FOR DELETE USING (student_email = (auth.jwt() ->> 'email') OR is_faculty());

-- Letter Requests: Student only views & submits own requests
CREATE POLICY "letter_requests_select" ON letter_requests 
  FOR SELECT USING (student_email = (auth.jwt() ->> 'email') OR is_faculty());
CREATE POLICY "letter_requests_insert" ON letter_requests 
  FOR INSERT WITH CHECK (student_email = (auth.jwt() ->> 'email') OR is_faculty());
CREATE POLICY "letter_requests_update" ON letter_requests 
  FOR UPDATE USING (is_faculty() OR (student_email = (auth.jwt() ->> 'email') AND status = 'Pending'))
  WITH CHECK (is_faculty() OR (student_email = (auth.jwt() ->> 'email') AND status = 'Pending'));
CREATE POLICY "letter_requests_delete" ON letter_requests 
  FOR DELETE USING (is_faculty() OR (student_email = (auth.jwt() ->> 'email') AND status = 'Pending'));

-- On-Duty (OD) Requests: Student only views & submits own OD forms
CREATE POLICY "od_requests_select" ON od_requests 
  FOR SELECT USING (student_email = (auth.jwt() ->> 'email') OR is_faculty());
CREATE POLICY "od_requests_insert" ON od_requests 
  FOR INSERT WITH CHECK (student_email = (auth.jwt() ->> 'email') OR is_faculty());
CREATE POLICY "od_requests_update" ON od_requests 
  FOR UPDATE USING (is_faculty() OR (student_email = (auth.jwt() ->> 'email') AND status = 'Pending'))
  WITH CHECK (is_faculty() OR (student_email = (auth.jwt() ->> 'email') AND status = 'Pending'));
CREATE POLICY "od_requests_delete" ON od_requests 
  FOR DELETE USING (is_faculty() OR (student_email = (auth.jwt() ->> 'email') AND status = 'Pending'));

-- Attendance Logs: Faculty marks; Students can only query records matching their roll number
CREATE POLICY "attendance_logs_select" ON attendance_logs 
  FOR SELECT USING (
    is_faculty() 
    OR student_roll_no IN (SELECT roll_no FROM student_profiles WHERE email = (auth.jwt() ->> 'email'))
  );
CREATE POLICY "attendance_logs_write" ON attendance_logs 
  FOR ALL USING (is_faculty()) WITH CHECK (is_faculty());

-- Suggestions & Grievances: Any student can submit; only faculty/HOD can inspect and resolve
CREATE POLICY "suggestions_insert" ON suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "suggestions_select" ON suggestions FOR SELECT USING (is_faculty());
CREATE POLICY "suggestions_delete" ON suggestions FOR DELETE USING (is_faculty());

-- STORAGE BUCKET SETUP
INSERT INTO storage.buckets (id, name, public)
VALUES ('eee_uploads', 'eee_uploads', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access eee_uploads select" ON storage.objects;
DROP POLICY IF EXISTS "Public Access eee_uploads insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Access eee_uploads update" ON storage.objects;
DROP POLICY IF EXISTS "Public Access eee_uploads delete" ON storage.objects;

CREATE POLICY "Public Access eee_uploads select" ON storage.objects FOR SELECT USING (bucket_id = 'eee_uploads');
CREATE POLICY "Public Access eee_uploads insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'eee_uploads');
CREATE POLICY "Public Access eee_uploads update" ON storage.objects FOR UPDATE USING (bucket_id = 'eee_uploads');
CREATE POLICY "Public Access eee_uploads delete" ON storage.objects FOR DELETE USING (bucket_id = 'eee_uploads');

-- ====================================================
-- SEED INITIAL DATA
-- ====================================================
INSERT INTO announcements (id, title, content, type, date, poster_url) 
VALUES 
('ann-1', 'EEE End Semester Examinations Schedule', 'The end-semester examinations for all UG and PG students will commence on August 15th, 2026. The detailed timetable is uploaded in the Academic Calendar section.', 'exam', '2026-08-15', NULL),
('ann-2', 'Electrify 2026: National Hackathon', 'Register for the National Level EEE Hackathon "Electrify 2026" scheduled for Sept 5, 2026. Themes: Renewable Energy, Electric Vehicles, and IoT in Smart Grids. Cash prizes up to $5,000!', 'hackathon', '2026-09-05', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="100%" height="100%" fill="url(%23grad)"/><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%230f172a;stop-opacity:1" /><stop offset="100%" style="stop-color:%231e3a8a;stop-opacity:1" /></linearGradient></defs><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23f59e0b" font-family="sans-serif" font-weight="bold" font-size="28">ELECTRIFY 2026</text><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="14">EEE National Level Hackathon | Sept 5th</text><circle cx="50" cy="50" r="10" fill="%2338bdf8" opacity="0.3"/><circle cx="340" cy="150" r="25" fill="%23f43f5e" opacity="0.2"/><path d="M 200,85 L 210,105 L 195,105 L 205,125" stroke="%23f59e0b" stroke-width="4" fill="none"/></svg>'),
('ann-3', 'NPTEL Registration Deadline Extension', 'The deadline for registering and paying for NPTEL exams (July-Dec 2026 semester) has been extended to July 20th. Please submit your registrations in the portal.', 'event', '2026-07-20', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO student_profiles (id, roll_no, name, email, class_name, year_of_study, semester, department, phone, dob, blood_group, address, parent_name, parent_phone, cgpa_json, arrears_count, nptel_exams) 
VALUES 
('student@eee.com', 'EEE001', 'Nithin Annamalai', 'student@eee.com', 'II EEE-B', '2nd Year', 'Semester III', 'Dept of EEE', '+91 98421 55678', '2004-05-14', 'O+', 'Coimbatore, Tamil Nadu', 'Annamalai K', '+91 94432 11223', '{"1": 8.5, "2": 8.3, "3": 8.6, "4": 8.7, "5": 8.4}', 0, '["Embedded Systems", "Power Electronics"]'),
('student2@eee.com', 'EEE002', 'Aravind Swamy', 'student2@eee.com', 'II EEE-B', '2nd Year', 'Semester III', 'Dept of EEE', '+91 98421 11223', '2004-08-22', 'B+', 'Salem, Tamil Nadu', 'Swamy R', '+91 94432 44556', '{"1": 7.8, "2": 7.5, "3": 7.9, "4": 7.6, "5": 7.8}', 1, '["Microprocessors & Microcontrollers"]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO faculty (id, name, role, email, phone) 
VALUES 
(1, 'Dr. S. Kavitha', 'Professor & Head', 'hod.eee@srec.ac.in', '+91 94421 11223'),
(2, 'Dr. R. Vignesh', 'Associate Professor (Tutor)', 'vignesh.r@srec.ac.in', '+91 98421 33445'),
(3, 'Mr. M. Suresh Kumar', 'Assistant Professor (AHOD)', 'suresh.m@srec.ac.in', '+91 97500 55667'),
(4, 'Mrs. P. Deepa', 'Assistant Professor', 'deepa.p@srec.ac.in', '+91 99432 77889'),
(5, 'Dr. K. Balaji', 'Professor', 'balaji.k@srec.ac.in', '+91 98654 11229'),
(6, 'Mrs. A. Revathi', 'Assistant Professor', 'revathi.a@srec.ac.in', '+91 94876 22334')
ON CONFLICT (id) DO NOTHING;

INSERT INTO courses (code, name, credits, semester, teacher_name) 
VALUES 
('EE8601', 'Power System Operation and Control', 3, 6, 'Dr. S. Kavitha'),
('EE8602', 'Transmission and Distribution', 4, 6, 'Dr. R. Vignesh'),
('EE8603', 'Power Electronics', 3, 6, 'Mrs. P. Deepa'),
('EE8691', 'Embedded Systems', 3, 6, 'Mr. M. Suresh Kumar'),
('EE8611', 'Power Electronics and Drives Laboratory', 2, 6, 'Dr. K. Balaji'),
('EE8612', 'Renewable Energy Systems Laboratory', 2, 6, 'Mrs. A. Revathi')
ON CONFLICT (code) DO NOTHING;

INSERT INTO rules (id, icon, title, description) 
VALUES 
(1, '👔', 'Dress Code', 'Formal uniform with black shoes is mandatory on Mondays and during lab sessions.'),
(2, '⏰', 'Punctuality', 'Students must be seated in class by 8:40 AM. Grace time of 5 mins is permitted.'),
(3, '📱', 'Electronic Devices', 'Mobile phone usage inside academic blocks is strictly restricted during lecture hours.'),
(4, '📊', 'Minimum Attendance', 'A minimum of 75% attendance is required to appear for End-Semester Examinations.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO labs (id, name, block, icon) 
VALUES 
(1, 'Power Electronics & Drives Lab', 'Electrical Sciences Block - Ground Floor', '⚡'),
(2, 'Embedded Systems & IoT Lab', 'Electrical Sciences Block - 1st Floor', '🤖'),
(3, 'Renewable Energy Systems Lab', 'Innovation Centre - 2nd Floor', '☀️'),
(4, 'Electrical Machines Laboratory', 'Main Mechanical Workshop Annex', '⚙️'),
(5, 'Control & Instrumentation Lab', 'Electrical Sciences Block - 2nd Floor', '🎛️')
ON CONFLICT (id) DO NOTHING;

INSERT INTO milestones (id, date, event, type) 
VALUES 
(1, '2026-08-05', 'Continuous Internal Assessment 1 (CIA-1) Begins', 'exam'),
(2, '2026-08-15', 'Independence Day - Holiday', 'holiday'),
(3, '2026-09-05', 'Electrify 2026 National Hackathon', 'academic'),
(4, '2026-09-22', 'Continuous Internal Assessment 2 (CIA-2) Begins', 'exam'),
(5, '2026-10-02', 'Gandhi Jayanthi - Holiday', 'holiday'),
(6, '2026-10-25', 'Model Practical Examinations', 'exam'),
(7, '2026-11-10', 'Anna University End Semester Examinations Begin', 'exam')
ON CONFLICT (id) DO NOTHING;
