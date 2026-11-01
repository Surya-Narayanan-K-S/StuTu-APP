import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Megaphone, Calendar, Trophy, FileText, X, Pencil, Upload, FileImage, Trash2, Eye } from 'lucide-react';
import addIcon from '../../assets/add-icon.png';
export const AnnouncementBanner = ({ announcements, isAdmin, onAddAnnouncement, onDeleteAnnouncement, onOpenAnnouncements }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editAnnouncementId, setEditAnnouncementId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newType, setNewType] = useState('general');
    const [newDate, setNewDate] = useState('');
    const [newPosterUrl, setNewPosterUrl] = useState('');
    const posterFileInputRef = useRef(null);
    const handlePosterFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result;
            setNewPosterUrl(dataUrl);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    // 👆 Swipe touch states
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [swiped, setSwiped] = useState(false);
    const minSwipeDistance = 50;
    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
        setSwiped(false);
    };
    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
        if (touchStart && Math.abs(touchStart - e.targetTouches[0].clientX) > 10) {
            setSwiped(true);
        }
    };
    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd)
            return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe) {
            setActiveIndex(prev => (prev + 1) % announcements.length);
        }
        else if (isRightSwipe) {
            setActiveIndex(prev => (prev - 1 + announcements.length) % announcements.length);
        }
    };
    const handleCardClick = (ann, e) => {
        if (swiped) {
            e.stopPropagation();
            e.preventDefault();
            return;
        }
        setSelectedAnnouncement(ann);
    };
    if (announcements.length === 0 && !isAdmin) {
        return (_jsxs("div", { className: "announcement-card", style: { justifyContent: 'center', alignItems: 'center' }, children: [_jsx(Megaphone, { size: 28, className: "text-muted", style: { marginBottom: 6 } }), _jsx("p", { className: "ann-content", children: "No new announcements at this time." })] }));
    }
    const current = announcements[activeIndex] || announcements[0];
    const handleNext = (index) => {
        setActiveIndex(index);
    };
    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!newTitle || !newContent || !newDate)
            return;
        onAddAnnouncement({
            id: editAnnouncementId || undefined,
            title: newTitle,
            content: newContent,
            type: newType,
            date: newDate,
            posterUrl: newPosterUrl || undefined
        });
        // Reset
        setNewTitle('');
        setNewContent('');
        setNewType('general');
        setNewDate('');
        setNewPosterUrl('');
        setEditAnnouncementId(null);
        setShowAddModal(false);
    };
    const getPosterSrc = (ann) => {
        if (ann.posterUrl)
            return ann.posterUrl;
        // Fallback vector poster graphic
        const bgCol = ann.type === 'hackathon' ? '%23ea580c' : ann.type === 'exam' ? '%23dc2626' : ann.type === 'event' ? '%230284c7' : '%234f46e5';
        return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><rect width="100%" height="100%" fill="${bgCol}"/><rect x="10" y="10" width="300" height="200" rx="12" fill="%23ffffff" fill-opacity="0.12"/><text x="50%" y="42%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-family="system-ui,-apple-system,sans-serif" font-weight="900" font-size="20">${ann.type.toUpperCase()}</text><text x="50%" y="64%" dominant-baseline="middle" text-anchor="middle" fill="%23f8fafc" font-family="system-ui,-apple-system,sans-serif" font-weight="600" font-size="12">KSRCT EEE</text><text x="50%" y="82%" dominant-baseline="middle" text-anchor="middle" fill="%23e2e8f0" font-family="system-ui,-apple-system,sans-serif" font-size="11">${ann.date}</text></svg>`;
    };
    const getIcon = (type) => {
        switch (type) {
            case 'exam': return _jsx(FileText, { size: 16 });
            case 'hackathon': return _jsx(Trophy, { size: 16 });
            case 'event': return _jsx(Calendar, { size: 16 });
            default: return _jsx(Megaphone, { size: 16 });
        }
    };
    return (_jsxs("div", { style: { position: 'relative' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, children: [_jsx("h3", { className: "dashboard-grid-title", style: { margin: 0, cursor: 'pointer' }, onClick: onOpenAnnouncements, children: "Announcements" }), isAdmin && (_jsxs("button", { onClick: () => { setEditAnnouncementId(null); setShowAddModal(true); }, className: "btn-png-add", children: [_jsx("img", { src: addIcon, alt: "Add", style: { width: 14, height: 14 } }), " Add"] }))] }), !onOpenAnnouncements && announcements.length > 0 && (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 14 }, children: announcements.map((ann) => {
                    const colors = ann.type === 'exam'
                        ? { badge: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: '#ef444430' }
                        : ann.type === 'hackathon'
                            ? { badge: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: '#f59e0b30' }
                            : ann.type === 'event'
                                ? { badge: '#0891b2', bg: 'rgba(8,145,178,0.08)', border: '#0891b230' }
                                : { badge: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: '#6366f130' };
                    const posterSrc = getPosterSrc(ann);
                    return (_jsxs("div", { onClick: (e) => handleCardClick(ann, e), style: {
                            background: colors.bg,
                            border: `1.5px solid ${colors.border}`,
                            borderRadius: 14,
                            padding: '14px 16px',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }, children: [_jsxs("span", { style: {
                                            fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1,
                                            background: colors.badge, color: '#fff', padding: '2px 8px', borderRadius: 20,
                                            display: 'inline-flex', alignItems: 'center', gap: 4
                                        }, children: [getIcon(ann.type), " ", ann.type] }), _jsx("span", { style: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }, children: ann.date })] }), _jsxs("div", { style: { display: 'flex', gap: 14, alignItems: 'flex-start' }, children: [_jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx("h4", { style: { fontSize: 14, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6, lineHeight: 1.3 }, children: ann.title }), _jsx("p", { style: {
                                                    fontSize: 12,
                                                    color: 'var(--text-main)',
                                                    lineHeight: 1.55,
                                                    margin: 0,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }, children: ann.content })] }), _jsxs("div", { style: {
                                            width: 76,
                                            height: 76,
                                            minWidth: 76,
                                            borderRadius: 10,
                                            overflow: 'hidden',
                                            border: '1.5px solid var(--card-border)',
                                            background: 'var(--bg-secondary)',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            position: 'relative',
                                            flexShrink: 0
                                        }, children: [_jsx("img", { src: posterSrc, alt: ann.title, style: { width: '100%', height: '100%', objectFit: 'cover' } }), _jsx("div", { style: {
                                                    position: 'absolute', bottom: 2, right: 2,
                                                    background: 'rgba(0,0,0,0.65)', color: '#fff',
                                                    borderRadius: 4, padding: '1px 4px', fontSize: 8, fontWeight: 800
                                                }, children: "VIEW" })] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }, children: [_jsxs("span", { style: { fontSize: 11, fontWeight: 700, color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 4 }, children: [_jsx(Eye, { size: 12 }), " Tap to view full info & poster"] }), isAdmin && (_jsxs("div", { style: { display: 'flex', gap: 6 }, onClick: e => e.stopPropagation(), children: [_jsxs("button", { onClick: () => {
                                                    setEditAnnouncementId(ann.id);
                                                    setNewTitle(ann.title);
                                                    setNewContent(ann.content);
                                                    setNewType(ann.type);
                                                    setNewDate(ann.date);
                                                    setNewPosterUrl(ann.posterUrl || '');
                                                    setShowAddModal(true);
                                                }, className: "btn-secondary", style: { padding: '3px 8px', fontSize: 10, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 3 }, children: [_jsx(Pencil, { size: 10 }), " Edit"] }), onDeleteAnnouncement && (_jsx("button", { onClick: () => {
                                                    if (window.confirm('Delete this announcement?'))
                                                        onDeleteAnnouncement(ann.id);
                                                }, className: "btn-secondary", style: { padding: '3px 8px', fontSize: 10, borderColor: '#f87171', color: '#f87171' }, children: "Delete" }))] }))] })] }, ann.id));
                }) })), onOpenAnnouncements && announcements.length > 0 && (_jsxs("div", { className: "announcement-card", style: { cursor: 'pointer', position: 'relative' }, onClick: (e) => handleCardClick(current, e), onTouchStart: handleTouchStart, onTouchMove: handleTouchMove, onTouchEnd: handleTouchEnd, children: [_jsxs("div", { className: "ann-header", children: [_jsx("span", { className: `ann-badge ${current.type}`, children: _jsxs("span", { style: { display: 'inline-flex', alignItems: 'center', gap: 4 }, children: [getIcon(current.type), current.type] }) }), _jsx("span", { className: "ann-date", children: current.date })] }), _jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'flex-start', margin: '4px 0' }, children: [_jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [_jsx("h4", { className: "ann-title", style: { margin: '0 0 4px 0', fontSize: 14, fontWeight: 800 }, children: current.title }), _jsx("p", { className: "ann-content", style: { margin: 0, fontSize: 12, lineHeight: 1.5 }, children: current.content })] }), _jsxs("div", { onClick: (e) => { e.stopPropagation(); setSelectedAnnouncement(current); }, title: "Click to view full poster and info", style: {
                                    width: 72,
                                    height: 72,
                                    minWidth: 72,
                                    borderRadius: 10,
                                    overflow: 'hidden',
                                    border: '1.5px solid var(--card-border)',
                                    background: 'var(--bg-secondary)',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                                    position: 'relative',
                                    flexShrink: 0,
                                    cursor: 'pointer'
                                }, children: [_jsx("img", { src: getPosterSrc(current), alt: current.title, style: { width: '100%', height: '100%', objectFit: 'cover' } }), _jsx("div", { style: {
                                            position: 'absolute', bottom: 2, right: 2,
                                            background: 'rgba(0,0,0,0.65)', color: '#fff',
                                            borderRadius: 4, padding: '1px 4px', fontSize: 8, fontWeight: 900,
                                            letterSpacing: 0.5
                                        }, children: "EXPAND" })] })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { style: { display: 'flex', gap: 6 }, children: [_jsxs("button", { onClick: (e) => { e.stopPropagation(); setSelectedAnnouncement(current); }, className: "btn-secondary", style: { padding: '3px 8px', fontSize: 10, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }, children: [_jsx(Eye, { size: 11 }), " View Details & Poster"] }), isAdmin && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    setEditAnnouncementId(current.id);
                                                    setNewTitle(current.title);
                                                    setNewContent(current.content);
                                                    setNewType(current.type);
                                                    setNewDate(current.date);
                                                    setNewPosterUrl(current.posterUrl || '');
                                                    setShowAddModal(true);
                                                }, className: "btn-secondary", style: { padding: '3px 8px', fontSize: 10, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 2 }, children: [_jsx(Pencil, { size: 10 }), " Edit"] }), onDeleteAnnouncement && (_jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Delete this announcement?')) {
                                                        onDeleteAnnouncement(current.id);
                                                        setActiveIndex(0);
                                                    }
                                                }, className: "btn-secondary", style: { padding: '3px 8px', fontSize: 10, borderColor: '#f87171', color: '#f87171' }, children: "Delete" }))] }))] }), _jsx("div", { className: "ann-indicator-container", style: { margin: 0 }, children: announcements.map((_, idx) => (_jsx("div", { className: `ann-indicator ${idx === activeIndex ? 'active' : ''}`, onClick: () => handleNext(idx) }, idx))) })] })] })), selectedAnnouncement && typeof document !== 'undefined' && createPortal(_jsx("div", { className: "poster-modal", onClick: () => setSelectedAnnouncement(null), children: _jsxs("div", { className: "poster-content", onClick: e => e.stopPropagation(), style: { maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }, children: [_jsx("span", { className: `ann-badge ${selectedAnnouncement.type}`, children: _jsxs("span", { style: { display: 'inline-flex', alignItems: 'center', gap: 4 }, children: [getIcon(selectedAnnouncement.type), selectedAnnouncement.type] }) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("span", { style: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }, children: selectedAnnouncement.date }), _jsx("button", { className: "close-modal-btn", style: { position: 'static', width: 28, height: 28 }, onClick: () => setSelectedAnnouncement(null), children: _jsx(X, { size: 16 }) })] })] }), _jsx("h3", { style: { fontSize: 16, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35, margin: '4px 0 8px' }, children: selectedAnnouncement.title }), _jsx("div", { style: { borderRadius: 16, overflow: 'hidden', border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', marginBottom: 8 }, children: _jsx("img", { src: getPosterSrc(selectedAnnouncement), alt: selectedAnnouncement.title, className: "poster-image", style: { width: '100%', maxHeight: '42vh', objectFit: 'contain', display: 'block' } }) }), _jsxs("div", { style: { background: 'var(--bg-secondary)', padding: 14, borderRadius: 14, border: '1px solid var(--card-border)' }, children: [_jsx("h5", { style: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 6 }, children: "Description & Details" }), _jsx("p", { style: { fontSize: 13, color: 'var(--text-main)', lineHeight: 1.65, whiteSpace: 'pre-wrap', margin: 0 }, children: selectedAnnouncement.content })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }, children: [isAdmin && (_jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsxs("button", { onClick: () => {
                                                const annToEdit = selectedAnnouncement;
                                                setSelectedAnnouncement(null);
                                                setEditAnnouncementId(annToEdit.id);
                                                setNewTitle(annToEdit.title);
                                                setNewContent(annToEdit.content);
                                                setNewType(annToEdit.type);
                                                setNewDate(annToEdit.date);
                                                setNewPosterUrl(annToEdit.posterUrl || '');
                                                setShowAddModal(true);
                                            }, className: "btn-secondary", style: { padding: '6px 12px', fontSize: 11, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 4 }, children: [_jsx(Pencil, { size: 12 }), " Edit Announcement"] }), onDeleteAnnouncement && (_jsx("button", { onClick: () => {
                                                if (window.confirm('Delete this announcement?')) {
                                                    onDeleteAnnouncement(selectedAnnouncement.id);
                                                    setSelectedAnnouncement(null);
                                                }
                                            }, className: "btn-secondary", style: { padding: '6px 12px', fontSize: 11, borderColor: '#f87171', color: '#f87171' }, children: "Delete" }))] })), _jsx("button", { type: "button", className: "btn-primary", onClick: () => setSelectedAnnouncement(null), style: { marginLeft: 'auto', padding: '6px 16px', fontSize: 12 }, children: "Done" })] })] }) }), document.body), showAddModal && typeof document !== 'undefined' && createPortal(_jsx("div", { className: "poster-modal", children: _jsxs("form", { className: "poster-content", onSubmit: handleAddSubmit, style: { gap: 10 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h3", { style: { fontSize: 14, fontWeight: '700' }, children: editAnnouncementId ? 'Edit Announcement' : 'New Announcement' }), _jsx("button", { type: "button", className: "close-modal-btn", style: { position: 'static' }, onClick: () => { setShowAddModal(false); setEditAnnouncementId(null); }, children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Announcement Title" }), _jsx("input", { type: "text", value: newTitle, onChange: e => setNewTitle(e.target.value), className: "form-input", placeholder: "e.g. Hackathon Registration", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Type" }), _jsxs("select", { value: newType, onChange: e => setNewType(e.target.value), className: "form-select", children: [_jsx("option", { value: "general", children: "General" }), _jsx("option", { value: "exam", children: "Exam" }), _jsx("option", { value: "hackathon", children: "Hackathon" }), _jsx("option", { value: "event", children: "Event" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Date" }), _jsx("input", { type: "date", value: newDate, onChange: e => setNewDate(e.target.value), className: "form-input", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Content" }), _jsx("textarea", { value: newContent, onChange: e => setNewContent(e.target.value), className: "form-textarea", rows: 3, placeholder: "Details of the announcement...", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }, children: [_jsx("label", { className: "form-label", style: { margin: 0 }, children: "Announcement Poster / Circular (Optional)" }), newPosterUrl && (_jsxs("button", { type: "button", onClick: () => setNewPosterUrl(''), style: { background: 'none', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }, children: [_jsx(Trash2, { size: 12 }), " Remove"] }))] }), _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsxs("button", { type: "button", onClick: () => posterFileInputRef.current?.click(), className: "btn-secondary", style: {
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 8,
                                                padding: '10px 14px',
                                                borderRadius: 12,
                                                fontWeight: 700,
                                                fontSize: 12,
                                                background: 'rgba(0,82,204,0.06)',
                                                color: 'var(--accent-blue)',
                                                border: '1.5px dashed var(--accent-blue)',
                                                cursor: 'pointer',
                                            }, children: [_jsx(Upload, { size: 16 }), " Choose Image / PDF File"] }), _jsx("input", { ref: posterFileInputRef, type: "file", accept: "image/*,application/pdf", onChange: handlePosterFileUpload, style: { display: 'none' } })] }), newPosterUrl && (_jsxs("div", { style: { marginTop: 8, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', padding: 6, display: 'flex', alignItems: 'center', gap: 10 }, children: [newPosterUrl.startsWith('data:image') || newPosterUrl.startsWith('http') ? (_jsx("img", { src: newPosterUrl, alt: "Preview", style: { width: 44, height: 44, objectFit: 'cover', borderRadius: 8 } })) : (_jsx(FileImage, { size: 28, style: { color: 'var(--accent-blue)', margin: '0 6px' } })), _jsx("div", { style: { flex: 1, fontSize: 11, fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: "Poster attached successfully" })] }))] }), _jsx("button", { type: "submit", className: "btn-primary", style: { marginTop: 8 }, children: editAnnouncementId ? 'Save Changes' : 'Publish Announcement' })] }) }), document.body)] }));
};
