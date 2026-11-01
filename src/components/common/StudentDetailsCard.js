import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Award, GraduationCap, UserCheck, ChevronRight, ShieldCheck, Calendar, Hash, Layers } from 'lucide-react';
import { dbService } from '../../services/db';
export const StudentDetailsCard = ({ currentUser, onOpenProfile, onOpenTab }) => {
    const isAdmin = currentUser?.role === 'teacher';
    const name = currentUser?.name || 'Nithin Annamalai';
    const rollNo = currentUser?.rollNo || '71812503104';
    const className = currentUser?.className || 'II EEE-B';
    const yearOfStudy = currentUser?.yearOfStudy || '2nd Year';
    const semester = currentUser?.semester || 'SEM III';
    const department = currentUser?.department || 'Dept of EEE';
    const [dbMetrics, setDbMetrics] = useState({
        attendance: '88.5%',
        cgpa: '8.75',
        nptelCerts: '2 Exams',
        arrears: '0'
    });
    useEffect(() => {
        let isMounted = true;
        const fetchDbData = async () => {
            const email = currentUser?.email || 'student@eee.com';
            const studentRoll = currentUser?.rollNo || '71812503104';
            try {
                const profile = await dbService.getStudentProfile(email);
                if (profile && isMounted) {
                    const semKeys = Object.keys(profile.cgpa).map(Number).sort((a, b) => b - a);
                    const latestSem = semKeys[0];
                    const latestCgpa = latestSem ? profile.cgpa[latestSem]?.gpa || 8.75 : 8.75;
                    setDbMetrics(prev => ({
                        ...prev,
                        cgpa: String(latestCgpa),
                        arrears: String(profile.arrears ?? 0),
                        nptelCerts: `${profile.nptelExams?.length || 2} Exams`
                    }));
                }
                const logs = await dbService.getAttendanceForStudent(studentRoll);
                if (logs && logs.length > 0 && isMounted) {
                    const present = logs.filter(l => l.status === 'present').length;
                    const percentage = Math.round((present / logs.length) * 100);
                    setDbMetrics(prev => ({ ...prev, attendance: `${percentage}%` }));
                }
            }
            catch (e) {
                console.warn('Student card db sync fallback:', e);
            }
        };
        fetchDbData();
        return () => { isMounted = false; };
    }, [currentUser]);
    return (_jsxs("div", { className: "mobile-vip-student-card", children: [_jsxs("div", { className: "vip-card-header", children: [_jsxs("div", { className: "vip-avatar-wrap", children: [_jsx("div", { className: "vip-avatar-circle", children: name.charAt(0) }), _jsx("span", { className: "vip-online-badge" })] }), _jsxs("div", { className: "vip-user-info", children: [_jsxs("div", { className: "vip-name-row", children: [_jsx("h2", { className: "vip-student-name", children: name }), _jsxs("span", { className: `vip-role-tag ${isAdmin ? 'admin' : 'student'}`, children: [_jsx(ShieldCheck, { size: 11 }), " ", isAdmin ? 'Faculty Admin' : 'UG Scholar'] })] }), _jsxs("p", { className: "vip-dept-text", children: [department, " \u00B7 SREC"] })] }), _jsxs("button", { className: "vip-vault-btn", onClick: onOpenProfile, "aria-label": "Open Document Vault", children: [_jsx("span", { children: "Doc Vault" }), _jsx(ChevronRight, { size: 14 })] })] }), !isAdmin && (_jsxs("div", { className: "vip-chips-row", children: [_jsxs("div", { className: "vip-chip", children: [_jsx(Hash, { size: 12, className: "vip-chip-icon" }), _jsx("span", { children: rollNo })] }), _jsxs("div", { className: "vip-chip", children: [_jsx(Layers, { size: 12, className: "vip-chip-icon" }), _jsx("span", { children: className })] }), _jsxs("div", { className: "vip-chip", children: [_jsx(Calendar, { size: 12, className: "vip-chip-icon" }), _jsxs("span", { children: [yearOfStudy, " \u00B7 ", semester] })] })] })), !isAdmin && (_jsxs("div", { className: "vip-metrics-grid", children: [_jsxs("div", { className: "vip-metric-box", onClick: () => onOpenTab('attendance'), children: [_jsx("div", { className: "vip-metric-icon", style: { background: 'rgba(22, 163, 74, 0.2)', color: '#4ade80' }, children: _jsx(UserCheck, { size: 14 }) }), _jsxs("div", { className: "vip-metric-data", children: [_jsx("span", { className: "vip-metric-val", children: dbMetrics.attendance }), _jsx("span", { className: "vip-metric-label", children: "Attendance" })] })] }), _jsxs("div", { className: "vip-metric-box", onClick: () => onOpenTab('academics'), children: [_jsx("div", { className: "vip-metric-icon", style: { background: 'rgba(99, 102, 241, 0.25)', color: '#818cf8' }, children: _jsx(GraduationCap, { size: 14 }) }), _jsxs("div", { className: "vip-metric-data", children: [_jsx("span", { className: "vip-metric-val", children: dbMetrics.cgpa }), _jsx("span", { className: "vip-metric-label", children: "CGPA" })] })] }), _jsxs("div", { className: "vip-metric-box", onClick: () => onOpenTab('nptel'), children: [_jsx("div", { className: "vip-metric-icon", style: { background: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24' }, children: _jsx(Award, { size: 14 }) }), _jsxs("div", { className: "vip-metric-data", children: [_jsx("span", { className: "vip-metric-val", children: dbMetrics.nptelCerts }), _jsx("span", { className: "vip-metric-label", children: "NPTEL" })] })] })] }))] }));
};
