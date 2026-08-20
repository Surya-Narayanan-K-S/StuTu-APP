import React, { useState } from 'react';
import { ArrowLeft, FileText, Download, Eye, Plus, Trash2, Users, UserPlus } from 'lucide-react';
import { jsPDF } from 'jspdf';
import headerImage from '../../assets/srec-snr-header.png';

export interface StudentDetail {
  rollNo: string;
  name: string;
  year: string;
  className: string;
}

interface ODFormProps {
  onBack: () => void;
  currentUser?: {
    rollNo?: string;
    name?: string;
    yearOfStudy?: string;
    className?: string;
  } | null;
}

// Helper: convert an image URL to a base64 data URL via canvas
const getBase64Image = (imgUrl: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject('Canvas context unavailable');
      }
    };
    img.onerror = reject;
    img.src = imgUrl;
  });

export const ODForm: React.FC<ODFormProps> = ({
  onBack,
  currentUser
}) => {
  // Form fields
  const [odType, setOdType] = useState<'External OD' | 'Internal OD'>('Internal OD');
  const [odSubCategory, setOdSubCategory] = useState<'SAC OD' | 'Other'>('SAC OD');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [facultyCoordinator, setFacultyCoordinator] = useState('');
  const [generating, setGenerating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Student Details state
  const [students, setStudents] = useState<StudentDetail[]>([
    {
      rollNo: currentUser?.rollNo || '',
      name: currentUser?.name || '',
      year: currentUser?.yearOfStudy || '',
      className: currentUser?.className || ''
    }
  ]);

  // Additional fields for "Other" category
  const [deptName, setDeptName] = useState('DEPARTMENT OF ELECTRICAL AND ELECTRONICS ENGINEERING');
  const [formTitle, setFormTitle] = useState('ON DUTY REQUISITION FORM');

  const handleAddStudent = () => {
    setStudents(prev => [
      ...prev,
      {
        rollNo: '',
        name: '',
        year: prev[prev.length - 1]?.year || '',
        className: prev[prev.length - 1]?.className || ''
      }
    ]);
  };

  const handleRemoveStudent = (index: number) => {
    if (students.length <= 1) return;
    setStudents(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateStudent = (index: number, field: keyof StudentDetail, value: string) => {
    setStudents(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCountChange = (newCount: number) => {
    const target = Math.max(1, Math.min(20, newCount));
    setStudents(prev => {
      if (target > prev.length) {
        const added: StudentDetail[] = Array.from({ length: target - prev.length }, () => ({
          rollNo: '',
          name: '',
          year: prev[prev.length - 1]?.year || '',
          className: prev[prev.length - 1]?.className || ''
        }));
        return [...prev, ...added];
      } else if (target < prev.length) {
        return prev.slice(0, target);
      }
      return prev;
    });
  };

  const validateForm = (): boolean => {
    if (!eventName.trim()) {
      setValidationError('Please enter the Name of the Event / Purpose (Mandatory).');
      return false;
    }
    if (!eventDate.trim()) {
      setValidationError('Please enter the Date and timing of the Event (Mandatory).');
      return false;
    }
    if (!venue.trim()) {
      setValidationError('Please enter the Venue (Mandatory).');
      return false;
    }
    setValidationError('');
    return true;
  };

  /* ── Shared PDF Builder ─────────────────────────────────── */
  const buildPDF = async (doc: jsPDF) => {
    /* Header image occupying very top part: y = 5 instead of 15 */
    let imgBase64 = '';
    try { imgBase64 = await getBase64Image(headerImage); } catch (_) { }
    if (imgBase64) {
      doc.addImage(imgBase64, 'PNG', 10, 4, 128, 23);
    } else {
      doc.setFont('Helvetica', 'bold').setFontSize(10);
      doc.text('SRI RAMAKRISHNA ENGINEERING COLLEGE', 74, 10, { align: 'center' });
      doc.setFontSize(6.5);
      doc.text('[Educational Service : SNR Sons Charitable Trust]', 74, 14, { align: 'center' });
      doc.text('Vattamalaipalayam, N.G.G.O. Colony Post, Coimbatore – 641022.', 74, 18, { align: 'center' });
    }

    /* ── Header Banner Block (Scaled to A5) ──────────────────── */
    const bannerY = 28;
    const bannerH = 11;
    doc.setFillColor(15, 76, 129); // Premium Navy Blue
    doc.rect(10, bannerY, 128, bannerH, 'F');

    // Gold bottom border line
    doc.setFillColor(220, 160, 40);
    doc.rect(10, bannerY + bannerH - 1.2, 128, 1.2, 'F');

    // Banner Text - with (INTERNAL) or (EXTERNAL) near OD Requisition Form Title
    const odTag = odType === 'Internal OD' ? '(INTERNAL)' : '(EXTERNAL)';
    doc.setTextColor(255, 255, 255);
    if (odSubCategory === 'SAC OD') {
      doc.setFont('Helvetica', 'bold').setFontSize(9.5);
      doc.text('STUDENT AFFAIRS CLUB', 74, bannerY + 4.5, { align: 'center' });
      doc.setFont('Helvetica', 'normal').setFontSize(6.5);
      doc.text(`STUDENT ON-DUTY REQUISITION FORM ${odTag}`, 74, bannerY + 7.8, { align: 'center' });
    } else {
      doc.setFont('Helvetica', 'bold').setFontSize(8.5);
      const cleanTitle = formTitle.trim().toUpperCase();
      const titleWithTag = cleanTitle.includes('(INTERNAL)') || cleanTitle.includes('(EXTERNAL)')
        ? cleanTitle
        : `${cleanTitle} ${odTag}`;
      doc.text(titleWithTag, 74, bannerY + 4.5, { align: 'center' });
      doc.setFont('Helvetica', 'normal').setFontSize(6.5);
      doc.text(deptName.trim().toUpperCase(), 74, bannerY + 7.8, { align: 'center' });
    }

    // Reset styles
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);

    /* ── Section Title Helper ───────────────────────────────── */
    const sectionHeader = (title: string, y: number) => {
      doc.setFont('Helvetica', 'bold').setFontSize(8.5).setTextColor(15, 76, 129);
      doc.text(title.toUpperCase(), 10, y);
      const tw = doc.getTextWidth(title.toUpperCase());
      doc.setFillColor(15, 76, 129);
      doc.rect(10, y + 1.2, tw, 0.6, 'F');
    };

    /* ── Field Underline Helper (Darker Lines) ──────────────── */
    const field = (label: string, value: string, y: number) => {
      doc.setFont('Helvetica', 'bold').setFontSize(7.5).setTextColor(50, 50, 50);
      doc.text(label, 14, y);
      const lw = doc.getTextWidth(label);
      const startX = 14 + lw + 1;

      const val = value.trim();
      if (val) {
        doc.setFont('Helvetica', 'normal').setTextColor(0, 0, 0);
        doc.text(val, startX + 1, y);

        // Underline only under the text, ending exactly at the end of text
        const valW = doc.getTextWidth(val);
        doc.setLineWidth(0.3);
        doc.setDrawColor(40, 40, 40);
        doc.line(startX + 1, y + 1.2, startX + 1 + valW, y + 1.2);
      } else {
        // Dashed placeholder line
        doc.setLineWidth(0.3);
        doc.setDrawColor(100, 100, 100);
        doc.setLineDashPattern([1, 1.5], 0);
        doc.line(startX + 1, y + 1.2, startX + 1 + 45, y + 1.2);
        doc.setLineDashPattern([], 0);
      }
    };

    /* ── 1. Requisition Details ────────────────────────────── */
    sectionHeader('1. Requisition Details', 44);

    // Rounded card container box
    doc.setFillColor(250, 251, 253);
    doc.setDrawColor(220, 225, 230);
    doc.setLineWidth(0.3);
    doc.roundedRect(10, 48, 128, 45, 2, 2, 'FD');

    // Helper: draw a subtle row separator inside the card
    const rowSep = (y: number) => {
      doc.setLineWidth(0.2);
      doc.setDrawColor(210, 215, 220);
      doc.line(12, y, 136, y);
    };

    // Render Fields with separators between them
    // First 3 details: Mandatory (Name of Event, Date & Timing, Venue)
    // Last 2 details: Optional (Faculty Coordinator, Signature placeholder)
    field('Name of the Event/Purpose: ', eventName, 55);
    rowSep(59);
    field('Date and timing of the Event: ', eventDate, 63);
    rowSep(67);
    field('Venue: ', venue, 71);
    rowSep(75);
    field('Faculty Co-ordinator: ', facultyCoordinator, 79);
    rowSep(83);

    // Signature line inside card
    doc.setFont('Helvetica', 'bold').setFontSize(7.5).setTextColor(50, 50, 50);
    doc.text('Signature: ', 14, 87);
    doc.setLineWidth(0.3).setDrawColor(100, 100, 100).setLineDashPattern([1, 1.5], 0);
    doc.line(28, 88.2, 58, 88.2);
    doc.setLineDashPattern([], 0);

    /* ── 2. Student Details ────────────────────────────────── */
    sectionHeader('2. Student Details', 99);

    const count = Math.max(1, students.length);
    const tableTop = 104;
    // Scale row height gracefully so it fits cleanly on A5 without overlapping signatures
    const rowH = count <= 4 ? 7.5 : count <= 6 ? 6.8 : 5.8;
    const cols = [10, 26, 46, 18, 28]; // widths in mm (sum = 128)
    const colLabels = ['S.No.', 'Roll.No', 'Name', 'Year', 'Class'];

    /* Table Header */
    doc.setFillColor(15, 76, 129);
    doc.rect(10, tableTop, 128, rowH, 'F');
    doc.setFont('Helvetica', 'bold').setFontSize(7.5).setTextColor(255, 255, 255);
    let cx = 10;
    for (let i = 0; i < colLabels.length; i++) {
      const tw = doc.getTextWidth(colLabels[i]);
      doc.text(colLabels[i], cx + (cols[i] - tw) / 2, tableTop + (rowH * 0.65));
      cx += cols[i];
    }

    /* Table Body with Student Details */
    doc.setFont('Helvetica', 'normal').setFontSize(7).setTextColor(0, 0, 0);
    for (let r = 0; r < count; r++) {
      const ry = tableTop + rowH + r * rowH;
      const s = students[r] || { rollNo: '', name: '', year: '', className: '' };

      // S.No
      const sn = (r + 1).toString();
      const snW = doc.getTextWidth(sn);
      doc.text(sn, 10 + (cols[0] - snW) / 2, ry + (rowH * 0.65));

      // Roll.No
      const roll = (s.rollNo || '').trim();
      if (roll) {
        const rw = doc.getTextWidth(roll);
        doc.text(roll, 10 + cols[0] + (cols[1] - rw) / 2, ry + (rowH * 0.65));
      }

      // Name (Left aligned with padding, truncated if exceeds col width)
      const name = (s.name || '').trim();
      if (name) {
        const maxW = cols[2] - 4;
        let displayName = name;
        if (doc.getTextWidth(displayName) > maxW) {
          while (displayName.length > 0 && doc.getTextWidth(displayName + '…') > maxW) {
            displayName = displayName.slice(0, -1);
          }
          displayName += '…';
        }
        doc.text(displayName, 10 + cols[0] + cols[1] + 2, ry + (rowH * 0.65));
      }

      // Year
      const yr = (s.year || '').trim();
      if (yr) {
        const yw = doc.getTextWidth(yr);
        doc.text(yr, 10 + cols[0] + cols[1] + cols[2] + (cols[3] - yw) / 2, ry + (rowH * 0.65));
      }

      // Class
      const cls = (s.className || '').trim();
      if (cls) {
        const cw = doc.getTextWidth(cls);
        doc.text(cls, 10 + cols[0] + cols[1] + cols[2] + cols[3] + (cols[4] - cw) / 2, ry + (rowH * 0.65));
      }
    }

    /* Table Grid Borders */
    const tableBottom = tableTop + rowH + count * rowH;

    // Outer table border box
    doc.setLineWidth(0.3).setDrawColor(15, 76, 129);
    doc.rect(10, tableTop, 128, tableBottom - tableTop);

    // Divider below header
    doc.line(10, tableTop + rowH, 138, tableTop + rowH);

    // Row lines
    doc.setLineWidth(0.3).setDrawColor(40, 40, 40);
    for (let r = 0; r < count - 1; r++) {
      const ry = tableTop + rowH + (r + 1) * rowH;
      doc.line(10, ry, 138, ry);
    }

    // Vertical dividers in table body
    let vx = 10;
    for (let i = 0; i < cols.length - 1; i++) {
      vx += cols[i];
      doc.line(vx, tableTop + rowH, vx, tableBottom);
    }

    /* Total Students Badge Bar */
    const totalY = tableBottom + 2.5;
    doc.setFillColor(240, 244, 248);
    doc.rect(10, totalY, 128, 6, 'F');
    doc.setFont('Helvetica', 'bold').setFontSize(7.5).setTextColor(15, 76, 129);
    doc.text(`TOTAL NUMBER OF STUDENTS: ${count}`, 14, totalY + 4.2);

    /* Signatures at bottom of A5 */
    const sigY = 182;
    doc.setFont('Helvetica', 'bold').setFontSize(7.5).setTextColor(0, 0, 0);

    if (odSubCategory === 'SAC OD') {
      doc.text('Club Admin', 42, sigY, { align: 'center' });
      doc.text('Dr.K.Balamurugan', 42, sigY + 4.5, { align: 'center' });

      doc.text('Dean SAC', 106, sigY, { align: 'center' });
      doc.text('Dr.P.Perumal', 106, sigY + 4.5, { align: 'center' });
    } else {
      doc.text('Tutor', 31, sigY, { align: 'center' });
      doc.text('Academic Coordinator', 74, sigY, { align: 'center' });
      doc.text('HOD', 117, sigY, { align: 'center' });
    }

    /* Date and Time at bottom left */
    const now = new Date();
    const dateTimeStr = `Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    doc.setFont('Helvetica', 'normal').setFontSize(6.5).setTextColor(120, 120, 120);
    doc.text(dateTimeStr, 10, 203);
  };

  /* ── Download PDF Action ───────────────────────────────── */
  const handleDownloadPDF = async () => {
    if (!validateForm()) return;
    setGenerating(true);
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a5' });
      await buildPDF(doc);
      doc.save(`OD_Form_${odType === 'Internal OD' ? 'Internal' : 'External'}_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  /* ── Preview PDF Action ────────────────────────────────── */
  const handlePreviewPDF = async () => {
    if (!validateForm()) return;
    setGenerating(true);
    try {
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a5' });
      await buildPDF(doc);
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      console.error('Preview error:', err);
    } finally {
      setGenerating(false);
    }
  };

  /* ── UI Styles ─────────────────────────────────────────── */
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    color: 'var(--text-primary)',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 11,
    color: 'var(--text-muted)',
    display: 'block',
    marginBottom: 5
  };

  return (
    <div style={{ padding: 16, maxWidth: 640, margin: '0 auto' }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button
          onClick={onBack}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--card-border)',
            borderRadius: '50%',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-primary)'
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            OD Form Request ({odType === 'Internal OD' ? 'Internal' : 'External'})
          </h2>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            Fill details and generate the On-Duty request PDF
          </p>
        </div>
      </div>

      {/* ── Form Card ── */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--card-border)',
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }}>

        {/* Section label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--card-border)', paddingBottom: 10 }}>
          <FileText size={16} color="#4f46e5" />
          <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>
            1. Requisition Details ({odType === 'Internal OD' ? 'Internal' : 'External'})
          </span>
        </div>

        {validationError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 8,
            padding: '10px 12px',
            color: '#ef4444',
            fontSize: 12,
            fontWeight: 600
          }}>
            ⚠️ {validationError}
          </div>
        )}

        {/* OD Category */}
        <div>
          <label style={labelStyle}>OD Category</label>
          <select
            value={odType}
            onChange={e => {
              setOdType(e.target.value as any);
              setOdSubCategory('SAC OD');
            }}
            style={inputStyle}
          >
            <option value="Internal OD">Internal OD (Internal)</option>
            <option value="External OD">External OD (External)</option>
          </select>
        </div>

        {/* Sub-Category — SAC OD under Internal/External OD */}
        <div>
          <label style={labelStyle}>Sub-Category</label>
          <select
            value={odSubCategory}
            onChange={e => setOdSubCategory(e.target.value as any)}
            style={inputStyle}
          >
            <option value="SAC OD">SAC OD (Student Affairs Club)</option>
            <option value="Other">Other Requisition / Event</option>
          </select>
        </div>

        {/* Other OD extra options */}
        {odSubCategory === 'Other' && (
          <>
            <div>
              <label style={labelStyle}>Department Name</label>
              <input
                type="text"
                value={deptName}
                onChange={e => setDeptName(e.target.value)}
                placeholder="e.g. DEPARTMENT OF ELECTRICAL AND ELECTRONICS ENGINEERING"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Title of the Form</label>
              <input
                type="text"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="e.g. ON DUTY REQUISITION FORM"
                style={inputStyle}
                required
              />
            </div>
          </>
        )}

        {/* Event Name (Mandatory 1) */}
        <div>
          <label style={labelStyle}>
            Name of the Event / Purpose <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={eventName}
            onChange={e => {
              setEventName(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="e.g. Science Exhibition, Paper Presentation"
            style={inputStyle}
            required
          />
        </div>

        {/* Date & Timing (Mandatory 2) */}
        <div>
          <label style={labelStyle}>
            Date and Timing of the Event <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={eventDate}
            onChange={e => {
              setEventDate(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="e.g. 15th Aug 2026, 9:00 AM – 5:00 PM"
            style={inputStyle}
            required
          />
        </div>

        {/* Venue (Mandatory 3) */}
        <div>
          <label style={labelStyle}>
            Venue <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={venue}
            onChange={e => {
              setVenue(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="e.g. SREC Main Auditorium, PSG College"
            style={inputStyle}
            required
          />
        </div>

        {/* Faculty Co-ordinator (Optional) */}
        <div>
          <label style={labelStyle}>
            Faculty Co-ordinator <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)' }}>(Optional)</span>
          </label>
          <input
            type="text"
            value={facultyCoordinator}
            onChange={e => setFacultyCoordinator(e.target.value)}
            placeholder="e.g. Dr. K. Balamurugan (leave blank if not applicable)"
            style={inputStyle}
          />
        </div>

        {/* ── Section 2: Student Details ── */}
        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 16, marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} color="#4f46e5" />
              <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>
                2. Student Details ({students.length})
              </span>
            </div>

            {/* Quick counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleCountChange(students.length - 1)}
                disabled={students.length <= 1}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-primary)',
                  fontSize: 16, lineHeight: 1,
                  cursor: students.length <= 1 ? 'not-allowed' : 'pointer',
                  opacity: students.length <= 1 ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700
                }}
              >−</button>

              <span style={{ fontSize: 13, fontWeight: 800, minWidth: 20, textAlign: 'center', color: 'var(--text-primary)' }}>
                {students.length}
              </span>

              <button
                type="button"
                onClick={() => handleCountChange(students.length + 1)}
                disabled={students.length >= 20}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'var(--accent-primary, #4f46e5)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 16,
                  cursor: students.length >= 20 ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700
                }}
              >+</button>
            </div>
          </div>

          {/* Student rows list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {students.map((student, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 12,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 22, height: 22,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 800
                    }}>
                      {idx + 1}
                    </span>
                    Student #{idx + 1}
                  </span>

                  {students.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(idx)}
                      title="Remove student"
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 6,
                        color: '#ef4444',
                        padding: '4px 8px',
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                  <div>
                    <label style={{ ...labelStyle, fontSize: 10 }}>Roll Number</label>
                    <input
                      type="text"
                      value={student.rollNo}
                      onChange={e => handleUpdateStudent(idx, 'rollNo', e.target.value)}
                      placeholder="e.g. 7377221EE101"
                      style={{ ...inputStyle, padding: '8px 10px', fontSize: 11 }}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: 10 }}>Student Name</label>
                    <input
                      type="text"
                      value={student.name}
                      onChange={e => handleUpdateStudent(idx, 'name', e.target.value)}
                      placeholder="e.g. John Doe"
                      style={{ ...inputStyle, padding: '8px 10px', fontSize: 11 }}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: 10 }}>Year</label>
                    <input
                      type="text"
                      value={student.year}
                      onChange={e => handleUpdateStudent(idx, 'year', e.target.value)}
                      placeholder="e.g. III / III Year"
                      style={{ ...inputStyle, padding: '8px 10px', fontSize: 11 }}
                    />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontSize: 10 }}>Class / Section</label>
                    <input
                      type="text"
                      value={student.className}
                      onChange={e => handleUpdateStudent(idx, 'className', e.target.value)}
                      placeholder="e.g. EEE A"
                      style={{ ...inputStyle, padding: '8px 10px', fontSize: 11 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add student button */}
          <button
            type="button"
            onClick={handleAddStudent}
            style={{
              marginTop: 12,
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              background: 'var(--bg-primary)',
              border: '1.5px dashed var(--accent-primary, #4f46e5)',
              color: 'var(--accent-primary, #4f46e5)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <UserPlus size={15} /> Add Another Student
          </button>
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display: 'flex', gap: 10, marginTop: 10, borderTop: '1px solid var(--card-border)', paddingTop: 16 }}>
          {/* Preview PDF */}
          <button
            type="button"
            onClick={handlePreviewPDF}
            disabled={generating}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'var(--bg-primary)',
              border: '1.5px solid var(--card-border)',
              color: 'var(--text-primary)',
              fontSize: 12, fontWeight: 700,
              cursor: generating ? 'not-allowed' : 'pointer',
              opacity: generating ? 0.7 : 1
            }}
          >
            <Eye size={15} /> Preview PDF
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={generating}
            style={{
              flex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '12px 14px',
              borderRadius: 10,
              background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
              border: 'none',
              color: '#fff',
              fontSize: 12, fontWeight: 700,
              cursor: generating ? 'not-allowed' : 'pointer',
              opacity: generating ? 0.7 : 1
            }}
          >
            <Download size={15} /> {generating ? 'Generating…' : 'Download PDF'}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'transparent',
              border: '1.5px solid var(--card-border)',
              color: 'var(--text-muted)',
              fontSize: 12, fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
