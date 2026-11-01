import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { 
  Bug, ArrowLeft, CheckCircle2, Clock, AlertTriangle, 
  Send, RefreshCw, Trash2, Filter, ShieldAlert, Cpu
} from 'lucide-react';

export function BugReport({ onBack, currentUser, isAdmin = false }) {
  const [activeTab, setActiveTab] = useState('report'); // 'report' | 'list'
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ui');
  const [severity, setSeverity] = useState('medium');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Admin note editing
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [statusInput, setStatusInput] = useState('open');

  const reporterEmail = currentUser?.email || 'student@eee.com';
  const reporterName = currentUser?.name || 'Scholar Student';

  useEffect(() => {
    loadReports();
  }, [reporterEmail, isAdmin]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await dbService.getBugReports(isAdmin ? null : reporterEmail);
      setReports(data || []);
    } catch (err) {
      console.warn('Failed to load bug reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const detectedPlatform = typeof navigator !== 'undefined' 
        ? `${navigator.userAgentData?.platform || navigator.platform || 'Client'} (${navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'})` 
        : 'Web Client';

      const newReport = await dbService.saveBugReport({
        reporterName,
        reporterEmail,
        reporterRole: isAdmin ? 'faculty' : 'student',
        title: title.trim(),
        category,
        severity,
        description: description.trim(),
        deviceInfo: detectedPlatform,
        status: 'open',
        adminNotes: ''
      });

      setReports(prev => [newReport, ...prev]);
      setSubmitted(true);
      setTitle('');
      setDescription('');
      setCategory('ui');
      setSeverity('medium');
    } catch (err) {
      alert('Error submitting report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (reportId) => {
    try {
      await dbService.updateBugReportStatus(reportId, statusInput, adminNoteInput);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: statusInput, adminNotes: adminNoteInput } : r));
      setSelectedReport(null);
    } catch (err) {
      alert('Failed to update ticket status.');
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Delete this issue ticket?')) return;
    try {
      await dbService.deleteBugReport(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (err) {
      alert('Failed to delete report.');
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return { label: 'CRITICAL', bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', border: '#fca5a5' };
      case 'high':
        return { label: 'HIGH', bg: 'rgba(255, 95, 31, 0.15)', color: '#ea580c', border: '#fdba74' };
      case 'low':
        return { label: 'LOW', bg: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: '#86efac' };
      default:
        return { label: 'MEDIUM', bg: 'rgba(234, 179, 8, 0.15)', color: '#ca8a04', border: '#fde047' };
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'resolved':
      case 'closed':
        return { label: 'Resolved', bg: '#dcfce7', color: '#15803d', icon: CheckCircle2 };
      case 'in_progress':
        return { label: 'In Progress', bg: '#eff6ff', color: '#1d4ed8', icon: RefreshCw };
      default:
        return { label: 'Open Ticket', bg: '#fef3c7', color: '#b45309', icon: Clock };
    }
  };

  const filteredReports = reports.filter(r => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    return true;
  });

  return (
    _jsxs("div", { className: "panel-view", style: { position: 'relative', top: 0, minHeight: '85vh', background: 'var(--bg-secondary)', paddingBottom: 60 }, children: [
      // Top Navigation Bar
      _jsxs("div", { className: "panel-header", style: { background: 'var(--bg-primary)', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px' }, children: [
        _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [
          _jsx("button", { className: "back-btn", onClick: onBack, "aria-label": "Go Back", children: _jsx(ArrowLeft, { size: 18 }) }),
          _jsxs("div", { children: [
            _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6 }, children: [
              _jsx(Bug, { size: 18, color: "var(--accent-orange)" }),
              _jsx("h2", { style: { margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text-main)' }, children: "Bug & Issue Reporter" })
            ] }),
            _jsx("p", { style: { margin: 0, fontSize: 11, color: 'var(--text-muted)' }, children: "Report glitches, errors, or system malfunctions" })
          ] })
        ] }),
        _jsxs("div", { style: { display: 'flex', gap: 6, background: 'var(--bg-secondary)', padding: 3, borderRadius: 10, border: '1px solid var(--card-border)' }, children: [
          _jsx("button", { 
            onClick: () => { setActiveTab('report'); setSubmitted(false); }, 
            style: { 
              padding: '6px 12px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 800, cursor: 'pointer',
              background: activeTab === 'report' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'report' ? '#ffffff' : 'var(--text-muted)'
            }, 
            children: "New Issue" 
          }),
          _jsxs("button", { 
            onClick: () => { setActiveTab('list'); loadReports(); }, 
            style: { 
              padding: '6px 12px', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 800, cursor: 'pointer',
              background: activeTab === 'list' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'list' ? '#ffffff' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 4
            }, 
            children: [
              "Issue Log", 
              reports.length > 0 && _jsx("span", { style: { background: activeTab === 'list' ? 'rgba(255,255,255,0.3)' : 'rgba(0,82,204,0.15)', color: activeTab === 'list' ? '#ffffff' : 'var(--accent-blue)', padding: '1px 5px', borderRadius: 99, fontSize: 10 }, children: reports.length })
            ] 
          })
        ] })
      ] }),

      // Main Content Area
      _jsx("div", { style: { maxWidth: 640, margin: '0 auto', padding: '16px 16px 32px' }, children: [
        // TAB 1: SUBMIT REPORT
        activeTab === 'report' && (
          submitted ? (
            _jsxs("div", { style: { background: 'var(--bg-primary)', borderRadius: 20, padding: 32, textAlign: 'center', border: '1px solid var(--card-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginTop: 20 }, children: [
              _jsx(CheckCircle2, { size: 54, color: "#10b981", style: { marginBottom: 14 } }),
              _jsx("h3", { style: { fontSize: 18, fontWeight: 900, margin: '0 0 8px', color: 'var(--text-main)' }, children: "Bug Report Submitted!" }),
              _jsx("p", { style: { fontSize: 13, color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.5 }, children: "Thank you for helping us maintain SREC Smart Hub. Your issue ticket has been dispatched to the IT support & administration team." }),
              _jsxs("div", { style: { display: 'flex', gap: 10, justifyContent: 'center' }, children: [
                _jsx("button", { className: "btn-secondary", onClick: () => setSubmitted(false), children: "Submit Another" }),
                _jsx("button", { className: "btn-primary", onClick: () => setActiveTab('list'), children: "View Issue Log" })
              ] })
            ] })
          ) : (
            _jsxs("form", { onSubmit: handleSubmit, style: { background: 'var(--bg-primary)', borderRadius: 20, padding: 22, border: '1px solid var(--card-border)', boxShadow: '0 4px 16px rgba(0,82,204,0.04)', display: 'flex', flexDirection: 'column', gap: 16 }, children: [
              _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255, 95, 31, 0.08)', borderRadius: 12, border: '1px solid rgba(255, 95, 31, 0.2)' }, children: [
                _jsx(AlertTriangle, { size: 18, color: "var(--accent-orange)" }),
                _jsx("span", { style: { fontSize: 11.5, color: '#c2410c', fontWeight: 600 }, children: "Found a broken button, UI misalignment, or calculation mismatch? Let us know below." })
              ] }),

              _jsxs("div", { className: "form-group", children: [
                _jsx("label", { className: "form-label", children: "Issue Headline / Summary *" }),
                _jsx("input", { 
                  type: "text", 
                  className: "form-input", 
                  placeholder: "e.g., Attendance percentage not recalculating after leave approval", 
                  value: title, 
                  onChange: e => setTitle(e.target.value), 
                  required: true 
                })
              ] }),

              _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }, children: [
                _jsxs("div", { className: "form-group", children: [
                  _jsx("label", { className: "form-label", children: "Category *" }),
                  _jsxs("select", { className: "form-select", value: category, onChange: e => setCategory(e.target.value), children: [
                    _jsx("option", { value: "ui", children: "🎨 UI / Layout Glitch" }),
                    _jsx("option", { value: "academic", children: "📊 Academic / CGPA Calc" }),
                    _jsx("option", { value: "login", children: "🔑 Login & Account" }),
                    _jsx("option", { value: "performance", children: "⚡ Slow Load / Lag" }),
                    _jsx("option", { value: "crash", children: "💥 App Crash / Freeze" }),
                    _jsx("option", { value: "other", children: "📝 Other Issue" })
                  ] })
                ] }),
                _jsxs("div", { className: "form-group", children: [
                  _jsx("label", { className: "form-label", children: "Severity *" }),
                  _jsxs("select", { className: "form-select", value: severity, onChange: e => setSeverity(e.target.value), children: [
                    _jsx("option", { value: "low", children: "🟢 Low (Minor defect)" }),
                    _jsx("option", { value: "medium", children: "🟡 Medium (Affects task)" }),
                    _jsx("option", { value: "high", children: "🟠 High (Blocks feature)" }),
                    _jsx("option", { value: "critical", children: "🔴 Critical (System crash)" })
                  ] })
                ] })
              ] }),

              _jsxs("div", { className: "form-group", children: [
                _jsx("label", { className: "form-label", children: "Detailed Description & Steps to Reproduce *" }),
                _jsx("textarea", { 
                  className: "form-textarea", 
                  rows: 4, 
                  placeholder: "Please describe what happened, what you expected, and any steps to trigger the bug...", 
                  value: description, 
                  onChange: e => setDescription(e.target.value), 
                  required: true,
                  style: { minHeight: 95 }
                })
              ] }),

              _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 10 }, children: [
                _jsx(Cpu, { size: 14 }),
                _jsxs("span", { children: ["Reporter: ", _jsx("strong", { children: reporterName }), " (", reporterEmail, ")"] })
              ] }),

              _jsxs("button", { 
                type: "submit", 
                className: "btn-primary", 
                disabled: submitting || !title.trim() || !description.trim(),
                style: { padding: '12px', fontSize: 13, gap: 8, marginTop: 4 }, 
                children: [
                  submitting ? _jsx(RefreshCw, { size: 16, className: "spin-animate" }) : _jsx(Send, { size: 16 }),
                  submitting ? "Transmitting Ticket..." : "Submit Bug Report"
                ] 
              })
            ] })
          )
        ),

        // TAB 2: ISSUE LOG / TRACKER
        activeTab === 'list' && (
          _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 14 }, children: [
            // Filter Bar
            _jsxs("div", { style: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: 14, border: '1px solid var(--card-border)' }, children: [
              _jsx(Filter, { size: 14, color: "var(--text-muted)" }),
              _jsxs("select", { 
                className: "form-select", 
                style: { width: 'auto', padding: '6px 26px 6px 10px', fontSize: 11 }, 
                value: filterCategory, 
                onChange: e => setFilterCategory(e.target.value),
                children: [
                  _jsx("option", { value: "all", children: "All Categories" }),
                  _jsx("option", { value: "ui", children: "UI / Layout" }),
                  _jsx("option", { value: "academic", children: "Academic" }),
                  _jsx("option", { value: "login", children: "Login" }),
                  _jsx("option", { value: "performance", children: "Performance" }),
                  _jsx("option", { value: "crash", children: "Crash" }),
                  _jsx("option", { value: "other", children: "Other" })
                ] 
              }),
              _jsxs("select", { 
                className: "form-select", 
                style: { width: 'auto', padding: '6px 26px 6px 10px', fontSize: 11 }, 
                value: filterSeverity, 
                onChange: e => setFilterSeverity(e.target.value),
                children: [
                  _jsx("option", { value: "all", children: "All Severities" }),
                  _jsx("option", { value: "low", children: "Low" }),
                  _jsx("option", { value: "medium", children: "Medium" }),
                  _jsx("option", { value: "high", children: "High" }),
                  _jsx("option", { value: "critical", children: "Critical" })
                ] 
              }),
              _jsx("button", { onClick: loadReports, style: { marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700 }, children: [
                _jsx(RefreshCw, { size: 12 }), " Refresh"
              ] })
            ] }),

            // Reports List
            loading ? (
              _jsxs("div", { style: { textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }, children: [
                _jsx(RefreshCw, { size: 24, className: "spin-animate", style: { marginBottom: 8 } }),
                _jsx("div", { style: { fontSize: 12 }, children: "Fetching issue tickets..." })
              ] })
            ) : filteredReports.length === 0 ? (
              _jsxs("div", { style: { background: 'var(--bg-primary)', borderRadius: 16, padding: '36px 20px', textAlign: 'center', border: '1px solid var(--card-border)' }, children: [
                _jsx(CheckCircle2, { size: 40, color: "#10b981", style: { marginBottom: 10 } }),
                _jsx("h4", { style: { fontSize: 15, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-main)' }, children: "No Issues Found" }),
                _jsx("p", { style: { fontSize: 12, color: 'var(--text-muted)', margin: 0 }, children: "All systems operational! No bug reports match your filter." })
              ] })
            ) : (
              filteredReports.map(report => {
                const sevBadge = getSeverityBadge(report.severity);
                const stBadge = getStatusBadge(report.status);
                const StatusIcon = stBadge.icon;

                return (
                  _jsxs("div", { style: { background: 'var(--bg-primary)', borderRadius: 16, padding: '16px 18px', border: '1px solid var(--card-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: 10 }, children: [
                    _jsxs("div", { style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }, children: [
                      _jsxs("div", { children: [
                        _jsx("h4", { style: { margin: '0 0 4px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }, children: report.title }),
                        _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-muted)' }, children: [
                          _jsx("span", { children: report.reporterName }),
                          _jsx("span", { children: "·" }),
                          _jsx("span", { children: report.createdAt?.split('T')[0] || report.createdAt })
                        ] })
                      ] }),
                      _jsxs("div", { style: { display: 'flex', gap: 6, flexShrink: 0 }, children: [
                        _jsx("span", { style: { fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: sevBadge.bg, color: sevBadge.color, border: `1px solid ${sevBadge.border}` }, children: sevBadge.label }),
                        _jsxs("span", { style: { fontSize: 9.5, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: stBadge.bg, color: stBadge.color, display: 'flex', alignItems: 'center', gap: 3 }, children: [
                          _jsx(StatusIcon, { size: 10 }),
                          stBadge.label
                        ] })
                      ] })
                    ] }),

                    _jsx("p", { style: { fontSize: 12, color: 'var(--text-main)', margin: 0, lineHeight: 1.4, background: 'var(--bg-secondary)', padding: 10, borderRadius: 10 }, children: report.description }),

                    report.adminNotes && (
                      _jsxs("div", { style: { background: 'rgba(0, 82, 204, 0.05)', borderLeft: '3px solid var(--accent-blue)', padding: '6px 10px', borderRadius: '0 8px 8px 0', fontSize: 11 }, children: [
                        _jsx("strong", { style: { color: 'var(--accent-blue)' }, children: "Admin Note: " }),
                        _jsx("span", { style: { color: 'var(--text-main)' }, children: report.adminNotes })
                      ] })
                    ),

                    // Admin Actions
                    isAdmin && (
                      _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--card-border)', paddingTop: 10, marginTop: 4 }, children: [
                        _jsx("button", { 
                          onClick: () => { setSelectedReport(report); setStatusInput(report.status); setAdminNoteInput(report.adminNotes || ''); },
                          style: { background: 'rgba(0,82,204,0.08)', color: 'var(--accent-blue)', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' },
                          children: "Manage Ticket"
                        }),
                        _jsx("button", { 
                          onClick: () => handleDelete(report.id),
                          style: { background: 'rgba(239,68,68,0.08)', color: '#dc2626', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' },
                          children: [_jsx(Trash2, { size: 12 }), " Delete"]
                        })
                      ] })
                    )
                  ] }, report.id)
                );
              })
            )
          ] })
        )
      ] }),

      // Admin Manage Modal
      selectedReport && (
        _jsx("div", { className: "poster-modal", onClick: () => setSelectedReport(null), children: [
          _jsxs("div", { className: "poster-content", onClick: e => e.stopPropagation(), children: [
            _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }, children: [
              _jsxs("h3", { style: { margin: 0, fontSize: 16, fontWeight: 900 }, children: ["Update Issue #", selectedReport.id.slice(-6)] }),
              _jsx("button", { onClick: () => setSelectedReport(null), style: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }, children: "✕" })
            ] }),
            _jsxs("div", { className: "form-group", style: { marginBottom: 12 }, children: [
              _jsx("label", { className: "form-label", children: "Ticket Status" }),
              _jsxs("select", { className: "form-select", value: statusInput, onChange: e => setStatusInput(e.target.value), children: [
                _jsx("option", { value: "open", children: "Open Ticket" }),
                _jsx("option", { value: "in_progress", children: "In Progress" }),
                _jsx("option", { value: "resolved", children: "Resolved" }),
                _jsx("option", { value: "closed", children: "Closed" })
              ] })
            ] }),
            _jsxs("div", { className: "form-group", style: { marginBottom: 16 }, children: [
              _jsx("label", { className: "form-label", children: "Resolution / Faculty Admin Note" }),
              _jsx("textarea", { className: "form-textarea", rows: 3, value: adminNoteInput, onChange: e => setAdminNoteInput(e.target.value), placeholder: "Describe fix or status update for the student..." })
            ] }),
            _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [
              _jsx("button", { className: "btn-primary", style: { flex: 1 }, onClick: () => handleUpdateStatus(selectedReport.id), children: "Save Updates" }),
              _jsx("button", { className: "btn-secondary", onClick: () => setSelectedReport(null), children: "Cancel" })
            ] })
          ] })
        ] })
      )
    ] })
  );
}

