import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, CheckSquare, Trash2, Clock, AlertCircle, Calendar, X } from 'lucide-react';
const STORAGE_KEY = 'eee_tasks_v1';
const loadTasks = (email) => {
    try {
        const raw = localStorage.getItem(`${STORAGE_KEY}_${email}`);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
};
const saveTasks = (email, tasks) => {
    localStorage.setItem(`${STORAGE_KEY}_${email}`, JSON.stringify(tasks));
};
const urgencyColor = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dl = new Date(deadline + 'T00:00:00');
    dl.setHours(0, 0, 0, 0);
    const diff = Math.ceil((dl.getTime() - today.getTime()) / 86400000);
    if (diff < 0)
        return { border: '#dc2626', bg: 'rgba(220,38,38,0.07)', badge: '#dc2626', badgeBg: 'rgba(220,38,38,0.12)', label: 'Overdue' };
    if (diff === 0)
        return { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', badge: '#f59e0b', badgeBg: 'rgba(245,158,11,0.14)', label: 'Due Today' };
    if (diff <= 2)
        return { border: '#f97316', bg: 'rgba(249,115,22,0.07)', badge: '#f97316', badgeBg: 'rgba(249,115,22,0.12)', label: `Due in ${diff}d` };
    return { border: '#6366f1', bg: 'rgba(99,102,241,0.06)', badge: '#6366f1', badgeBg: 'rgba(99,102,241,0.10)', label: `${diff} days left` };
};
const formatDate = (iso) => {
    if (!iso)
        return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};
const TaskCard = ({ task, completing, onTick, onDelete }) => {
    const c = urgencyColor(task.deadline);
    const isLeaving = completing === task.id;
    return (<div style={{
            background: c.bg,
            border: `1.5px solid ${c.border}30`,
            borderLeft: `4px solid ${c.border}`,
            borderRadius: 14,
            padding: '12px 14px',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            opacity: isLeaving ? 0 : 1,
            transform: isLeaving ? 'translateX(80px) scale(0.92)' : 'none',
        }}>
      {/* Tick Button */}
      <button onClick={() => onTick(task.id)} style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: `2px solid ${c.border}`,
            background: isLeaving ? c.border : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            marginTop: 1
        }} title="Mark as done">
        {isLeaving && <span style={{ fontSize: 14, color: '#fff' }}>✓</span>}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: '#1e293b', margin: '0 0 5px', lineHeight: 1.35 }}>
          {task.text}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Calendar size={11}/> {formatDate(task.deadline)}
          </span>
          <span style={{ fontSize: 10, fontWeight: 800, background: c.badgeBg, color: c.badge, padding: '2px 7px', borderRadius: 20 }}>
            {c.label}
          </span>
        </div>
      </div>

      {/* Delete */}
      <button onClick={() => onDelete(task.id)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }} title="Delete task">
        <Trash2 size={14}/>
      </button>
    </div>);
};
// ── Main Component ─────────────────────────────────────────────────────────────
export const TaskList = ({ onBack, currentEmail = 'user' }) => {
    const [tasks, setTasks] = useState(() => loadTasks(currentEmail));
    const [showAdd, setShowAdd] = useState(false);
    const [newText, setNewText] = useState('');
    const [newDeadline, setNewDeadline] = useState('');
    const [completing, setCompleting] = useState(null);
    const inputRef = useRef(null);
    useEffect(() => { saveTasks(currentEmail, tasks); }, [tasks, currentEmail]);
    useEffect(() => { if (showAdd && inputRef.current)
        inputRef.current.focus(); }, [showAdd]);
    const todayStr = new Date().toISOString().split('T')[0];
    const handleAdd = (e) => {
        e.preventDefault();
        if (!newText.trim() || !newDeadline)
            return;
        const task = {
            id: Date.now().toString(),
            text: newText.trim(),
            deadline: newDeadline,
            done: false,
            createdAt: new Date().toISOString()
        };
        setTasks(prev => [task, ...prev]);
        setNewText('');
        setNewDeadline('');
        setShowAdd(false);
    };
    const handleTick = (id) => {
        setCompleting(id);
        setTimeout(() => {
            setTasks(prev => prev.filter(t => t.id !== id));
            setCompleting(null);
        }, 550);
    };
    const handleDelete = (id) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };
    const allPending = tasks.filter(t => !t.done).sort((a, b) => a.deadline.localeCompare(b.deadline));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = allPending.filter(t => { const d = new Date(t.deadline + 'T00:00:00'); d.setHours(0, 0, 0, 0); return d < today; });
    const upcoming = allPending.filter(t => { const d = new Date(t.deadline + 'T00:00:00'); d.setHours(0, 0, 0, 0); return d >= today; });
    return (<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--bg-primary)', borderRadius: 20, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 16px 14px', background: 'linear-gradient(135deg, #3b0764 0%, #6d28d9 100%)', color: '#fff', flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '6px 8px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={18}/>
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, margin: 0 }}>📝 My Task List</h2>
          <p style={{ fontSize: 11, opacity: 0.8, margin: 0 }}>{allPending.length} pending · {overdue.length} overdue</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 12, padding: '7px 14px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700 }}>
          <Plus size={16}/> Add Task
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Empty state */}
        {tasks.length === 0 && (<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 60, color: 'var(--text-muted)' }}>
            <CheckSquare size={48} style={{ opacity: 0.25 }}/>
            <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>No tasks yet</p>
            <p style={{ fontSize: 12, margin: 0, opacity: 0.7 }}>Tap "+ Add Task" to get started</p>
            <button onClick={() => setShowAdd(true)} style={{ marginTop: 8, background: '#6d28d9', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 22px', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
              + Add First Task
            </button>
          </div>)}

        {/* Overdue section */}
        {overdue.length > 0 && (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <AlertCircle size={13} color="#dc2626"/>
              <span style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', textTransform: 'uppercase', letterSpacing: 1 }}>Overdue</span>
            </div>
            {overdue.map(task => <TaskCard key={task.id} task={task} completing={completing} onTick={handleTick} onDelete={handleDelete}/>)}
          </>)}

        {/* Upcoming section */}
        {upcoming.length > 0 && (<>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: overdue.length > 0 ? 6 : 0, marginBottom: 2 }}>
              <Clock size={13} color="#6366f1"/>
              <span style={{ fontSize: 10, fontWeight: 900, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1 }}>Upcoming</span>
            </div>
            {upcoming.map(task => <TaskCard key={task.id} task={task} completing={completing} onTick={handleTick} onDelete={handleDelete}/>)}
          </>)}
      </div>

      {/* Add Task Bottom Sheet Modal */}
      {showAdd && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(12px)', zIndex: 99999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px 36px', width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 14, boxShadow: '0 -8px 32px rgba(0,0,0,0.18)', animation: 'modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: '#1e293b', margin: 0 }}>New Task</h3>
              <button type="button" onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}><X size={18}/></button>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Task Description</label>
              <input ref={inputRef} type="text" value={newText} onChange={e => setNewText(e.target.value)} placeholder="e.g. Submit assignment, Study Chapter 4..." required style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, fontWeight: 600, color: '#1e293b', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}/>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>Deadline</label>
              <input type="date" value={newDeadline} min={todayStr} onChange={e => setNewDeadline(e.target.value)} required style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, fontWeight: 600, color: '#1e293b', outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}/>
            </div>

            <button type="submit" style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #4f46e5 100%)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px 0', fontWeight: 900, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(109,40,217,0.3)', marginTop: 2 }}>
              Add Task ✓
            </button>
          </form>
        </div>)}
    </div>);
};
