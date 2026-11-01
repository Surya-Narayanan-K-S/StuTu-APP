import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { ArrowLeft, TrendingUp, Sparkles, Search, UserCheck, ShieldCheck, ChevronDown, ChevronUp, Save } from 'lucide-react';
export const AcademicsTracker = ({ currentEmail, isAdmin, onBack }) => {
    const [student, setStudent] = useState(null);
    const [cgpaRecords, setCgpaRecords] = useState({});
    const [arrears, setArrears] = useState(0);
    // Admin states
    const [allStudents, setAllStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
    const [sortBy, setSortBy] = useState('name');
    const [expandedSem, setExpandedSem] = useState(null);
    // Input states
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
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
                    setCgpaRecords(p.cgpa || {});
                    setArrears(p.arrears || 0);
                }
            }
            else {
                setStudent(null);
            }
        }
        else {
            const p = await dbService.getStudentProfile(currentEmail);
            if (p) {
                setStudent(p);
                setCgpaRecords(p.cgpa || {});
                setArrears(p.arrears || 0);
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
                setCgpaRecords(fallbackStudent.cgpa);
                setArrears(fallbackStudent.arrears);
            }
        }
    };
    const handleGradeChange = (semester, field, value) => {
        const val = parseFloat(value);
        setCgpaRecords(prev => ({
            ...prev,
            [semester]: {
                ...(prev[semester] || {}),
                [field]: isNaN(val) ? undefined : val
            }
        }));
    };
    const handleSaveAcademics = async (e) => {
        e.preventDefault();
        if (!student)
            return;
        setSaving(true);
        setStatusMessage('');
        try {
            await dbService.updateStudentProfile(student.email, {
                cgpa: cgpaRecords,
                arrears: arrears
            });
            setStatusMessage('Academic details saved successfully!');
            setTimeout(() => setStatusMessage(''), 3000);
            loadData();
        }
        catch (err) {
            console.error(err);
            setStatusMessage('Error saving academic data.');
        }
        finally {
            setSaving(false);
        }
    };
    const getGpa = (grades) => {
        if (!grades)
            return 0;
        if (typeof grades === 'number')
            return grades;
        return grades.gpa || 0;
    };
    const calculateCgpa = (records) => {
        const gpas = Object.values(records).map(g => getGpa(g)).filter(v => v > 0);
        if (gpas.length === 0)
            return 0;
        const sum = gpas.reduce((acc, curr) => acc + curr, 0);
        return parseFloat((sum / gpas.length).toFixed(2));
    };
    const calculateProgressiveCgpa = (sem) => {
        const sems = Object.keys(cgpaRecords)
            .map(Number)
            .filter(k => k <= sem && getGpa(cgpaRecords[k]) > 0);
        if (sems.length === 0)
            return 0;
        const sum = sems.reduce((acc, k) => acc + getGpa(cgpaRecords[k]), 0);
        return parseFloat((sum / sems.length).toFixed(2));
    };
    const currentCgpa = calculateCgpa(cgpaRecords);
    const getSortedStudents = () => {
        const filtered = allStudents.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()));
        if (sortBy === 'cgpa') {
            return [...filtered].sort((a, b) => calculateCgpa(b.cgpa) - calculateCgpa(a.cgpa));
        }
        if (sortBy === 'arrears') {
            return [...filtered].sort((a, b) => b.arrears - a.arrears);
        }
        return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    };
    const sortedStudents = getSortedStudents();
    return (_jsxs("div", { className: "dedicated-page-view page-slide-enter", style: { background: '#f8fafc', minHeight: '100vh', paddingBottom: 88 }, children: [_jsxs("div", { className: "dedicated-page-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("button", { className: "page-back-btn", onClick: selectedStudentEmail ? () => setSelectedStudentEmail(null) : onBack, title: "Go Back", children: _jsx(ArrowLeft, { size: 16 }) }), _jsxs("div", { children: [_jsx("h2", { className: "dedicated-page-title", style: { margin: 0, fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }, children: "\uD83D\uDCC8 CGPA & Academic Performance" }), _jsx("span", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: isAdmin && !selectedStudentEmail ? 'Institution Grade Console' : `Student ID: ${student?.rollNo || '71812503104'}` })] })] }), _jsxs("div", { style: {
                            padding: '6px 14px',
                            borderRadius: 20,
                            background: 'linear-gradient(135deg, #0052cc 0%, #2563eb 100%)',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: 11.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            boxShadow: '0 4px 12px rgba(0,82,204,0.3)'
                        }, children: [_jsx(Sparkles, { size: 14 }), " ", currentCgpa > 0 ? `${currentCgpa} CGPA` : 'Grade Portal'] })] }), _jsxs("div", { style: { padding: 16, maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }, children: [statusMessage && (_jsx("div", { style: { padding: 12, background: '#f0fdf4', color: '#166534', border: '1.5px solid #86efac', borderRadius: 16, fontSize: 12.5, fontWeight: 800, textAlign: 'center' }, children: statusMessage })), isAdmin && !selectedStudentEmail && (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 14 }, children: [_jsxs("div", { style: { background: '#ffffff', borderRadius: 24, padding: 18, border: '1.5px solid rgba(0,82,204,0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }, children: [_jsxs("div", { style: { position: 'relative', marginBottom: 12 }, children: [_jsx(Search, { size: 16, style: { position: 'absolute', left: 12, top: 12, color: '#94a3b8' } }), _jsx("input", { type: "text", placeholder: "Search student by name or roll number...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), style: { width: '100%', padding: '10px 12px 10px 36px', borderRadius: 14, border: '1.5px solid #cbd5e1', fontSize: 12, outline: 'none', background: '#f8fafc' } })] }), _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: 11, fontWeight: 800, color: 'var(--text-main)' }, children: "Sort By:" }), ['name', 'cgpa', 'arrears'].map(s => (_jsx("button", { onClick: () => setSortBy(s), style: {
                                                    padding: '6px 12px',
                                                    fontSize: 11,
                                                    fontWeight: 800,
                                                    borderRadius: 10,
                                                    border: 'none',
                                                    background: sortBy === s ? 'linear-gradient(135deg, #0052cc 0%, #2563eb 100%)' : '#f1f5f9',
                                                    color: sortBy === s ? '#ffffff' : '#64748b',
                                                    cursor: 'pointer',
                                                    textTransform: 'capitalize'
                                                }, children: s }, s)))] })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: sortedStudents.map(s => {
                                    const studentCgpa = calculateCgpa(s.cgpa);
                                    return (_jsxs("div", { onClick: () => setSelectedStudentEmail(s.email), style: {
                                            background: '#ffffff',
                                            borderRadius: 18,
                                            padding: '14px 18px',
                                            border: '1.5px solid rgba(0,82,204,0.1)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }, children: [_jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 2px 0', fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }, children: s.name }), _jsxs("p", { style: { margin: 0, fontSize: 11, color: '#64748b' }, children: ["Roll: ", s.rollNo, " \u00B7 ", s.email] }), _jsxs("div", { style: { display: 'flex', gap: 12, marginTop: 6 }, children: [_jsxs("span", { style: { fontSize: 11, color: 'var(--accent-blue)', fontWeight: 800 }, children: ["CGPA: ", studentCgpa || 'N/A'] }), _jsx("span", { style: { fontSize: 11, color: s.arrears > 0 ? '#dc2626' : '#059669', fontWeight: 800 }, children: s.arrears > 0 ? `⚠️ ${s.arrears} Arrears` : '✓ 0 Arrears' })] })] }), _jsx(UserCheck, { size: 18, style: { color: 'var(--accent-blue)' } })] }, s.id));
                                }) })] })), (!isAdmin || selectedStudentEmail) && student && (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 16 }, children: [_jsx("div", { style: {
                                    background: 'linear-gradient(135deg, #0052cc 0%, #1e40af 100%)',
                                    borderRadius: 28,
                                    padding: '24px 20px',
                                    color: '#ffffff',
                                    boxShadow: '0 16px 36px rgba(0, 82, 204, 0.3)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 14 }, children: [_jsx("div", { style: { width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.3)' }, children: _jsx(TrendingUp, { size: 28 }) }), _jsxs("div", { children: [_jsx("span", { style: { fontSize: 11, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }, children: "Cumulative CGPA" }), _jsx("h3", { style: { margin: '2px 0 0', fontSize: 32, fontWeight: 900, letterSpacing: -0.5 }, children: currentCgpa || '0.00' })] })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsxs("div", { style: {
                                                        padding: '6px 12px',
                                                        borderRadius: 14,
                                                        background: arrears === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                        color: arrears === 0 ? '#6ee7b7' : '#fca5a5',
                                                        fontSize: 11.5,
                                                        fontWeight: 800,
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 6
                                                    }, children: [arrears === 0 ? _jsx(ShieldCheck, { size: 14 }) : '⚠️', arrears === 0 ? 'Zero Arrears' : `${arrears} Standing Arrear${arrears > 1 ? 's' : ''}`] }), _jsx("span", { style: { display: 'block', fontSize: 10.5, opacity: 0.8, marginTop: 4 }, children: currentCgpa >= 8.5 ? '🏆 First Class with Distinction' : currentCgpa >= 7.0 ? '🎖️ First Class' : 'Second Class' })] })] }) }), _jsxs("div", { style: { background: '#ffffff', borderRadius: 28, padding: 22, border: '1.5px solid rgba(0,82,204,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }, children: [_jsx("h4", { style: { margin: '0 0 16px 0', fontSize: 14, fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }, children: "\uD83D\uDCDA Semester-Wise Academic Breakdown" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: [1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                                            const grades = cgpaRecords[sem];
                                            const gpa = getGpa(grades);
                                            const progCgpa = calculateProgressiveCgpa(sem);
                                            const isExpanded = expandedSem === sem;
                                            return (_jsxs("div", { style: {
                                                    background: isExpanded ? '#eff6ff' : '#f8fafc',
                                                    borderRadius: 18,
                                                    border: '1.5px solid',
                                                    borderColor: isExpanded ? '#93c5fd' : 'rgba(0,82,204,0.08)',
                                                    overflow: 'hidden',
                                                    transition: 'all 0.24s ease'
                                                }, children: [_jsxs("div", { onClick: () => setExpandedSem(isExpanded ? null : sem), style: {
                                                            padding: '14px 16px',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            cursor: 'pointer'
                                                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("span", { style: {
                                                                            width: 28,
                                                                            height: 28,
                                                                            borderRadius: 8,
                                                                            background: gpa > 0 ? 'rgba(0,82,204,0.1)' : '#e2e8f0',
                                                                            color: gpa > 0 ? 'var(--accent-blue)' : '#94a3b8',
                                                                            fontSize: 12,
                                                                            fontWeight: 900,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }, children: sem }), _jsxs("span", { style: { fontSize: 13, fontWeight: 900, color: 'var(--text-main)' }, children: ["Semester ", sem] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [gpa > 0 && (_jsxs("div", { style: { display: 'flex', gap: 6 }, children: [_jsxs("span", { style: { padding: '4px 8px', borderRadius: 8, background: '#fef3c7', color: '#b45309', fontSize: 11, fontWeight: 800 }, children: ["GPA: ", gpa] }), _jsxs("span", { style: { padding: '4px 8px', borderRadius: 8, background: '#dbeafe', color: '#1d4ed8', fontSize: 11, fontWeight: 800 }, children: ["CGPA: ", progCgpa] })] })), isExpanded ? _jsx(ChevronUp, { size: 16, color: "#64748b" }) : _jsx(ChevronDown, { size: 16, color: "#64748b" })] })] }), isExpanded && (_jsx("div", { style: { padding: '0 16px 16px', borderTop: '1px solid rgba(0,0,0,0.06)' }, children: _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }, children: [_jsxs("div", { children: [_jsx("label", { style: { fontSize: 10, fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }, children: "Internal 1" }), _jsx("input", { type: "number", step: "0.1", placeholder: "0-100", value: grades?.internal1 ?? '', onChange: e => handleGradeChange(sem, 'internal1', e.target.value), disabled: !isAdmin && !student, style: { width: '100%', padding: '8px 10px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 12, background: '#ffffff', outline: 'none' } })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 10, fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }, children: "Internal 2" }), _jsx("input", { type: "number", step: "0.1", placeholder: "0-100", value: grades?.internal2 ?? '', onChange: e => handleGradeChange(sem, 'internal2', e.target.value), disabled: !isAdmin && !student, style: { width: '100%', padding: '8px 10px', borderRadius: 10, border: '1.5px solid #cbd5e1', fontSize: 12, background: '#ffffff', outline: 'none' } })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 10, fontWeight: 800, color: '#64748b', display: 'block', marginBottom: 4 }, children: "Semester GPA" }), _jsx("input", { type: "number", step: "0.01", placeholder: "0-10", value: grades?.gpa ?? '', onChange: e => handleGradeChange(sem, 'gpa', e.target.value), disabled: !isAdmin && !student, style: { width: '100%', padding: '8px 10px', borderRadius: 10, border: '1.5px solid #0052cc', fontSize: 12, background: '#ffffff', fontWeight: 800, color: 'var(--accent-blue)', outline: 'none' } })] })] }) }))] }, sem));
                                        }) }), _jsxs("button", { type: "button", onClick: handleSaveAcademics, disabled: saving, style: {
                                            width: '100%',
                                            marginTop: 16,
                                            padding: 14,
                                            borderRadius: 16,
                                            border: 'none',
                                            background: 'linear-gradient(135deg, #0052cc 0%, #2563eb 100%)',
                                            color: '#ffffff',
                                            fontWeight: 900,
                                            fontSize: 13.5,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8,
                                            boxShadow: '0 6px 20px rgba(0,82,204,0.3)'
                                        }, children: [_jsx(Save, { size: 16 }), " ", saving ? 'Saving Records...' : 'Save Academic Records'] })] })] }))] })] }));
};
