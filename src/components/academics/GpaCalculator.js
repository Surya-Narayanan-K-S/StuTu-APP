import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { GraduationCap, Sparkles, Pencil, Check, Plus, Trash2, ArrowLeft, RotateCcw, BookOpen } from 'lucide-react';
const DEFAULT_SUBJECTS = [
    { id: '1', code: 'EE8601', name: 'Power System Operation and Control', credits: 3, gradePoint: 9 },
    { id: '2', code: 'EE8602', name: 'Transmission and Distribution', credits: 4, gradePoint: 8 },
    { id: '3', code: 'EE8603', name: 'Digital Logic Circuits', credits: 3, gradePoint: 9 },
    { id: '4', code: 'EE8691', name: 'Embedded Systems', credits: 3, gradePoint: 10 },
    { id: '5', code: 'EE8611', name: 'Power Electronics Lab', credits: 2, gradePoint: 10 },
    { id: '6', code: 'EE8612', name: 'Renewable Energy Systems Lab', credits: 2, gradePoint: 10 },
];
const GRADE_OPTIONS = [
    { label: 'O (10 Pts)', value: 10 },
    { label: 'A+ (9 Pts)', value: 9 },
    { label: 'A (8 Pts)', value: 8 },
    { label: 'B+ (7 Pts)', value: 7 },
    { label: 'B (6 Pts)', value: 6 },
    { label: 'U (0 Pts - Arrear)', value: 0 },
];
export const GpaCalculator = ({ onBack }) => {
    const [subjects, setSubjects] = useState(DEFAULT_SUBJECTS);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentCgpa, setCurrentCgpa] = useState('8.6');
    const [completedSemesters, setCompletedSemesters] = useState('5');
    const [targetCgpa, setTargetCgpa] = useState('9.0');
    // Calculations
    const totalCredits = subjects.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
    const earnedPoints = subjects.reduce((sum, s) => sum + (s.gradePoint * (Number(s.credits) || 0)), 0);
    const calculatedGpa = totalCredits > 0 ? (earnedPoints / totalCredits).toFixed(2) : '0.00';
    // Target required GPA calculation
    const curCgpaNum = parseFloat(currentCgpa) || 8.6;
    const compSemsNum = parseInt(completedSemesters) || 5;
    const tgtCgpaNum = parseFloat(targetCgpa) || 9.0;
    const remSems = Math.max(1, 8 - compSemsNum);
    const reqGpaForTarget = (((tgtCgpaNum * 8) - (curCgpaNum * compSemsNum)) / remSems).toFixed(2);
    // Projected Cumulative CGPA including this semester
    const projectedCgpa = (((curCgpaNum * compSemsNum) + parseFloat(calculatedGpa)) / (compSemsNum + 1)).toFixed(2);
    const handleUpdateGrade = (id, newPoint) => {
        setSubjects(prev => prev.map(s => s.id === id ? { ...s, gradePoint: newPoint } : s));
    };
    const handleUpdateSubjectField = (id, field, value) => {
        setSubjects(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };
    const handleAddSubject = () => {
        const newId = `sub-${Date.now()}`;
        setSubjects(prev => [
            ...prev,
            {
                id: newId,
                code: `EE86${prev.length + 10}`,
                name: 'New Elective / Subject',
                credits: 3,
                gradePoint: 9
            }
        ]);
    };
    const handleDeleteSubject = (id) => {
        if (subjects.length <= 1)
            return;
        setSubjects(prev => prev.filter(s => s.id !== id));
    };
    const handleSetAllGrades = (point) => {
        setSubjects(prev => prev.map(s => ({ ...s, gradePoint: point })));
    };
    const handleResetDefaults = () => {
        setSubjects(DEFAULT_SUBJECTS);
        setIsEditMode(false);
    };
    return (_jsxs("div", { style: { padding: '4px 0 30px', maxWidth: 720, margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx("button", { onClick: onBack, style: {
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '50%',
                                    width: 36,
                                    height: 36,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)'
                                }, children: _jsx(ArrowLeft, { size: 18 }) }), _jsxs("div", { children: [_jsx("h2", { style: { fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-main)' }, children: "Target CGPA & GPA Calculator" }), _jsx("p", { style: { fontSize: 11, color: 'var(--text-muted)', margin: 0 }, children: "Simulate semester grades, edit courses & calculate target CGPA" })] })] }), _jsx("div", { style: { display: 'flex', gap: 8 }, children: _jsx("button", { onClick: () => setIsEditMode(!isEditMode), style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '8px 14px',
                                borderRadius: 10,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: isEditMode ? 'var(--accent-blue, #0052cc)' : 'var(--bg-secondary)',
                                color: isEditMode ? '#fff' : 'var(--text-primary)',
                                border: isEditMode ? 'none' : '1px solid var(--card-border)',
                                transition: 'all 0.2s'
                            }, children: isEditMode ? _jsxs(_Fragment, { children: [_jsx(Check, { size: 14 }), " Done Editing"] }) : _jsxs(_Fragment, { children: [_jsx(Pencil, { size: 14 }), " Edit Courses"] }) }) })] }), _jsxs("div", { style: { background: 'var(--bg-primary)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--card-border)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', marginBottom: 16 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: 'var(--accent-blue)', marginBottom: 12 }, children: [_jsx(Sparkles, { size: 16 }), " TARGET CGPA GOAL PLANNER"] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 12 }, children: [_jsxs("div", { children: [_jsx("label", { style: { fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }, children: "Current CGPA" }), _jsx("input", { type: "number", step: "0.01", value: currentCgpa, onChange: e => setCurrentCgpa(e.target.value), className: "form-input", style: { fontSize: 13, fontWeight: 700, padding: '8px 10px', borderRadius: 8 } })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }, children: "Completed Sems" }), _jsx("input", { type: "number", min: "1", max: "7", value: completedSemesters, onChange: e => setCompletedSemesters(e.target.value), className: "form-input", style: { fontSize: 13, fontWeight: 700, padding: '8px 10px', borderRadius: 8 } })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }, children: "Target Goal CGPA" }), _jsx("input", { type: "number", step: "0.01", value: targetCgpa, onChange: e => setTargetCgpa(e.target.value), className: "form-input", style: { fontSize: 13, fontWeight: 700, padding: '8px 10px', borderRadius: 8 } })] })] }), _jsxs("div", { style: { background: 'rgba(0,82,204,0.06)', padding: '10px 14px', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,82,204,0.12)' }, children: [_jsxs("span", { style: { fontSize: 11, fontWeight: 700, color: 'var(--text-main)' }, children: ["Required Avg GPA / Remaining Semesters (", remSems, "):"] }), _jsx("span", { style: { fontSize: 14, fontWeight: 900, color: parseFloat(reqGpaForTarget) > 10 ? '#ef4444' : 'var(--accent-blue)' }, children: parseFloat(reqGpaForTarget) > 10 ? 'Requires > 10.00' : `${reqGpaForTarget} GPA` })] })] }), _jsxs("div", { style: { background: 'var(--bg-primary)', borderRadius: 16, padding: '18px', border: '1px solid var(--card-border)', marginBottom: 20 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(BookOpen, { size: 16, color: "#0052cc" }), _jsxs("h3", { style: { fontSize: 13, fontWeight: 800, margin: 0, color: 'var(--text-main)' }, children: ["Semester Subject Grades (", subjects.length, " Courses \u00B7 ", totalCredits, " Credits)"] })] }), _jsx("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: isEditMode ? (_jsxs("button", { type: "button", onClick: handleAddSubject, style: {
                                        background: 'rgba(0,82,204,0.1)',
                                        border: '1px solid rgba(0,82,204,0.2)',
                                        color: 'var(--accent-blue, #0052cc)',
                                        borderRadius: 8,
                                        padding: '5px 10px',
                                        fontSize: 11,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4
                                    }, children: [_jsx(Plus, { size: 13 }), " Add Course"] })) : (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 4 }, children: [_jsx("span", { style: { fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }, children: "Quick:" }), _jsx("button", { type: "button", onClick: () => handleSetAllGrades(10), style: { background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '3px 7px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }, children: "All O" }), _jsx("button", { type: "button", onClick: () => handleSetAllGrades(9), style: { background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '3px 7px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }, children: "All A+" }), _jsx("button", { type: "button", onClick: () => handleSetAllGrades(8), style: { background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '3px 7px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }, children: "All A" })] })) })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: subjects.map((sub, idx) => (_jsx("div", { style: {
                                background: 'var(--bg-secondary)',
                                borderRadius: 12,
                                padding: '12px 14px',
                                border: '1px solid var(--card-border)',
                                display: 'flex',
                                flexDirection: isEditMode ? 'column' : 'row',
                                justifyContent: 'space-between',
                                alignItems: isEditMode ? 'stretch' : 'center',
                                gap: 10
                            }, children: isEditMode ? (_jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("span", { style: { fontSize: 11, fontWeight: 800, color: 'var(--accent-blue)' }, children: ["Course #", idx + 1] }), subjects.length > 1 && (_jsxs("button", { type: "button", onClick: () => handleDeleteSubject(sub.id), style: {
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    color: '#ef4444',
                                                    borderRadius: 6,
                                                    padding: '3px 8px',
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 3
                                                }, children: [_jsx(Trash2, { size: 12 }), " Remove"] }))] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }, children: [_jsxs("div", { children: [_jsx("label", { style: { fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }, children: "Course Name" }), _jsx("input", { type: "text", value: sub.name, onChange: e => handleUpdateSubjectField(sub.id, 'name', e.target.value), placeholder: "Course Name", className: "form-input", style: { fontSize: 11, padding: '6px 8px' } })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }, children: "Code" }), _jsx("input", { type: "text", value: sub.code, onChange: e => handleUpdateSubjectField(sub.id, 'code', e.target.value), placeholder: "e.g. EE8601", className: "form-input", style: { fontSize: 11, padding: '6px 8px' } })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }, children: "Credits" }), _jsx("input", { type: "number", min: "1", max: "12", value: sub.credits, onChange: e => handleUpdateSubjectField(sub.id, 'credits', Math.max(1, parseInt(e.target.value) || 1)), className: "form-input", style: { fontSize: 11, padding: '6px 8px' } })] })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { style: { flex: 1, minWidth: 0, paddingRight: 8 }, children: [_jsx("div", { style: { fontSize: 12.5, fontWeight: 800, color: 'var(--text-main)', marginBottom: 2 }, children: sub.name }), _jsxs("div", { style: { fontSize: 10.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsxs("span", { children: ["Code: ", sub.code] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { style: { background: 'rgba(0,82,204,0.08)', color: 'var(--accent-blue)', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }, children: [sub.credits, " Credits"] })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }, children: [_jsx("select", { value: sub.gradePoint, onChange: e => handleUpdateGrade(sub.id, parseInt(e.target.value)), style: {
                                                    padding: '7px 10px',
                                                    borderRadius: 8,
                                                    fontSize: 12,
                                                    fontWeight: 800,
                                                    background: 'var(--bg-primary)',
                                                    border: '1.5px solid var(--accent-blue, #0052cc)',
                                                    color: 'var(--accent-blue, #0052cc)',
                                                    outline: 'none',
                                                    cursor: 'pointer'
                                                }, children: GRADE_OPTIONS.map(opt => (_jsx("option", { value: opt.value, children: opt.label }, opt.value))) }), _jsx("button", { type: "button", onClick: () => setIsEditMode(true), title: "Edit Course Name & Credits", style: {
                                                    background: 'transparent',
                                                    border: '1px solid var(--card-border)',
                                                    borderRadius: 8,
                                                    padding: '6px',
                                                    cursor: 'pointer',
                                                    color: 'var(--text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }, children: _jsx(Pencil, { size: 13 }) })] })] })) }, sub.id))) }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px dashed var(--card-border)' }, children: [_jsxs("button", { type: "button", onClick: handleResetDefaults, style: {
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontSize: 11,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }, children: [_jsx(RotateCcw, { size: 12 }), " Reset to Defaults"] }), !isEditMode && (_jsxs("button", { type: "button", onClick: () => setIsEditMode(true), style: {
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--accent-blue, #0052cc)',
                                    fontSize: 11,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }, children: [_jsx(Pencil, { size: 12 }), " Customize Subjects & Credits"] }))] })] }), _jsx("div", { style: {
                    background: 'linear-gradient(135deg, #0052cc 0%, #1d4ed8 100%)',
                    borderRadius: 20,
                    padding: '22px 24px',
                    color: '#fff',
                    boxShadow: '0 12px 32px rgba(0,82,204,0.25)',
                    border: '1px solid rgba(255,255,255,0.15)'
                }, children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }, children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: 0.9, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }, children: [_jsx(GraduationCap, { size: 18 }), " SIMULATED SEMESTER GPA RESULT"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }, children: [_jsx("span", { style: { fontSize: 44, fontWeight: 900, lineHeight: 1, letterSpacing: -0.5 }, children: calculatedGpa }), _jsx("span", { style: { fontSize: 18, opacity: 0.8, fontWeight: 700 }, children: "/ 10.00" })] })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 6, background: 'rgba(255,255,255,0.12)', padding: '12px 16px', borderRadius: 14, minWidth: 180 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 11 }, children: [_jsx("span", { style: { opacity: 0.85 }, children: "Total Courses:" }), _jsx("span", { style: { fontWeight: 800 }, children: subjects.length })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 11 }, children: [_jsx("span", { style: { opacity: 0.85 }, children: "Total Credits:" }), _jsxs("span", { style: { fontWeight: 800 }, children: [totalCredits, " Credits"] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 11 }, children: [_jsx("span", { style: { opacity: 0.85 }, children: "Grade Points:" }), _jsxs("span", { style: { fontWeight: 800 }, children: [earnedPoints, " / ", totalCredits * 10] })] }), _jsx("div", { style: { height: 1, background: 'rgba(255,255,255,0.2)', margin: '2px 0' } }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', fontSize: 11 }, children: [_jsx("span", { style: { opacity: 0.9, fontWeight: 700 }, children: "Projected New CGPA:" }), _jsx("span", { style: { fontWeight: 900, color: '#fef08a' }, children: projectedCgpa })] })] })] }) })] }));
};
