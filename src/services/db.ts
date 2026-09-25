import { supabase } from './supabaseClient';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'exam' | 'hackathon' | 'event' | 'general';
  date: string;
  posterUrl?: string; // base64 or external url
}

export interface StudentDoc {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl: string; // Base64 data
  uploadedAt: string;
}

export interface SemesterGrades {
  internal1?: number;
  internal2?: number;
  semMarks?: number;
  gpa?: number;
}

export interface Student {
  id: string; // email as key or generated
  rollNo: string;
  name: string;
  email: string;
  className?: string;
  yearOfStudy?: string;
  semester?: string;
  department?: string;
  phone?: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
  cgpa: Record<number, SemesterGrades>; // updated to SemesterGrades
  arrears: number;
  nptelExams: string[];
  documents: StudentDoc[];
}

export interface CalendarFile {
  id?: string;
  name: string;
  size: string;
  type: string;
  dataUrl: string; // Base64 or URL
  uploadedAt: string;
  uploadedBy?: string;
  academicYear?: string;
  description?: string;
}

export interface Suggestion {
  id: string;
  studentName?: string;
  category: string;
  message: string;
  createdAt: string;
  status?: 'pending' | 'reviewed';
}

export interface LabSeatAssignment {
  id?: string;
  rollNo: string;
  studentName: string;
  labName: string;
  block: string;
  roomNo: string;
  benchNo: string;
  systemNo: string;
  session: string;
  time: string;
  supervisor: string;
}

export interface Milestone {
  id?: number;
  date: string;
  event: string;
  type: 'academic' | 'exam' | 'holiday';
}

export interface Lab {
  id?: number;
  name: string;
  block: string;
  icon: string;
}

export interface AttendanceLog {
  id: string;
  date: string; // YYYY-MM-DD
  period: number; // 1-7
  studentRollNo: string;
  studentName: string;
  status: 'present' | 'absent';
  markedBy: string;
}

export interface Course {
  code: string;
  name: string;
  credits: number;
  semester: number;
  teacherName?: string;
}

export interface Faculty {
  id?: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Rule {
  id?: number;
  icon: string;
  title: string;
  desc: string;
}

export interface TimetableEntry {
  id?: number;
  day: string;    // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  period: number; // 1–7
  subject: string;
  teacher?: string;
  semester: number;
}

export interface TimetableFile {
  id?: string;
  name: string;
  size: string;
  type: string;
  dataUrl: string;
  uploadedAt?: string;
  uploadedBy?: string;
  semester?: number;
}

export interface LetterRequest {
  id: string;
  studentEmail: string;
  studentName: string;
  rollNo: string;
  letterType: 'Bonafide' | 'NOC' | 'Internship Request' | 'Course Completion';
  purpose: string;
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  pdfUrl?: string; // base64 signed PDF uploaded by admin
  adminRemarks?: string;
}

export interface ODStudent {
  rollNo: string;
  name: string;
  year: string;
  className: string;
}

export interface ODRequest {
  id: string;
  studentEmail: string;
  studentName: string;
  rollNo: string;
  odType: 'External OD' | 'Internal OD';
  odSubCategory: 'SAC OD' | 'Other';
  eventName: string;
  eventDate: string;
  venue: string;
  facultyCoordinator: string;
  students: ODStudent[];
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string;
  pdfUrl?: string;
  adminRemarks?: string;
}


// ----------------------------------------------------
// DEFAULT SEED DATA FOR MOCK FALLBACK
// ----------------------------------------------------
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'EEE End Semester Examinations Schedule',
    content: 'The end-semester examinations for all UG and PG students will commence on August 15th, 2026. The detailed timetable is uploaded in the Academic Calendar section.',
    type: 'exam',
    date: '2026-08-15',
    posterUrl: ''
  },
  {
    id: 'ann-2',
    title: 'Electrify 2026: National Hackathon',
    content: 'Register for the National Level EEE Hackathon "Electrify 2026" scheduled for Sept 5, 2026. Themes: Renewable Energy, Electric Vehicles, and IoT in Smart Grids. Cash prizes up to $5,000!',
    type: 'hackathon',
    date: '2026-09-05',
    posterUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="100%" height="100%" fill="url(%23grad)"/><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%230f172a;stop-opacity:1" /><stop offset="100%" style="stop-color:%231e3a8a;stop-opacity:1" /></linearGradient></defs><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23f59e0b" font-family="sans-serif" font-weight="bold" font-size="28">ELECTRIFY 2026</text><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="sans-serif" font-size="14">EEE National Level Hackathon | Sept 5th</text><circle cx="50" cy="50" r="10" fill="%2338bdf8" opacity="0.3"/><circle cx="340" cy="150" r="25" fill="%23f43f5e" opacity="0.2"/><path d="M 200,85 L 210,105 L 195,105 L 205,125" stroke="%23f59e0b" stroke-width="4" fill="none"/></svg>'
  },
  {
    id: 'ann-3',
    title: 'NPTEL Registration Deadline Extension',
    content: 'The deadline for registering and paying for NPTEL exams (July-Dec 2026 semester) has been extended to July 20th. Please submit your registrations in the portal.',
    type: 'event',
    date: '2026-07-20',
    posterUrl: ''
  }
];

const DEFAULT_CALENDAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1250" width="100%" height="100%" style="background:#ffffff; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;">
  <defs>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0052cc" />
      <stop offset="100%" stop-color="#1e3a8a" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-2%" width="110%" height="108%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Header Banner -->
  <rect x="25" y="25" width="850" height="150" rx="14" fill="url(#headerGrad)" />
  <circle cx="95" cy="100" r="42" fill="#ffffff" opacity="0.15" />
  <text x="95" y="108" text-anchor="middle" font-size="34" font-weight="900" fill="#ffffff">SREC</text>

  <text x="160" y="75" font-size="22" font-weight="800" fill="#ffffff" letter-spacing="0.5">SRI RAMAKRISHNA ENGINEERING COLLEGE</text>
  <text x="160" y="100" font-size="13" font-weight="600" fill="#93c5fd">Autonomous Institution · Affiliated to Anna University, Chennai · Approved by AICTE</text>
  <text x="160" y="125" font-size="14" font-weight="700" fill="#fde047">DEPARTMENT OF ELECTRICAL &amp; ELECTRONICS ENGINEERING</text>
  <text x="160" y="148" font-size="12" font-weight="600" fill="#e0f2fe">OFFICIAL ACADEMIC SCHEDULE · ACADEMIC YEAR 2026 – 2027</text>

  <!-- Notice Sub-Bar -->
  <rect x="25" y="190" width="850" height="42" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1.5" />
  <text x="45" y="216" font-size="12" font-weight="700" fill="#1e40af">📌 CIRCULAR NO: SREC/EEE/AC-2026/01</text>
  <text x="855" y="216" text-anchor="end" font-size="12" font-weight="700" fill="#1e40af">SEMESTER: ODD &amp; EVEN (III, V, VII SEM)</text>

  <!-- Section 1: Semester Schedule Table -->
  <rect x="25" y="250" width="850" height="430" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#shadow)" />
  <rect x="25" y="250" width="850" height="44" rx="12" fill="#f8fafc" />
  <text x="45" y="278" font-size="14" font-weight="800" fill="#0f172a">📅 ODD SEMESTER SCHEDULE (AUG 2026 – DEC 2026)</text>

  <!-- Table Header -->
  <rect x="40" y="308" width="820" height="34" fill="#0052cc" rx="6" />
  <text x="60" y="330" font-size="12" font-weight="800" fill="#ffffff">S.NO</text>
  <text x="120" y="330" font-size="12" font-weight="800" fill="#ffffff">ACADEMIC EVENT / MILESTONE</text>
  <text x="480" y="330" font-size="12" font-weight="800" fill="#ffffff">SCHEDULED DATE(S)</text>
  <text x="730" y="330" font-size="12" font-weight="800" fill="#ffffff">REMARKS</text>

  <!-- Row 1 -->
  <rect x="40" y="348" width="820" height="34" fill="#f8fafc" />
  <text x="60" y="370" font-size="12" font-weight="700" fill="#334155">01</text>
  <text x="120" y="370" font-size="12" font-weight="700" fill="#0f172a">Reopening &amp; Commencement of Classes</text>
  <text x="480" y="370" font-size="12" font-weight="700" fill="#0284c7">August 10, 2026 (Monday)</text>
  <text x="730" y="370" font-size="11" font-weight="600" fill="#16a34a">Classwork Begins</text>

  <!-- Row 2 -->
  <rect x="40" y="388" width="820" height="34" fill="#ffffff" />
  <text x="60" y="410" font-size="12" font-weight="700" fill="#334155">02</text>
  <text x="120" y="410" font-size="12" font-weight="700" fill="#0f172a">Continuous Assessment Test - I (CAT-I)</text>
  <text x="480" y="410" font-size="12" font-weight="700" fill="#ea580c">Sept 15 – Sept 22, 2026</text>
  <text x="730" y="410" font-size="11" font-weight="600" fill="#dc2626">Units 1 &amp; 2</text>

  <!-- Row 3 -->
  <rect x="40" y="428" width="820" height="34" fill="#f8fafc" />
  <text x="60" y="450" font-size="12" font-weight="700" fill="#334155">03</text>
  <text x="120" y="450" font-size="12" font-weight="700" fill="#0f172a">Internal Marks &amp; Attendance Entry - 1</text>
  <text x="480" y="450" font-size="12" font-weight="700" fill="#0284c7">September 28, 2026</text>
  <text x="730" y="450" font-size="11" font-weight="600" fill="#4f46e5">Portal Upload</text>

  <!-- Row 4 -->
  <rect x="40" y="468" width="820" height="34" fill="#ffffff" />
  <text x="60" y="490" font-size="12" font-weight="700" fill="#334155">04</text>
  <text x="120" y="490" font-size="12" font-weight="700" fill="#0f172a">Department Technical Symposium &amp; Workshop</text>
  <text x="480" y="490" font-size="12" font-weight="700" fill="#7c3aed">October 14 – 15, 2026</text>
  <text x="730" y="490" font-size="11" font-weight="600" fill="#059669">ELECTRIFY 2026</text>

  <!-- Row 5 -->
  <rect x="40" y="508" width="820" height="34" fill="#f8fafc" />
  <text x="60" y="530" font-size="12" font-weight="700" fill="#334155">05</text>
  <text x="120" y="530" font-size="12" font-weight="700" fill="#0f172a">Continuous Assessment Test - II (CAT-II)</text>
  <text x="480" y="530" font-size="12" font-weight="700" fill="#ea580c">Nov 02 – Nov 09, 2026</text>
  <text x="730" y="530" font-size="11" font-weight="600" fill="#dc2626">Units 3, 4 &amp; 5</text>

  <!-- Row 6 -->
  <rect x="40" y="548" width="820" height="34" fill="#ffffff" />
  <text x="60" y="570" font-size="12" font-weight="700" fill="#334155">06</text>
  <text x="120" y="570" font-size="12" font-weight="700" fill="#0f172a">Autonomous Practical End Examinations</text>
  <text x="480" y="570" font-size="12" font-weight="700" fill="#0284c7">Nov 16 – Nov 21, 2026</text>
  <text x="730" y="570" font-size="11" font-weight="600" fill="#d97706">Lab Assessments</text>

  <!-- Row 7 -->
  <rect x="40" y="588" width="820" height="34" fill="#f8fafc" />
  <text x="60" y="610" font-size="12" font-weight="700" fill="#334155">07</text>
  <text x="120" y="610" font-size="12" font-weight="700" fill="#0f172a">End Semester Theory Examinations (Autonomous)</text>
  <text x="480" y="610" font-size="12" font-weight="700" fill="#dc2626">Dec 01 – Dec 18, 2026</text>
  <text x="730" y="610" font-size="11" font-weight="600" fill="#dc2626">Anna Univ Norms</text>

  <!-- Row 8 -->
  <rect x="40" y="628" width="820" height="34" fill="#ffffff" />
  <text x="60" y="650" font-size="12" font-weight="700" fill="#334155">08</text>
  <text x="120" y="650" font-size="12" font-weight="700" fill="#0f172a">Commencement of Even Semester 2026-27</text>
  <text x="480" y="650" font-size="12" font-weight="700" fill="#16a34a">January 05, 2027 (Tuesday)</text>
  <text x="730" y="650" font-size="11" font-weight="600" fill="#16a34a">Even Sem Classes</text>

  <!-- Section 2: Important Guidelines -->
  <rect x="25" y="700" width="850" height="310" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#shadow)" />
  <rect x="25" y="700" width="850" height="44" rx="12" fill="#f8fafc" />
  <text x="45" y="728" font-size="14" font-weight="800" fill="#0f172a">📋 MANDATORY RULES &amp; ATTENDANCE CRITERIA</text>

  <text x="45" y="765" font-size="12.5" font-weight="700" fill="#1e293b">1. Minimum Attendance Requirement:</text>
  <text x="45" y="785" font-size="12" fill="#475569">Students must secure a minimum of 75% overall attendance to be eligible for End Semester Autonomous Examinations.</text>

  <text x="45" y="815" font-size="12.5" font-weight="700" fill="#1e293b">2. On-Duty (OD) Requisition Policy:</text>
  <text x="45" y="835" font-size="12" fill="#475569">OD requests must be submitted through the official portal (onduty.srecieee.org) at least 2 working days prior to the event.</text>

  <text x="45" y="865" font-size="12.5" font-weight="700" fill="#1e293b">3. Continuous Assessment Weights:</text>
  <text x="45" y="885" font-size="12" fill="#475569">Internal Assessment carries 40% and End Semester Examination carries 60% total weightage as per Autonomous Regulations.</text>

  <text x="45" y="915" font-size="12.5" font-weight="700" fill="#1e293b">4. NPTEL / Swayam Credit Transfer:</text>
  <text x="45" y="935" font-size="12" fill="#475569">Certificates for Open Elective credit waiver must be verified and submitted through the portal before November 10, 2026.</text>

  <text x="45" y="965" font-size="12.5" font-weight="700" fill="#1e293b">5. Mentor Contact &amp; Grievance Redressal:</text>
  <text x="45" y="985" font-size="12" fill="#475569">Mentee counseling meetings take place on 2nd and 4th Saturdays. Urgent inquiries can be routed via Tutor-Ward desk.</text>

  <!-- Footer Seal & Signatures -->
  <rect x="25" y="1030" width="850" height="180" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
  
  <text x="60" y="1070" font-size="12" font-weight="700" fill="#64748b">Verified &amp; Approved By:</text>
  
  <text x="60" y="1130" font-size="13" font-weight="800" fill="#0f172a">Dr. S. KAVITHA, Ph.D.</text>
  <text x="60" y="1150" font-size="11" font-weight="600" fill="#64748b">Academic Coordinator / EEE</text>

  <text x="450" y="1130" font-size="13" font-weight="800" fill="#0f172a">Dr. C. S. RAVICHANDRAN, Ph.D.</text>
  <text x="450" y="1150" font-size="11" font-weight="600" fill="#64748b">Head of the Department / EEE</text>

  <text x="750" y="1130" font-size="13" font-weight="800" fill="#0f172a">Dr. N. R. ALAMELU</text>
  <text x="750" y="1150" font-size="11" font-weight="600" fill="#64748b">Principal / SREC</text>

  <line x1="45" y1="1175" x2="855" y2="1175" stroke="#cbd5e1" stroke-width="1" />
  <text x="450" y="1195" text-anchor="middle" font-size="10" font-weight="600" fill="#94a3b8">This is an officially verified autonomous academic calendar generated for the SREC EEE Smart Portal.</text>
</svg>`;

const DEFAULT_CALENDAR_FILE: CalendarFile = {
  id: 'cal_official_2026',
  name: 'SREC_EEE_Academic_Calendar_2026-27.svg',
  size: '184 KB',
  type: 'image/svg+xml',
  dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(DEFAULT_CALENDAR_SVG)}`,
  uploadedAt: '2026-08-01',
  uploadedBy: 'Dr. C. S. Ravichandran (HOD/EEE)',
  academicYear: '2026–2027',
  description: 'Official SREC EEE Autonomous Academic Calendar & Examination Schedule'
};

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  {
    id: 'sug-1',
    studentName: 'Nithin Annamalai (EEE001)',
    category: 'Lab Equipments',
    message: 'Requesting calibration of digital storage oscilloscopes in Power Electronics Lab.',
    createdAt: '2026-08-14 10:30',
    status: 'pending'
  },
  {
    id: 'sug-2',
    studentName: 'Aravind Swamy (EEE002)',
    category: 'Academic',
    message: 'Could we have extra tutorial hours for Power System Operation & Control (EE8601)?',
    createdAt: '2026-08-12 14:15',
    status: 'reviewed'
  }
];

const DEFAULT_LAB_SEATS: LabSeatAssignment[] = [
  {
    id: 'seat-1',
    rollNo: '71812503104',
    studentName: 'Nithin Annamalai',
    labName: 'Power Electronics & Drives Laboratory',
    block: 'EEE Main Block - 2nd Floor',
    roomNo: 'EB-204',
    benchNo: 'Bench B-04',
    systemNo: 'PE-KIT-07',
    session: 'FN (Forenoon)',
    time: '09:00 AM – 12:00 PM',
    supervisor: 'Mr. K. Senthilkumar'
  },
  {
    id: 'seat-2',
    rollNo: '7377221EE002',
    studentName: 'Aravind Swamy',
    labName: 'Renewable Energy Systems Laboratory',
    block: 'EEE Research Block - Ground Floor',
    roomNo: 'RB-102',
    benchNo: 'Bench A-02',
    systemNo: 'RE-SOLAR-03',
    session: 'FN (Forenoon)',
    time: '09:00 AM – 12:00 PM',
    supervisor: 'Ms. P. Vijayalakshmi'
  },
  {
    id: 'seat-3',
    rollNo: '7377221EE003',
    studentName: 'Bhavani Shankar',
    labName: 'Embedded Systems Laboratory',
    block: 'IT & EEE Block - 2nd Floor',
    roomNo: 'EB-308',
    benchNo: 'Bench C-12',
    systemNo: 'EMB-ARM-15',
    session: 'AN (Afternoon)',
    time: '01:30 PM – 04:30 PM',
    supervisor: 'Dr. M. Arulkumar'
  }
];

const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'student@eee.com',
    rollNo: '71812503104',
    name: 'Nithin Annamalai',
    email: 'student@eee.com',
    className: 'II EEE-B',
    yearOfStudy: '2nd Year',
    semester: 'Semester III',
    department: 'Dept of EEE',
    phone: '+91 98421 55678',
    bloodGroup: 'O+',
    dob: '2004-05-14',
    address: 'Coimbatore, Tamil Nadu',
    parentName: 'Annamalai K',
    parentPhone: '+91 94432 11223',
    cgpa: {
      1: { internal1: 85, internal2: 88, semMarks: 86, gpa: 8.5 },
      2: { internal1: 82, internal2: 84, semMarks: 83, gpa: 8.3 },
      3: { internal1: 86, internal2: 87, semMarks: 86, gpa: 8.6 },
      4: { internal1: 88, internal2: 90, semMarks: 87, gpa: 8.7 },
      5: { internal1: 84, internal2: 85, semMarks: 84, gpa: 8.4 },
      6: { internal1: 85, internal2: 86, semMarks: 85, gpa: 8.5 }
    },
    arrears: 0,
    nptelExams: ['Embedded Systems', 'Power Electronics'],
    documents: [
      {
        id: 'doc-1',
        name: 'DOC_Semester V Marksheet.pdf',
        size: '145 KB',
        type: 'application/pdf',
        dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6gogMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PiBlbmRvYmo...',
        uploadedAt: '2026-07-10 14:30'
      }
    ]
  },
  {
    id: 'student2@eee.com',
    rollNo: '7377221EE002',
    name: 'Aravind Swamy',
    email: 'student2@eee.com',
    className: 'II EEE-B',
    yearOfStudy: '2nd Year',
    semester: 'Semester III',
    department: 'Dept of EEE',
    phone: '+91 97890 22341',
    bloodGroup: 'B+',
    dob: '2004-08-22',
    address: 'Tiruppur, Tamil Nadu',
    parentName: 'Swaminathan R',
    parentPhone: '+91 98941 77890',
    cgpa: {
      1: { internal1: 78, internal2: 80, semMarks: 78, gpa: 7.8 },
      2: { internal1: 75, internal2: 76, semMarks: 75, gpa: 7.5 },
      3: { internal1: 79, internal2: 80, semMarks: 79, gpa: 7.9 },
      4: { internal1: 76, internal2: 78, semMarks: 76, gpa: 7.6 },
      5: { internal1: 78, internal2: 79, semMarks: 78, gpa: 7.8 },
      6: { internal1: 79, internal2: 81, semMarks: 80, gpa: 8.0 }
    },
    arrears: 0,
    nptelExams: ['Microprocessors & Microcontrollers'],
    documents: []
  },
  {
    id: 'student3@eee.com',
    rollNo: '7377221EE003',
    name: 'Bhavani Shankar',
    email: 'student3@eee.com',
    className: 'II EEE-B',
    yearOfStudy: '2nd Year',
    semester: 'Semester III',
    department: 'Dept of EEE',
    phone: '+91 94421 99887',
    bloodGroup: 'A+',
    dob: '2004-03-10',
    address: 'Erode, Tamil Nadu',
    parentName: 'Shankar Narayanan',
    parentPhone: '+91 94433 88776',
    cgpa: {
      1: { internal1: 88, internal2: 90, semMarks: 89, gpa: 8.9 },
      2: { internal1: 90, internal2: 92, semMarks: 91, gpa: 9.1 },
      3: { internal1: 87, internal2: 89, semMarks: 88, gpa: 8.8 },
      4: { internal1: 91, internal2: 93, semMarks: 92, gpa: 9.2 },
      5: { internal1: 89, internal2: 90, semMarks: 90, gpa: 9.0 },
      6: { internal1: 90, internal2: 92, semMarks: 91, gpa: 9.1 }
    },
    arrears: 0,
    nptelExams: ['Electric Vehicles', 'Control Engineering'],
    documents: []
  },
  {
    id: 'student4@eee.com',
    rollNo: '7377221EE004',
    name: 'Dinesh Kumar',
    email: 'student4@eee.com',
    className: 'II EEE-B',
    yearOfStudy: '2nd Year',
    semester: 'Semester III',
    department: 'Dept of EEE',
    phone: '+91 99440 12345',
    bloodGroup: 'AB+',
    dob: '2004-11-05',
    address: 'Salem, Tamil Nadu',
    parentName: 'Kumaresan M',
    parentPhone: '+91 98425 67890',
    cgpa: {
      1: { internal1: 72, internal2: 74, semMarks: 73, gpa: 7.3 },
      2: { internal1: 70, internal2: 71, semMarks: 70, gpa: 7.0 },
      3: { internal1: 68, internal2: 70, semMarks: 69, gpa: 6.9 },
      4: { internal1: 71, internal2: 73, semMarks: 72, gpa: 7.2 },
      5: { internal1: 70, internal2: 72, semMarks: 71, gpa: 7.1 },
      6: { internal1: 72, internal2: 74, semMarks: 73, gpa: 7.3 }
    },
    arrears: 1,
    nptelExams: [],
    documents: []
  }
];

const DEFAULT_COURSES: Course[] = [
  { code: '25MA2114', name: 'Transforms and Computational Methods', credits: 4, semester: 6, teacherName: 'Dr. V. Tharanidharan, AP/S&H' },
  { code: '25EE2106', name: 'Electromagnetic Field Theory', credits: 3, semester: 6, teacherName: 'Dr. M. Ezhilarasi, AP(Sl.G)/EEE' },
  { code: '25EE2200', name: 'DC Machines and Transformers', credits: 4, semester: 6, teacherName: 'Dr. H. Vidhya, AP(Sr.G)/EEE' },
  { code: '25EE2250', name: 'Digital Logic Circuits (Theory cum Lab)', credits: 4, semester: 6, teacherName: 'Mr. V. Gopu & Dr. K. Balachander, AP(Sl.G)/EEE' },
  { code: '25CS2261', name: 'Data Structures and Algorithms (Theory cum Lab)', credits: 4, semester: 6, teacherName: 'Faculty from AIDS department' },
  { code: '25EE2201', name: 'PCB design (Skill Enhancement Course)', credits: 2, semester: 6, teacherName: 'Mr. B. Sridhar, AP(Sl.G)/EEE' },
  { code: '25AD2125', name: 'AI tools for Engineers (Liberal Arts Course)', credits: 2, semester: 6, teacherName: 'Faculty from AIDS department' },
  { code: '25BA1E53', name: 'Finance for Engineers (Value Added Course)', credits: 2, semester: 6, teacherName: 'Faculty from MBA department' },
  { code: 'AEC', name: 'Ability Enhancement Course (Foreign language - German / Japanese)', credits: 2, semester: 6, teacherName: 'English Department' },
  { code: '25EE2270', name: 'DC Machines and Transformers Laboratory', credits: 2, semester: 6, teacherName: 'Dr. H. Vidhya & Mr. B. Marisekar, AP(Sr.G)/EEE' },
  { code: 'LIB', name: 'Library & Academic Reading', credits: 1, semester: 6, teacherName: 'Mrs. R.K. Ragavapriya, AP(Sl.G)/EEE' },
  { code: 'GATE', name: 'Gate Questions Solving', credits: 1, semester: 6, teacherName: 'Dr. K. Balamurugan, AsP/EEE' },
  { code: 'TWM', name: 'Tutor Ward Meeting', credits: 1, semester: 6, teacherName: 'Respective Tutors' },
];

const DEFAULT_FACULTY: Faculty[] = [
  { id: 1, name: 'Dr. M. Ezhilarasi', role: 'AP(Sl.G) – Dept of EEE', email: 'm.ezhilarasi@srec.ac.in', phone: '+91-98421-10001' },
  { id: 2, name: 'Dr. H. Vidhya', role: 'AP(Sr.G) – Dept of EEE', email: 'h.vidhya@srec.ac.in', phone: '+91-98421-10002' },
  { id: 3, name: 'Mr. V. Gopu', role: 'AP(Sl.G) – Dept of EEE', email: 'v.gopu@srec.ac.in', phone: '+91-98421-10003' },
  { id: 4, name: 'Dr. K. Balachander', role: 'AP(Sl.G) – Dept of EEE', email: 'k.balachander@srec.ac.in', phone: '+91-98421-10004' },
  { id: 5, name: 'Mr. B. Sridhar', role: 'AP(Sl.G) – Dept of EEE', email: 'b.sridhar@srec.ac.in', phone: '+91-98421-10005' },
  { id: 6, name: 'Mr. B. Marisekar', role: 'AP(Sr.G) – Dept of EEE', email: 'b.marisekar@srec.ac.in', phone: '+91-98421-10006' },
  { id: 7, name: 'Mrs. R.K. Ragavapriya', role: 'AP(Sl.G) – Dept of EEE', email: 'rk.ragavapriya@srec.ac.in', phone: '+91-98421-10007' },
  { id: 8, name: 'Dr. K. Balamurugan', role: 'AsP – Dept of EEE', email: 'k.balamurugan@srec.ac.in', phone: '+91-98421-10008' },
  { id: 9, name: 'Dr. V. Tharanidharan', role: 'AP – Dept of S&H (Maths)', email: 'v.tharanidharan@srec.ac.in', phone: '+91-98421-10009' },
  { id: 10, name: 'Faculty from AIDS Dept', role: 'Faculty – Dept of AIDS (AI Tools & DSA)', email: 'aids.faculty@srec.ac.in', phone: '+91-98421-10010' },
  { id: 11, name: 'Faculty from MBA Dept', role: 'Faculty – Dept of MBA (Finance)', email: 'mba.faculty@srec.ac.in', phone: '+91-98421-10011' },
  { id: 12, name: 'Faculty from English Dept', role: 'Faculty – English & Foreign Languages (AEC)', email: 'languages@srec.ac.in', phone: '+91-98421-10012' },
];

const DEFAULT_RULES: Rule[] = [
  { id: 1, icon: '👔', title: 'Dress Code', desc: 'Formal attire on working days. Lab coat mandatory during lab sessions.' },
  { id: 2, icon: '📊', title: 'Attendance', desc: 'Minimum 75% attendance per subject required to sit for semester exams.' },
  { id: 3, icon: '🥾', title: 'Lab Safety', desc: 'Safety shoes and lab coat compulsory. Mobile usage prohibited during lab.' },
  { id: 4, icon: '🤫', title: 'Discipline', desc: 'Maintain quiet in classrooms & library. Zero tolerance for ragging.' },
  { id: 5, icon: '📱', title: 'Mobile Policy', desc: 'Keep phones in silent mode inside all academic blocks.' },
  { id: 6, icon: '🏆', title: 'Integrity', desc: 'Strict anti-malpractice rules apply to all internal & end-semester exams.' },
];

const DEFAULT_TIMETABLE: TimetableEntry[] = [
  // Monday
  { id: 1, day: 'Mon', period: 1, subject: '25MA2114', teacher: 'Dr. V. Tharanidharan', semester: 6 },
  { id: 2, day: 'Mon', period: 2, subject: '25MA2114', teacher: 'Dr. V. Tharanidharan', semester: 6 },
  { id: 3, day: 'Mon', period: 3, subject: '25CS2261', teacher: 'Faculty from AIDS department', semester: 6 },
  { id: 4, day: 'Mon', period: 4, subject: '25CS2261', teacher: 'Faculty from AIDS department', semester: 6 },
  { id: 5, day: 'Mon', period: 5, subject: '25EE2250 (L)', teacher: 'Mr. V. Gopu / Dr. K. Balachander', semester: 6 },
  { id: 6, day: 'Mon', period: 6, subject: '25EE2250 (L)', teacher: 'Mr. V. Gopu / Dr. K. Balachander', semester: 6 },
  { id: 7, day: 'Mon', period: 7, subject: '25CS2261(L)', teacher: 'Faculty from AIDS department', semester: 6 },
  { id: 8, day: 'Mon', period: 8, subject: '25CS2261(L)', teacher: 'Faculty from AIDS department', semester: 6 },

  // Tuesday
  { id: 9, day: 'Tue', period: 1, subject: '25MA2114', teacher: 'Dr. V. Tharanidharan', semester: 6 },
  { id: 10, day: 'Tue', period: 2, subject: '25MA2114', teacher: 'Dr. V. Tharanidharan', semester: 6 },
  { id: 11, day: 'Tue', period: 3, subject: '25EE2200', teacher: 'Dr. H. Vidhya', semester: 6 },
  { id: 12, day: 'Tue', period: 4, subject: '25EE2200', teacher: 'Dr. H. Vidhya', semester: 6 },
  { id: 13, day: 'Tue', period: 5, subject: '25EE2270 / 25CS2261', teacher: 'Dr. H. Vidhya / Mr. B. Marisekar / AIDS Dept', semester: 6 },
  { id: 14, day: 'Tue', period: 6, subject: '25EE2270 / 25CS2261', teacher: 'Dr. H. Vidhya / Mr. B. Marisekar / AIDS Dept', semester: 6 },
  { id: 15, day: 'Tue', period: 7, subject: '25EE2270 / 25CS2261', teacher: 'Dr. H. Vidhya / Mr. B. Marisekar / AIDS Dept', semester: 6 },
  { id: 16, day: 'Tue', period: 8, subject: 'TWM', teacher: 'Respective Tutors', semester: 6 },

  // Wednesday
  { id: 17, day: 'Wed', period: 1, subject: '25EE2200', teacher: 'Dr. H. Vidhya', semester: 6 },
  { id: 18, day: 'Wed', period: 2, subject: '25EE2200', teacher: 'Dr. H. Vidhya', semester: 6 },
  { id: 19, day: 'Wed', period: 3, subject: '25EE2106', teacher: 'Dr. M. Ezhilarasi', semester: 6 },
  { id: 20, day: 'Wed', period: 4, subject: '25EE2106', teacher: 'Dr. M. Ezhilarasi', semester: 6 },
  { id: 21, day: 'Wed', period: 5, subject: '25EE2201', teacher: 'Mr. B. Sridhar', semester: 6 },
  { id: 22, day: 'Wed', period: 6, subject: 'LIB', teacher: 'Mrs. R.K. Ragavapriya', semester: 6 },
  { id: 23, day: 'Wed', period: 7, subject: '25EE2200(T)', teacher: 'Dr. H. Vidhya', semester: 6 },
  { id: 24, day: 'Wed', period: 8, subject: '25EE2250', teacher: 'Mr. V. Gopu / Dr. K. Balachander', semester: 6 },

  // Thursday
  { id: 25, day: 'Thu', period: 1, subject: '25EE2250', teacher: 'Mr. V. Gopu / Dr. K. Balachander', semester: 6 },
  { id: 26, day: 'Thu', period: 2, subject: '25EE2250', teacher: 'Mr. V. Gopu / Dr. K. Balachander', semester: 6 },
  { id: 27, day: 'Thu', period: 3, subject: 'AEC', teacher: 'English Department (German / Japanese)', semester: 6 },
  { id: 28, day: 'Thu', period: 4, subject: 'AEC', teacher: 'English Department (German / Japanese)', semester: 6 },
  { id: 29, day: 'Thu', period: 5, subject: '25EE2201(L)', teacher: 'Mr. B. Sridhar', semester: 6 },
  { id: 30, day: 'Thu', period: 6, subject: '25EE2201(L)', teacher: 'Mr. B. Sridhar', semester: 6 },
  { id: 31, day: 'Thu', period: 7, subject: '25BA1E53', teacher: 'Faculty from MBA department', semester: 6 },
  { id: 32, day: 'Thu', period: 8, subject: '25BA1E53', teacher: 'Faculty from MBA department', semester: 6 },

  // Friday
  { id: 33, day: 'Fri', period: 1, subject: '25EE2106', teacher: 'Dr. M. Ezhilarasi', semester: 6 },
  { id: 34, day: 'Fri', period: 2, subject: '25EE2270 / 25CS2261', teacher: 'Dr. H. Vidhya / Mr. B. Marisekar / AIDS Dept', semester: 6 },
  { id: 35, day: 'Fri', period: 3, subject: '25EE2270 / 25CS2261', teacher: 'Dr. H. Vidhya / Mr. B. Marisekar / AIDS Dept', semester: 6 },
  { id: 36, day: 'Fri', period: 4, subject: '25EE2270 / 25CS2261', teacher: 'Dr. H. Vidhya / Mr. B. Marisekar / AIDS Dept', semester: 6 },
  { id: 37, day: 'Fri', period: 5, subject: 'GATE', teacher: 'Dr. K. Balamurugan', semester: 6 },
  { id: 38, day: 'Fri', period: 6, subject: 'GATE', teacher: 'Dr. K. Balamurugan', semester: 6 },
  { id: 39, day: 'Fri', period: 7, subject: '25AD2125', teacher: 'Faculty from AIDS department', semester: 6 },
  { id: 40, day: 'Fri', period: 8, subject: '25AD2125', teacher: 'Faculty from AIDS department', semester: 6 },

  // Saturday (BYOD / Self-Study / Mentoring)
  { id: 41, day: 'Sat', period: 1, subject: 'BYOD / Skill Lab', teacher: 'Mrs. R.K. Ragavapriya / Mr. B. Sridhar', semester: 6 },
  { id: 42, day: 'Sat', period: 2, subject: 'BYOD / Skill Lab', teacher: 'Mrs. R.K. Ragavapriya / Mr. B. Sridhar', semester: 6 },
  { id: 43, day: 'Sat', period: 3, subject: 'Library / Self Study', teacher: 'Mrs. R.K. Ragavapriya', semester: 6 },
  { id: 44, day: 'Sat', period: 4, subject: 'Library / Self Study', teacher: 'Mrs. R.K. Ragavapriya', semester: 6 },
  { id: 45, day: 'Sat', period: 5, subject: 'GATE Problem Solving', teacher: 'Dr. K. Balamurugan', semester: 6 },
  { id: 46, day: 'Sat', period: 6, subject: 'GATE Problem Solving', teacher: 'Dr. K. Balamurugan', semester: 6 },
  { id: 47, day: 'Sat', period: 7, subject: 'Project Work / NPTEL', teacher: 'Respective Faculty Mentors', semester: 6 },
  { id: 48, day: 'Sat', period: 8, subject: 'Project Work / NPTEL', teacher: 'Respective Faculty Mentors', semester: 6 },
];

// Initialize local storage fallback
const initLocalDB = () => {
  const DATA_VERSION = 'eee_data_v2026_schedules';
  const currentVer = localStorage.getItem('eee_data_version');
  if (currentVer !== DATA_VERSION) {
    localStorage.setItem('eee_courses', JSON.stringify(DEFAULT_COURSES));
    localStorage.setItem('eee_faculty', JSON.stringify(DEFAULT_FACULTY));
    localStorage.setItem('eee_timetable_3', JSON.stringify(DEFAULT_TIMETABLE.map(e => ({ ...e, semester: 3 }))));
    localStorage.setItem('eee_timetable_6', JSON.stringify(DEFAULT_TIMETABLE));
    localStorage.setItem('eee_data_version', DATA_VERSION);
  }

  if (!localStorage.getItem('eee_announcements')) {
    localStorage.setItem('eee_announcements', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem('eee_students')) {
    localStorage.setItem('eee_students', JSON.stringify(DEFAULT_STUDENTS));
  }
  if (!localStorage.getItem('eee_attendance')) {
    localStorage.setItem('eee_attendance', JSON.stringify([]));
  }
  if (!localStorage.getItem('eee_courses')) {
    localStorage.setItem('eee_courses', JSON.stringify(DEFAULT_COURSES));
  }
  if (!localStorage.getItem('eee_faculty')) {
    localStorage.setItem('eee_faculty', JSON.stringify(DEFAULT_FACULTY));
  }
  if (!localStorage.getItem('eee_timetable_6')) {
    localStorage.setItem('eee_timetable_6', JSON.stringify(DEFAULT_TIMETABLE));
  }
};
initLocalDB();

export const normalizeCgpa = (cgpaJson: any): Record<number, SemesterGrades> => {
  if (!cgpaJson || typeof cgpaJson !== 'object') return {};
  const normalized: Record<number, SemesterGrades> = {};
  Object.keys(cgpaJson).forEach(key => {
    const sem = parseInt(key);
    if (!isNaN(sem)) {
      const val = cgpaJson[key];
      if (typeof val === 'number') {
        normalized[sem] = { gpa: val };
      } else if (val && typeof val === 'object') {
        normalized[sem] = {
          internal1: typeof val.internal1 === 'number' ? val.internal1 : undefined,
          internal2: typeof val.internal2 === 'number' ? val.internal2 : undefined,
          semMarks: typeof val.semMarks === 'number' ? val.semMarks : undefined,
          gpa: typeof val.gpa === 'number' ? val.gpa : undefined
        };
      }
    }
  });
  return normalized;
};

// ----------------------------------------------------
// DATABASE SERVICE METHODS (SUPABASE + LOCALSTORAGE)
// ----------------------------------------------------

export const dbService = {
  // --- Announcements ---
  async getAnnouncements(): Promise<Announcement[]> {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.warn('Supabase getAnnouncements failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_announcements');
      return localData ? JSON.parse(localData) : [];
    }
  },

  async saveAnnouncement(announcement: Omit<Announcement, 'id'> & { id?: string }): Promise<Announcement> {
    const newId = announcement.id || `ann-${Date.now()}`;
    const fullAnn: Announcement = { ...announcement, id: newId };

    try {
      const { data, error } = await supabase
        .from('announcements')
        .upsert(fullAnn)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.warn('Supabase saveAnnouncement failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_announcements');
      const list: Announcement[] = localData ? JSON.parse(localData) : [];

      const index = list.findIndex(a => a.id === fullAnn.id);
      if (index > -1) {
        list[index] = fullAnn;
      } else {
        list.push(fullAnn);
      }
      localStorage.setItem('eee_announcements', JSON.stringify(list));
      return fullAnn;
    }
  },

  async deleteAnnouncement(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase deleteAnnouncement failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_announcements');
      const list: Announcement[] = localData ? JSON.parse(localData) : [];
      const filtered = list.filter(a => a.id !== id);
      localStorage.setItem('eee_announcements', JSON.stringify(filtered));
      return true;
    }
  },

  // --- Student Profiles ---
  async getStudentProfile(email: string): Promise<Student | null> {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        // Parse json fields
        return {
          id: data.id,
          rollNo: data.roll_no,
          name: data.name,
          email: data.email,
          className: data.class_name || 'II EEE-B',
          yearOfStudy: data.year_of_study || '2nd Year',
          semester: data.semester || 'Semester III',
          department: data.department || 'Dept of EEE',
          phone: data.phone || '+91 98421 55678',
          dob: data.dob || '2004-05-14',
          bloodGroup: data.blood_group || 'O+',
          address: data.address || 'Coimbatore, Tamil Nadu',
          parentName: data.parent_name || 'Annamalai K',
          parentPhone: data.parent_phone || '+91 94432 11223',
          cgpa: normalizeCgpa(typeof data.cgpa_json === 'string' ? JSON.parse(data.cgpa_json) : data.cgpa_json),
          arrears: data.arrears_count || 0,
          nptelExams: typeof data.nptel_exams === 'string' ? JSON.parse(data.nptel_exams) : data.nptel_exams || [],
          documents: [] // we fetch documents separately below or join
        };
      }
      throw new Error('Not found');
    } catch (err: any) {
      console.warn(`Supabase getStudentProfile for ${email} failed, using localStorage:`, err.message || err);
      const localData = localStorage.getItem('eee_students');
      const list: Student[] = localData ? JSON.parse(localData) : [];
      return list.find(s => s.email.toLowerCase() === email.toLowerCase()) || null;
    }
  },

  async updateStudentProfile(email: string, updates: Partial<Omit<Student, 'email' | 'documents'>>): Promise<Student> {
    try {
      // Map properties to snake_case for supabase
      const mappedUpdates: any = {};
      if (updates.rollNo !== undefined) mappedUpdates.roll_no = updates.rollNo;
      if (updates.name !== undefined) mappedUpdates.name = updates.name;
      if (updates.cgpa !== undefined) mappedUpdates.cgpa_json = updates.cgpa;
      if (updates.arrears !== undefined) mappedUpdates.arrears_count = updates.arrears;
      if (updates.nptelExams !== undefined) mappedUpdates.nptel_exams = updates.nptelExams;
      if (updates.className !== undefined) mappedUpdates.class_name = updates.className;
      if (updates.yearOfStudy !== undefined) mappedUpdates.year_of_study = updates.yearOfStudy;
      if (updates.semester !== undefined) mappedUpdates.semester = updates.semester;
      if (updates.department !== undefined) mappedUpdates.department = updates.department;
      if (updates.phone !== undefined) mappedUpdates.phone = updates.phone;
      if (updates.dob !== undefined) mappedUpdates.dob = updates.dob;
      if (updates.bloodGroup !== undefined) mappedUpdates.blood_group = updates.bloodGroup;
      if (updates.address !== undefined) mappedUpdates.address = updates.address;
      if (updates.parentName !== undefined) mappedUpdates.parent_name = updates.parentName;
      if (updates.parentPhone !== undefined) mappedUpdates.parent_phone = updates.parentPhone;

      const { error } = await supabase
        .from('student_profiles')
        .update(mappedUpdates)
        .eq('email', email);

      if (error) throw error;

      // Update local storage backup too
      const localData = localStorage.getItem('eee_students');
      if (localData) {
        const list: Student[] = JSON.parse(localData);
        const idx = list.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
        if (idx > -1) {
          list[idx] = { ...list[idx], ...updates };
          localStorage.setItem('eee_students', JSON.stringify(list));
        }
      }

      // Fetch profile for return
      const profile = await this.getStudentProfile(email);
      return profile!;
    } catch (err: any) {
      console.warn(`Supabase updateStudentProfile failed for ${email}, using localStorage:`, err.message || err);
      const localData = localStorage.getItem('eee_students');
      const list: Student[] = localData ? JSON.parse(localData) : [];
      const index = list.findIndex(s => s.email.toLowerCase() === email.toLowerCase());
      if (index > -1) {
        list[index] = { ...list[index], ...updates };
        localStorage.setItem('eee_students', JSON.stringify(list));
        try {
          const extraKey = 'eee_profile_extra_' + email;
          const existing = localStorage.getItem(extraKey);
          const parsed = existing ? JSON.parse(existing) : {};
          localStorage.setItem(extraKey, JSON.stringify({ ...parsed, ...updates }));
        } catch { }
        return list[index];
      }
      throw new Error('Student profile not found');
    }
  },

  async createStudentProfile(student: Omit<Student, 'documents'>): Promise<Student> {
    try {
      const { error } = await supabase
        .from('student_profiles')
        .insert({
          id: student.email,
          roll_no: student.rollNo,
          name: student.name,
          email: student.email,
          cgpa_json: student.cgpa,
          arrears_count: student.arrears,
          nptel_exams: student.nptelExams
        });

      if (error) throw error;
      return { ...student, documents: [] };
    } catch (err: any) {
      console.warn('Supabase createStudentProfile failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_students');
      const list: Student[] = localData ? JSON.parse(localData) : [];
      const newStudent: Student = { ...student, id: student.email, documents: [] };
      list.push(newStudent);
      localStorage.setItem('eee_students', JSON.stringify(list));
      return newStudent;
    }
  },

  // --- Student Documents ---
  async getStudentDocuments(studentEmail: string): Promise<StudentDoc[]> {
    try {
      const { data, error } = await supabase
        .from('student_documents')
        .select('*')
        .eq('student_email', studentEmail);

      if (error) throw error;
      return (data || []).map(d => ({
        id: d.id,
        name: d.name,
        size: d.size,
        type: d.type,
        dataUrl: d.data_url,
        uploadedAt: d.uploaded_at
      }));
    } catch (err: any) {
      console.warn(`Supabase getStudentDocuments failed for ${studentEmail}, using localStorage:`, err.message || err);
      const student = await this.getStudentProfile(studentEmail);
      return student ? student.documents || [] : [];
    }
  },

  async uploadDocument(studentEmail: string, doc: Omit<StudentDoc, 'id' | 'uploadedAt'>): Promise<StudentDoc> {
    const newDoc: StudentDoc = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    try {
      const { error } = await supabase
        .from('student_documents')
        .insert({
          id: newDoc.id,
          student_email: studentEmail,
          name: newDoc.name,
          size: newDoc.size,
          type: newDoc.type,
          data_url: newDoc.dataUrl,
          uploaded_at: newDoc.uploadedAt
        });

      if (error) throw error;
      return newDoc;
    } catch (err: any) {
      console.warn(`Supabase uploadDocument failed for ${studentEmail}, using localStorage:`, err.message || err);
      const localData = localStorage.getItem('eee_students');
      const list: Student[] = localData ? JSON.parse(localData) : [];
      const index = list.findIndex(s => s.email.toLowerCase() === studentEmail.toLowerCase());
      if (index > -1) {
        if (!list[index].documents) list[index].documents = [];
        list[index].documents.push(newDoc);
        localStorage.setItem('eee_students', JSON.stringify(list));
      }
      return newDoc;
    }
  },

  async deleteDocument(studentEmail: string, docId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('student_documents')
        .delete()
        .eq('id', docId)
        .eq('student_email', studentEmail);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn(`Supabase deleteDocument failed, using localStorage:`, err.message || err);
      const localData = localStorage.getItem('eee_students');
      const list: Student[] = localData ? JSON.parse(localData) : [];
      const index = list.findIndex(s => s.email.toLowerCase() === studentEmail.toLowerCase());
      if (index > -1 && list[index].documents) {
        list[index].documents = list[index].documents.filter(d => d.id !== docId);
        localStorage.setItem('eee_students', JSON.stringify(list));
        return true;
      }
      return false;
    }
  },

  // --- Attendance ---
  async getAttendanceForStudent(rollNo: string): Promise<AttendanceLog[]> {
    try {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('student_roll_no', rollNo);

      if (error) throw error;
      return (data || []).map(d => ({
        id: d.id,
        date: d.date,
        period: d.period,
        studentRollNo: d.student_roll_no,
        studentName: d.student_name,
        status: d.status,
        markedBy: d.marked_by
      }));
    } catch (err: any) {
      console.warn(`Supabase getAttendanceForStudent failed, using localStorage:`, err.message || err);
      const localData = localStorage.getItem('eee_attendance');
      const list: AttendanceLog[] = localData ? JSON.parse(localData) : [];
      return list.filter(log => log.studentRollNo === rollNo);
    }
  },

  async saveAttendanceLogs(date: string, period: number, logs: Omit<AttendanceLog, 'id'>[]): Promise<boolean> {
    const logsWithIds = logs.map(l => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...l
    }));

    try {
      // Map to supabase format
      const mappedLogs = logsWithIds.map(l => ({
        id: l.id,
        date: l.date,
        period: l.period,
        student_roll_no: l.studentRollNo,
        student_name: l.studentName,
        status: l.status,
        marked_by: l.markedBy
      }));

      const { error } = await supabase
        .from('attendance_logs')
        .insert(mappedLogs);

      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase saveAttendanceLogs failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_attendance');
      const list: AttendanceLog[] = localData ? JSON.parse(localData) : [];

      // Filter out duplicates for the same date and period, then append new logs
      const filtered = list.filter(l => !(l.date === date && l.period === period));
      filtered.push(...logsWithIds);

      localStorage.setItem('eee_attendance', JSON.stringify(filtered));
      return true;
    }
  },

  // --- All Students (for Admin View) ---
  async fetchAllStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*');

      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          rollNo: d.roll_no,
          name: d.name,
          email: d.email,
          cgpa: normalizeCgpa(typeof d.cgpa_json === 'string' ? JSON.parse(d.cgpa_json) : d.cgpa_json),
          arrears: d.arrears_count || 0,
          nptelExams: typeof d.nptel_exams === 'string' ? JSON.parse(d.nptel_exams) : d.nptel_exams || [],
          documents: [] // loaded reactively in profile docs UI
        }));
      }
      throw new Error('No student data in Supabase');
    } catch (err: any) {
      console.warn('Supabase fetchAllStudents failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_students');
      return localData ? JSON.parse(localData) : [];
    }
  },

  // --- Courses ---
  async getCourses(): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) throw error;
      return (data || []).map((d: any) => ({
        code: d.code,
        name: d.name,
        credits: d.credits,
        semester: d.semester,
        teacherName: d.teacher_name || ''
      }));
    } catch (err: any) {
      console.warn('Supabase getCourses failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_courses');
      return localData ? JSON.parse(localData) : DEFAULT_COURSES;
    }
  },

  async saveCourse(course: Course): Promise<Course> {
    try {
      const payload: any = {
        code: course.code,
        name: course.name,
        credits: course.credits,
        semester: course.semester,
        teacher_name: course.teacherName || ''
      };
      const { error } = await supabase.from('courses').upsert(payload);
      if (error) throw error;
      return course;
    } catch (err: any) {
      console.warn('Supabase saveCourse failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_courses');
      const list: Course[] = localData ? JSON.parse(localData) : [];
      const idx = list.findIndex(c => c.code === course.code);
      if (idx > -1) { list[idx] = course; } else { list.push(course); }
      localStorage.setItem('eee_courses', JSON.stringify(list));
      return course;
    }
  },

  async deleteCourse(code: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('code', code);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase deleteCourse failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_courses');
      const list: Course[] = localData ? JSON.parse(localData) : [];
      localStorage.setItem('eee_courses', JSON.stringify(list.filter(c => c.code !== code)));
      return true;
    }
  },

  // --- Attendance Fetch by Date & Period ---
  async getAttendanceForDateAndPeriod(date: string, period: number): Promise<AttendanceLog[]> {
    try {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('date', date)
        .eq('period', period);

      if (error) throw error;
      return (data || []).map(d => ({
        id: d.id,
        date: d.date,
        period: d.period,
        studentRollNo: d.student_roll_no,
        studentName: d.student_name,
        status: d.status,
        markedBy: d.marked_by
      }));
    } catch (err: any) {
      console.warn(`Supabase getAttendanceForDateAndPeriod failed, using localStorage:`, err.message || err);
      const localData = localStorage.getItem('eee_attendance');
      const list: AttendanceLog[] = localData ? JSON.parse(localData) : [];
      return list.filter(log => log.date === date && log.period === period);
    }
  },

  // --- Milestones ---
  async getMilestones(): Promise<Milestone[]> {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.warn('Supabase getMilestones failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_milestones');
      return localData ? JSON.parse(localData) : [];
    }
  },

  async saveMilestone(milestone: Milestone): Promise<Milestone> {
    try {
      // If saving new item, id is serial so let Supabase generate it (omit if null/undefined)
      const payload = { ...milestone };
      if (!payload.id) delete payload.id;

      const { data, error } = await supabase
        .from('milestones')
        .upsert(payload)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.warn('Supabase saveMilestone failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_milestones') || '[]';
      const list: Milestone[] = JSON.parse(localData);

      if (milestone.id) {
        const idx = list.findIndex(m => m.id === milestone.id);
        if (idx > -1) {
          list[idx] = milestone;
        } else {
          list.push(milestone);
        }
      } else {
        const newM = { ...milestone, id: Date.now() };
        list.push(newM);
        milestone.id = newM.id;
      }
      localStorage.setItem('eee_milestones', JSON.stringify(list));
      return milestone;
    }
  },

  async deleteMilestone(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase deleteMilestone failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_milestones');
      const list: Milestone[] = localData ? JSON.parse(localData) : [];
      const filtered = list.filter(m => m.id !== id);
      localStorage.setItem('eee_milestones', JSON.stringify(filtered));
      return true;
    }
  },

  // --- Labs ---
  async getLabs(): Promise<Lab[]> {
    try {
      const { data, error } = await supabase
        .from('labs')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return (data || []).map((d: any) => ({ id: d.id, name: d.name, block: d.block, icon: d.icon }));
    } catch (err: any) {
      console.warn('Supabase getLabs failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_labs');
      return localData ? JSON.parse(localData) : [];
    }
  },

  async saveLab(lab: Lab): Promise<Lab> {
    try {
      const payload: any = { name: lab.name, block: lab.block, icon: lab.icon };
      if (lab.id) payload.id = lab.id;
      const { data, error } = await supabase.from('labs').upsert(payload).select().single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.warn('Supabase saveLab failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_labs') || '[]';
      const list: Lab[] = JSON.parse(localData);
      if (lab.id) {
        const idx = list.findIndex(l => l.id === lab.id);
        if (idx > -1) { list[idx] = lab; } else { list.push(lab); }
      } else {
        const newL = { ...lab, id: Date.now() };
        list.push(newL);
        lab.id = newL.id;
      }
      localStorage.setItem('eee_labs', JSON.stringify(list));
      return lab;
    }
  },

  async deleteLab(id: number): Promise<boolean> {
    try {
      const { error } = await supabase.from('labs').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase deleteLab failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_labs');
      const list: Lab[] = localData ? JSON.parse(localData) : [];
      localStorage.setItem('eee_labs', JSON.stringify(list.filter(l => l.id !== id)));
      return true;
    }
  },

  // --- Faculty ---
  async getFaculty(): Promise<Faculty[]> {
    try {
      const { data, error } = await supabase.from('faculty').select('*').order('id', { ascending: true });
      if (error) throw error;
      return (data || []).map((d: any) => ({ id: d.id, name: d.name, role: d.role, email: d.email, phone: d.phone }));
    } catch (err: any) {
      console.warn('Supabase getFaculty failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_faculty');
      return localData ? JSON.parse(localData) : DEFAULT_FACULTY;
    }
  },

  async saveFaculty(faculty: Faculty): Promise<Faculty> {
    try {
      const payload: any = { name: faculty.name, role: faculty.role, email: faculty.email, phone: faculty.phone };
      if (faculty.id) payload.id = faculty.id;
      const { data, error } = await supabase.from('faculty').upsert(payload).select().single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.warn('Supabase saveFaculty failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_faculty') || JSON.stringify(DEFAULT_FACULTY);
      const list: Faculty[] = JSON.parse(localData);
      if (faculty.id) {
        const idx = list.findIndex(f => f.id === faculty.id);
        if (idx > -1) { list[idx] = faculty; } else { list.push(faculty); }
      } else {
        const newF = { ...faculty, id: Date.now() };
        list.push(newF);
        faculty.id = newF.id;
      }
      localStorage.setItem('eee_faculty', JSON.stringify(list));
      return faculty;
    }
  },

  async deleteFaculty(id: number): Promise<boolean> {
    try {
      const { error } = await supabase.from('faculty').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase deleteFaculty failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_faculty');
      const list: Faculty[] = localData ? JSON.parse(localData) : [];
      localStorage.setItem('eee_faculty', JSON.stringify(list.filter(f => f.id !== id)));
      return true;
    }
  },

  // --- Rules ---
  async getRules(): Promise<Rule[]> {
    try {
      const { data, error } = await supabase.from('rules').select('*').order('id', { ascending: true });
      if (error) throw error;
      return (data || []).map((d: any) => ({ id: d.id, icon: d.icon, title: d.title, desc: d.description || d.desc || '' }));
    } catch (err: any) {
      console.warn('Supabase getRules failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_rules');
      return localData ? JSON.parse(localData) : DEFAULT_RULES;
    }
  },

  async saveRule(rule: Rule): Promise<Rule> {
    try {
      const payload: any = { icon: rule.icon, title: rule.title, description: rule.desc };
      if (rule.id) payload.id = rule.id;
      const { data, error } = await supabase.from('rules').upsert(payload).select().single();
      if (error) throw error;
      return { id: data.id, icon: data.icon, title: data.title, desc: data.description || data.desc || rule.desc };
    } catch (err: any) {
      console.warn('Supabase saveRule failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_rules') || JSON.stringify(DEFAULT_RULES);
      const list: Rule[] = JSON.parse(localData);
      if (rule.id) {
        const idx = list.findIndex(r => r.id === rule.id);
        if (idx > -1) { list[idx] = rule; } else { list.push(rule); }
      } else {
        const newR = { ...rule, id: Date.now() };
        list.push(newR);
        rule.id = newR.id;
      }
      localStorage.setItem('eee_rules', JSON.stringify(list));
      return rule;
    }
  },

  async deleteRule(id: number): Promise<boolean> {
    try {
      const { error } = await supabase.from('rules').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase deleteRule failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_rules');
      const list: Rule[] = localData ? JSON.parse(localData) : [];
      localStorage.setItem('eee_rules', JSON.stringify(list.filter(r => r.id !== id)));
      return true;
    }
  },

  // --- Timetable ---
  async getTimetable(semester: number = 3): Promise<TimetableEntry[]> {
    try {
      const { data, error } = await supabase
        .from('timetable_entries')
        .select('*')
        .eq('semester', semester)
        .order('id', { ascending: true });
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map((d: any) => ({ id: d.id, day: d.day, period: d.period, subject: d.subject, teacher: d.teacher || '', semester: d.semester }));
      }
      throw new Error('No timetable in Supabase');
    } catch (err: any) {
      console.warn('Supabase getTimetable failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem(`eee_timetable_${semester}`);
      if (localData) return JSON.parse(localData);
      const filtered = DEFAULT_TIMETABLE.filter(e => e.semester === semester);
      return filtered.length > 0 ? filtered : DEFAULT_TIMETABLE.map(e => ({ ...e, semester }));
    }
  },

  async saveTimetableEntry(entry: TimetableEntry): Promise<TimetableEntry> {
    try {
      const payload: any = { day: entry.day, period: entry.period, subject: entry.subject, teacher: entry.teacher || '', semester: entry.semester };
      if (entry.id) payload.id = entry.id;
      const { data, error } = await supabase.from('timetable_entries').upsert(payload).select().single();
      if (error) throw error;
      return data;
    } catch (err: any) {
      console.warn('Supabase saveTimetableEntry failed, using localStorage:', err.message || err);
      const key = `eee_timetable_${entry.semester}`;
      const localData = localStorage.getItem(key) || JSON.stringify(DEFAULT_TIMETABLE.filter(e => e.semester === entry.semester));
      const list: TimetableEntry[] = JSON.parse(localData);
      const idx = list.findIndex(e => e.day === entry.day && e.period === entry.period);
      if (idx > -1) { list[idx] = { ...list[idx], ...entry }; } else { list.push(entry); }
      localStorage.setItem(key, JSON.stringify(list));
      return entry;
    }
  },



  // --- Letter Requests ---
  async getLetterRequests(studentEmail?: string): Promise<LetterRequest[]> {
    try {
      const { data, error } = await supabase
        .from('letter_requests')
        .select('*');
      if (error) throw error;
      const list = (data || []).map(d => ({
        id: d.id,
        studentEmail: d.student_email,
        studentName: d.student_name,
        rollNo: d.roll_no,
        letterType: d.letter_type,
        purpose: d.purpose,
        details: d.details,
        status: d.status,
        requestedAt: d.requested_at,
        pdfUrl: d.pdf_url,
        adminRemarks: d.admin_remarks
      }));
      if (studentEmail) {
        return list.filter(r => r.studentEmail.toLowerCase() === studentEmail.toLowerCase());
      }
      return list;
    } catch (err: any) {
      console.warn('Supabase getLetterRequests failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_letter_requests');
      const list: LetterRequest[] = localData ? JSON.parse(localData) : [];
      if (studentEmail) {
        return list.filter(r => r.studentEmail.toLowerCase() === studentEmail.toLowerCase());
      }
      return list;
    }
  },

  async saveLetterRequest(req: LetterRequest): Promise<LetterRequest> {
    try {
      const payload = {
        id: req.id,
        student_email: req.studentEmail,
        student_name: req.studentName,
        roll_no: req.rollNo,
        letter_type: req.letterType,
        purpose: req.purpose,
        details: req.details,
        status: req.status,
        requested_at: req.requestedAt,
        pdf_url: req.pdfUrl,
        admin_remarks: req.adminRemarks
      };
      const { error } = await supabase
        .from('letter_requests')
        .upsert(payload);
      if (error) throw error;
      return req;
    } catch (err: any) {
      console.warn('Supabase saveLetterRequest failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_letter_requests') || '[]';
      const list: LetterRequest[] = JSON.parse(localData);
      const idx = list.findIndex(r => r.id === req.id);
      if (idx > -1) {
        list[idx] = req;
      } else {
        list.push(req);
      }
      localStorage.setItem('eee_letter_requests', JSON.stringify(list));
      return req;
    }
  },

  async deleteLetterRequest(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('letter_requests')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase deleteLetterRequest failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_letter_requests');
      const list: LetterRequest[] = localData ? JSON.parse(localData) : [];
      localStorage.setItem('eee_letter_requests', JSON.stringify(list.filter(r => r.id !== id)));
      return true;
    }
  },

  // --- OD Requests ---
  async getODRequests(studentEmail?: string): Promise<ODRequest[]> {
    try {
      const { data, error } = await supabase
        .from('od_requests')
        .select('*');
      if (error) throw error;
      const list = (data || []).map(d => ({
        id: d.id,
        studentEmail: d.student_email,
        studentName: d.student_name,
        rollNo: d.roll_no,
        odType: d.od_type,
        odSubCategory: d.od_sub_category,
        eventName: d.event_name,
        eventDate: d.event_date,
        venue: d.venue,
        facultyCoordinator: d.faculty_coordinator,
        students: typeof d.students === 'string' ? JSON.parse(d.students) : d.students,
        status: d.status,
        requestedAt: d.requested_at,
        pdfUrl: d.pdf_url,
        adminRemarks: d.admin_remarks
      }));
      if (studentEmail) {
        return list.filter(r => r.studentEmail.toLowerCase() === studentEmail.toLowerCase());
      }
      return list;
    } catch (err: any) {
      console.warn('Supabase getODRequests failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_od_requests');
      const list: ODRequest[] = localData ? JSON.parse(localData) : [];
      if (studentEmail) {
        return list.filter(r => r.studentEmail.toLowerCase() === studentEmail.toLowerCase());
      }
      return list;
    }
  },

  async saveODRequest(req: ODRequest): Promise<ODRequest> {
    try {
      const payload = {
        id: req.id,
        student_email: req.studentEmail,
        student_name: req.studentName,
        roll_no: req.rollNo,
        od_type: req.odType,
        od_sub_category: req.odSubCategory,
        event_name: req.eventName,
        event_date: req.eventDate,
        venue: req.venue,
        faculty_coordinator: req.facultyCoordinator,
        students: JSON.stringify(req.students),
        status: req.status,
        requested_at: req.requestedAt,
        pdf_url: req.pdfUrl,
        admin_remarks: req.adminRemarks
      };
      const { error } = await supabase
        .from('od_requests')
        .upsert(payload);
      if (error) throw error;
      return req;
    } catch (err: any) {
      console.warn('Supabase saveODRequest failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_od_requests') || '[]';
      const list: ODRequest[] = JSON.parse(localData);
      const idx = list.findIndex(r => r.id === req.id);
      if (idx > -1) {
        list[idx] = req;
      } else {
        list.push(req);
      }
      localStorage.setItem('eee_od_requests', JSON.stringify(list));
      return req;
    }
  },

  async deleteODRequest(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('od_requests')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.warn('Supabase deleteODRequest failed, using localStorage:', err.message || err);
      const localData = localStorage.getItem('eee_od_requests');
      const list: ODRequest[] = localData ? JSON.parse(localData) : [];
      localStorage.setItem('eee_od_requests', JSON.stringify(list.filter(r => r.id !== id)));
      return true;
    }
  },

  // --- Academic Calendar File (Admin Uploaded) ---
  async getCalendarFile(): Promise<CalendarFile | null> {
    try {
      const { data, error } = await supabase
        .from('calendar_files')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          name: data.name,
          size: data.size,
          type: data.type,
          dataUrl: data.data_url,
          uploadedAt: data.uploaded_at,
          uploadedBy: data.uploaded_by,
          academicYear: data.academic_year,
          description: data.description
        };
      }
    } catch (err: any) {
      console.warn('Supabase getCalendarFile failed, using localStorage:', err.message || err);
    }
    const local = localStorage.getItem('eee_academic_calendar_file');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return DEFAULT_CALENDAR_FILE;
      }
    }
    return DEFAULT_CALENDAR_FILE;
  },

  async saveCalendarFile(file: CalendarFile): Promise<CalendarFile> {
    const fileWithMeta: CalendarFile = {
      ...file,
      id: file.id || 'cal_' + Date.now(),
      uploadedAt: file.uploadedAt || new Date().toISOString().split('T')[0]
    };
    try {
      const payload = {
        id: fileWithMeta.id,
        name: fileWithMeta.name,
        size: fileWithMeta.size,
        type: fileWithMeta.type,
        data_url: fileWithMeta.dataUrl,
        uploaded_at: fileWithMeta.uploadedAt,
        uploaded_by: fileWithMeta.uploadedBy || 'Admin',
        academic_year: fileWithMeta.academicYear || '2026–2027',
        description: fileWithMeta.description || 'SREC EEE Department Official Academic Calendar'
      };
      await supabase.from('calendar_files').upsert(payload);
    } catch (err: any) {
      console.warn('Supabase saveCalendarFile failed, using localStorage:', err.message || err);
    }
    localStorage.setItem('eee_academic_calendar_file', JSON.stringify(fileWithMeta));
    return fileWithMeta;
  },

  async deleteCalendarFile(): Promise<boolean> {
    try {
      await supabase.from('calendar_files').delete().neq('id', '');
    } catch (err: any) {
      console.warn('Supabase deleteCalendarFile failed, using localStorage:', err.message || err);
    }
    localStorage.removeItem('eee_academic_calendar_file');
    return true;
  },

  // --- Timetable File (Admin Uploaded Image/PDF) ---
  async getTimetableFile(semester: number = 6): Promise<TimetableFile | null> {
    try {
      const { data, error } = await supabase
        .from('timetable_files')
        .select('*')
        .eq('semester', semester)
        .order('uploaded_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        return {
          id: data.id,
          name: data.name,
          size: data.size,
          type: data.type,
          dataUrl: data.data_url,
          uploadedAt: data.uploaded_at,
          uploadedBy: data.uploaded_by,
          semester: data.semester
        };
      }
    } catch (err: any) {
      console.warn('Supabase getTimetableFile failed, using localStorage:', err.message || err);
    }
    const local = localStorage.getItem(`eee_timetable_file_${semester}`) || localStorage.getItem('eee_timetable_img');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return null;
      }
    }
    return null;
  },

  async saveTimetableFile(file: TimetableFile): Promise<TimetableFile> {
    const sem = file.semester || 6;
    const fileWithMeta: TimetableFile = {
      ...file,
      id: file.id || 'tt_file_' + Date.now(),
      uploadedAt: file.uploadedAt || new Date().toISOString().split('T')[0],
      semester: sem
    };
    try {
      const payload = {
        id: fileWithMeta.id,
        name: fileWithMeta.name,
        size: fileWithMeta.size,
        type: fileWithMeta.type,
        data_url: fileWithMeta.dataUrl,
        uploaded_at: fileWithMeta.uploadedAt,
        uploaded_by: fileWithMeta.uploadedBy || 'Admin',
        semester: sem
      };
      await supabase.from('timetable_files').upsert(payload);
    } catch (err: any) {
      console.warn('Supabase saveTimetableFile failed, using localStorage:', err.message || err);
    }
    localStorage.setItem(`eee_timetable_file_${sem}`, JSON.stringify(fileWithMeta));
    localStorage.setItem('eee_timetable_img', JSON.stringify(fileWithMeta));
    return fileWithMeta;
  },

  async deleteTimetableFile(semester: number = 6): Promise<boolean> {
    try {
      await supabase.from('timetable_files').delete().eq('semester', semester);
    } catch (err: any) {
      console.warn('Supabase deleteTimetableFile failed, using localStorage:', err.message || err);
    }
    localStorage.removeItem(`eee_timetable_file_${semester}`);
    localStorage.removeItem('eee_timetable_img');
    return true;
  },

  // --- Student Suggestions ---
  async getSuggestions(): Promise<Suggestion[]> {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          studentName: d.student_name,
          category: d.category,
          message: d.message,
          createdAt: d.created_at,
          status: d.status || 'pending'
        }));
      }
    } catch (err: any) {
      console.warn('Supabase getSuggestions failed, using localStorage:', err.message || err);
    }
    const local = localStorage.getItem('eee_suggestions');
    return local ? JSON.parse(local) : DEFAULT_SUGGESTIONS;
  },

  async saveSuggestion(suggestion: Omit<Suggestion, 'id' | 'createdAt'>): Promise<Suggestion> {
    const newSug: Suggestion = {
      ...suggestion,
      id: 'sug_' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending'
    };
    try {
      await supabase.from('suggestions').insert({
        id: newSug.id,
        student_name: newSug.studentName || 'Anonymous Scholar',
        category: newSug.category,
        message: newSug.message,
        created_at: newSug.createdAt,
        status: newSug.status
      });
    } catch (err: any) {
      console.warn('Supabase saveSuggestion failed, using localStorage:', err.message || err);
    }
    const local = localStorage.getItem('eee_suggestions');
    const list: Suggestion[] = local ? JSON.parse(local) : [...DEFAULT_SUGGESTIONS];
    list.unshift(newSug);
    localStorage.setItem('eee_suggestions', JSON.stringify(list));
    return newSug;
  },

  async deleteSuggestion(id: string): Promise<boolean> {
    try {
      await supabase.from('suggestions').delete().eq('id', id);
    } catch (err: any) {
      console.warn('Supabase deleteSuggestion failed, using localStorage:', err.message || err);
    }
    const local = localStorage.getItem('eee_suggestions');
    const list: Suggestion[] = local ? JSON.parse(local) : [];
    localStorage.setItem('eee_suggestions', JSON.stringify(list.filter(s => s.id !== id)));
    return true;
  },

  // --- Lab Seat Assignments ---
  async getLabSeatAssignments(): Promise<LabSeatAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('lab_seats')
        .select('*');
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map(d => ({
          id: d.id,
          rollNo: d.roll_no,
          studentName: d.student_name,
          labName: d.lab_name,
          block: d.block,
          roomNo: d.room_no,
          benchNo: d.bench_no,
          systemNo: d.system_no,
          session: d.session,
          time: d.time,
          supervisor: d.supervisor
        }));
      }
    } catch (err: any) {
      console.warn('Supabase getLabSeatAssignments failed, using localStorage:', err.message || err);
    }
    const local = localStorage.getItem('eee_lab_seats');
    return local ? JSON.parse(local) : DEFAULT_LAB_SEATS;
  },

  async saveLabSeatAssignment(assignment: LabSeatAssignment): Promise<LabSeatAssignment> {
    const item = {
      ...assignment,
      id: assignment.id || 'seat_' + Date.now()
    };
    try {
      await supabase.from('lab_seats').upsert({
        id: item.id,
        roll_no: item.rollNo,
        student_name: item.studentName,
        lab_name: item.labName,
        block: item.block,
        room_no: item.roomNo,
        bench_no: item.benchNo,
        system_no: item.systemNo,
        session: item.session,
        time: item.time,
        supervisor: item.supervisor
      });
    } catch (err: any) {
      console.warn('Supabase saveLabSeatAssignment failed, using localStorage:', err.message || err);
    }
    const local = localStorage.getItem('eee_lab_seats');
    const list: LabSeatAssignment[] = local ? JSON.parse(local) : [...DEFAULT_LAB_SEATS];
    const idx = list.findIndex(s => s.rollNo === item.rollNo && s.labName === item.labName);
    if (idx > -1) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    localStorage.setItem('eee_lab_seats', JSON.stringify(list));
    return item;
  },

  async deleteStudentProfile(email: string): Promise<boolean> {
    try {
      await supabase.from('student_profiles').delete().eq('email', email);
    } catch (err: any) {
      console.warn('Supabase deleteStudentProfile failed, using localStorage:', err.message || err);
    }
    const local = localStorage.getItem('eee_students');
    if (local) {
      const list: Student[] = JSON.parse(local);
      localStorage.setItem('eee_students', JSON.stringify(list.filter(s => s.email.toLowerCase() !== email.toLowerCase())));
    }
    return true;
  }
};

