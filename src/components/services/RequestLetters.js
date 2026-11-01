import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { ArrowLeft, FileText, Clock, CheckCircle2, XCircle, Upload, Download, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
const LETTER_TYPES = [
    'Bonafide',
    'NOC',
    'Internship Request',
    'Course Completion'
];
const STATUS_CONFIG = {
    Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: _jsx(Clock, { size: 14 }) },
    Approved: { color: '#4ade80', bg: 'rgba(74,222,128,0.12)', icon: _jsx(CheckCircle2, { size: 14 }) },
    Rejected: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: _jsx(XCircle, { size: 14 }) }
};
export const RequestLetters = ({ currentEmail, currentName, currentRollNo, isAdmin, onBack }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    // Student form state
    const [showForm, setShowForm] = useState(false);
    const [letterType, setLetterType] = useState('Bonafide');
    const [purpose, setPurpose] = useState('');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);
    // Admin state
    const [adminRemarks, setAdminRemarks] = useState({});
    const [uploadingFor, setUploadingFor] = useState(null);
    useEffect(() => {
        loadRequests();
    }, [currentEmail, isAdmin]);
    const loadRequests = async () => {
        setLoading(true);
        try {
            const list = isAdmin
                ? await dbService.getLetterRequests()
                : await dbService.getLetterRequests(currentEmail);
            setRequests(list.sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)));
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (!purpose.trim() || !details.trim())
            return;
        setSubmitting(true);
        setStatusMsg('');
        const newReq = {
            id: `lr-${Date.now()}`,
            studentEmail: currentEmail,
            studentName: currentName,
            rollNo: currentRollNo,
            letterType,
            purpose: purpose.trim(),
            details: details.trim(),
            status: 'Pending',
            requestedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        try {
            await dbService.saveLetterRequest(newReq);
            setStatusMsg('Request submitted successfully!');
            setTimeout(() => setStatusMsg(''), 3000);
            setPurpose('');
            setDetails('');
            setShowForm(false);
            loadRequests();
        }
        catch (err) {
            console.error(err);
            setStatusMsg('Error submitting request.');
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleUpdateStatus = async (req, status) => {
        const remarks = adminRemarks[req.id] || '';
        const updated = { ...req, status, adminRemarks: remarks };
        try {
            await dbService.saveLetterRequest(updated);
            setStatusMsg(`Request ${status.toLowerCase()}!`);
            setTimeout(() => setStatusMsg(''), 2500);
            loadRequests();
        }
        catch (err) {
            console.error(err);
            setStatusMsg('Error updating status.');
        }
    };
    const handleUploadSignedLetter = (e, req) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.type !== 'application/pdf') {
            setStatusMsg('Only PDF documents are supported.');
            return;
        }
        setUploadingFor(req.id);
        setStatusMsg('');
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target?.result;
            const updated = { ...req, status: 'Approved', pdfUrl: base64, adminRemarks: adminRemarks[req.id] || req.adminRemarks || '' };
            try {
                await dbService.saveLetterRequest(updated);
                setStatusMsg('Signed letter uploaded & request approved!');
                setTimeout(() => setStatusMsg(''), 3000);
                loadRequests();
            }
            catch (err) {
                console.error(err);
                setStatusMsg('Error uploading letter.');
            }
            finally {
                setUploadingFor(null);
            }
        };
        reader.readAsDataURL(file);
    };
    const handleDownloadLetter = (req) => {
        if (!req.pdfUrl)
            return;
        const link = document.createElement('a');
        link.href = req.pdfUrl;
        link.download = `${req.letterType.replace(/\s+/g, '_')}_Letter_${req.rollNo}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const handleDeleteRequest = async (id) => {
        if (!window.confirm('Delete this letter request?'))
            return;
        try {
            await dbService.deleteLetterRequest(id);
            setStatusMsg('Request deleted.');
            setTimeout(() => setStatusMsg(''), 2500);
            loadRequests();
        }
        catch (err) {
            console.error(err);
            setStatusMsg('Error deleting request.');
        }
    };
    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    return (_jsxs("div", { className: "panel-view", children: [_jsxs("div", { className: "panel-header", children: [_jsx("button", { onClick: onBack, className: "back-btn", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("span", { className: "panel-title", children: isAdmin ? 'Letter Request Manager' : 'Request Letters' })] }), _jsxs("div", { className: "panel-body", children: [statusMsg && (_jsx("div", { style: { padding: 8, background: '#eff6ff', border: '1px solid rgba(0,82,204,0.2)', borderRadius: 6, fontSize: 11, textAlign: 'center', color: '#0052cc', fontWeight: 700, marginBottom: 4 }, children: statusMsg })), !isAdmin && (_jsxs(_Fragment, { children: [_jsxs("div", { style: { background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '2px solid rgba(0,82,204,0.18)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }, children: "Letters Requested" }), _jsx("div", { style: { fontSize: 24, fontWeight: 800, color: '#0f172a' }, children: requests.length })] }), _jsxs("div", { style: { textAlign: 'right' }, children: [_jsx("div", { style: { fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 4 }, children: "Awaiting Approval" }), _jsx("div", { style: { fontSize: 24, fontWeight: 800, color: pendingCount > 0 ? '#d97706' : '#059669' }, children: pendingCount })] })] }), _jsxs("button", { onClick: () => setShowForm(!showForm), className: "btn-primary", style: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }, children: [_jsx(Plus, { size: 16 }), "New Letter Request"] }), showForm && (_jsxs("form", { onSubmit: handleSubmitRequest, style: { background: 'var(--bg-secondary)', borderRadius: 12, padding: 14, border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14, animation: 'slideDown 0.2s ease' }, children: [_jsx("h4", { style: { fontSize: 13, fontWeight: 800, margin: 0 }, children: "\u2709\uFE0F New Letter Request" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Letter Type" }), _jsx("select", { value: letterType, onChange: e => setLetterType(e.target.value), className: "form-select", style: { fontSize: 12 }, children: LETTER_TYPES.map(t => _jsxs("option", { value: t, children: [t, " Letter"] }, t)) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Purpose" }), _jsx("input", { type: "text", value: purpose, onChange: e => setPurpose(e.target.value), className: "form-input", placeholder: "e.g. Bank Loan, Passport Application, Internship at Siemens", required: true, style: { fontSize: 12 } })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Additional Details" }), _jsx("textarea", { value: details, onChange: e => setDetails(e.target.value), className: "form-input", placeholder: "Any specific information the HOD office should know...", required: true, rows: 3, style: { fontSize: 12, resize: 'vertical', fontFamily: 'inherit' } })] }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsx("button", { type: "submit", className: "btn-primary", style: { flex: 1, fontSize: 12 }, disabled: submitting, children: submitting ? 'Submitting...' : 'Submit Request' }), _jsx("button", { type: "button", onClick: () => setShowForm(false), className: "btn-secondary", style: { fontSize: 12 }, children: "Cancel" })] })] })), _jsx("h4", { style: { fontSize: 13, fontWeight: 700, marginBottom: 8 }, children: "My Requests" }), loading ? (_jsx("p", { style: { fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }, children: "Loading..." })) : requests.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }, children: [_jsx(FileText, { size: 36, style: { opacity: 0.3, marginBottom: 8 } }), _jsx("p", { style: { fontSize: 12 }, children: "No letter requests yet. Submit one above!" })] })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: requests.map(req => {
                                    const cfg = STATUS_CONFIG[req.status];
                                    const isExpanded = expandedId === req.id;
                                    return (_jsxs("div", { style: { background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: 12, overflow: 'hidden' }, children: [_jsxs("div", { onClick: () => setExpandedId(isExpanded ? null : req.id), style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', cursor: 'pointer' }, children: [_jsxs("div", { style: { display: 'flex', gap: 10, alignItems: 'center' }, children: [_jsx("div", { style: { background: 'rgba(79,70,229,0.12)', color: '#818cf8', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, children: _jsx(FileText, { size: 15 }) }), _jsxs("div", { children: [_jsxs("div", { style: { fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }, children: [req.letterType, " Letter"] }), _jsx("div", { style: { fontSize: 10, color: 'var(--text-muted)' }, children: req.requestedAt })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsxs("span", { style: { fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', gap: 4 }, children: [cfg.icon, req.status] }), isExpanded ? _jsx(ChevronUp, { size: 14, style: { color: 'var(--text-muted)' } }) : _jsx(ChevronDown, { size: 14, style: { color: 'var(--text-muted)' } })] })] }), isExpanded && (_jsxs("div", { style: { padding: '0 14px 14px', borderTop: '1px solid var(--card-border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 2 }, children: "Purpose" }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-main)' }, children: req.purpose })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 2 }, children: "Details" }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }, children: req.details })] }), req.adminRemarks && (_jsxs("div", { style: { background: 'rgba(56,189,248,0.08)', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(56,189,248,0.18)' }, children: [_jsx("div", { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: '#38bdf8', marginBottom: 2 }, children: "Admin Remarks" }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-main)' }, children: req.adminRemarks })] })), req.status === 'Approved' && req.pdfUrl && (_jsxs("button", { onClick: () => handleDownloadLetter(req), className: "btn-primary", style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, padding: '8px 12px', background: '#059669' }, children: [_jsx(Download, { size: 14 }), "Download Signed Letter"] }))] }))] }, req.id));
                                }) }))] })), isAdmin && (_jsxs(_Fragment, { children: [_jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }, children: ['Pending', 'Approved', 'Rejected'].map(s => {
                                    const cfg = STATUS_CONFIG[s];
                                    const count = requests.filter(r => r.status === s).length;
                                    return (_jsxs("div", { style: { background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: 10, padding: '10px 8px', textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: 20, fontWeight: 800, color: cfg.color }, children: count }), _jsx("div", { style: { fontSize: 9, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: 0.8 }, children: s })] }, s));
                                }) }), _jsx("h4", { style: { fontSize: 13, fontWeight: 700, marginBottom: 10 }, children: "All Student Requests" }), loading ? (_jsx("p", { style: { fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }, children: "Loading..." })) : requests.length === 0 ? (_jsxs("div", { style: { textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }, children: [_jsx(FileText, { size: 36, style: { opacity: 0.3, marginBottom: 8 } }), _jsx("p", { style: { fontSize: 12 }, children: "No letter requests received yet." })] })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: requests.map(req => {
                                    const cfg = STATUS_CONFIG[req.status];
                                    const isExpanded = expandedId === req.id;
                                    return (_jsxs("div", { style: { background: 'var(--bg-secondary)', border: `1.5px solid ${req.status === 'Pending' ? '#f59e0b44' : 'var(--card-border)'}`, borderRadius: 14, overflow: 'hidden', transition: 'box-shadow 0.2s' }, children: [_jsxs("div", { onClick: () => setExpandedId(isExpanded ? null : req.id), style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', cursor: 'pointer' }, children: [_jsxs("div", { style: { display: 'flex', gap: 10, alignItems: 'center' }, children: [_jsx("div", { style: { width: 36, height: 36, borderRadius: '50%', background: `hsl(${req.studentName.charCodeAt(0) * 4}, 55%, 80%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#111', flexShrink: 0 }, children: req.studentName.charAt(0) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }, children: req.studentName }), _jsxs("div", { style: { fontSize: 10, color: 'var(--text-muted)' }, children: [req.rollNo, " \u00B7 ", req.letterType, " \u00B7 ", req.requestedAt] })] })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6 }, children: [_jsxs("span", { style: { fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 5, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', gap: 3 }, children: [cfg.icon, req.status] }), isExpanded ? _jsx(ChevronUp, { size: 13, style: { color: 'var(--text-muted)' } }) : _jsx(ChevronDown, { size: 13, style: { color: 'var(--text-muted)' } })] })] }), isExpanded && (_jsxs("div", { style: { padding: '0 14px 14px', borderTop: '1px solid var(--card-border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }, children: "Purpose" }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-main)' }, children: req.purpose })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }, children: "Student Email" }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', wordBreak: 'break-all' }, children: req.studentEmail })] })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }, children: "Student Details" }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }, children: req.details })] }), _jsxs("div", { children: [_jsx("label", { style: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }, children: "Admin Remarks" }), _jsx("textarea", { value: adminRemarks[req.id] ?? (req.adminRemarks || ''), onChange: e => setAdminRemarks(prev => ({ ...prev, [req.id]: e.target.value })), className: "form-input", placeholder: "Add remarks for the student...", rows: 2, style: { fontSize: 11, resize: 'vertical', fontFamily: 'inherit' } })] }), _jsx("div", { style: { background: 'var(--bg-tertiary)', padding: '8px 10px', borderRadius: 8, border: '1px dashed var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: req.pdfUrl ? (_jsxs(_Fragment, { children: [_jsx("span", { style: { fontSize: 10, color: '#4ade80', fontWeight: 700 }, children: "\u2705 Signed PDF Available" }), _jsx("button", { onClick: () => handleDownloadLetter(req), className: "doc-action-btn", style: { padding: 4 }, title: "Download", children: _jsx(Download, { size: 14 }) })] })) : (_jsxs(_Fragment, { children: [_jsx("span", { style: { fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }, children: "No signed letter uploaded" }), _jsxs("label", { className: "btn-secondary", style: { display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: 10, padding: '3px 8px', borderRadius: 6 }, children: [uploadingFor === req.id ? 'Uploading...' : _jsxs(_Fragment, { children: [_jsx(Upload, { size: 12 }), "Upload Signed PDF"] }), _jsx("input", { type: "file", accept: "application/pdf", onChange: e => handleUploadSignedLetter(e, req), style: { display: 'none' }, disabled: uploadingFor !== null })] })] })) }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [req.status !== 'Approved' && (_jsxs("button", { onClick: () => handleUpdateStatus(req, 'Approved'), style: { flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1.5px solid #4ade80', background: 'rgba(74,222,128,0.1)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }, children: [_jsx(CheckCircle2, { size: 13 }), " Approve"] })), req.status !== 'Rejected' && (_jsxs("button", { onClick: () => handleUpdateStatus(req, 'Rejected'), style: { flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1.5px solid #f87171', background: 'rgba(248,113,113,0.1)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }, children: [_jsx(XCircle, { size: 13 }), " Reject"] })), _jsx("button", { onClick: () => handleDeleteRequest(req.id), style: { padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1.5px solid var(--card-border)', background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, title: "Delete Request", children: _jsx(Trash2, { size: 13 }) })] })] }))] }, req.id));
                                }) }))] }))] })] }));
};
