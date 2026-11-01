import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { ArrowLeft, BookOpen, Calendar, Trash2, Pencil, X, Check, Upload, Download, ExternalLink, Eye, EyeOff, FileText, ShieldCheck } from 'lucide-react';
import addIcon from '../../assets/add-icon.png';
// Hardcoded teacher name fallback — used when DB/localStorage is missing teacher_name
const TEACHER_MAP = {
    '25MA2114': 'Dr. V. Tharanidharan, AP/S&H',
    '25EE2106': 'Dr. M. Ezhilarasi, AP(Sl.G)/EEE',
    '25EE2200': 'Dr. H. Vidhya, AP(Sr.G)/EEE',
    '25EE2250': 'Mr. V. Gopu & Dr. K. Balachander, AP(Sl.G)/EEE',
    '25CS2261': 'Faculty from AIDS department',
    '25EE2201': 'Mr. B. Sridhar, AP(Sl.G)/EEE',
    '25AD2125': 'Faculty from AIDS department',
    '25BA1E53': 'Faculty from MBA department',
    'AEC': 'English Department',
    '25EE2270': 'Dr. H. Vidhya & Mr. B. Marisekar, AP(Sr.G)/EEE',
    'LIB': 'Mrs. R.K. Ragavapriya, AP(Sl.G)/EEE',
    'GATE': 'Dr. K. Balamurugan, AsP/EEE',
    'TWM': 'Respective Tutors',
    'BYOD': 'Mrs. R.K. Ragavapriya / Mr. B. Sridhar',
};
export const AcademicCalendar = ({ onBack, isAdmin = false, viewMode, initialEditMode = false }) => {
    const [courses, setCourses] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [calendarFile, setCalendarFile] = useState(null);
    const [showViewer, setShowViewer] = useState(true);
    const [uploadingCalendar, setUploadingCalendar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(initialEditMode);
    const [editCourseCode, setEditCourseCode] = useState(null);
    const [editMilestoneId, setEditMilestoneId] = useState(null);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [newCode, setNewCode] = useState('');
    const [newName, setNewName] = useState('');
    const [newCredits, setNewCredits] = useState('');
    const [newSem, setNewSem] = useState('6');
    const [newTeacher, setNewTeacher] = useState('');
    const [courseStatus, setCourseStatus] = useState('');
    const [showMilestoneForm, setShowMilestoneForm] = useState(false);
    const [newMDate, setNewMDate] = useState('');
    const [newMEvent, setNewMEvent] = useState('');
    const [newMType, setNewMType] = useState('academic');
    useEffect(() => {
        setEditMode(initialEditMode);
    }, [initialEditMode]);
    useEffect(() => {
        loadCourses();
        loadMilestones();
        loadCalendarFile();
    }, []);
    const loadCalendarFile = async () => {
        try {
            const file = await dbService.getCalendarFile();
            setCalendarFile(file);
        }
        catch (err) {
            console.error('Failed to load academic calendar file:', err);
        }
    };
    const handleCalendarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploadingCalendar(true);
        setCourseStatus('');
        const sizeKB = Math.round(file.size / 1024);
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const dataUrl = event.target?.result;
                const newCalFile = {
                    name: file.name,
                    size: `${sizeKB} KB`,
                    type: file.type || 'application/pdf',
                    dataUrl,
                    uploadedAt: new Date().toISOString().split('T')[0],
                    uploadedBy: 'Faculty Administration',
                    academicYear: '2026–2027',
                    description: 'Official SREC EEE Autonomous Academic Calendar & Examination Schedule'
                };
                await dbService.saveCalendarFile(newCalFile);
                setCalendarFile(newCalFile);
                setShowViewer(true);
                setCourseStatus('Academic Calendar file successfully saved to database!');
                setTimeout(() => setCourseStatus(''), 4000);
            }
            catch (err) {
                console.error('Error saving calendar file:', err);
            }
            finally {
                setUploadingCalendar(false);
            }
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    const handleDownloadCalendar = () => {
        if (!calendarFile)
            return;
        const a = document.createElement('a');
        a.href = calendarFile.dataUrl;
        a.download = calendarFile.name || 'SREC_EEE_Academic_Calendar_2026.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    const handleOpenFullscreen = () => {
        if (!calendarFile)
            return;
        const win = window.open('', '_blank');
        if (win) {
            if (calendarFile.type.includes('svg') || calendarFile.name.endsWith('.svg')) {
                win.document.write(`
          <!DOCTYPE html>
          <html>
            <head><title>${calendarFile.name}</title></head>
            <body style="margin:0; background:#0f172a; display:flex; justify-content:center; align-items:center; min-height:100vh;">
              <img src="${calendarFile.dataUrl}" style="max-width:100%; height:auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />
            </body>
          </html>
        `);
            }
            else {
                win.location.href = calendarFile.dataUrl;
            }
        }
    };
    const handleDeleteCalendar = async () => {
        if (!window.confirm('Are you sure you want to remove the current Academic Calendar file?'))
            return;
        await dbService.deleteCalendarFile();
        setCalendarFile(null);
        setCourseStatus('Calendar file removed.');
        setTimeout(() => setCourseStatus(''), 3000);
    };
    const loadCourses = async () => {
        setLoading(true);
        const list = await dbService.getCourses();
        // Merge teacher names from local fallback map when DB returns empty
        const merged = list.map(c => ({
            ...c,
            teacherName: c.teacherName || TEACHER_MAP[c.code] || '',
        }));
        setCourses(merged);
        setLoading(false);
    };
    const loadMilestones = async () => {
        setLoading(true);
        const list = await dbService.getMilestones();
        setMilestones(list);
        setLoading(false);
    };
    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!newCode.trim() || !newName.trim() || !newCredits)
            return;
        const course = {
            code: newCode.trim().toUpperCase(),
            name: newName.trim(),
            credits: parseInt(newCredits),
            semester: parseInt(newSem),
            teacherName: newTeacher.trim() || undefined,
        };
        if (editCourseCode && editCourseCode !== course.code) {
            await dbService.deleteCourse(editCourseCode);
        }
        await dbService.saveCourse(course);
        setCourseStatus(editCourseCode ? 'Course updated!' : 'Course added!');
        setTimeout(() => setCourseStatus(''), 2500);
        setNewCode('');
        setNewName('');
        setNewCredits('');
        setNewSem('6');
        setNewTeacher('');
        setEditCourseCode(null);
        setShowCourseForm(false);
        loadCourses();
    };
    const handleDeleteCourse = async (code) => {
        if (!window.confirm(`Delete course "${code}"?`))
            return;
        await dbService.deleteCourse(code);
        loadCourses();
    };
    const handleAddMilestone = async (e) => {
        e.preventDefault();
        if (!newMDate.trim() || !newMEvent.trim())
            return;
        const m = {
            date: newMDate.trim(),
            event: newMEvent.trim(),
            type: newMType,
        };
        if (editMilestoneId) {
            m.id = editMilestoneId;
        }
        await dbService.saveMilestone(m);
        setNewMDate('');
        setNewMEvent('');
        setNewMType('academic');
        setEditMilestoneId(null);
        setShowMilestoneForm(false);
        loadMilestones();
    };
    const handleDeleteMilestone = async (id) => {
        if (!window.confirm('Delete this milestone event?'))
            return;
        await dbService.deleteMilestone(id);
        loadMilestones();
    };
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const typeColor = (type) => type === 'exam' ? '#f87171' : type === 'holiday' ? 'var(--accent-gold)' : 'var(--accent-blue)';
    const title = viewMode === 'courses' ? 'Syllabus & Curriculum' : viewMode === 'calendar' ? 'Academic Calendar' : 'Courses & Calendar';
    return (_jsxs("div", { className: "panel-view", children: [_jsxs("div", { className: "panel-header", children: [_jsx("button", { onClick: onBack, className: "back-btn", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { className: "panel-title", children: title }), isAdmin && (_jsx("button", { onClick: () => setEditMode(e => !e), style: {
                            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                            padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            border: `1.5px solid ${editMode ? '#f87171' : 'var(--accent-blue)'}`,
                            background: editMode ? 'rgba(248,113,113,0.12)' : 'rgba(56,189,248,0.12)',
                            color: editMode ? '#f87171' : 'var(--accent-blue)',
                        }, children: editMode ? _jsxs(_Fragment, { children: [_jsx(X, { size: 12 }), " Done"] }) : _jsxs(_Fragment, { children: [_jsx(Pencil, { size: 12 }), " Edit"] }) }))] }), _jsxs("div", { className: "panel-body", children: [courseStatus && (_jsxs("div", { style: { padding: 8, background: 'rgba(74,222,128,0.1)', borderRadius: 8, fontSize: 11, textAlign: 'center', color: '#4ade80', fontWeight: 700, border: '1px solid rgba(74,222,128,0.2)' }, children: [_jsx(Check, { size: 12, style: { display: 'inline', marginRight: 4 } }), courseStatus] })), (viewMode === 'courses' || !viewMode) && (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, children: [_jsx("h4", { style: { fontSize: 13, fontWeight: '700' }, children: "Semester III Curriculum" }), _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsxs("span", { style: { fontSize: 11, background: 'rgba(56,189,248,0.15)', color: 'var(--accent-blue)', padding: '2px 8px', borderRadius: 4, fontWeight: 'bold' }, children: ["Total: ", totalCredits, " Cr"] }), editMode && (_jsxs("button", { onClick: () => { setShowCourseForm(v => !v); setEditCourseCode(null); }, className: "btn-png-add", children: [_jsx("img", { src: addIcon, alt: "Add", style: { width: 14, height: 14 } }), " Add Course"] }))] })] }), editMode && showCourseForm && (_jsxs("form", { onSubmit: handleAddCourse, style: { background: 'var(--bg-secondary)', borderRadius: 10, padding: 12, border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Course Code" }), _jsx("input", { value: newCode, onChange: e => setNewCode(e.target.value), className: "form-input", placeholder: "e.g. EE8700", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Credits" }), _jsx("input", { type: "number", value: newCredits, onChange: e => setNewCredits(e.target.value), className: "form-input", placeholder: "3", min: "1", max: "6", required: true, style: { fontSize: 11 } })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Course Name" }), _jsx("input", { value: newName, onChange: e => setNewName(e.target.value), className: "form-input", placeholder: "e.g. Digital Signal Processing", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Teacher / Faculty Name" }), _jsx("input", { value: newTeacher, onChange: e => setNewTeacher(e.target.value), className: "form-input", placeholder: "e.g. Dr. A. Rajan", style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Semester" }), _jsx("select", { value: newSem, onChange: e => setNewSem(e.target.value), className: "form-select", style: { fontSize: 11 }, children: [1, 2, 3, 4, 5, 6, 7, 8].map(s => _jsxs("option", { value: s, children: ["Semester ", s] }, s)) })] }), _jsxs("div", { style: { display: 'flex', gap: 6 }, children: [_jsx("button", { type: "submit", className: "btn-primary", style: { flex: 1, fontSize: 11 }, children: editCourseCode ? 'Save Changes' : 'Save Course' }), _jsx("button", { type: "button", onClick: () => { setShowCourseForm(false); setEditCourseCode(null); }, className: "btn-secondary", style: { fontSize: 11 }, children: "Cancel" })] })] })), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: loading ? (_jsx("p", { style: { textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }, children: "Loading..." })) : courses.length === 0 ? (_jsxs("p", { style: { textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }, children: ["No courses found. ", isAdmin ? 'Add one above.' : ''] })) : (courses.map(course => (_jsxs("div", { className: "document-item", style: { padding: '10px 12px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: { background: 'rgba(255,255,255,0.05)', width: 34, height: 34, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, children: _jsx(BookOpen, { size: 16, style: { color: 'var(--accent-gold)' } }) }), _jsxs("div", { className: "doc-info", style: { gap: 0 }, children: [_jsx("span", { style: { fontSize: 12, fontWeight: '700', color: 'var(--text-main)' }, children: course.name }), _jsxs("span", { style: { fontSize: 10, color: 'var(--text-muted)' }, children: [course.code, " \u00B7 Sem ", course.semester] }), _jsxs("span", { style: { fontSize: 10, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }, children: ["\uD83D\uDC64 ", course.teacherName || TEACHER_MAP[course.code] || '—'] })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }, children: [_jsxs("span", { style: { fontSize: 11, fontWeight: '800', background: 'rgba(56,189,248,0.08)', color: 'var(--accent-blue)', padding: '4px 8px', borderRadius: 6 }, children: [course.credits, " Cr"] }), editMode && (_jsxs("div", { style: { display: 'flex', gap: 4 }, children: [_jsx("button", { onClick: () => {
                                                                setEditCourseCode(course.code);
                                                                setNewCode(course.code);
                                                                setNewName(course.name);
                                                                setNewCredits(course.credits.toString());
                                                                setNewSem(course.semester.toString());
                                                                setNewTeacher(course.teacherName || '');
                                                                setShowCourseForm(true);
                                                            }, style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', padding: 4 }, children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => handleDeleteCourse(course.code), style: { background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 4 }, children: _jsx(Trash2, { size: 14 }) })] }))] })] }, course.code)))) })] })), (viewMode === undefined) && (_jsx("hr", { style: { border: 'none', height: 1, backgroundColor: 'var(--card-border)', margin: '12px 0' } })), (viewMode === 'calendar' || !viewMode) && (_jsxs("div", { children: [_jsxs("div", { style: { background: '#ffffff', borderRadius: 16, border: '1.5px solid rgba(0,82,204,0.15)', padding: 16, marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx("div", { style: { width: 44, height: 44, borderRadius: 12, background: 'rgba(220,38,38,0.1)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, children: _jsx(Calendar, { size: 22 }) }), _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }, children: [_jsx("h4", { style: { fontSize: 15, fontWeight: 900, color: 'var(--text-main)', margin: 0 }, children: "Official Academic Calendar 2026\u201327" }), _jsxs("span", { style: { fontSize: 10, fontWeight: 800, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 3 }, children: [_jsx(ShieldCheck, { size: 11 }), " VERIFIED BY ADMIN"] })] }), _jsx("p", { style: { fontSize: 11.5, color: 'var(--text-muted)', margin: '3px 0 0' }, children: calendarFile ? `${calendarFile.name} · ${calendarFile.size} · Uploaded: ${calendarFile.uploadedAt}` : 'No calendar file uploaded yet.' })] })] }), _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }, children: [calendarFile && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: handleDownloadCalendar, style: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, background: '#eff6ff', color: '#0052cc', border: '1px solid #bfdbfe', cursor: 'pointer' }, title: "Download official file", children: [_jsx(Download, { size: 13 }), " Download"] }), _jsxs("button", { onClick: handleOpenFullscreen, style: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', cursor: 'pointer' }, title: "Open in new window / full screen", children: [_jsx(ExternalLink, { size: 13 }), " Fullscreen"] }), _jsx("button", { onClick: () => setShowViewer(v => !v), style: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', cursor: 'pointer' }, children: showViewer ? _jsxs(_Fragment, { children: [_jsx(EyeOff, { size: 13 }), " Hide"] }) : _jsxs(_Fragment, { children: [_jsx(Eye, { size: 13 }), " View"] }) })] })), isAdmin && (_jsxs("label", { style: {
                                                            display: 'flex', alignItems: 'center', gap: 4,
                                                            padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                                                            background: '#0052cc', color: '#ffffff', cursor: 'pointer',
                                                            boxShadow: '0 2px 8px rgba(0,82,204,0.2)'
                                                        }, children: [_jsx(Upload, { size: 13 }), _jsx("span", { children: uploadingCalendar ? 'Uploading...' : (calendarFile ? 'Replace File' : 'Upload Calendar') }), _jsx("input", { type: "file", accept: ".pdf,.png,.jpg,.jpeg,.svg", onChange: handleCalendarUpload, style: { display: 'none' }, disabled: uploadingCalendar })] })), isAdmin && calendarFile && (_jsx("button", { onClick: handleDeleteCalendar, style: { padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', cursor: 'pointer' }, title: "Delete Calendar File", children: _jsx(Trash2, { size: 13 }) }))] })] }), courseStatus && (_jsxs("div", { style: { padding: 8, background: '#ecfdf5', borderRadius: 8, fontSize: 11, textAlign: 'center', color: '#059669', fontWeight: 700, border: '1px solid #a7f3d0', marginBottom: 12 }, children: [_jsx(Check, { size: 12, style: { display: 'inline', marginRight: 4 } }), courseStatus] })), showViewer && calendarFile && (_jsx("div", { style: { background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }, children: calendarFile.type.includes('image') || calendarFile.name.endsWith('.svg') || calendarFile.dataUrl.startsWith('data:image/') ? (_jsx("div", { style: { overflowX: 'auto', padding: 8, display: 'flex', justifyContent: 'center', background: '#f1f5f9' }, children: _jsx("img", { src: calendarFile.dataUrl, alt: "Academic Calendar", style: { maxWidth: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' } }) })) : (_jsx("iframe", { src: calendarFile.dataUrl, title: "Academic Calendar PDF", style: { width: '100%', minHeight: 480, border: 'none', background: '#ffffff' } })) })), !calendarFile && (_jsxs("div", { style: { padding: 32, textAlign: 'center', background: '#f8fafc', borderRadius: 12, border: '1.5px dashed #cbd5e1' }, children: [_jsx(FileText, { size: 36, style: { color: '#94a3b8', margin: '0 auto 10px' } }), _jsx("h4", { style: { fontSize: 13, fontWeight: 800, color: '#1e293b', margin: '0 0 4px' }, children: "No Calendar Document Uploaded" }), _jsx("p", { style: { fontSize: 11, color: '#64748b', margin: 0 }, children: isAdmin ? 'Click "Upload Calendar" above to upload the semester academic calendar file (PDF or Image).' : 'The department administration will publish the official semester schedule shortly.' })] }))] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, children: [_jsxs("div", { children: [_jsx("h4", { style: { fontSize: 14, fontWeight: '800', margin: 0, color: 'var(--text-main)' }, children: "Key Academic Milestones 2026\u201327" }), _jsx("p", { style: { fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 0' }, children: "Continuous Assessment & Semester Deadlines" })] }), editMode && (_jsxs("button", { onClick: () => { setShowMilestoneForm(v => !v); setEditMilestoneId(null); }, className: "btn-png-add", children: [_jsx("img", { src: addIcon, alt: "Add", style: { width: 14, height: 14 } }), " Add Event"] }))] }), editMode && showMilestoneForm && (_jsxs("form", { onSubmit: handleAddMilestone, style: { background: 'var(--bg-secondary)', borderRadius: 10, padding: 12, border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }, children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Date / Range" }), _jsx("input", { value: newMDate, onChange: e => setNewMDate(e.target.value), className: "form-input", placeholder: "e.g. December 1, 2026", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Event Description" }), _jsx("input", { value: newMEvent, onChange: e => setNewMEvent(e.target.value), className: "form-input", placeholder: "e.g. Semester End Review", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Type" }), _jsxs("select", { value: newMType, onChange: e => setNewMType(e.target.value), className: "form-select", style: { fontSize: 11 }, children: [_jsx("option", { value: "academic", children: "Academic" }), _jsx("option", { value: "exam", children: "Exam" }), _jsx("option", { value: "holiday", children: "Holiday / Event" })] })] }), _jsxs("div", { style: { display: 'flex', gap: 6 }, children: [_jsx("button", { type: "submit", className: "btn-primary", style: { flex: 1, fontSize: 11 }, children: editMilestoneId ? 'Save Changes' : 'Add Event' }), _jsx("button", { type: "button", onClick: () => { setShowMilestoneForm(false); setEditMilestoneId(null); }, className: "btn-secondary", style: { fontSize: 11 }, children: "Cancel" })] })] })), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: milestones.map((m, idx) => (_jsxs("div", { className: "document-item", style: { padding: '10px 12px', borderLeft: `3px solid ${typeColor(m.type)}`, borderRadius: '4px 10px 10px 4px' }, children: [_jsxs("div", { className: "doc-info", style: { gap: 2 }, children: [_jsxs("span", { style: { fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }, children: [_jsx(Calendar, { size: 12 }), m.date, _jsx("span", { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: typeColor(m.type), background: `${typeColor(m.type)}22`, padding: '1px 5px', borderRadius: 4, marginLeft: 4 }, children: m.type })] }), _jsx("span", { style: { fontSize: 12, fontWeight: '700', color: 'var(--text-main)' }, children: m.event })] }), editMode && (_jsxs("div", { style: { display: 'flex', gap: 4 }, children: [_jsx("button", { onClick: () => {
                                                        setEditMilestoneId(m.id || null);
                                                        setNewMDate(m.date);
                                                        setNewMEvent(m.event);
                                                        setNewMType(m.type);
                                                        setShowMilestoneForm(true);
                                                    }, style: { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', padding: 4 }, children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => handleDeleteMilestone(m.id), style: { background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: 4, flexShrink: 0 }, children: _jsx(Trash2, { size: 14 }) })] }))] }, m.id || idx))) })] }))] })] }));
};
