import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { dbService } from '../../services/db';
import { ArrowLeft, Pencil, X, Check, Clock, User, ChevronLeft, ChevronRight, Calendar, Coffee, ImagePlus, FileImage, ZoomIn } from 'lucide-react';
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];
const PERIOD_TIMES = {
    1: '8:45–9:35',
    2: '9:35–10:25',
    3: '10:45–11:35',
    4: '11:35–12:25',
    5: '1:10–2:00',
    6: '2:00–2:50',
    7: '3:00–3:50',
    8: '3:50–4:40',
};
const BurgerIcon = ({ size = 18, color = '#10B981' }) => (_jsxs("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", style: { display: 'block' }, children: [_jsx("path", { d: "M2 12A10 10 0 0 1 22 12Z", fill: "rgba(16, 185, 129, 0.15)" }), _jsx("path", { d: "M5 15h14" }), _jsx("rect", { x: "3", y: "17", width: "18", height: "4", rx: "1.5", fill: "rgba(16, 185, 129, 0.15)" })] }));
const COURSE_TITLES = {
    '25EE2200': 'Electric Circuit Theory',
    '25EE2200(T)': 'Electric Circuit Theory (Tutorial)',
    '25EE2106': 'Electromagnetic Fields',
    '25EE2201': 'Electrical Machines - I',
    '25EE2201(L)': 'Electrical Machines Lab',
    '25EE2250': 'DC Machines & Transformers Lab',
    '25EE2250 (L)': 'DC Machines & Transformers Lab',
    '25MA2114': 'Transforms & Partial Differential Eq.',
    '25CS2261': 'Python Programming & Data Structures',
    '25CS2261(L)': 'Python Programming Lab',
    '25EE2270 / 25CS2261': 'Circuits & Python Lab',
    '25BA1E53': 'Professional Ethics & Human Values',
    '25AD2125': 'Artificial Intelligence Basics',
    'AEC': 'Ability Enhancement Course',
    'GATE': 'GATE Coaching / Training',
    'LIB': 'Library / Self Study',
    'TWM': 'Tutor Ward Meeting',
    'BYOD / Skill Lab': 'BYOD & Skill Lab',
    'Library / Self Study': 'Library & Reference',
    'GATE Problem Solving': 'GATE Problem Solving',
    'Project Work / NPTEL': 'Project Work / NPTEL Mentoring',
};
const parseSubject = (subjectStr) => {
    try {
        if (subjectStr && subjectStr.trim().startsWith('{')) {
            const parsed = JSON.parse(subjectStr);
            const code = parsed.courseCode || '';
            return {
                courseCode: code,
                title: parsed.title || COURSE_TITLES[code] || '',
            };
        }
    }
    catch (e) {
        // Ignore error
    }
    const cleanCode = subjectStr || '—';
    return {
        courseCode: cleanCode,
        title: COURSE_TITLES[cleanCode] || '',
    };
};
export const Timetable = ({ onBack, isAdmin = false, semester = 3 }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date('2026-08-05')); // Default to Wednesday 05-Aug-2026 as per user screenshot
    const [editCell, setEditCell] = useState(null);
    // Custom states for editing
    const [editCourseCode, setEditCourseCode] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editTeacher, setEditTeacher] = useState('');
    const [saving, setSaving] = useState(false);
    // Timetable image/PDF states
    const [ttFile, setTtFile] = useState(null);
    const [showTtPreview, setShowTtPreview] = useState(false);
    const dateInputRef = useRef(null);
    const ttFileInputRef = useRef(null);
    useEffect(() => {
        loadTimetable();
        loadTimetableFile();
    }, [semester]);
    const loadTimetable = async () => {
        setLoading(true);
        const data = await dbService.getTimetable(semester);
        setEntries(data);
        setLoading(false);
    };
    const loadTimetableFile = async () => {
        try {
            const file = await dbService.getTimetableFile(semester);
            setTtFile(file);
        }
        catch (err) {
            console.warn('Failed to load timetable file:', err);
        }
    };
    const getEntry = (day, period) => entries.find(e => e.day === day && e.period === period);
    const openEdit = (day, period) => {
        if (!editMode)
            return;
        const e = getEntry(day, period);
        setEditCell({ day, period });
        const details = parseSubject(e?.subject || '');
        setEditCourseCode(details.courseCode === '—' ? '' : details.courseCode);
        setEditTitle(details.title);
        setEditTeacher(e?.teacher || '');
    };
    const saveCell = async () => {
        if (!editCell)
            return;
        setSaving(true);
        const existing = getEntry(editCell.day, editCell.period);
        // Store fields as JSON string inside subject field
        const subjectJson = JSON.stringify({
            courseCode: editCourseCode.trim(),
            title: editTitle.trim() || (COURSE_TITLES[editCourseCode.trim()] || ''),
        });
        const updated = {
            id: existing?.id,
            day: editCell.day,
            period: editCell.period,
            subject: subjectJson,
            teacher: editTeacher.trim(),
            semester,
        };
        await dbService.saveTimetableEntry(updated);
        setEditCell(null);
        await loadTimetable();
        setSaving(false);
    };
    const handleTtFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            const dataUrl = ev.target?.result;
            const fileObj = {
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                type: file.type,
                dataUrl,
                uploadedBy: isAdmin ? 'Admin' : 'Tutor',
                semester,
            };
            const saved = await dbService.saveTimetableFile(fileObj);
            setTtFile(saved);
        };
        reader.readAsDataURL(file);
        // reset so the same file can be re-uploaded
        e.target.value = '';
    };
    const handleRemoveTtFile = async () => {
        await dbService.deleteTimetableFile(semester);
        setTtFile(null);
        setShowTtPreview(false);
    };
    const handlePrevDay = () => {
        setSelectedDate(prev => {
            const nextDate = new Date(prev);
            nextDate.setDate(nextDate.getDate() - 1);
            return nextDate;
        });
    };
    const handleNextDay = () => {
        setSelectedDate(prev => {
            const nextDate = new Date(prev);
            nextDate.setDate(nextDate.getDate() + 1);
            return nextDate;
        });
    };
    const handleDateChange = (e) => {
        if (e.target.value) {
            setSelectedDate(new Date(e.target.value));
        }
    };
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayOfWeek = daysOfWeek[date.getDay()];
        return `${day}-${month}-${year} (${dayOfWeek})`;
    };
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const activeDay = daysOfWeek[selectedDate.getDay()];
    const isSunday = activeDay === 'Sun';
    const activeDayEntries = PERIODS.map(p => ({
        period: p,
        entry: getEntry(activeDay, p),
    }));
    return (_jsxs("div", { className: "panel-view", children: [_jsxs("div", { className: "panel-header", children: [_jsx("button", { onClick: onBack, className: "back-btn", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { className: "panel-title", children: "\uD83D\uDCC5 Class Timetable" }), isAdmin && (_jsx("button", { onClick: () => { setEditMode(v => !v); setEditCell(null); }, style: {
                            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                            padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            border: `1.5px solid ${editMode ? '#f87171' : 'var(--accent-blue)'}`,
                            background: editMode ? 'rgba(248,113,113,0.12)' : 'rgba(56,189,248,0.12)',
                            color: editMode ? '#f87171' : 'var(--accent-blue)',
                        }, children: editMode ? _jsxs(_Fragment, { children: [_jsx(X, { size: 12 }), " Done"] }) : _jsxs(_Fragment, { children: [_jsx(Pencil, { size: 12 }), " Edit"] }) }))] }), _jsxs("div", { className: "panel-body", children: [_jsx("div", { style: { marginBottom: 12 }, children: _jsxs("span", { style: { fontSize: 11.5, background: 'rgba(0,82,204,0.1)', color: 'var(--accent-blue)', padding: '4px 12px', borderRadius: 20, fontWeight: 800 }, children: ["Semester ", semester, " \u00B7 EEE-B \u00B7 2025\u20132029"] }) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }, children: [_jsx("button", { onClick: handlePrevDay, style: {
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1.5px solid var(--card-border)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-main)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }, children: _jsx(ChevronLeft, { size: 16 }) }), _jsxs("button", { onClick: () => dateInputRef.current?.showPicker(), style: {
                                    padding: '6px 16px',
                                    borderRadius: 20,
                                    border: '1.5px solid var(--card-border)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-main)',
                                    fontWeight: 700,
                                    fontSize: 12,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    transition: 'all 0.2s ease',
                                }, children: [_jsx(Calendar, { size: 13, style: { color: 'var(--accent-blue)' } }), formatDate(selectedDate)] }), _jsx("input", { type: "date", ref: dateInputRef, onChange: handleDateChange, value: selectedDate.toISOString().split('T')[0], style: { display: 'none' } }), _jsx("button", { onClick: handleNextDay, style: {
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1.5px solid var(--card-border)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-main)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }, children: _jsx(ChevronRight, { size: 16 }) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }, children: [ttFile ? (_jsxs("button", { onClick: () => setShowTtPreview(true), title: `View: ${ttFile.name}`, style: {
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            border: '1.5px solid rgba(0,82,204,0.3)',
                                            background: 'rgba(0,82,204,0.08)',
                                            color: 'var(--accent-blue)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            transition: 'all 0.2s ease',
                                        }, children: [ttFile.type.startsWith('image/') ? (_jsx("img", { src: ttFile.dataUrl, alt: "Timetable", style: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 } })) : (_jsx(FileImage, { size: 18 })), _jsx("div", { style: {
                                                    position: 'absolute', inset: 0, background: 'rgba(0,82,204,0.55)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: 0, transition: 'opacity 0.15s',
                                                }, onMouseEnter: e => (e.currentTarget.style.opacity = '1'), onMouseLeave: e => (e.currentTarget.style.opacity = '0'), children: _jsx(ZoomIn, { size: 14, color: "#fff" }) })] })) : null, isAdmin && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => ttFileInputRef.current?.click(), title: "Upload timetable image or PDF", style: {
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 10,
                                                    border: '1.5px solid var(--card-border)',
                                                    background: 'var(--bg-secondary)',
                                                    color: 'var(--text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s ease',
                                                }, children: _jsx(ImagePlus, { size: 16 }) }), _jsx("input", { ref: ttFileInputRef, type: "file", accept: "image/*,application/pdf", onChange: handleTtFileUpload, style: { display: 'none' } })] }))] })] }), loading ? (_jsxs("div", { style: { textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }, children: [_jsx("div", { className: "loading-spinner", style: { margin: '0 auto 12px' } }), "Loading timetable\u2026"] })) : isSunday ? (_jsxs("div", { style: {
                            textAlign: 'center',
                            padding: '60px 20px',
                            background: 'var(--bg-secondary)',
                            borderRadius: 16,
                            border: '1.5px dashed var(--card-border)',
                            color: 'var(--text-muted)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 8
                        }, children: [_jsx("span", { style: { fontSize: 32 }, children: "\uD83D\uDD4A\uFE0F" }), _jsx("div", { style: { fontWeight: 800, color: 'var(--text-main)' }, children: "Sunday - Holiday" }), _jsx("div", { style: { fontSize: 11 }, children: "No academic classes scheduled for today." })] })) : (_jsx("div", { style: {
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 10,
                            overflowX: 'auto',
                            paddingBottom: 16,
                            paddingTop: 4,
                            alignItems: 'stretch',
                            WebkitOverflowScrolling: 'touch',
                        }, children: (() => {
                            const rows = [];
                            activeDayEntries.forEach(({ period, entry }) => {
                                const subjectDetails = parseSubject(entry?.subject || '');
                                const isAllocated = !!entry && subjectDetails.courseCode !== '' && subjectDetails.courseCode !== '—';
                                rows.push(_jsxs("div", { onClick: () => openEdit(activeDay, period), style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: 146,
                                        height: 205,
                                        flexShrink: 0,
                                        borderRadius: 14,
                                        overflow: 'hidden',
                                        border: `1.5px solid ${isAllocated ? 'rgba(217, 119, 6, 0.28)' : 'var(--card-border)'}`,
                                        background: isAllocated ? 'var(--bg-primary)' : 'rgba(241, 245, 249, 0.05)',
                                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                                        cursor: editMode ? 'pointer' : 'default',
                                        transition: 'all 0.18s ease',
                                        position: 'relative'
                                    }, children: [_jsxs("div", { style: {
                                                height: 48,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: isAllocated ? '#FEF3C7' : '#F1F5F9',
                                                borderBottom: `1px solid ${isAllocated ? '#FDE68A' : 'var(--card-border)'}`,
                                                color: isAllocated ? '#B45309' : '#64748B',
                                                padding: '4px 2px',
                                            }, children: [_jsxs("span", { style: { fontWeight: 850, fontSize: 13 }, children: ["Hour:", period] }), _jsx("span", { style: { fontSize: 11, opacity: 0.95, fontWeight: 750, letterSpacing: 0.2, marginTop: 1 }, children: PERIOD_TIMES[period] })] }), _jsx("div", { style: {
                                                flex: 1,
                                                padding: '12px 10px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-start',
                                                gap: 6,
                                                whiteSpace: 'normal',
                                            }, children: isAllocated ? (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'flex', flexDirection: 'column' }, children: [_jsx("span", { style: { fontSize: 8.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4 }, children: "COURSE:" }), _jsx("span", { style: { fontSize: 13, fontWeight: 900, color: 'var(--text-main)', marginTop: 1 }, children: subjectDetails.courseCode })] }), subjectDetails.title && (_jsxs("div", { style: { display: 'flex', flexDirection: 'column' }, children: [_jsx("span", { style: { fontSize: 8.5, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.4 }, children: "TITLE:" }), _jsx("span", { style: { fontSize: 10.5, fontWeight: 700, color: 'var(--text-main)', opacity: 0.85, marginTop: 1, lineHeight: 1.25 }, children: subjectDetails.title })] })), entry.teacher && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 750, color: '#0f766e', marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: 5 }, children: [_jsx(User, { size: 10, style: { flexShrink: 0 } }), _jsx("span", { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: entry.teacher })] }))] })) : (_jsxs("div", { style: {
                                                    margin: 'auto 0',
                                                    textAlign: 'center',
                                                    fontSize: 10.5,
                                                    color: '#475569',
                                                    fontWeight: 700,
                                                    lineHeight: 1.4,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 4
                                                }, children: [_jsx("span", { children: "No hours" }), _jsx("span", { children: "allocated" })] })) }), editMode && (_jsx("div", { style: {
                                                position: 'absolute',
                                                bottom: 6,
                                                right: 6,
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                background: 'rgba(56, 189, 248, 0.15)',
                                                color: 'var(--accent-blue)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }, children: _jsx(Pencil, { size: 10 }) }))] }, `hour-${period}`));
                                // Insert intervals after specific periods
                                if (period === 2) {
                                    rows.push(_jsx("div", { style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 42,
                                            height: 200,
                                            flexShrink: 0,
                                            borderRadius: 12,
                                            border: '1.5px solid rgba(245, 158, 11, 0.25)',
                                            background: 'rgba(251, 191, 36, 0.06)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                                        }, title: "Tea Break (10:25\u201310:45)", children: _jsx(Coffee, { size: 16, style: { color: '#D97706' } }) }, "break-tea-1"));
                                }
                                else if (period === 4) {
                                    rows.push(_jsx("div", { style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 42,
                                            height: 200,
                                            flexShrink: 0,
                                            borderRadius: 12,
                                            border: '1.5px solid rgba(16, 185, 129, 0.25)',
                                            background: 'rgba(16, 185, 129, 0.06)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                                        }, title: "Lunch Break (12:25\u20131:10)", children: _jsx(BurgerIcon, { size: 16, color: "#059669" }) }, "break-lunch"));
                                }
                                else if (period === 6) {
                                    rows.push(_jsx("div", { style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 42,
                                            height: 200,
                                            flexShrink: 0,
                                            borderRadius: 12,
                                            border: '1.5px solid rgba(245, 158, 11, 0.25)',
                                            background: 'rgba(251, 191, 36, 0.06)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.01)',
                                        }, title: "Tea Break (2:50\u20133:00)", children: _jsx(Coffee, { size: 16, style: { color: '#D97706' } }) }, "break-tea-2"));
                                }
                            });
                            return rows;
                        })() })), !loading && (_jsx("div", { style: { marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--card-border)' }, children: _jsxs("p", { style: { fontSize: 10.5, color: 'var(--text-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }, children: [_jsx(Clock, { size: 11 }), " Showing Sem ", semester, " timetable for II EEE-B (2025\u20132029)", isAdmin && editMode && _jsx("span", { style: { color: 'var(--accent-blue)', fontWeight: 700 }, children: " \u00B7 Tap any cell to edit" })] }) }))] }), showTtPreview && ttFile && typeof document !== 'undefined' && createPortal(_jsx("div", { onClick: () => setShowTtPreview(false), className: "poster-modal", children: _jsxs("div", { onClick: e => e.stopPropagation(), className: "poster-content", style: { maxWidth: 640 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: 13, fontWeight: 800, color: 'var(--text-main)', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: ttFile.name }), _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [isAdmin && (_jsx("button", { onClick: handleRemoveTtFile, style: { padding: '4px 10px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: 11, fontWeight: 800, cursor: 'pointer' }, children: "Remove" })), _jsx("button", { onClick: () => setShowTtPreview(false), className: "close-modal-btn", children: _jsx(X, { size: 16 }) })] })] }), _jsx("div", { style: { borderRadius: 18, overflow: 'hidden', maxHeight: 'calc(80vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '1.5px solid rgba(0, 82, 204, 0.1)' }, children: ttFile.type.startsWith('image/') ? (_jsx("img", { src: ttFile.dataUrl, alt: "Timetable", style: { maxWidth: '100%', maxHeight: 'calc(80vh - 70px)', objectFit: 'contain', borderRadius: 14 } })) : (_jsx("iframe", { src: ttFile.dataUrl, title: "Timetable PDF", style: { width: '100%', height: 'min(70vh, 600px)', border: 'none', borderRadius: 14 } })) })] }) }), document.body), editCell && typeof document !== 'undefined' && createPortal(_jsx("div", { className: "poster-modal", onClick: () => setEditCell(null), children: _jsxs("div", { className: "poster-content", onClick: e => e.stopPropagation(), children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("span", { style: { fontWeight: 900, fontSize: 15, color: 'var(--text-main)' }, children: ["\uD83D\uDDD3\uFE0F Edit Hour ", editCell.period, " \u00B7 ", editCell.day] }), _jsx("button", { onClick: () => setEditCell(null), className: "close-modal-btn", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "form-group", style: { display: 'flex', flexDirection: 'column', gap: 4 }, children: [_jsx("label", { className: "form-label", style: { fontSize: 10.5, fontWeight: 800, color: 'var(--text-muted)' }, children: "COURSE CODE" }), _jsx("input", { value: editCourseCode, onChange: e => {
                                        const code = e.target.value;
                                        setEditCourseCode(code);
                                        if (COURSE_TITLES[code.trim()]) {
                                            setEditTitle(COURSE_TITLES[code.trim()]);
                                        }
                                    }, placeholder: "e.g. 25EE2200", autoFocus: true, className: "form-input" })] }), _jsxs("div", { className: "form-group", style: { display: 'flex', flexDirection: 'column', gap: 4 }, children: [_jsx("label", { className: "form-label", style: { fontSize: 10.5, fontWeight: 800, color: 'var(--text-muted)' }, children: "COURSE TITLE" }), _jsx("input", { value: editTitle, onChange: e => setEditTitle(e.target.value), placeholder: "e.g. Electric Circuit Theory", className: "form-input" })] }), _jsxs("div", { className: "form-group", style: { display: 'flex', flexDirection: 'column', gap: 4 }, children: [_jsx("label", { className: "form-label", style: { fontSize: 10.5, fontWeight: 800, color: 'var(--text-muted)' }, children: "FACULTY NAME (OPTIONAL)" }), _jsx("input", { value: editTeacher, onChange: e => setEditTeacher(e.target.value), placeholder: "e.g. Dr. H. Vidhya", className: "form-input" })] }), _jsxs("div", { style: { display: 'flex', gap: 10, marginTop: 8 }, children: [_jsxs("button", { onClick: saveCell, disabled: saving, className: "btn-primary", style: { flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }, children: [_jsx(Check, { size: 15 }), " ", saving ? 'Saving…' : 'Save'] }), _jsx("button", { onClick: () => setEditCell(null), className: "btn-secondary", style: { flex: 0.8 }, children: "Cancel" })] })] }) }), document.body)] }));
};
