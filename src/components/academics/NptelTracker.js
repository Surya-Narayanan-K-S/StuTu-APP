import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { dbService } from '../../services/db';
import { ArrowLeft, Plus, Trash2, Award, Search, UserCheck, Upload, Download, CheckCircle2, BookOpen, X, Sparkles, FileText, Clock, ChevronDown, ChevronUp } from 'lucide-react';
const STATUS_CONFIG = {
    registered: { label: 'Registered', color: '#0052cc', bg: 'rgba(0,82,204,0.1)', icon: Clock },
    'in-progress': { label: 'In Progress', color: '#d97706', bg: 'rgba(217,119,6,0.1)', icon: BookOpen },
    completed: { label: 'Completed', color: '#059669', bg: 'rgba(5,150,105,0.1)', icon: CheckCircle2 },
};
export const NptelTracker = ({ currentEmail, isAdmin, onBack }) => {
    const [student, setStudent] = useState(null);
    const [exams, setExams] = useState([]);
    const [docs, setDocs] = useState([]);
    const [uploading, setUploading] = useState(null); // exam name being uploaded
    const [expandedExam, setExpandedExam] = useState(null);
    // Admin states
    const [allStudents, setAllStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
    // Form state
    const [newExam, setNewExam] = useState('');
    const [newStatus, setNewStatus] = useState('registered');
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusType, setStatusType] = useState('success');
    const [newlyAdded, setNewlyAdded] = useState(null);
    // Per-exam upload state
    const [pendingFiles, setPendingFiles] = useState({});
    const [pendingNames, setPendingNames] = useState({});
    const formRef = useRef(null);
    useEffect(() => {
        loadData();
    }, [currentEmail, selectedStudentEmail, isAdmin]);
    const loadData = async () => {
        if (isAdmin) {
            const list = await dbService.fetchAllStudents();
            setAllStudents(list);
            if (selectedStudentEmail) {
                const p = await dbService.getStudentProfile(selectedStudentEmail);
                if (p) {
                    setStudent(p);
                    setExams(p.nptelExams || []);
                    const d = await dbService.getStudentDocuments(p.email);
                    setDocs(d);
                }
            }
            else {
                setStudent(null);
                setExams([]);
                setDocs([]);
            }
        }
        else {
            const p = await dbService.getStudentProfile(currentEmail);
            if (p) {
                setStudent(p);
                setExams(p.nptelExams || []);
                const d = await dbService.getStudentDocuments(p.email);
                setDocs(d);
            }
            else {
                const fallback = {
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
                    nptelExams: ['Embedded Systems', 'Power Electronics'],
                    documents: []
                };
                setStudent(fallback);
                setExams(fallback.nptelExams);
                const d = await dbService.getStudentDocuments(fallback.email);
                setDocs(d);
            }
        }
    };
    const showStatus = (msg, type = 'success') => {
        setStatusMessage(msg);
        setStatusType(type);
        setTimeout(() => setStatusMessage(''), 3000);
    };
    const handleAddExam = async (e) => {
        e.preventDefault();
        if (!newExam.trim() || !student)
            return;
        setSaving(true);
        const examEntry = newExam.trim();
        const updatedExams = [...exams, examEntry];
        try {
            await dbService.updateStudentProfile(student.email, { nptelExams: updatedExams });
            setExams(updatedExams);
            setNewlyAdded(examEntry);
            setExpandedExam(examEntry);
            setTimeout(() => setNewlyAdded(null), 1200);
            setNewExam('');
            setNewStatus('registered');
            showStatus('Course added successfully!');
            loadData();
        }
        catch (err) {
            console.error(err);
            showStatus('Error adding course.', 'error');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDeleteExam = async (examName) => {
        if (!student)
            return;
        if (!window.confirm(`Remove "${examName}" from NPTEL list?`))
            return;
        setSaving(true);
        const updatedExams = exams.filter(e => e !== examName);
        try {
            await dbService.updateStudentProfile(student.email, { nptelExams: updatedExams });
            setExams(updatedExams);
            showStatus('Course removed.');
            loadData();
        }
        catch (err) {
            showStatus('Error removing course.', 'error');
        }
        finally {
            setSaving(false);
        }
    };
    // Select file for a specific exam (stores in pending state)
    const handleSelectFile = (examName, file) => {
        if (!file)
            return;
        if (file.type !== 'application/pdf') {
            showStatus('Only PDF files are supported.', 'error');
            return;
        }
        setPendingFiles(prev => ({ ...prev, [examName]: file }));
        // Auto-fill cert name from file
        const base = file.name.replace(/\.[^/.]+$/, '').replace(/[_\-\.]+/g, ' ');
        const autoName = base.length > 2 ? base : `${examName} Certificate`;
        setPendingNames(prev => ({ ...prev, [examName]: prev[examName] || autoName }));
    };
    // Actually upload the certificate for an exam
    const handleUploadCertificate = async (examName) => {
        const file = pendingFiles[examName];
        const certName = (pendingNames[examName] || examName).trim();
        if (!file || !student || !certName)
            return;
        setUploading(examName);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64Data = event.target?.result;
            const sizeKB = Math.round(file.size / 1024);
            try {
                await dbService.uploadDocument(student.email, {
                    name: `NPTEL_${examName}_${certName}.pdf`,
                    size: `${sizeKB} KB`,
                    type: file.type,
                    dataUrl: base64Data
                });
                showStatus('Certificate uploaded successfully! 🎉');
                setPendingFiles(prev => { const n = { ...prev }; delete n[examName]; return n; });
                setPendingNames(prev => { const n = { ...prev }; delete n[examName]; return n; });
                loadData();
            }
            catch (err) {
                showStatus('Upload failed. Try again.', 'error');
            }
            finally {
                setUploading(null);
            }
        };
        reader.readAsDataURL(file);
    };
    const handleDeleteDoc = async (id) => {
        if (!student)
            return;
        if (!window.confirm('Delete this certificate?'))
            return;
        try {
            await dbService.deleteDocument(student.email, id);
            showStatus('Certificate deleted.');
            loadData();
        }
        catch {
            showStatus('Error deleting certificate.', 'error');
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
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.nptelExams?.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))));
    const nptelDocs = docs.filter(d => d.name.startsWith('NPTEL_'));
    const completedCount = nptelDocs.length;
    const totalCount = exams.length;
    return (_jsxs("div", { className: "panel-view nptel-panel", children: [_jsxs("div", { className: "panel-header", children: [_jsx("button", { onClick: selectedStudentEmail ? () => setSelectedStudentEmail(null) : onBack, className: "back-btn", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { className: "panel-title", children: isAdmin && !selectedStudentEmail ? 'NPTEL Admin Portal' : 'NPTEL Certifications' })] }), _jsxs("div", { className: "panel-body", children: [statusMessage && (_jsxs("div", { className: `nptel-toast ${statusType}`, children: [statusType === 'success' ? _jsx(CheckCircle2, { size: 14 }) : _jsx(X, { size: 14 }), statusMessage] })), isAdmin && !selectedStudentEmail && (_jsxs("div", { className: "nptel-admin-section", children: [_jsxs("div", { className: "nptel-search-wrap", children: [_jsx(Search, { size: 15, className: "nptel-search-icon" }), _jsx("input", { type: "text", placeholder: "Search by student or course name...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), className: "nptel-search-input" })] }), _jsx("p", { className: "nptel-section-label", children: "Select a student to view registrations:" }), filteredStudents.length === 0 ? (_jsx("div", { className: "nptel-empty-state", children: "No students matched your search." })) : (filteredStudents.map(s => (_jsxs("div", { className: "nptel-student-row", onClick: () => setSelectedStudentEmail(s.email), children: [_jsxs("div", { children: [_jsx("h4", { className: "nptel-student-name", children: s.name }), _jsxs("p", { className: "nptel-student-meta", children: ["Roll: ", s.rollNo] }), _jsxs("div", { className: "nptel-tags", children: [(s.nptelExams || []).slice(0, 3).map((ex, i) => (_jsx("span", { className: "nptel-tag", children: ex }, i))), (s.nptelExams?.length ?? 0) > 3 && (_jsxs("span", { className: "nptel-tag-more", children: ["+", (s.nptelExams?.length ?? 0) - 3] }))] })] }), _jsx(UserCheck, { size: 18, className: "nptel-student-chevron" })] }, s.id))))] })), (!isAdmin || selectedStudentEmail) && student && (_jsxs("div", { className: "nptel-student-view", children: [isAdmin && (_jsxs("div", { className: "nptel-admin-badge", children: [_jsx(Sparkles, { size: 12 }), " Viewing: ", _jsxs("strong", { children: [student.name, " (", student.rollNo, ")"] })] })), !isAdmin && (_jsxs("div", { className: "nptel-stats-row", children: [_jsxs("div", { className: "nptel-stat-card blue", children: [_jsx("span", { className: "nptel-stat-val", children: totalCount }), _jsx("span", { className: "nptel-stat-lbl", children: "Registered" })] }), _jsxs("div", { className: "nptel-stat-card green", children: [_jsx("span", { className: "nptel-stat-val", children: completedCount }), _jsx("span", { className: "nptel-stat-lbl", children: "Certified" })] }), _jsxs("div", { className: "nptel-stat-card gold", children: [_jsx("span", { className: "nptel-stat-val", children: totalCount - completedCount }), _jsx("span", { className: "nptel-stat-lbl", children: "Pending" })] })] })), _jsxs("form", { ref: formRef, onSubmit: handleAddExam, className: "nptel-add-form", children: [_jsxs("div", { className: "nptel-form-header", children: [_jsx(Award, { size: 16, className: "nptel-form-icon" }), _jsx("span", { children: "Register New NPTEL Course" })] }), _jsxs("div", { className: "nptel-field-wrap", children: [_jsx("label", { className: "nptel-field-label", children: "Course Name" }), _jsxs("div", { className: "nptel-field-input-wrap", children: [_jsx(BookOpen, { size: 14, className: "nptel-field-icon" }), _jsx("input", { type: "text", value: newExam, onChange: e => setNewExam(e.target.value), className: "nptel-field-input", placeholder: "e.g. Introduction to Smart Grid", required: true })] })] }), _jsxs("div", { className: "nptel-field-wrap", children: [_jsx("label", { className: "nptel-field-label", children: "Status" }), _jsx("div", { className: "nptel-status-picker", children: ['registered', 'in-progress', 'completed'].map(s => (_jsx("button", { type: "button", className: `nptel-status-chip ${newStatus === s ? 'active ' + s : ''}`, onClick: () => setNewStatus(s), children: STATUS_CONFIG[s].label }, s))) })] }), _jsxs("button", { type: "submit", className: `nptel-add-btn ${saving ? 'loading' : ''}`, disabled: saving || !newExam.trim(), children: [saving ? (_jsx("span", { className: "nptel-spinner" })) : (_jsx(Plus, { size: 16 })), saving ? 'Adding...' : 'Add Course'] })] }), _jsxs("div", { className: "nptel-courses-section", children: [_jsxs("h4", { className: "nptel-courses-title", children: [_jsx(Award, { size: 15 }), "Registered Courses", _jsx("span", { className: "nptel-count-badge", children: exams.length })] }), exams.length === 0 ? (_jsxs("div", { className: "nptel-empty-state", children: [_jsx(Award, { size: 32, className: "nptel-empty-icon" }), _jsx("p", { children: "No NPTEL courses registered yet." }), _jsx("span", { children: "Add your first course above!" })] })) : (_jsx("div", { className: "nptel-course-list", children: exams.map((examName, index) => {
                                            const examDoc = docs.find(d => d.name.startsWith(`NPTEL_${examName}_`));
                                            const isExpanded = expandedExam === examName;
                                            const isNew = newlyAdded === examName;
                                            const pendingFile = pendingFiles[examName];
                                            const pendingName = pendingNames[examName] ?? '';
                                            const isUploading = uploading === examName;
                                            return (_jsxs("div", { className: `nptel-course-card ${isNew ? 'just-added' : ''} ${examDoc ? 'certified' : ''}`, style: { animationDelay: `${index * 0.05}s` }, children: [_jsxs("div", { className: "nptel-course-card-header", onClick: () => setExpandedExam(isExpanded ? null : examName), children: [_jsxs("div", { className: "nptel-course-left", children: [_jsx("div", { className: `nptel-course-num ${examDoc ? 'done' : ''}`, children: examDoc ? _jsx(CheckCircle2, { size: 13 }) : index + 1 }), _jsxs("div", { className: "nptel-course-info", children: [_jsx("span", { className: "nptel-course-name", children: examName }), examDoc ? (_jsx("span", { className: "nptel-cert-label", children: "\u2713 Certificate Uploaded" })) : (_jsx("span", { className: "nptel-no-cert-label", children: "No certificate yet" }))] })] }), _jsxs("div", { className: "nptel-course-actions", children: [_jsx("button", { className: "nptel-delete-btn", onClick: e => { e.stopPropagation(); handleDeleteExam(examName); }, title: "Remove course", children: _jsx(Trash2, { size: 13 }) }), _jsx("span", { className: "nptel-expand-icon", children: isExpanded ? _jsx(ChevronUp, { size: 15 }) : _jsx(ChevronDown, { size: 15 }) })] })] }), isExpanded && (_jsx("div", { className: "nptel-course-panel", children: examDoc ? (_jsxs("div", { className: "nptel-cert-uploaded", children: [_jsxs("div", { className: "nptel-cert-info", children: [_jsx(FileText, { size: 16, className: "nptel-cert-file-icon" }), _jsxs("div", { children: [_jsx("p", { className: "nptel-cert-name", children: examDoc.name.replace(`NPTEL_${examName}_`, '').replace(/\.pdf$/i, '') }), _jsxs("p", { className: "nptel-cert-meta", children: [examDoc.size, " \u00B7 ", examDoc.uploadedAt] })] })] }), _jsxs("div", { className: "nptel-cert-btns", children: [_jsxs("button", { className: "nptel-action-btn download", onClick: () => downloadDoc(examDoc), children: [_jsx(Download, { size: 13 }), " Download"] }), _jsxs("button", { className: "nptel-action-btn delete-cert", onClick: () => handleDeleteDoc(examDoc.id), children: [_jsx(Trash2, { size: 13 }), " Remove"] })] })] })) : (_jsxs("div", { className: "nptel-upload-section", children: [_jsxs("div", { className: "nptel-field-wrap", style: { marginBottom: 10 }, children: [_jsx("label", { className: "nptel-field-label", children: "Certificate Name" }), _jsx("input", { type: "text", value: pendingName, onChange: e => setPendingNames(prev => ({ ...prev, [examName]: e.target.value })), className: "nptel-field-input", style: { paddingLeft: 10 }, placeholder: `e.g. ${examName} NPTEL Certificate` })] }), pendingFile ? (_jsxs("div", { className: "nptel-file-preview", children: [_jsxs("div", { className: "nptel-file-preview-info", children: [_jsx(FileText, { size: 15 }), _jsxs("div", { children: [_jsx("span", { className: "nptel-file-name", children: pendingFile.name }), _jsxs("span", { className: "nptel-file-size", children: [Math.round(pendingFile.size / 1024), " KB"] })] })] }), _jsxs("label", { className: "nptel-change-file-btn", children: ["Change", _jsx("input", { type: "file", accept: "application/pdf", style: { display: 'none' }, onChange: e => handleSelectFile(examName, e.target.files?.[0] ?? null) })] })] })) : (_jsxs("label", { className: "nptel-drop-zone", children: [_jsx(Upload, { size: 20, className: "nptel-drop-icon" }), _jsx("span", { className: "nptel-drop-title", children: "Upload Certificate PDF" }), _jsx("span", { className: "nptel-drop-hint", children: "Click to select \u00B7 PDF only" }), _jsx("input", { type: "file", accept: "application/pdf", style: { display: 'none' }, onChange: e => handleSelectFile(examName, e.target.files?.[0] ?? null) })] })), _jsx("button", { className: `nptel-upload-save-btn ${isUploading ? 'uploading' : ''}`, onClick: () => handleUploadCertificate(examName), disabled: !pendingFile || !pendingName.trim() || isUploading, children: isUploading ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "nptel-spinner small" }), " Uploading..."] })) : (_jsxs(_Fragment, { children: [_jsx(Upload, { size: 14 }), " Upload & Save Certificate"] })) })] })) }))] }, examName));
                                        }) }))] })] }))] })] }));
};
