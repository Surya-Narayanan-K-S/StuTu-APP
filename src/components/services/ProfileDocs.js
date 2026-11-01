import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { dbService } from '../../services/db';
import { ArrowLeft, Upload, Download, Trash2, Search, UserCheck, Plus, X, User, Phone, Calendar, Droplets, MapPin, BookOpen, Hash, Layers, CheckCircle, Edit3, Award, FileText, Sparkles, CheckCircle2, ChevronDown } from 'lucide-react';
const CERT_CATEGORY_CONFIG = [
    { label: 'NPTEL & Swayam Certifications', icon: '🎓', color: '#0052cc', bg: '#eff6ff' },
    { label: 'Internship & Industry Training', icon: '💼', color: '#059669', bg: '#ecfdf5' },
    { label: 'Workshops & Seminars', icon: '🛠️', color: '#d97706', bg: '#fffbeb' },
    { label: 'Sports & Co-Curricular', icon: '🏆', color: '#dc2626', bg: '#fef2f2' },
    { label: 'Academic Degrees & Marksheets', icon: '📜', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Other Certificates', icon: '📑', color: '#475569', bg: '#f8fafc' },
];
const CERT_CATEGORIES = CERT_CATEGORY_CONFIG.map(c => c.label);
const DOC_CATEGORIES = [
    'Academic Marksheets',
    'Identity Proofs (Aadhar, ID, etc.)',
    'Resumes & CVs',
    'Recommendation & Permission Letters',
    'General Documents'
];
export const ProfileDocs = ({ currentEmail, isAdmin, onBack, mode = 'documents', currentUser, onUpdateUser }) => {
    const [student, setStudent] = useState(null);
    const [docs, setDocs] = useState([]);
    // Admin states
    const [allStudents, setAllStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
    // Add student modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [addName, setAddName] = useState('');
    const [addRollNo, setAddRollNo] = useState('');
    const [addEmail, setAddEmail] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [customDocName, setCustomDocName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    // ── Profile Edit States ──────────────────────────────
    const [profileName, setProfileName] = useState('');
    const [profileRollNo, setProfileRollNo] = useState('');
    const [profileClass, setProfileClass] = useState('');
    const [profileYear, setProfileYear] = useState('');
    const [profileSem, setProfileSem] = useState('');
    const [profileDept, setProfileDept] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profileDob, setProfileDob] = useState('');
    const [profileBlood, setProfileBlood] = useState('');
    const [profileAddress, setProfileAddress] = useState('');
    const [profileParentName, setProfileParentName] = useState('');
    const [profileParentPhone, setProfileParentPhone] = useState('');
    const [showEditBioModal, setShowEditBioModal] = useState(false);
    // Populate profile fields from currentUser
    useEffect(() => {
        if (mode === 'profile' && currentUser) {
            setProfileName(currentUser.name || '');
            setProfileRollNo(currentUser.rollNo || '');
            setProfileClass(currentUser.className || '');
            setProfileYear(currentUser.yearOfStudy || '');
            setProfileSem(currentUser.semester || '');
            setProfileDept(currentUser.department || '');
            setProfilePhone(currentUser.phone || '');
            setProfileDob(currentUser.dob || '');
            setProfileBlood(currentUser.bloodGroup || '');
            setProfileAddress(currentUser.address || '');
            setProfileParentName(currentUser.parentName || '');
            setProfileParentPhone(currentUser.parentPhone || '');
        }
    }, [mode, currentUser]);
    // Load student data
    useEffect(() => {
        if (mode !== 'profile')
            loadData();
    }, [currentEmail, selectedStudentEmail, isAdmin, mode]);
    const loadData = async () => {
        if (isAdmin) {
            const list = await dbService.fetchAllStudents();
            setAllStudents(list);
            if (selectedStudentEmail) {
                const p = await dbService.getStudentProfile(selectedStudentEmail);
                if (p) {
                    setStudent(p);
                    const d = await dbService.getStudentDocuments(p.email);
                    setDocs(d);
                }
            }
            else {
                setStudent(null);
                setDocs([]);
            }
        }
        else {
            const p = await dbService.getStudentProfile(currentEmail);
            if (p) {
                setStudent(p);
                const d = await dbService.getStudentDocuments(p.email);
                setDocs(d);
            }
            else {
                const fallbackStudent = {
                    id: currentEmail || 'student@eee.com',
                    rollNo: '71812503104',
                    name: 'Nithin Annamalai',
                    email: currentEmail || 'student@eee.com',
                    cgpa: {
                        1: { internal1: 85, internal2: 88, semMarks: 86, gpa: 8.5 },
                        2: { internal1: 82, internal2: 84, semMarks: 83, gpa: 8.3 },
                        3: { internal1: 86, internal2: 87, semMarks: 86, gpa: 8.6 },
                        4: { internal1: 88, internal2: 90, semMarks: 87, gpa: 8.7 },
                        5: { internal1: 84, internal2: 85, semMarks: 84, gpa: 8.4 },
                        6: { internal1: 85, internal2: 86, semMarks: 85, gpa: 8.5 }
                    },
                    arrears: 0,
                    nptelExams: [],
                    documents: []
                };
                setStudent(fallbackStudent);
                const d = await dbService.getStudentDocuments(fallbackStudent.email);
                setDocs(d);
            }
        }
    };
    // ── Save Profile Handler ─────────────────────────────
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = {
                ...currentUser,
                name: profileName.trim() || currentUser?.name || '',
                rollNo: profileRollNo.trim() || currentUser?.rollNo || '',
                className: profileClass.trim(),
                yearOfStudy: profileYear.trim(),
                semester: profileSem.trim(),
                department: profileDept.trim(),
                phone: profilePhone.trim(),
                dob: profileDob.trim(),
                bloodGroup: profileBlood.trim(),
                address: profileAddress.trim(),
                parentName: profileParentName.trim(),
                parentPhone: profileParentPhone.trim(),
            };
            onUpdateUser?.(updated);
            // Persist to localStorage so it survives refresh
            localStorage.setItem('eee_profile_extra_' + (currentUser?.email || 'student'), JSON.stringify(updated));
        }
        finally {
            setSaving(false);
        }
    };
    const handleAddStudentSubmit = async (e) => {
        e.preventDefault();
        if (!addName.trim() || !addRollNo.trim() || !addEmail.trim())
            return;
        setSaving(true);
        setStatusMessage('');
        try {
            await dbService.createStudentProfile({
                id: addEmail.trim().toLowerCase(),
                rollNo: addRollNo.trim(),
                name: addName.trim(),
                email: addEmail.trim().toLowerCase(),
                cgpa: {},
                arrears: 0,
                nptelExams: []
            });
            setStatusMessage('Student profile created successfully!');
            setTimeout(() => setStatusMessage(''), 3000);
            setAddName('');
            setAddRollNo('');
            setAddEmail('');
            setShowAddModal(false);
            loadData();
        }
        catch (err) {
            console.error(err);
            setStatusMessage(err.message || 'Error creating student profile.');
        }
        finally {
            setSaving(false);
        }
    };
    const autoRecognizeDocName = (fileName) => {
        const baseName = fileName.replace(/\.[^/.]+$/, '');
        let cleanName = baseName.replace(/[_\-\.]+/g, ' ');
        const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        const lower = cleanName.toLowerCase();
        if (lower.includes('sem 1') || lower.includes('sem1') || lower.includes('semester 1'))
            return 'Semester I Marksheet';
        if (lower.includes('sem 2') || lower.includes('sem2') || lower.includes('semester 2'))
            return 'Semester II Marksheet';
        if (lower.includes('sem 3') || lower.includes('sem3') || lower.includes('semester 3'))
            return 'Semester III Marksheet';
        if (lower.includes('sem 4') || lower.includes('sem4') || lower.includes('semester 4'))
            return 'Semester IV Marksheet';
        if (lower.includes('sem 5') || lower.includes('sem5') || lower.includes('semester 5'))
            return 'Semester V Marksheet';
        if (lower.includes('sem 6') || lower.includes('sem6') || lower.includes('semester 6'))
            return 'Semester III Marksheet';
        if (lower.includes('sem 7') || lower.includes('sem7') || lower.includes('semester 7'))
            return 'Semester IIII Marksheet';
        if (lower.includes('sem 8') || lower.includes('sem8') || lower.includes('semester 8'))
            return 'Semester IIIII Marksheet';
        if (lower.includes('nptel') || lower.includes('swayam')) {
            if (lower.includes('python'))
                return 'NPTEL Python Programming Certificate';
            if (lower.includes('java'))
                return 'NPTEL Java Programming Certificate';
            if (lower.includes('iot'))
                return 'NPTEL Internet of Things Certificate';
            return 'NPTEL Certification';
        }
        if (lower.includes('bonafide'))
            return 'Bonafide Certificate';
        if (lower.includes('noc'))
            return 'No Objection Certificate (NOC)';
        if (lower.includes('internship') || lower.includes('training'))
            return 'Internship Certificate';
        if (lower.includes('resume') || lower.includes('cv'))
            return 'Student Resume';
        if (lower.includes('aadhar') || lower.includes('adhaar') || lower.includes('aadhaar'))
            return 'Aadhar Card / Identity Proof';
        return toTitleCase(cleanName);
    };
    const handleOpenUploadModal = () => {
        setCustomDocName('');
        setSelectedFile(null);
        setSelectedCategory(mode === 'certificates' ? CERT_CATEGORIES[0] : DOC_CATEGORIES[0]);
        setShowUploadModal(true);
    };
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file || (mode !== 'documents' && !student))
            return;
        if (file.type !== 'application/pdf') {
            setStatusMessage('Only PDF documents are supported.');
            return;
        }
        setSelectedFile(file);
        setCustomDocName(autoRecognizeDocName(file.name));
        e.target.value = '';
    };
    const handleActualUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !customDocName.trim())
            return;
        const targetEmail = mode === 'documents'
            ? (student?.email || currentEmail)
            : (student?.email || currentEmail);
        if (!targetEmail)
            return;
        setUploading(true);
        setStatusMessage('');
        const file = selectedFile;
        const docName = customDocName.trim();
        const category = selectedCategory;
        setSelectedFile(null);
        setShowUploadModal(false);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64Data = event.target?.result;
            const sizeKB = Math.round(file.size / 1024);
            try {
                let nameToSave;
                if (mode === 'documents') {
                    // Simple: just prefix DOC_ + name
                    const finalName = docName.toLowerCase().endsWith('.pdf') ? docName : `${docName}.pdf`;
                    nameToSave = 'DOC_' + finalName;
                }
                else {
                    const prefix = 'CERT_';
                    const finalName = docName.toLowerCase().endsWith('.pdf') ? docName : `${docName}.pdf`;
                    nameToSave = prefix + category + '::' + finalName;
                }
                await dbService.uploadDocument(targetEmail, {
                    name: nameToSave,
                    size: `${sizeKB} KB`,
                    type: file.type,
                    dataUrl: base64Data
                });
                setStatusMessage(mode === 'certificates' ? 'Certificate uploaded!' : 'Document uploaded!');
                setTimeout(() => setStatusMessage(''), 3000);
                loadData();
            }
            catch (err) {
                console.error(err);
                setStatusMessage('Error uploading file.');
            }
            finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };
    const filteredDocs = docs.filter(doc => {
        if (mode === 'certificates')
            return doc.name.startsWith('CERT_');
        return doc.name.startsWith('DOC_') || (!doc.name.startsWith('CERT_') && !doc.name.startsWith('NPTEL_'));
    });
    const getDisplayName = (docName) => {
        let n = docName;
        if (n.startsWith('CERT_'))
            n = n.substring(5);
        else if (n.startsWith('DOC_'))
            n = n.substring(4);
        if (n.includes('::'))
            return n.split('::')[1].replace(/\.pdf$/i, '');
        return n.replace(/\.pdf$/i, '');
    };
    const getDocCategory = (docName) => {
        let n = docName;
        if (n.startsWith('CERT_'))
            n = n.substring(5);
        else if (n.startsWith('DOC_'))
            n = n.substring(4);
        if (n.includes('::'))
            return n.split('::')[0];
        return mode === 'certificates' ? 'Other Certificates' : 'General Documents';
    };
    const handleDeleteDoc = async (id) => {
        if (!student)
            return;
        if (!window.confirm('Delete this document?'))
            return;
        try {
            await dbService.deleteDocument(student.email, id);
            setStatusMessage('Document deleted.');
            setTimeout(() => setStatusMessage(''), 3000);
            loadData();
        }
        catch (err) {
            console.error(err);
            setStatusMessage('Error deleting document.');
        }
    };
    const downloadDoc = (doc) => {
        const link = document.createElement('a');
        link.href = doc.dataUrl;
        link.download = doc.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const filteredStudents = allStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()));
    // ─────────────────────────────────────────────────────
    // ── MODE: PROFILE ────────────────────────────────────
    // ─────────────────────────────────────────────────────
    if (mode === 'profile') {
        const initials = (profileName || currentUser?.name || 'S').charAt(0).toUpperCase();
        return (_jsxs("div", { className: "dedicated-page-view page-slide-enter", style: { background: '#f8fafc', minHeight: '100vh', paddingBottom: 88 }, children: [_jsxs("div", { className: "dedicated-page-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("button", { className: "page-back-btn", onClick: onBack, title: "Go Back", children: _jsx(ArrowLeft, { size: 16 }) }), _jsxs("div", { children: [_jsx("h2", { className: "dedicated-page-title", style: { margin: 0, fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }, children: "\uD83D\uDC64 Student Profile & ID Pass" }), _jsx("span", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: "Sri Ramakrishna Engineering College \u00B7 EEE Department" })] })] }), _jsxs("button", { onClick: () => setShowEditBioModal(true), style: {
                                padding: '7px 14px',
                                borderRadius: 14,
                                border: 'none',
                                background: 'linear-gradient(135deg, #0052cc 0%, #2563eb 100%)',
                                color: '#ffffff',
                                fontSize: 11.5,
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,82,204,0.3)'
                            }, children: [_jsx(Edit3, { size: 13 }), " Edit Bio"] })] }), _jsxs("div", { style: { padding: 16, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }, children: [_jsxs("div", { style: {
                                background: 'linear-gradient(135deg, #0052cc 0%, #1e3a8a 100%)',
                                borderRadius: 28,
                                padding: '24px 20px',
                                color: '#ffffff',
                                boxShadow: '0 16px 36px rgba(0, 82, 204, 0.3)',
                                position: 'relative',
                                overflow: 'hidden'
                            }, children: [_jsx("div", { style: { position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', pointerEvents: 'none' } }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 12, marginBottom: 16 }, children: [_jsxs("div", { children: [_jsx("span", { style: { fontSize: 10, fontWeight: 900, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.85, display: 'block' }, children: "Sri Ramakrishna Engineering College" }), _jsx("span", { style: { fontSize: 12.5, fontWeight: 900, letterSpacing: -0.2 }, children: "Department of Electrical & Electronics" })] }), _jsx("span", { style: { padding: '3px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 800, border: '1px solid rgba(255,255,255,0.3)' }, children: "UG 2022\u201326" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }, children: [_jsxs("div", { style: { position: 'relative', flexShrink: 0 }, children: [_jsx("div", { style: {
                                                        width: 68,
                                                        height: 68,
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #ff5f1f 0%, #ea580c 100%)',
                                                        border: '3px solid #ffffff',
                                                        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 26,
                                                        fontWeight: 900,
                                                        color: '#ffffff'
                                                    }, children: initials }), _jsx("div", { style: { position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: '#10b981', border: '2px solid #ffffff' } })] }), _jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx("h3", { style: { fontSize: 20, fontWeight: 900, margin: '0 0 2px 0', letterSpacing: -0.5 }, children: profileName || currentUser?.name || 'Nithin Annamalai' }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }, children: [_jsxs("span", { style: { padding: '2px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.18)', fontSize: 11, fontWeight: 800 }, children: ["Roll: ", profileRollNo || currentUser?.rollNo || '71812503104'] }), _jsx("span", { style: { padding: '2px 8px', borderRadius: 8, background: 'rgba(255,255,255,0.18)', fontSize: 11, fontWeight: 800 }, children: profileClass || 'II EEE-B' })] })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, background: 'rgba(0,0,0,0.18)', padding: '10px 8px', borderRadius: 16, textAlign: 'center' }, children: [_jsxs("div", { children: [_jsx("span", { style: { fontSize: 8.5, opacity: 0.75, textTransform: 'uppercase', display: 'block' }, children: "Attendance" }), _jsx("strong", { style: { fontSize: 13, color: '#38bdf8' }, children: "94.5%" })] }), _jsxs("div", { children: [_jsx("span", { style: { fontSize: 8.5, opacity: 0.75, textTransform: 'uppercase', display: 'block' }, children: "CGPA" }), _jsx("strong", { style: { fontSize: 13, color: '#4ade80' }, children: "8.64" })] }), _jsxs("div", { children: [_jsx("span", { style: { fontSize: 8.5, opacity: 0.75, textTransform: 'uppercase', display: 'block' }, children: "Certs" }), _jsx("strong", { style: { fontSize: 13, color: '#fcd34d' }, children: docs.filter(d => d.name.startsWith('CERT_')).length || 3 })] }), _jsxs("div", { children: [_jsx("span", { style: { fontSize: 8.5, opacity: 0.75, textTransform: 'uppercase', display: 'block' }, children: "Arrears" }), _jsx("strong", { style: { fontSize: 13, color: '#6ee7b7' }, children: "0 Clear" })] })] })] }), _jsxs("div", { style: { background: '#ffffff', borderRadius: 24, padding: 20, border: '1.5px solid rgba(0,82,204,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }, children: [_jsxs("h4", { style: { margin: '0 0 14px 0', fontSize: 13.5, fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(BookOpen, { size: 16, color: "var(--accent-blue)" }), " Academic Enrollment"] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }, children: [_jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Class & Section" }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }, children: profileClass || 'II EEE-B' })] }), _jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Semester" }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }, children: profileSem || 'Semester III' })] }), _jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Academic Year" }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }, children: profileYear || '2nd Year (2022–26)' })] }), _jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Faculty Tutor" }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }, children: "Dr. S. Kavitha" })] })] })] }), _jsxs("div", { style: { background: '#ffffff', borderRadius: 24, padding: 20, border: '1.5px solid rgba(0,82,204,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }, children: [_jsxs("h4", { style: { margin: '0 0 14px 0', fontSize: 13.5, fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(User, { size: 16, color: "#059669" }), " Personal & Contact Info"] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: [_jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: 11, color: '#64748b', fontWeight: 700 }, children: "Institutional Email" }), _jsx("span", { style: { fontSize: 12.5, fontWeight: 800, color: 'var(--accent-blue)' }, children: currentUser?.email || currentEmail })] }), _jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: 11, color: '#64748b', fontWeight: 700 }, children: "Mobile Phone" }), _jsx("span", { style: { fontSize: 12.5, fontWeight: 800, color: 'var(--text-main)' }, children: profilePhone || '+91 98765 43210' })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }, children: [_jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Blood Group" }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }, children: profileBlood || 'O+' })] }), _jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Date of Birth" }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }, children: profileDob || '14-07-2004' })] })] }), _jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Permanent Address" }), _jsx("span", { style: { fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }, children: profileAddress || '12, Anna Nagar, Peelamedu, Coimbatore - 641004' })] })] })] }), _jsxs("div", { style: { background: '#ffffff', borderRadius: 24, padding: 20, border: '1.5px solid rgba(0,82,204,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }, children: [_jsxs("h4", { style: { margin: '0 0 14px 0', fontSize: 13.5, fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(Phone, { size: 16, color: "#d97706" }), " Parent / Guardian Contact"] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }, children: [_jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Guardian Name" }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }, children: profileParentName || 'Annamalai R' })] }), _jsxs("div", { style: { background: '#f8fafc', padding: '10px 14px', borderRadius: 14, border: '1px solid #e2e8f0' }, children: [_jsx("span", { style: { fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block' }, children: "Emergency Phone" }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }, children: profileParentPhone || '+91 98765 43210' })] })] })] })] }), showEditBioModal && createPortal(_jsx("div", { style: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(15, 23, 42, 0.65)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 999999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px'
                    }, onClick: () => setShowEditBioModal(false), children: _jsxs("div", { style: {
                            width: '100%',
                            maxWidth: 480,
                            maxHeight: '90vh',
                            background: '#ffffff',
                            borderRadius: 24,
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            animation: 'fluidTabSpring 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
                        }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { style: { background: 'linear-gradient(135deg, #0052cc 0%, #1e40af 100%)', padding: '16px 20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h3", { style: { margin: 0, fontSize: 15, fontWeight: 900 }, children: "\u270F\uFE0F Edit Profile Bio" }), _jsx("button", { onClick: () => setShowEditBioModal(false), style: { background: 'rgba(255,255,255,0.2)', border: 'none', color: '#ffffff', width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }, children: _jsx(X, { size: 16 }) })] }), _jsxs("form", { onSubmit: async (e) => {
                                    await handleSaveProfile(e);
                                    setShowEditBioModal(false);
                                }, style: { padding: '18px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }, children: [_jsx(ProfileField, { icon: _jsx(User, { size: 14 }), label: "Full Name", type: "text", value: profileName, onChange: setProfileName, placeholder: "e.g. Nithin Annamalai", required: true }), _jsx(ProfileField, { icon: _jsx(Hash, { size: 14 }), label: "Roll Number", type: "text", value: profileRollNo, onChange: setProfileRollNo, placeholder: "e.g. 71812503104", required: true }), _jsx(ProfileField, { icon: _jsx(Layers, { size: 14 }), label: "Class & Section", type: "text", value: profileClass, onChange: setProfileClass, placeholder: "e.g. II EEE-B" }), _jsx(ProfileField, { icon: _jsx(Calendar, { size: 14 }), label: "Year of Study", type: "text", value: profileYear, onChange: setProfileYear, placeholder: "e.g. 2nd Year" }), _jsx(ProfileField, { icon: _jsx(BookOpen, { size: 14 }), label: "Semester", type: "text", value: profileSem, onChange: setProfileSem, placeholder: "e.g. Semester III" }), _jsx(ProfileField, { icon: _jsx(Phone, { size: 14 }), label: "Phone Number", type: "tel", value: profilePhone, onChange: setProfilePhone, placeholder: "e.g. 98765 43210" }), _jsx(ProfileField, { icon: _jsx(Droplets, { size: 14 }), label: "Blood Group", type: "text", value: profileBlood, onChange: setProfileBlood, placeholder: "e.g. O+, A+, B-" }), _jsx(ProfileField, { icon: _jsx(Calendar, { size: 14 }), label: "Date of Birth", type: "date", value: profileDob, onChange: setProfileDob, placeholder: "" }), _jsx(ProfileField, { icon: _jsx(MapPin, { size: 14 }), label: "Address", type: "text", value: profileAddress, onChange: setProfileAddress, placeholder: "e.g. 12, Anna Nagar, Coimbatore" }), _jsx(ProfileField, { icon: _jsx(User, { size: 14 }), label: "Parent / Guardian Name", type: "text", value: profileParentName, onChange: setProfileParentName, placeholder: "e.g. Annamalai R" }), _jsx(ProfileField, { icon: _jsx(Phone, { size: 14 }), label: "Parent Phone Number", type: "tel", value: profileParentPhone, onChange: setProfileParentPhone, placeholder: "e.g. 98765 43210" }), _jsxs("div", { style: { display: 'flex', gap: 10, marginTop: 8 }, children: [_jsx("button", { type: "button", onClick: () => setShowEditBioModal(false), style: { flex: 1, padding: '12px', borderRadius: 14, border: '1.5px solid #cbd5e1', background: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: 13, cursor: 'pointer' }, children: "Cancel" }), _jsx("button", { type: "submit", disabled: saving, style: { flex: 1, padding: '12px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #0052cc 0%, #2563eb 100%)', color: '#ffffff', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,82,204,0.3)' }, children: saving ? 'Saving...' : 'Save Details' })] })] })] }) }), document.body)] }));
    }
    // ─────────────────────────────────────────────────────
    // ── MODE: DOCUMENTS / CERTIFICATES ──────────────────
    // ─────────────────────────────────────────────────────
    return (_jsxs("div", { className: "dedicated-page-view page-slide-enter", style: { background: '#f8fafc', minHeight: '100vh', paddingBottom: 88 }, children: [_jsx("div", { className: "dedicated-page-header", children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("button", { className: "page-back-btn", onClick: selectedStudentEmail ? () => setSelectedStudentEmail(null) : onBack, title: "Go Back", children: _jsx(ArrowLeft, { size: 16 }) }), _jsxs("div", { children: [_jsx("h2", { className: "dedicated-page-title", style: { margin: 0, fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }, children: isAdmin && !selectedStudentEmail
                                        ? (mode === 'certificates' ? '🏆 Certificates Directory' : '👥 Student Database')
                                        : (mode === 'certificates' ? '🏆 Certified Skill Vault' : '📁 Academic Document Vault') }), _jsx("span", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: isAdmin && !selectedStudentEmail ? 'Institution Verification Center' : `Student ID: ${student?.rollNo || '71812503104'}` })] })] }) }), _jsxs("div", { style: { padding: 16, maxWidth: 640, margin: '0 auto' }, children: [isAdmin && !selectedStudentEmail && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "form-group", style: { position: 'relative' }, children: [_jsx("input", { type: "text", placeholder: "Search by name or roll number...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), className: "form-input", style: { paddingLeft: '36px' } }), _jsx(Search, { size: 16, style: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' } })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("p", { className: "form-label", style: { margin: 0 }, children: "Select a student:" }), _jsxs("button", { onClick: () => setShowAddModal(true), style: { padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, background: 'var(--accent-blue)', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: 6, fontWeight: 700 }, children: [_jsx(Plus, { size: 12 }), " Add Student"] })] }), filteredStudents.length === 0 ? (_jsx("p", { style: { textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', padding: '20px 0' }, children: "No students found." })) : (filteredStudents.map(s => (_jsxs("div", { className: "attendance-mark-item", onClick: () => setSelectedStudentEmail(s.email), style: { cursor: 'pointer' }, children: [_jsxs("div", { children: [_jsx("h4", { style: { fontSize: 13, fontWeight: '700' }, children: s.name }), _jsxs("p", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: ["Roll: ", s.rollNo, " | ", s.email] })] }), _jsx(UserCheck, { size: 18, style: { color: 'var(--accent-blue)' } })] }, s.id))))] })] })), (!isAdmin || selectedStudentEmail) && student && (_jsxs(_Fragment, { children: [isAdmin && (_jsxs("div", { style: { background: 'rgba(56, 189, 248, 0.1)', padding: 10, borderRadius: 10, fontSize: 11, border: '1px solid rgba(56,189,248,0.2)', marginBottom: 8 }, children: ["Viewing: ", _jsxs("strong", { children: [student.name, " (", student.rollNo, ")"] })] })), _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }, children: [_jsxs("div", { children: [_jsx("h4", { style: { fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: 0, letterSpacing: -0.3 }, children: mode === 'certificates' ? '🏆 Certificates Vault' : '📁 Documents Vault' }), _jsx("p", { style: { fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0 0' }, children: mode === 'certificates' ? 'NPTEL, Symposia, Workshops & Course Certifications' : 'Academic Proofs, Bonafide, Resume & ID Records' })] }), _jsxs("button", { onClick: handleOpenUploadModal, className: "modern-add-cert-btn", children: [_jsx(Plus, { size: 15 }), _jsx("span", { children: mode === 'certificates' ? 'Add Certificate' : 'Add Document' })] })] }), uploading && (_jsx("div", { style: { padding: 14, background: 'rgba(0,82,204,0.06)', border: '1.5px solid rgba(0,82,204,0.18)', borderRadius: 16, textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 12 }, children: "\u23F3 Uploading and securing to encrypted vault..." })), statusMessage && (_jsx("div", { style: { padding: 10, background: '#eff6ff', border: '1px solid rgba(0,82,204,0.18)', borderRadius: 12, fontSize: 11.5, textAlign: 'center', color: 'var(--accent-blue)', fontWeight: 700, marginBottom: 12 }, children: statusMessage })), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 14 }, children: filteredDocs.length === 0 ? (_jsxs("div", { style: { background: '#ffffff', borderRadius: 20, border: '1.5px dashed rgba(0,82,204,0.18)', padding: '36px 20px', textAlign: 'center' }, children: [_jsx("div", { style: { width: 50, height: 50, borderRadius: 16, background: 'rgba(0,82,204,0.08)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }, children: mode === 'certificates' ? _jsx(Award, { size: 26 }) : _jsx(FileText, { size: 26 }) }), _jsx("h4", { style: { fontSize: 14, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }, children: mode === 'certificates' ? 'No Certificates Stored' : 'No Documents Stored' }), _jsxs("p", { style: { fontSize: 11.5, color: 'var(--text-muted)', margin: 0 }, children: ["Click \"Add ", mode === 'certificates' ? 'Certificate' : 'Document', "\" to upload your PDFs."] })] })) : mode === 'documents' ? (_jsx("div", { style: { background: '#ffffff', border: '1.5px solid rgba(0,82,204,0.12)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }, children: filteredDocs.map((doc, idx) => (_jsxs("div", { style: {
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '12px 16px',
                                                    borderBottom: idx < filteredDocs.length - 1 ? '1px solid rgba(0,82,204,0.06)' : 'none',
                                                    background: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                                                    transition: 'background 0.2s ease'
                                                }, children: [_jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsx("div", { style: { width: 34, height: 34, borderRadius: 10, background: 'rgba(0,82,204,0.1)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, children: _jsx(FileText, { size: 16 }) }), _jsxs("div", { children: [_jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'block' }, children: getDisplayName(doc.name) }), _jsxs("span", { style: { fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 }, children: [doc.size, " \u00B7 Uploaded ", doc.uploadedAt] })] })] }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsx("button", { onClick: () => downloadDoc(doc), className: "doc-action-btn", title: "Download", children: _jsx(Download, { size: 15 }) }), _jsx("button", { onClick: () => handleDeleteDoc(doc.id), className: "doc-action-btn delete", title: "Delete", children: _jsx(Trash2, { size: 15 }) })] })] }, doc.id))) })) : (
                                        // Certificates: Grouped by Category with Modern Cards
                                        (() => {
                                            const grouped = {};
                                            filteredDocs.forEach(doc => {
                                                const cat = getDocCategory(doc.name);
                                                if (!grouped[cat])
                                                    grouped[cat] = [];
                                                grouped[cat].push(doc);
                                            });
                                            return Object.keys(grouped).map(cat => (_jsxs("div", { className: "modern-cert-category-card", children: [_jsxs("div", { className: "modern-cert-category-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("span", { style: { fontSize: 14 }, children: "\uD83D\uDCC1" }), _jsx("span", { style: { fontSize: 12.5, fontWeight: 900, color: 'var(--text-main)' }, children: cat })] }), _jsxs("span", { className: "modern-cert-count-pill", children: [grouped[cat].length, " ", grouped[cat].length === 1 ? 'Cert' : 'Certs'] })] }), _jsx("div", { style: { padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }, children: grouped[cat].map((doc) => (_jsxs("div", { className: "modern-cert-item-row", children: [_jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center', minWidth: 0, flex: 1 }, children: [_jsx("div", { className: "modern-cert-pdf-badge", children: _jsx(Award, { size: 16 }) }), _jsxs("div", { style: { minWidth: 0, flex: 1 }, children: [_jsx("span", { style: { fontSize: 12.5, fontWeight: 800, color: 'var(--text-main)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: getDisplayName(doc.name) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }, children: [_jsx("span", { style: { fontSize: 10, color: '#16a34a', fontWeight: 800, background: '#dcfce7', padding: '1px 6px', borderRadius: 6 }, children: "\u2713 Verified PDF" }), _jsxs("span", { style: { fontSize: 10, color: 'var(--text-muted)' }, children: [doc.size, " \u00B7 ", doc.uploadedAt] })] })] })] }), _jsxs("div", { style: { display: 'flex', gap: 6, flexShrink: 0 }, children: [_jsx("button", { onClick: () => downloadDoc(doc), className: "modern-cert-action-btn download", title: "Download Certificate", children: _jsx(Download, { size: 14 }) }), _jsx("button", { onClick: () => handleDeleteDoc(doc.id), className: "modern-cert-action-btn delete", title: "Delete Certificate", children: _jsx(Trash2, { size: 14 }) })] })] }, doc.id))) })] }, cat)));
                                        })()) })] })] })), showAddModal && typeof document !== 'undefined' && createPortal(_jsx("div", { className: "modern-cert-modal-backdrop", children: _jsxs("form", { className: "modern-cert-modal-card", onSubmit: handleAddStudentSubmit, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }, children: [_jsx("h3", { style: { fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: 0 }, children: "\uD83D\uDC64 Add Student Profile" }), _jsx("button", { type: "button", className: "modern-cert-modal-close", onClick: () => setShowAddModal(false), children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Full Name" }), _jsx("input", { type: "text", value: addName, onChange: e => setAddName(e.target.value), className: "form-input", placeholder: "e.g. John Doe", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Roll Number" }), _jsx("input", { type: "text", value: addRollNo, onChange: e => setAddRollNo(e.target.value), className: "form-input", placeholder: "e.g. 7377221EE100", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Email Address" }), _jsx("input", { type: "email", value: addEmail, onChange: e => setAddEmail(e.target.value), className: "form-input", placeholder: "e.g. student3@eee.com", required: true })] }), _jsx("button", { type: "submit", className: "modern-cert-submit-btn", disabled: saving, children: saving ? 'Creating...' : 'Register Student' })] }) }), document.body), showUploadModal && typeof document !== 'undefined' && createPortal(_jsx("div", { className: "modern-cert-modal-backdrop", children: _jsxs("form", { className: "modern-cert-modal-card", onSubmit: handleActualUpload, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }, children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }, children: [_jsx("div", { style: { width: 28, height: 28, borderRadius: 8, background: 'rgba(0,82,204,0.1)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: mode === 'certificates' ? _jsx(Award, { size: 16 }) : _jsx(FileText, { size: 16 }) }), _jsx("h3", { style: { fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: 0 }, children: mode === 'certificates' ? 'Add Certificate' : 'Add Document' })] }), _jsx("p", { style: { fontSize: 11, color: 'var(--text-muted)', margin: 0 }, children: "Upload your verified PDF to the secure institutional vault" })] }), _jsx("button", { type: "button", className: "modern-cert-modal-close", onClick: () => setShowUploadModal(false), children: _jsx(X, { size: 16 }) })] }), mode === 'certificates' && (_jsxs("div", { className: "form-group", style: { marginBottom: 14, position: 'relative' }, children: [_jsx("label", { className: "form-label", style: { fontSize: 11.5, fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: 6 }, children: "Category / Group" }), _jsxs("div", { className: "custom-dropdown-container", children: [_jsxs("button", { type: "button", className: "custom-dropdown-trigger", onClick: () => setIsDropdownOpen(!isDropdownOpen), children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }, children: [_jsx("span", { style: { fontSize: 16 }, children: CERT_CATEGORY_CONFIG.find(c => c.label === selectedCategory)?.icon || '🎓' }), _jsx("span", { style: { fontWeight: 800, color: 'var(--text-main)', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: selectedCategory || CERT_CATEGORIES[0] })] }), _jsx(ChevronDown, { size: 16, className: `dropdown-chevron ${isDropdownOpen ? 'open' : ''}` })] }), isDropdownOpen && (_jsx("div", { className: "custom-dropdown-menu", children: CERT_CATEGORY_CONFIG.map(cat => (_jsxs("div", { className: `custom-dropdown-option ${selectedCategory === cat.label ? 'active' : ''}`, onClick: () => {
                                                            setSelectedCategory(cat.label);
                                                            setIsDropdownOpen(false);
                                                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("span", { style: { fontSize: 16 }, children: cat.icon }), _jsx("span", { style: { fontSize: 12.5, fontWeight: selectedCategory === cat.label ? 800 : 600 }, children: cat.label })] }), selectedCategory === cat.label && _jsx(CheckCircle, { size: 15, style: { color: 'var(--accent-blue)', flexShrink: 0 } })] }, cat.label))) }))] })] })), _jsxs("div", { className: "form-group", style: { marginBottom: 14 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }, children: [_jsx("label", { className: "form-label", style: { fontSize: 11.5, fontWeight: 800, color: 'var(--text-main)', margin: 0 }, children: mode === 'certificates' ? 'Certificate Name' : 'Document Name' }), selectedFile && (_jsxs("span", { style: { fontSize: 9.5, background: 'rgba(22, 163, 74, 0.12)', color: '#16a34a', padding: '2px 8px', borderRadius: 10, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }, children: [_jsx(Sparkles, { size: 10 }), " Auto-Recognized"] }))] }), _jsx("input", { type: "text", value: customDocName, onChange: e => setCustomDocName(e.target.value), className: "modern-cert-input", placeholder: mode === 'certificates' ? 'e.g. NPTEL Python Programming, EV Workshop 2026...' : 'e.g. Resume, Bonafide Letter, ID Card...', required: true })] }), _jsxs("div", { className: "form-group", style: { marginBottom: 18 }, children: [_jsx("label", { className: "form-label", style: { fontSize: 11.5, fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: 6 }, children: "Attach PDF Document" }), selectedFile ? (_jsxs("div", { className: "modern-attached-file-box", children: [_jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center', minWidth: 0, flex: 1 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 12, background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, children: _jsx(CheckCircle2, { size: 20 }) }), _jsxs("div", { style: { minWidth: 0, flex: 1 }, children: [_jsx("span", { style: { fontWeight: 800, color: '#166534', fontSize: 12.5, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: selectedFile.name }), _jsxs("span", { style: { color: '#64748b', fontSize: 10.5, fontWeight: 600 }, children: [(selectedFile.size / 1024).toFixed(1), " KB \u00B7 Ready to Save"] })] })] }), _jsxs("label", { className: "modern-change-file-btn", children: ["Change", _jsx("input", { type: "file", accept: "application/pdf", onChange: handleFileUpload, style: { display: 'none' } })] })] })) : (_jsxs("label", { className: "modern-pdf-dropzone", children: [_jsx("div", { style: { width: 48, height: 48, borderRadius: 16, background: 'rgba(0, 82, 204, 0.08)', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }, children: _jsx(Upload, { size: 22 }) }), _jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--accent-blue)' }, children: "Click to select PDF Certificate" }), _jsx("span", { style: { fontSize: 10.5, color: 'var(--text-muted)', marginTop: 3 }, children: "Accepts verified PDF files up to 10MB" }), _jsx("input", { type: "file", accept: "application/pdf", onChange: handleFileUpload, style: { display: 'none' } })] }))] }), _jsxs("div", { style: { display: 'flex', gap: 10 }, children: [_jsxs("button", { type: "submit", className: "modern-cert-submit-btn", disabled: !selectedFile || !customDocName.trim(), children: [_jsx(Award, { size: 15 }), " Upload & Secure Certificate"] }), _jsx("button", { type: "button", onClick: () => setShowUploadModal(false), className: "modern-cert-cancel-btn", children: "Cancel" })] })] }) }), document.body)] })] }));
};
// ── Reusable Profile Field Row ───────────────────────
function ProfileField({ icon, label, type, value, onChange, placeholder, required }) {
    return (_jsxs("div", { children: [_jsx("label", { style: { fontSize: 11, fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 5 }, children: label }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: '#f8fafc', borderRadius: 10, border: '1.5px solid #e2e8f0', transition: 'border-color 0.2s' }, onFocus: () => { }, children: [_jsx("span", { style: { color: '#94a3b8', flexShrink: 0, display: 'flex', alignItems: 'center' }, children: icon }), _jsx("input", { type: type, value: value, onChange: e => onChange(e.target.value), placeholder: placeholder, required: required, style: {
                            flex: 1, border: 'none', background: 'transparent', padding: '10px 0',
                            fontSize: 13, fontWeight: 600, color: '#0f172a', outline: 'none'
                        } })] })] }));
}
