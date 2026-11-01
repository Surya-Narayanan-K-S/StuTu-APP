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
        return (<div className="announcement-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Megaphone size={28} className="text-muted" style={{ marginBottom: 6 }}/>
        <p className="ann-content">No new announcements at this time.</p>
      </div>);
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
            case 'exam': return <FileText size={16}/>;
            case 'hackathon': return <Trophy size={16}/>;
            case 'event': return <Calendar size={16}/>;
            default: return <Megaphone size={16}/>;
        }
    };
    return (<div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 className="dashboard-grid-title" style={{ margin: 0, cursor: 'pointer' }} onClick={onOpenAnnouncements}>Announcements</h3>
        {isAdmin && (<button onClick={() => { setEditAnnouncementId(null); setShowAddModal(true); }} className="btn-png-add">
            <img src={addIcon} alt="Add" style={{ width: 14, height: 14 }}/> Add
          </button>)}
      </div>

      {/* Full-page mode: show all announcements as a stacked readable list with poster on the right */}
      {!onOpenAnnouncements && announcements.length > 0 && (<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {announcements.map((ann) => {
                const colors = ann.type === 'exam'
                    ? { badge: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: '#ef444430' }
                    : ann.type === 'hackathon'
                        ? { badge: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: '#f59e0b30' }
                        : ann.type === 'event'
                            ? { badge: '#0891b2', bg: 'rgba(8,145,178,0.08)', border: '#0891b230' }
                            : { badge: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: '#6366f130' };
                const posterSrc = getPosterSrc(ann);
                return (<div key={ann.id} onClick={(e) => handleCardClick(ann, e)} style={{
                        background: colors.bg,
                        border: `1.5px solid ${colors.border}`,
                        borderRadius: 14,
                        padding: '14px 16px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                        fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1,
                        background: colors.badge, color: '#fff', padding: '2px 8px', borderRadius: 20,
                        display: 'inline-flex', alignItems: 'center', gap: 4
                    }}>
                    {getIcon(ann.type)} {ann.type}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{ann.date}</span>
                </div>

                {/* Main Content with Poster to the Right */}
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6, lineHeight: 1.3 }}>{ann.title}</h4>
                    <p style={{
                        fontSize: 12,
                        color: 'var(--text-main)',
                        lineHeight: 1.55,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                      {ann.content}
                    </p>
                  </div>

                  {/* Poster Thumbnail on the Right */}
                  <div style={{
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
                    }}>
                    <img src={posterSrc} alt={ann.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                    <div style={{
                        position: 'absolute', bottom: 2, right: 2,
                        background: 'rgba(0,0,0,0.65)', color: '#fff',
                        borderRadius: 4, padding: '1px 4px', fontSize: 8, fontWeight: 800
                    }}>
                      VIEW
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={12}/> Tap to view full info & poster
                  </span>

                  {isAdmin && (<div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => {
                            setEditAnnouncementId(ann.id);
                            setNewTitle(ann.title);
                            setNewContent(ann.content);
                            setNewType(ann.type);
                            setNewDate(ann.date);
                            setNewPosterUrl(ann.posterUrl || '');
                            setShowAddModal(true);
                        }} className="btn-secondary" style={{ padding: '3px 8px', fontSize: 10, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Pencil size={10}/> Edit
                      </button>
                      {onDeleteAnnouncement && (<button onClick={() => { if (window.confirm('Delete this announcement?'))
                            onDeleteAnnouncement(ann.id); }} className="btn-secondary" style={{ padding: '3px 8px', fontSize: 10, borderColor: '#f87171', color: '#f87171' }}>
                          Delete
                        </button>)}
                    </div>)}
                </div>
              </div>);
            })}
        </div>)}

      {/* Widget / carousel mode on Dashboard: Poster thumbnail on the right */}
      {onOpenAnnouncements && announcements.length > 0 && (<div className="announcement-card" style={{ cursor: 'pointer', position: 'relative' }} onClick={(e) => handleCardClick(current, e)} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="ann-header">
            <span className={`ann-badge ${current.type}`}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {getIcon(current.type)}
                {current.type}
              </span>
            </span>
            <span className="ann-date">{current.date}</span>
          </div>

          {/* Row layout: Text on Left, Poster Thumbnail on Right */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', margin: '4px 0' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 className="ann-title" style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 800 }}>{current.title}</h4>
              <p className="ann-content" style={{ margin: 0, fontSize: 12, lineHeight: 1.5 }}>{current.content}</p>
            </div>

            {/* Poster Thumbnail preview on the right */}
            <div onClick={(e) => { e.stopPropagation(); setSelectedAnnouncement(current); }} title="Click to view full poster and info" style={{
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
            }}>
              <img src={getPosterSrc(current)} alt={current.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              <div style={{
                position: 'absolute', bottom: 2, right: 2,
                background: 'rgba(0,0,0,0.65)', color: '#fff',
                borderRadius: 4, padding: '1px 4px', fontSize: 8, fontWeight: 900,
                letterSpacing: 0.5
            }}>
                EXPAND
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={(e) => { e.stopPropagation(); setSelectedAnnouncement(current); }} className="btn-secondary" style={{ padding: '3px 8px', fontSize: 10, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <Eye size={11}/> View Details & Poster
              </button>

              {isAdmin && (<>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setEditAnnouncementId(current.id);
                    setNewTitle(current.title);
                    setNewContent(current.content);
                    setNewType(current.type);
                    setNewDate(current.date);
                    setNewPosterUrl(current.posterUrl || '');
                    setShowAddModal(true);
                }} className="btn-secondary" style={{ padding: '3px 8px', fontSize: 10, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                    <Pencil size={10}/> Edit
                  </button>
                  {onDeleteAnnouncement && (<button onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this announcement?')) {
                            onDeleteAnnouncement(current.id);
                            setActiveIndex(0);
                        }
                    }} className="btn-secondary" style={{ padding: '3px 8px', fontSize: 10, borderColor: '#f87171', color: '#f87171' }}>
                      Delete
                    </button>)}
                </>)}
            </div>

            <div className="ann-indicator-container" style={{ margin: 0 }}>
              {announcements.map((_, idx) => (<div key={idx} className={`ann-indicator ${idx === activeIndex ? 'active' : ''}`} onClick={() => handleNext(idx)}/>))}
            </div>
          </div>
        </div>)}

      {/* Bigger View Modal (Full Info + Big Poster) */}
      {selectedAnnouncement && typeof document !== 'undefined' && createPortal(<div className="poster-modal" onClick={() => setSelectedAnnouncement(null)}>
          <div className="poster-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Header: Type Badge, Date, Close Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span className={`ann-badge ${selectedAnnouncement.type}`}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {getIcon(selectedAnnouncement.type)}
                  {selectedAnnouncement.type}
                </span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{selectedAnnouncement.date}</span>
                <button className="close-modal-btn" style={{ position: 'static', width: 28, height: 28 }} onClick={() => setSelectedAnnouncement(null)}>
                  <X size={16}/>
                </button>
              </div>
            </div>

            {/* Announcement Title */}
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.35, margin: '4px 0 8px' }}>
              {selectedAnnouncement.title}
            </h3>

            {/* Big Poster Image Preview */}
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', marginBottom: 8 }}>
              <img src={getPosterSrc(selectedAnnouncement)} alt={selectedAnnouncement.title} className="poster-image" style={{ width: '100%', maxHeight: '42vh', objectFit: 'contain', display: 'block' }}/>
            </div>

            {/* Full Information / Content Description */}
            <div style={{ background: 'var(--bg-secondary)', padding: 14, borderRadius: 14, border: '1px solid var(--card-border)' }}>
              <h5 style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5, marginBottom: 6 }}>
                Description & Details
              </h5>
              <p style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.65, whiteSpace: 'pre-wrap', margin: 0 }}>
                {selectedAnnouncement.content}
              </p>
            </div>

            {/* Admin Controls / Close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
              {isAdmin && (<div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => {
                    const annToEdit = selectedAnnouncement;
                    setSelectedAnnouncement(null);
                    setEditAnnouncementId(annToEdit.id);
                    setNewTitle(annToEdit.title);
                    setNewContent(annToEdit.content);
                    setNewType(annToEdit.type);
                    setNewDate(annToEdit.date);
                    setNewPosterUrl(annToEdit.posterUrl || '');
                    setShowAddModal(true);
                }} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 11, borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Pencil size={12}/> Edit Announcement
                  </button>
                  {onDeleteAnnouncement && (<button onClick={() => {
                        if (window.confirm('Delete this announcement?')) {
                            onDeleteAnnouncement(selectedAnnouncement.id);
                            setSelectedAnnouncement(null);
                        }
                    }} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 11, borderColor: '#f87171', color: '#f87171' }}>
                      Delete
                    </button>)}
                </div>)}
              <button type="button" className="btn-primary" onClick={() => setSelectedAnnouncement(null)} style={{ marginLeft: 'auto', padding: '6px 16px', fontSize: 12 }}>
                Done
              </button>
            </div>
          </div>
        </div>, document.body)}

      {/* Add/Edit Announcement Modal */}
      {showAddModal && typeof document !== 'undefined' && createPortal(<div className="poster-modal">
          <form className="poster-content" onSubmit={handleAddSubmit} style={{ gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 14, fontWeight: '700' }}>{editAnnouncementId ? 'Edit Announcement' : 'New Announcement'}</h3>
              <button type="button" className="close-modal-btn" style={{ position: 'static' }} onClick={() => { setShowAddModal(false); setEditAnnouncementId(null); }}>
                <X size={16}/>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Announcement Title</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="form-input" placeholder="e.g. Hackathon Registration" required/>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select value={newType} onChange={e => setNewType(e.target.value)} className="form-select">
                <option value="general">General</option>
                <option value="exam">Exam</option>
                <option value="hackathon">Hackathon</option>
                <option value="event">Event</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="form-input" required/>
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea value={newContent} onChange={e => setNewContent(e.target.value)} className="form-textarea" rows={3} placeholder="Details of the announcement..." required/>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Announcement Poster / Circular (Optional)</label>
                {newPosterUrl && (<button type="button" onClick={() => setNewPosterUrl('')} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Trash2 size={12}/> Remove
                  </button>)}
              </div>

              {/* Upload Button */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" onClick={() => posterFileInputRef.current?.click()} className="btn-secondary" style={{
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
            }}>
                  <Upload size={16}/> Choose Image / PDF File
                </button>
                <input ref={posterFileInputRef} type="file" accept="image/*,application/pdf" onChange={handlePosterFileUpload} style={{ display: 'none' }}/>
              </div>

              {/* Attached Preview */}
              {newPosterUrl && (<div style={{ marginTop: 8, borderRadius: 10, overflow: 'hidden', border: '1px solid var(--card-border)', background: 'var(--bg-secondary)', padding: 6, display: 'flex', alignItems: 'center', gap: 10 }}>
                  {newPosterUrl.startsWith('data:image') || newPosterUrl.startsWith('http') ? (<img src={newPosterUrl} alt="Preview" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }}/>) : (<FileImage size={28} style={{ color: 'var(--accent-blue)', margin: '0 6px' }}/>)}
                  <div style={{ flex: 1, fontSize: 11, fontWeight: 700, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Poster attached successfully
                  </div>
                </div>)}
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
              {editAnnouncementId ? 'Save Changes' : 'Publish Announcement'}
            </button>
          </form>
        </div>, document.body)}
    </div>);
};
