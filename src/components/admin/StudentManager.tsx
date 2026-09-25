import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import type { Student, SemesterGrades } from '../../services/db';
import type { UserProfile } from '../../App';
import {
  ArrowLeft, Search, Plus, X, Trash2, Edit3,
  User, CheckCircle2,
  AlertCircle, ChevronRight, Save
} from 'lucide-react';

interface StudentManagerProps {
  onBack: () => void;
  currentUser?: UserProfile | null;
  isAdmin?: boolean;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  onBack,
  isAdmin = true
}) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedArrears, setSelectedArrears] = useState<string>('all');

  // Selected Student for View / Edit
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'bio' | 'academics' | 'documents'>('bio');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editRollNo, setEditRollNo] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editClass, setEditClass] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editSem, setEditSem] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editBlood, setEditBlood] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editArrears, setEditArrears] = useState('0');
  const [editCgpa, setEditCgpa] = useState<Record<number, SemesterGrades>>({});

  // Add Student Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addRollNo, setAddRollNo] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addClassName, setAddClassName] = useState('II EEE-B');
  const [addPhone, setAddPhone] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const list = await dbService.fetchAllStudents();
      setStudents(list);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsEditMode(false);
    setActiveTab('bio');
    setStatusMessage(null);

    // Populate edit fields
    setEditName(student.name || '');
    setEditRollNo(student.rollNo || '');
    setEditEmail(student.email || '');
    setEditClass(student.className || 'II EEE-B');
    setEditYear(student.yearOfStudy || '2nd Year');
    setEditSem(student.semester || 'Semester III');
    setEditPhone(student.phone || '+91 98421 55678');
    setEditDob(student.dob || '2004-05-14');
    setEditBlood(student.bloodGroup || 'O+');
    setEditAddress(student.address || 'Coimbatore, Tamil Nadu');
    setEditParentName(student.parentName || 'Parent Guardian');
    setEditParentPhone(student.parentPhone || '+91 94432 11223');
    setEditArrears(student.arrears?.toString() || '0');
    setEditCgpa(student.cgpa || {});
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSaving(true);
    setStatusMessage(null);

    try {
      const updates = {
        name: editName.trim(),
        rollNo: editRollNo.trim().toUpperCase(),
        className: editClass,
        yearOfStudy: editYear,
        semester: editSem,
        phone: editPhone.trim(),
        dob: editDob,
        bloodGroup: editBlood,
        address: editAddress.trim(),
        parentName: editParentName.trim(),
        parentPhone: editParentPhone.trim(),
        arrears: parseInt(editArrears) || 0,
        cgpa: editCgpa
      };

      const updated = await dbService.updateStudentProfile(selectedStudent.email, updates);
      setSelectedStudent(updated);
      setIsEditMode(false);
      setStatusMessage({ text: 'Student data updated and saved to database successfully!', type: 'success' });
      loadStudents();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: err.message || 'Error saving student data to database.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addRollNo.trim() || !addEmail.trim()) return;
    setSaving(true);

    try {
      const newStudent: Omit<Student, 'documents'> = {
        id: addEmail.trim().toLowerCase(),
        name: addName.trim(),
        rollNo: addRollNo.trim().toUpperCase(),
        email: addEmail.trim().toLowerCase(),
        className: addClassName,
        yearOfStudy: '2nd Year',
        semester: 'Semester III',
        department: 'Dept of EEE',
        phone: addPhone.trim() || '+91 98421 55678',
        dob: '2004-05-14',
        bloodGroup: 'O+',
        address: 'Coimbatore, Tamil Nadu',
        parentName: 'Parent Guardian',
        parentPhone: '+91 94432 11223',
        arrears: 0,
        nptelExams: [],
        cgpa: {
          1: { internal1: 85, internal2: 86, semMarks: 85, gpa: 8.5 },
          2: { internal1: 84, internal2: 85, semMarks: 84, gpa: 8.4 },
          3: { internal1: 86, internal2: 87, semMarks: 86, gpa: 8.6 },
          4: { internal1: 85, internal2: 86, semMarks: 85, gpa: 8.5 },
          5: { internal1: 86, internal2: 88, semMarks: 87, gpa: 8.7 },
          6: { internal1: 85, internal2: 87, semMarks: 86, gpa: 8.6 }
        }
      };

      await dbService.createStudentProfile(newStudent);
      setShowAddModal(false);
      setAddName('');
      setAddRollNo('');
      setAddEmail('');
      setAddPhone('');
      loadStudents();
      setStatusMessage({ text: `Student ${newStudent.name} added to database!`, type: 'success' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create student profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (email: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from the database?`)) return;
    try {
      await dbService.deleteStudentProfile(email);
      setSelectedStudent(null);
      loadStudents();
      setStatusMessage({ text: `Student record deleted.`, type: 'success' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert('Failed to delete student');
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchesClass = selectedClass === 'all' || (s.className || '').toLowerCase().includes(selectedClass.toLowerCase());
    const matchesArrears = selectedArrears === 'all'
      ? true
      : selectedArrears === 'clear'
        ? (s.arrears || 0) === 0
        : (s.arrears || 0) > 0;
    return matchesSearch && matchesClass && matchesArrears;
  });

  const calculateCgpa = (cgpaRecord: Record<number, SemesterGrades>) => {
    const sems = Object.values(cgpaRecord).filter(s => s?.gpa && s.gpa > 0);
    if (sems.length === 0) return '8.50';
    const sum = sems.reduce((acc, curr) => acc + (curr.gpa || 0), 0);
    return (sum / sems.length).toFixed(2);
  };

  return (
    <div className="dedicated-page-view page-slide-enter" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: 88 }}>
      {/* ── Top Header ── */}
      <div className="dedicated-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="page-back-btn" onClick={selectedStudent ? () => setSelectedStudent(null) : onBack} title="Go Back">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="dedicated-page-title" style={{ margin: 0, fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
              👥 {selectedStudent ? (isEditMode ? `Edit Student: ${selectedStudent.name}` : `Student Dossier: ${selectedStudent.name}`) : 'Student Records & Management'}
            </h2>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {selectedStudent ? `Roll No: ${selectedStudent.rollNo} · Dept of EEE` : 'Faculty Administration & Institutional Records'}
            </span>
          </div>
        </div>

        {!selectedStudent && isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#0052cc', color: '#fff', border: 'none',
              padding: '6px 14px', borderRadius: 8, fontSize: 11.5, fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,82,204,0.2)'
            }}
          >
            <Plus size={14} /> Add Student
          </button>
        )}
      </div>

      <div style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>
        {statusMessage && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            background: statusMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: statusMessage.type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${statusMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
          }}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* ── VIEW 1: STUDENT DIRECTORY LIST ── */}
        {!selectedStudent && (
          <div>
            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#ffffff', borderRadius: 14, padding: '12px 14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Enrolled</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, color: '#0052cc' }}>{students.length}</h3>
              </div>
              <div style={{ background: '#ffffff', borderRadius: 14, padding: '12px 14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>All-Clear (0 Arrears)</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, color: '#16a34a' }}>
                  {students.filter(s => (s.arrears || 0) === 0).length}
                </h3>
              </div>
              <div style={{ background: '#ffffff', borderRadius: 14, padding: '12px 14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Standing Arrears</span>
                <h3 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, color: '#dc2626' }}>
                  {students.filter(s => (s.arrears || 0) > 0).length}
                </h3>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div style={{ background: '#ffffff', borderRadius: 16, padding: 14, border: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search student by name, roll number, or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px 10px 38px', borderRadius: 10,
                    border: '1.5px solid #cbd5e1', fontSize: 12.5, outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 11.5, background: '#f8fafc', fontWeight: 600 }}
                >
                  <option value="all">All Classes</option>
                  <option value="II EEE-B">II EEE-B</option>
                  <option value="II EEE-B">II EEE-B</option>
                </select>

                <select
                  value={selectedArrears}
                  onChange={e => setSelectedArrears(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 11.5, background: '#f8fafc', fontWeight: 600 }}
                >
                  <option value="all">All Academic Standing</option>
                  <option value="clear">All Clear (0 Arrears)</option>
                  <option value="with_arrears">With Standing Arrears</option>
                </select>
              </div>
            </div>

            {/* Student Records List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 13 }}>Loading student records from database...</div>
              ) : filteredStudents.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', background: '#ffffff', borderRadius: 14, border: '1.5px dashed #cbd5e1' }}>
                  <User size={36} style={{ color: '#cbd5e1', margin: '0 auto 8px' }} />
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#64748b' }}>No students found matching search filters.</p>
                </div>
              ) : (
                filteredStudents.map(student => {
                  const studentCgpa = calculateCgpa(student.cgpa || {});
                  return (
                    <div
                      key={student.id || student.email}
                      style={{
                        background: '#ffffff', borderRadius: 14, padding: 14,
                        border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        gap: 12, cursor: 'pointer', transition: 'all 0.15s ease'
                      }}
                      onClick={() => handleSelectStudent(student)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 42, height: 42, borderRadius: 12,
                          background: 'linear-gradient(135deg, #0052cc 0%, #1e40af 100%)',
                          color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 15, fontWeight: 900, flexShrink: 0
                        }}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>{student.name}</h4>
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#0052cc', background: '#eff6ff', padding: '1px 6px', borderRadius: 4 }}>
                              {student.rollNo}
                            </span>
                          </div>
                          <p style={{ margin: '3px 0 0', fontSize: 11, color: '#64748b' }}>
                            {student.className || 'II EEE-B'} · {student.email}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 12.5, fontWeight: 900, color: '#0052cc', display: 'block' }}>{studentCgpa} CGPA</span>
                          <span style={{
                            fontSize: 10, fontWeight: 800,
                            color: (student.arrears || 0) === 0 ? '#16a34a' : '#dc2626'
                          }}>
                            {(student.arrears || 0) === 0 ? '✓ All Clear' : `⚠️ ${student.arrears} Arrear(s)`}
                          </span>
                        </div>
                        <ChevronRight size={16} color="#94a3b8" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── VIEW 2: SELECTED STUDENT DOSSIER & EDIT FORM ── */}
        {selectedStudent && (
          <div style={{ background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            {/* Dossier Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, paddingBottom: 16, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: 'linear-gradient(135deg, #0052cc 0%, #2563eb 100%)',
                  color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 900
                }}>
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#0f172a' }}>{selectedStudent.name}</h3>
                    <span style={{ fontSize: 11, fontWeight: 800, background: '#eff6ff', color: '#0052cc', padding: '2px 8px', borderRadius: 6 }}>
                      {selectedStudent.rollNo}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: '#64748b' }}>
                    {selectedStudent.className || 'II EEE-B'} · {selectedStudent.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsEditMode(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '7px 14px', borderRadius: 8, fontSize: 11.5, fontWeight: 800,
                    background: isEditMode ? '#fef2f2' : '#eff6ff',
                    color: isEditMode ? '#dc2626' : '#0052cc',
                    border: `1.5px solid ${isEditMode ? '#fecaca' : '#bfdbfe'}`,
                    cursor: 'pointer'
                  }}
                >
                  {isEditMode ? <><X size={13} /> Cancel Edit</> : <><Edit3 size={13} /> Edit Student Data</>}
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteStudent(selectedStudent.email, selectedStudent.name)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '7px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 800,
                    background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca',
                    cursor: 'pointer'
                  }}
                  title="Delete Student from Database"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 18, borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
              <button
                type="button"
                onClick={() => setActiveTab('bio')}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  border: 'none',
                  background: activeTab === 'bio' ? '#0052cc' : '#f8fafc',
                  color: activeTab === 'bio' ? '#ffffff' : '#64748b'
                }}
              >
                👤 Personal &amp; Bio Data
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('academics')}
                style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                  border: 'none',
                  background: activeTab === 'academics' ? '#0052cc' : '#f8fafc',
                  color: activeTab === 'academics' ? '#ffffff' : '#64748b'
                }}
              >
                🎓 Academics &amp; CGPA
              </button>
            </div>

            {/* Form for Editing or View Details */}
            <form onSubmit={handleSaveStudent}>
              {activeTab === 'bio' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Full Name</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Roll Number</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editRollNo}
                      onChange={e => setEditRollNo(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Institutional Email</label>
                    <input
                      type="email"
                      disabled={true}
                      value={editEmail}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: '#f1f5f9', color: '#64748b' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Class / Section</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editClass}
                      onChange={e => setEditClass(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Semester</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editSem}
                      onChange={e => setEditSem(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Phone Number</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Blood Group</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editBlood}
                      onChange={e => setEditBlood(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Residential Address</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editAddress}
                      onChange={e => setEditAddress(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Parent / Guardian Name</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editParentName}
                      onChange={e => setEditParentName(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Parent Phone Number</label>
                    <input
                      type="text"
                      disabled={!isEditMode}
                      value={editParentPhone}
                      onChange={e => setEditParentPhone(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box', background: isEditMode ? '#fff' : '#f8fafc' }}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'academics' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', padding: '12px 16px', borderRadius: 12, marginBottom: 16 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>Cumulative Performance</span>
                      <h3 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 900, color: '#0052cc' }}>
                        {calculateCgpa(editCgpa)} CGPA
                      </h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Total Arrears</label>
                      <input
                        type="number"
                        disabled={!isEditMode}
                        value={editArrears}
                        onChange={e => setEditArrears(e.target.value)}
                        style={{ width: 70, padding: '6px 8px', borderRadius: 6, border: '1.5px solid #cbd5e1', fontWeight: 800, fontSize: 13, textAlign: 'center', background: isEditMode ? '#fff' : '#f8fafc' }}
                        min="0"
                      />
                    </div>
                  </div>

                  <h4 style={{ fontSize: 13, fontWeight: 800, margin: '0 0 10px', color: '#0f172a' }}>Semester GPA &amp; Internal Marks Breakup</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                      const gpaVal = editCgpa[sem]?.gpa !== undefined ? editCgpa[sem].gpa : '';
                      const int1 = editCgpa[sem]?.internal1 !== undefined ? editCgpa[sem].internal1 : '';
                      const int2 = editCgpa[sem]?.internal2 !== undefined ? editCgpa[sem].internal2 : '';
                      return (
                        <div key={sem} style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#0052cc', display: 'block', marginBottom: 6 }}>Semester {sem}</span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                            <div>
                              <span style={{ fontSize: 9.5, color: '#64748b' }}>GPA</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="10"
                                disabled={!isEditMode}
                                value={gpaVal}
                                onChange={e => {
                                  const val = parseFloat(e.target.value) || 0;
                                  setEditCgpa(prev => ({
                                    ...prev,
                                    [sem]: { ...prev[sem], gpa: val }
                                  }));
                                }}
                                style={{ width: '100%', padding: '4px 6px', fontSize: 11.5, fontWeight: 700, borderRadius: 6, border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <span style={{ fontSize: 9.5, color: '#64748b' }}>Int 1</span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                disabled={!isEditMode}
                                value={int1}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 0;
                                  setEditCgpa(prev => ({
                                    ...prev,
                                    [sem]: { ...prev[sem], internal1: val }
                                  }));
                                }}
                                style={{ width: '100%', padding: '4px 6px', fontSize: 11.5, fontWeight: 700, borderRadius: 6, border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <span style={{ fontSize: 9.5, color: '#64748b' }}>Int 2</span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                disabled={!isEditMode}
                                value={int2}
                                onChange={e => {
                                  const val = parseInt(e.target.value) || 0;
                                  setEditCgpa(prev => ({
                                    ...prev,
                                    [sem]: { ...prev[sem], internal2: val }
                                  }));
                                }}
                                style={{ width: '100%', padding: '4px 6px', fontSize: 11.5, fontWeight: 700, borderRadius: 6, border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Save Bar when Edit Mode is active */}
              {isEditMode && (
                <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid #e2e8f0', display: 'flex', gap: 10 }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      flex: 1, padding: '10px 16px', borderRadius: 10, border: 'none',
                      background: '#0052cc', color: '#fff', fontSize: 13, fontWeight: 800,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      boxShadow: '0 4px 12px rgba(0,82,204,0.25)'
                    }}
                  >
                    <Save size={16} />
                    <span>{saving ? 'Saving to Database...' : 'Save Changes to Database'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    style={{
                      padding: '10px 18px', borderRadius: 10, border: '1px solid #cbd5e1',
                      background: '#f8fafc', color: '#475569', fontSize: 13, fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* ── ADD STUDENT MODAL ── */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div style={{ background: '#ffffff', borderRadius: 18, padding: 22, maxWidth: 440, width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900 }}>➕ Add New Student Record</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Priyadharshini S"
                  value={addName}
                  onChange={e => setAddName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. 7377221EE005"
                  value={addRollNo}
                  onChange={e => setAddRollNo(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. priya@eee.com"
                  value={addEmail}
                  onChange={e => setAddEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12.5, boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Class Section</label>
                  <select
                    value={addClassName}
                    onChange={e => setAddClassName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12 }}
                  >
                    <option value="II EEE-B">II EEE-B</option>
                    <option value="II EEE-B">II EEE-B</option>
                    <option value="IV EEE-A">IV EEE-A</option>
                    <option value="IV EEE-B">IV EEE-B</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 4 }}>Phone</label>
                  <input
                    type="text"
                    placeholder="+91 98421 55678"
                    value={addPhone}
                    onChange={e => setAddPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 12, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#0052cc', color: '#fff', fontWeight: 800, fontSize: 12.5, cursor: 'pointer' }}
                >
                  {saving ? 'Creating in Database...' : 'Create Student Record'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: 700, fontSize: 12.5, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
