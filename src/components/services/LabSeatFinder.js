import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Search, MapPin, User, Building } from 'lucide-react';
const SAMPLE_ASSIGNMENTS = [
    {
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
export const LabSeatFinder = ({ onBack, rollNo: initialRoll = '' }) => {
    const [searchQuery, setSearchQuery] = useState(initialRoll);
    const [selectedLab, setSelectedLab] = useState('Power Electronics & Drives Laboratory');
    const [result, setResult] = useState(SAMPLE_ASSIGNMENTS.find(a => a.rollNo.toLowerCase() === initialRoll.toLowerCase()) || SAMPLE_ASSIGNMENTS[0]);
    const handleSearch = (e) => {
        e.preventDefault();
        const query = searchQuery.trim().toLowerCase();
        const found = SAMPLE_ASSIGNMENTS.find(a => a.rollNo.toLowerCase() === query ||
            a.studentName.toLowerCase().includes(query));
        if (found) {
            setResult(found);
        }
        else {
            // Generate dynamic seat assignment for any roll number
            setResult({
                rollNo: searchQuery.toUpperCase() || '7377221EE999',
                studentName: 'EEE Student',
                labName: selectedLab,
                block: 'EEE Main Block - 2nd Floor',
                roomNo: 'EB-206',
                benchNo: `Bench ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}-${Math.floor(Math.random() * 15) + 1}`,
                systemNo: `SYS-EEE-${Math.floor(Math.random() * 30) + 1}`,
                session: 'FN (Forenoon)',
                time: '09:00 AM – 12:00 PM',
                supervisor: 'Dr. S. Kavitha'
            });
        }
    };
    return (_jsxs("div", { style: { padding: '4px 0 20px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }, children: [_jsxs("div", { children: [_jsx("h2", { style: { fontSize: 20, fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-main)' }, children: "\uD83D\uDD2C Lab Exam Hall & Seat Finder" }), _jsx("p", { style: { fontSize: 12, color: 'var(--text-muted)', margin: 0 }, children: "Instant Seat & Desk Locator for EEE Practical Examinations & Lab Sessions" })] }), _jsx("button", { className: "back-btn", onClick: onBack, children: "\u2190 Back" })] }), _jsx("form", { onSubmit: handleSearch, style: { background: 'var(--bg-primary)', padding: 18, borderRadius: 18, border: '1px solid var(--card-border)', marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }, children: _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, alignItems: 'end' }, children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", style: { fontSize: 11, fontWeight: 700, marginBottom: 6, display: 'block' }, children: "Select Lab Course" }), _jsxs("select", { className: "form-input", value: selectedLab, onChange: e => setSelectedLab(e.target.value), style: { fontSize: 13, width: '100%', padding: '10px 12px', borderRadius: 10 }, children: [_jsx("option", { children: "Power Electronics & Drives Laboratory" }), _jsx("option", { children: "Renewable Energy Systems Laboratory" }), _jsx("option", { children: "Embedded Systems Laboratory" }), _jsx("option", { children: "Digital Logic Circuits Laboratory" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", style: { fontSize: 11, fontWeight: 700, marginBottom: 6, display: 'block' }, children: "Enter Roll No or Student Name" }), _jsx("input", { type: "text", className: "form-input", placeholder: "e.g. 71812503104 or Nithin", value: searchQuery, onChange: e => setSearchQuery(e.target.value), style: { fontSize: 13, width: '100%', padding: '10px 12px', borderRadius: 10 }, required: true })] }), _jsxs("button", { type: "submit", className: "btn-primary", style: { height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 13, borderRadius: 10 }, children: [_jsx(Search, { size: 16 }), " Locate Seat"] })] }) }), result && (_jsxs("div", { style: { background: 'linear-gradient(135deg, #0052cc 0%, #1e40af 100%)', borderRadius: 24, padding: 24, color: '#fff', boxShadow: '0 16px 36px rgba(0, 82, 204, 0.25)', position: 'relative', overflow: 'hidden' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 16, marginBottom: 20 }, children: [_jsxs("div", { children: [_jsx("span", { style: { fontSize: 10, fontWeight: 800, textTransform: uppercaseText('CONFIRMED LAB SEAT ALLOCATION'), background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 20 }, children: "\u2713 OFFICIAL ALLOCATION" }), _jsx("h3", { style: { fontSize: 20, fontWeight: 900, margin: '8px 0 2px 0', color: '#fff' }, children: result.studentName }), _jsxs("p", { style: { fontSize: 12, color: 'rgba(255,255,255,0.85)', margin: 0 }, children: ["Roll No: ", result.rollNo] })] }), _jsxs("div", { style: { background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: 14, textAlign: 'right' }, children: [_jsx("div", { style: { fontSize: 10, textTransform: 'uppercase', opacity: 0.8 }, children: "Lab Session" }), _jsx("div", { style: { fontSize: 13, fontWeight: 800 }, children: result.session }), _jsx("div", { style: { fontSize: 11, opacity: 0.9 }, children: result.time })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }, children: [_jsxs("div", { style: { background: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 16, backdropFilter: 'blur(8px)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: 0.8, marginBottom: 4 }, children: [_jsx(Building, { size: 14 }), " Lab Location & Block"] }), _jsx("div", { style: { fontSize: 14, fontWeight: 800 }, children: result.roomNo }), _jsx("div", { style: { fontSize: 11, opacity: 0.9 }, children: result.block })] }), _jsxs("div", { style: { background: 'rgba(255,95,31,0.25)', border: '1px solid rgba(255,95,31,0.4)', padding: 14, borderRadius: 16, backdropFilter: 'blur(8px)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#ff9d76', marginBottom: 4 }, children: [_jsx(MapPin, { size: 14 }), " Assigned Bench & Desk"] }), _jsx("div", { style: { fontSize: 18, fontWeight: 900, color: '#fff' }, children: result.benchNo }), _jsxs("div", { style: { fontSize: 11, color: '#ff9d76' }, children: ["Kit / Setup: ", result.systemNo] })] }), _jsxs("div", { style: { background: 'rgba(255,255,255,0.12)', padding: 14, borderRadius: 16, backdropFilter: 'blur(8px)' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: 0.8, marginBottom: 4 }, children: [_jsx(User, { size: 14 }), " Lab In-Charge / Examiner"] }), _jsx("div", { style: { fontSize: 13, fontWeight: 800 }, children: result.supervisor }), _jsx("div", { style: { fontSize: 11, opacity: 0.9 }, children: "Dept of EEE, SREC" })] })] })] }))] }));
};
function uppercaseText(str) {
    return str.toUpperCase();
}
