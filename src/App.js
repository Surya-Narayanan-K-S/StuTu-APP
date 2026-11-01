import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { App as CapApp } from '@capacitor/app';
import { supabase } from './services/supabaseClient';
import { dbService } from './services/db';
import appLogo from './assets/app-logo.png';
import { APP_CATEGORIES } from './routes/appRoutes';
import { ProfileDocs, AttendanceTracker, NptelTracker, AcademicsTracker, CareerHub, AcademicCalendar, AIChatbot, SignInPage, StudentDetailsCard, Timetable, RequestLetters, LabSeatFinder, GpaCalculator, AnnouncementBanner, DesktopLandingPage, DesktopLoginPage, DesktopSidebar, DesktopVisionaDashboard, MobileLandingPage, PuzzleGames, StudentManager, TaskList } from './components';
import { Zap, Menu, X, Search, Bell, User, LogOut, ChevronRight, BookOpen, Calendar, GraduationCap, Award, FileText, UserCheck, Inbox, Map, Phone, Sparkles, Home, Gamepad2, CheckCircle2, Plus, Trash2, Pencil } from 'lucide-react';
import './App.css';
// Simulation accounts for testing
const USER_PROFILES = [
    {
        email: 'student@eee.com',
        name: 'Nithin Annamalai',
        rollNo: '71812503104',
        role: 'student',
        className: 'II EEE-B',
        yearOfStudy: '2nd Year',
        semester: 'Semester III',
        department: 'Dept of EEE'
    },
    {
        email: 'teacher@eee.com',
        name: 'Dr. EEE HOD / Faculty',
        rollNo: 'FAC001',
        role: 'teacher',
        className: 'All EEE Classes',
        yearOfStudy: 'Staff',
        semester: 'Staff Portal',
        department: 'Dept of EEE'
    }
];
function App() {
    const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 992);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        try {
            const saved = localStorage.getItem('eee_active_user');
            return !!saved;
        }
        catch {
            return false;
        }
    });
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('eee_active_user');
            return saved ? JSON.parse(saved) : null;
        }
        catch {
            return null;
        }
    });
    const [showSignInPage, setShowSignInPage] = useState(false);
    const [authIsSignUp, setAuthIsSignUp] = useState(false);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const [announcements, setAnnouncements] = useState([]);
    const [currentTab, setCurrentTab] = useState(() => {
        try {
            const hash = window.location.hash.replace('#', '').trim();
            return hash || null;
        }
        catch {
            return null;
        }
    });
    const [isClosingModal, setIsClosingModal] = useState(false);
    const [activeBottomNav, setActiveBottomNav] = useState('home');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [academicInitEdit, setAcademicInitEdit] = useState(false);
    // Sync window.location.hash with currentTab for seamless refresh & back navigation
    useEffect(() => {
        const syncHashToTab = () => {
            const hash = window.location.hash.replace('#', '').trim();
            setCurrentTab(hash || null);
            if (!hash) {
                setActiveBottomNav('home');
            }
            else if (hash === 'academics' || hash === 'courses') {
                setActiveBottomNav('academics');
            }
            else if (hash === 'attendance') {
                setActiveBottomNav('attendance');
            }
            else if (hash === 'puzzle-games') {
                setActiveBottomNav('puzzle-games');
            }
            else if (hash === 'profile-details' || hash === 'profile') {
                setActiveBottomNav('profile');
            }
        };
        window.addEventListener('hashchange', syncHashToTab);
        window.addEventListener('popstate', syncHashToTab);
        return () => {
            window.removeEventListener('hashchange', syncHashToTab);
            window.removeEventListener('popstate', syncHashToTab);
        };
    }, []);
    useEffect(() => {
        loadAnnouncements();
        // Check active session on mount
        const checkSession = async () => {
            const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
            if (isSupabaseConfigured) {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) {
                        const email = session.user.email || '';
                        let role = 'student';
                        let name = session.user.user_metadata?.name || email.split('@')[0].toUpperCase();
                        let rollNo = session.user.user_metadata?.rollNo || '';
                        // Check if teacher
                        const { data: facultyData } = await supabase
                            .from('faculty')
                            .select('*')
                            .eq('email', email)
                            .maybeSingle();
                        if (facultyData || email.toLowerCase() === 'teacher@eee.com') {
                            role = 'teacher';
                            name = facultyData?.name || 'Dr. EEE HOD / Faculty';
                            rollNo = 'FAC001';
                        }
                        else {
                            const { data: studentData } = await supabase
                                .from('student_profiles')
                                .select('*')
                                .eq('email', email)
                                .maybeSingle();
                            if (studentData) {
                                name = studentData.name;
                                rollNo = studentData.roll_no;
                            }
                        }
                        const userProfile = {
                            email,
                            name,
                            rollNo,
                            role,
                            className: role === 'teacher' ? 'All EEE Classes' : 'II EEE-B',
                            yearOfStudy: role === 'teacher' ? 'Staff' : '2nd Year',
                            semester: role === 'teacher' ? 'Staff Portal' : 'Semester III',
                            department: 'Dept of EEE'
                        };
                        // Merge local extras
                        try {
                            const saved = localStorage.getItem('eee_profile_extra_' + email);
                            if (saved) {
                                const extras = JSON.parse(saved);
                                const merged = { ...userProfile, ...extras, email, role };
                                setCurrentUser(merged);
                                localStorage.setItem('eee_active_user', JSON.stringify(merged));
                            }
                            else {
                                setCurrentUser(userProfile);
                                localStorage.setItem('eee_active_user', JSON.stringify(userProfile));
                            }
                        }
                        catch {
                            setCurrentUser(userProfile);
                            localStorage.setItem('eee_active_user', JSON.stringify(userProfile));
                        }
                        setIsAuthenticated(true);
                    }
                }
                catch (err) {
                    console.warn('Failed to fetch Supabase session on mount:', err);
                }
            }
        };
        checkSession();
    }, []);
    // Hardware Back Button Handler for Android / Capacitor
    useEffect(() => {
        const backListener = CapApp.addListener('backButton', () => {
            if (isDrawerOpen) {
                setIsDrawerOpen(false);
                return;
            }
            if (showSignInPage) {
                setShowSignInPage(false);
                return;
            }
            if (window.location.hash || currentTab !== null) {
                if (window.location.hash) {
                    window.history.back();
                }
                else {
                    setCurrentTab(null);
                }
                return;
            }
            CapApp.exitApp();
        });
        return () => {
            backListener.then((l) => l?.remove?.());
        };
    }, [isDrawerOpen, showSignInPage, currentTab]);
    const loadAnnouncements = async () => {
        const list = await dbService.getAnnouncements();
        setAnnouncements(list);
    };
    const handleAddAnnouncement = async (newAnn) => {
        await dbService.saveAnnouncement(newAnn);
        loadAnnouncements();
    };
    const handleDeleteAnnouncement = async (id) => {
        await dbService.deleteAnnouncement(id);
        loadAnnouncements();
    };
    const handleLoginSuccess = (userProfile) => {
        // Merge any locally saved personal details (phone, dob, etc.)
        let fullProfile = userProfile;
        try {
            const saved = localStorage.getItem('eee_profile_extra_' + userProfile.email);
            if (saved) {
                const extras = JSON.parse(saved);
                fullProfile = { ...userProfile, ...extras, email: userProfile.email, role: userProfile.role };
            }
        }
        catch { }
        setCurrentUser(fullProfile);
        localStorage.setItem('eee_active_user', JSON.stringify(fullProfile));
        setIsAuthenticated(true);
        setShowSignInPage(false);
    };
    const handleLogout = async () => {
        const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
        if (isSupabaseConfigured) {
            try {
                await supabase.auth.signOut();
            }
            catch (err) {
                console.warn('Failed to sign out from Supabase:', err);
            }
        }
        localStorage.removeItem('eee_active_user');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setCurrentTab(null);
        window.location.hash = '';
        setIsDrawerOpen(false);
    };
    const isAdmin = currentUser?.role === 'teacher';
    const handleCloseModal = () => {
        if (isClosingModal)
            return;
        setIsClosingModal(true);
        setCurrentTab(null);
        setActiveBottomNav('home');
        if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        setTimeout(() => {
            setIsClosingModal(false);
        }, 120);
    };
    // Capacitor Android system back button integration
    useEffect(() => {
        let listener = null;
        import('@capacitor/app')
            .then(({ App: CapApp }) => {
            listener = CapApp.addListener('backButton', () => {
                if (currentTab || isDrawerOpen || showSearch || showSignInPage) {
                    handleCloseModal();
                    setIsDrawerOpen(false);
                    setShowSearch(false);
                    setShowSignInPage(false);
                }
                else {
                    CapApp.exitApp();
                }
            });
        })
            .catch(() => { });
        return () => {
            if (listener && typeof listener.remove === 'function') {
                listener.remove();
            }
        };
    }, [currentTab, isDrawerOpen, showSearch, showSignInPage]);
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && (currentTab || isDrawerOpen || showSearch)) {
                handleCloseModal();
                setIsDrawerOpen(false);
                setShowSearch(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentTab, isDrawerOpen, showSearch, isClosingModal]);
    const handleCardClick = (titleKey) => {
        if (!isAuthenticated) {
            setShowSignInPage(true);
            return;
        }
        setAcademicInitEdit(false);
        if (titleKey === 'home') {
            if (window.location.hash) {
                window.location.hash = '';
            }
            else {
                setCurrentTab(null);
            }
            setActiveBottomNav('home');
            setIsDrawerOpen(false);
            return;
        }
        if (titleKey === 'od-form' || titleKey === 'apply-od') {
            const win = window.open('https://onduty.srecieee.org', '_blank', 'noopener,noreferrer');
            if (!win)
                window.location.href = 'https://onduty.srecieee.org';
            setIsDrawerOpen(false);
            return;
        }
        setIsClosingModal(false);
        window.location.hash = titleKey;
        setCurrentTab(titleKey);
        setIsDrawerOpen(false);
    };
    // Mobile & Desktop App Categories (Loaded from src/routes/appRoutes.ts)
    const appCategories = useMemo(() => APP_CATEGORIES, []);
    // Search aliases so common terms resolve correctly
    const SEARCH_ALIASES = {
        ai: ['ai', 'tutor', 'chat', 'bot', 'assistant'],
        courses: ['syllabus', 'course', 'subject', 'curriculum'],
        calendar: ['calendar', 'schedule', 'academic calendar', 'holiday'],
        academics: ['cgpa', 'gpa', 'marks', 'grade', 'score', 'result'],
        'cgpa-calc': ['cgpa', 'gpa', 'calculator', 'calc', 'grade'],
        nptel: ['nptel', 'online course', 'mooc', 'swayam'],
        timetable: ['timetable', 'time table', 'class', 'period', 'schedule'],
        profile: ['document', 'docs', 'bonafide', 'file'],
        certificates: ['certificate', 'achievement', 'award'],
        attendance: ['attendance', 'absent', 'present', 'od'],
        'lab-finder': ['lab', 'seat', 'laboratory', 'computer'],
        suggestion: ['suggestion', 'feedback', 'complaint'],
        career: ['career', 'roadmap', 'placement', 'job', 'internship'],
        'campus-map': ['campus', 'map', 'location', 'block', 'building'],
        'college-rules': ['rules', 'regulation', 'policy', 'discipline'],
        faculty: ['faculty', 'teacher', 'staff', 'professor', 'contact', 'phone'],
        tasks: ['task', 'todo', 'checklist', 'assignment', 'deadline', 'reminder', 'to-do'],
    };
    const itemMatchesSearch = (item, q) => {
        const lq = q.toLowerCase().trim();
        if (!lq)
            return true;
        if (item.label.toLowerCase().includes(lq))
            return true;
        if (item.key.toLowerCase().includes(lq))
            return true;
        const aliases = SEARCH_ALIASES[item.key] || [];
        return aliases.some(a => a.includes(lq) || lq.includes(a));
    };
    // Flat list of all matching items for the dropdown overlay
    const searchResults = searchQuery.trim()
        ? appCategories.flatMap(cat => cat.items.filter(item => itemMatchesSearch(item, searchQuery)))
        : [];
    // Filter items if search is active
    const filteredCategories = searchQuery.trim()
        ? appCategories.map(cat => ({
            ...cat,
            items: cat.items.filter(item => itemMatchesSearch(item, searchQuery))
        })).filter(cat => cat.items.length > 0)
        : appCategories;
    // MANDATORY AUTHENTICATION: Show Landing Page or Login Portal if not authenticated
    if (!isAuthenticated) {
        if (isDesktop) {
            if (showSignInPage) {
                return (_jsx(DesktopLoginPage, { onClose: () => setShowSignInPage(false), onLoginSuccess: (profile) => { handleLoginSuccess(profile); setShowSignInPage(false); }, demoProfiles: USER_PROFILES }));
            }
            return (_jsx(DesktopLandingPage, { onOpenLogin: (isSignUp) => {
                    setAuthIsSignUp(Boolean(isSignUp));
                    setShowSignInPage(true);
                }, demoProfiles: USER_PROFILES, onDemoLogin: (profile) => handleLoginSuccess(profile) }));
        }
        if (!showSignInPage) {
            return (_jsx("div", { className: "mobile-app-shell", children: _jsx(MobileLandingPage, { onOpenLogin: (isSignUp) => {
                        setAuthIsSignUp(Boolean(isSignUp));
                        setShowSignInPage(true);
                    }, demoProfiles: USER_PROFILES, onDemoLogin: (profile) => handleLoginSuccess(profile) }) }));
        }
        return (_jsx("div", { className: "mobile-app-shell", children: _jsx(SignInPage, { onClose: () => setShowSignInPage(false), onLoginSuccess: (profile) => { handleLoginSuccess(profile); setShowSignInPage(false); }, demoProfiles: USER_PROFILES, initialIsSignUp: authIsSignUp }) }));
    }
    return (_jsxs("div", { className: "mobile-app-shell", style: { display: isDesktop ? 'flex' : 'block', flexDirection: 'row' }, children: [isDesktop && (_jsx(DesktopSidebar, { currentTab: currentTab, activeBottomNav: activeBottomNav, onSelectTab: (tab) => {
                    if (tab) {
                        handleCardClick(tab);
                    }
                    else {
                        if (window.location.hash) {
                            window.location.hash = '';
                        }
                        else {
                            setCurrentTab(null);
                        }
                        setActiveBottomNav('home');
                    }
                }, isAuthenticated: isAuthenticated, currentUser: currentUser, isAdmin: isAdmin, onOpenSignIn: () => setShowSignInPage(true), onLogout: handleLogout })), _jsxs("div", { style: { flex: 1, minWidth: 0, width: '100%' }, children: [!isDesktop && currentTab === null && (_jsxs("header", { className: "mobile-top-bar", children: [_jsxs("div", { className: "mobile-top-left", children: [_jsx("button", { className: "hamburger-btn", "aria-label": "Open Menu", onClick: () => setIsDrawerOpen(true), children: _jsx(Menu, { size: 22 }) }), _jsxs("div", { className: "mobile-brand", onClick: () => handleCardClick('home'), role: "button", tabIndex: 0, children: [_jsx("div", { className: "mobile-brand-logo", children: _jsx("img", { src: appLogo, alt: "EEE SREC Logo", style: { width: 28, height: 28, borderRadius: 6, objectFit: 'cover' } }) }), _jsxs("div", { className: "mobile-brand-text", children: [_jsx("h1", { children: "EEE SREC" }), _jsx("p", { children: "Smart Mobile Hub" })] })] })] }), _jsxs("div", { className: "mobile-top-right", children: [_jsx("button", { className: "icon-circle-btn", onClick: () => setShowSearch(!showSearch), "aria-label": "Search", children: _jsx(Search, { size: 18 }) }), _jsxs("button", { className: "icon-circle-btn", onClick: () => handleCardClick('announcements'), "aria-label": "Notifications", children: [_jsx(Bell, { size: 18 }), _jsx("span", { className: "notification-badge" })] }), _jsx("button", { className: "avatar-btn", onClick: () => isAuthenticated ? handleCardClick('profile-details') : setShowSignInPage(true), "aria-label": "User Profile", children: isAuthenticated && currentUser ? currentUser.name.charAt(0) : _jsx(User, { size: 18 }) })] })] })), _jsxs("div", { className: "desktop-nav-links", children: [_jsxs("button", { className: `desktop-nav-btn ${activeBottomNav === 'home' && currentTab === null ? 'active' : ''}`, onClick: () => { setActiveBottomNav('home'); setCurrentTab(null); }, children: [_jsx(Home, { size: 15 }), " ", _jsx("span", { children: "Home" })] }), _jsxs("button", { className: `desktop-nav-btn ${currentTab === 'academics' || currentTab === 'courses' ? 'active' : ''}`, onClick: () => { setActiveBottomNav('academics'); handleCardClick('academics'); }, children: [_jsx(GraduationCap, { size: 15 }), " ", _jsx("span", { children: "Academics" })] }), _jsxs("button", { className: `desktop-nav-btn ${currentTab === 'attendance' ? 'active' : ''}`, onClick: () => { setActiveBottomNav('attendance'); handleCardClick('attendance'); }, children: [_jsx(UserCheck, { size: 15 }), " ", _jsx("span", { children: "Attendance" })] }), _jsxs("button", { className: `desktop-nav-btn ${currentTab === 'puzzle-games' ? 'active' : ''}`, onClick: () => { setActiveBottomNav('puzzle-games'); handleCardClick('puzzle-games'); }, children: [_jsx(Gamepad2, { size: 15 }), " ", _jsx("span", { children: "Mind Games" })] }), _jsxs("button", { className: `desktop-nav-btn ${currentTab === 'profile-details' ? 'active' : ''}`, onClick: () => { setActiveBottomNav('profile'); handleCardClick('profile-details'); }, children: [_jsx(User, { size: 15 }), " ", _jsx("span", { children: "Profile" })] })] }), showSearch && (_jsxs("div", { style: { position: 'relative' }, children: [_jsxs("div", { style: { padding: '8px 14px', background: 'var(--bg-primary)', borderBottom: '1px solid var(--card-border)', display: 'flex', gap: 8, alignItems: 'center' }, children: [_jsx(Search, { size: 16, style: { color: 'var(--text-muted)', flexShrink: 0 } }), _jsx("input", { type: "text", placeholder: "Search features (e.g. attendance, cgpa, faculty)...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), onKeyDown: e => {
                                            if (e.key === 'Enter' && searchResults.length > 0) {
                                                handleCardClick(searchResults[0].key);
                                                setSearchQuery('');
                                                setShowSearch(false);
                                            }
                                            if (e.key === 'Escape') {
                                                setShowSearch(false);
                                                setSearchQuery('');
                                            }
                                        }, autoFocus: true, style: { flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 15, color: 'var(--text-main)' } }), searchQuery ? (_jsx("button", { onClick: () => setSearchQuery(''), style: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: '0 2px' }, children: "\u2715" })) : null, _jsx("button", { onClick: () => { setShowSearch(false); setSearchQuery(''); }, style: { background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: '0 4px' }, children: "Done" })] }), searchQuery.trim() && (_jsx("div", { style: {
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    background: '#ffffff',
                                    border: '1px solid var(--card-border)',
                                    borderTop: 'none',
                                    borderRadius: '0 0 16px 16px',
                                    zIndex: 9999,
                                    boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
                                    maxHeight: '60vh',
                                    overflowY: 'auto'
                                }, children: searchResults.length === 0 ? (_jsxs("div", { style: { padding: '20px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }, children: ["No features found for \u201C", _jsx("strong", { children: searchQuery }), "\u201D"] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { style: { padding: '6px 14px 2px', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }, children: [searchResults.length, " result", searchResults.length !== 1 ? 's' : '', " found"] }), searchResults.map(item => (_jsxs("button", { onClick: () => { handleCardClick(item.key); setSearchQuery(''); setShowSearch(false); }, style: {
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 12,
                                                padding: '11px 16px',
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                borderBottom: '1px solid var(--card-border)'
                                            }, children: [_jsx("div", { style: { width: 34, height: 34, borderRadius: 10, background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }, children: item.icon }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }, children: item.label }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: "Tap to open" })] }), _jsx("span", { style: { marginLeft: 'auto', fontSize: 18, color: 'var(--text-muted)' }, children: "\u203A" })] }, item.key)))] })) }))] })), isDrawerOpen && createPortal(_jsx("div", { style: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(15, 23, 42, 0.65)',
                            backdropFilter: 'blur(10px)',
                            zIndex: 999999,
                            display: 'flex'
                        }, onClick: () => setIsDrawerOpen(false), children: _jsxs("div", { style: {
                                width: 'min(86vw, 350px)',
                                height: '100%',
                                background: '#f8fafc',
                                boxShadow: '12px 0 36px rgba(0, 0, 0, 0.35)',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                animation: 'drawerSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                            }, onClick: e => e.stopPropagation(), children: [_jsxs("div", { style: {
                                        background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 60%, #0052cc 100%)',
                                        padding: '24px 20px 20px',
                                        color: '#ffffff',
                                        position: 'relative',
                                        boxShadow: '0 8px 24px rgba(0, 82, 204, 0.25)'
                                    }, children: [_jsx("button", { onClick: () => setIsDrawerOpen(false), style: {
                                                position: 'absolute',
                                                top: 14,
                                                right: 14,
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                background: 'rgba(255, 255, 255, 0.15)',
                                                border: 'none',
                                                color: '#ffffff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }, children: _jsx(X, { size: 16 }) }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }, children: [_jsxs("div", { style: { position: 'relative', flexShrink: 0 }, children: [_jsx("div", { style: {
                                                                width: 54,
                                                                height: 54,
                                                                borderRadius: '50%',
                                                                background: 'linear-gradient(135deg, #ff5f1f 0%, #ea580c 100%)',
                                                                color: '#ffffff',
                                                                fontSize: 22,
                                                                fontWeight: 900,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                border: '2.5px solid rgba(255, 255, 255, 0.5)',
                                                                boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                                                            }, children: isAuthenticated && currentUser ? currentUser.name.charAt(0) : 'G' }), _jsx("div", { style: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#10b981', border: '2px solid #ffffff' } })] }), _jsxs("div", { style: { minWidth: 0, flex: 1 }, children: [_jsx("h3", { style: { fontSize: 16, fontWeight: 900, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: isAuthenticated && currentUser ? currentUser.name : 'Guest User' }), _jsx("p", { style: { fontSize: 11, color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontWeight: 600 }, children: isAuthenticated && currentUser ? `Roll: ${currentUser.rollNo}` : 'Sri Ramakrishna Eng. College' }), _jsxs("span", { style: {
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: 4,
                                                                background: 'rgba(255, 95, 31, 0.25)',
                                                                color: '#ffedd5',
                                                                border: '1px solid rgba(255, 95, 31, 0.4)',
                                                                padding: '2px 8px',
                                                                borderRadius: 99,
                                                                fontSize: 9.5,
                                                                fontWeight: 800,
                                                                textTransform: 'uppercase',
                                                                marginTop: 4
                                                            }, children: [_jsx(Sparkles, { size: 10 }), isAuthenticated && currentUser ? (isAdmin ? 'Faculty Admin' : 'UG Scholar') : 'Demo Guest'] })] })] }), _jsx("div", { style: { display: 'flex', gap: 8 }, children: isAuthenticated ? (_jsxs("button", { onClick: handleLogout, style: {
                                                    width: '100%',
                                                    padding: '8px',
                                                    borderRadius: 12,
                                                    background: 'rgba(255, 255, 255, 0.15)',
                                                    color: '#ffffff',
                                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                                    fontSize: 11.5,
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 6
                                                }, children: [_jsx(LogOut, { size: 13 }), " Sign Out Account"] })) : (_jsxs("button", { onClick: () => { setIsDrawerOpen(false); setShowSignInPage(true); }, style: {
                                                    width: '100%',
                                                    padding: '8px',
                                                    borderRadius: 12,
                                                    background: '#ffffff',
                                                    color: 'var(--accent-blue)',
                                                    border: 'none',
                                                    fontSize: 11.5,
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: 6
                                                }, children: [_jsx(User, { size: 13 }), " Sign In to Portal"] })) })] }), _jsxs("div", { style: { flex: 1, overflowY: 'auto', padding: '14px 14px 24px', display: 'flex', flexDirection: 'column', gap: 12 }, children: [_jsxs("a", { href: "/EEE-SREC-Portal.apk", download: "EEE-SREC-Portal.apk", style: {
                                                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                                color: '#ffffff',
                                                borderRadius: 16,
                                                padding: '11px 14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                textDecoration: 'none',
                                                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.28)',
                                                cursor: 'pointer'
                                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: {
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: 10,
                                                                background: 'rgba(255, 255, 255, 0.22)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: 16
                                                            }, children: "\uD83D\uDCF2" }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 13, fontWeight: 900, lineHeight: 1.2 }, children: "Download Android APK" }), _jsx("div", { style: { fontSize: 10, opacity: 0.88, fontWeight: 600 }, children: "Direct Mobile Install (30 MB)" })] })] }), _jsx("span", { style: { fontSize: 10, fontWeight: 900, background: '#ffffff', color: '#059669', padding: '3px 8px', borderRadius: 99 }, children: "GET" })] }), _jsxs("div", { onClick: () => { setCurrentTab(null); setIsDrawerOpen(false); }, style: {
                                                background: currentTab === null ? 'linear-gradient(135deg, #0052cc 0%, #2563eb 100%)' : '#ffffff',
                                                color: currentTab === null ? '#ffffff' : 'var(--text-main)',
                                                borderRadius: 16,
                                                padding: '12px 14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                                                border: '1px solid rgba(0,82,204,0.08)'
                                            }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: {
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: 10,
                                                                background: currentTab === null ? 'rgba(255,255,255,0.2)' : 'rgba(0,82,204,0.1)',
                                                                color: currentTab === null ? '#ffffff' : 'var(--accent-blue)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }, children: _jsx(Home, { size: 16 }) }), _jsx("span", { style: { fontSize: 13, fontWeight: 800 }, children: "Home Dashboard" })] }), _jsx(ChevronRight, { size: 14, opacity: 0.6 })] }), _jsxs("div", { style: { background: '#ffffff', borderRadius: 18, padding: '12px 10px', border: '1px solid rgba(0,82,204,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }, children: [_jsx("span", { style: { fontSize: 10, fontWeight: 900, color: 'var(--accent-blue)', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', padding: '0 6px 8px' }, children: "\uD83C\uDF93 Academics & Exams" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [
                                                        { label: 'Syllabus & Courses', key: 'courses', icon: _jsx(BookOpen, { size: 15 }), color: '#0891b2' },
                                                        { label: 'Academic Calendar', key: 'calendar', icon: _jsx(Calendar, { size: 15 }), color: '#dc2626' },
                                                        { label: 'Class Timetable', key: 'timetable', icon: _jsx(Calendar, { size: 15 }), color: '#0f766e' },
                                                        { label: 'CGPA & Arrears Radar', key: 'academics', icon: _jsx(GraduationCap, { size: 15 }), color: '#059669', badge: 'LIVE' },
                                                        { label: 'NPTEL Course Tracker', key: 'nptel', icon: _jsx(Award, { size: 15 }), color: '#7c3aed' },
                                                    ].map(item => (_jsxs("div", { onClick: () => { handleCardClick(item.key); setIsDrawerOpen(false); }, style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '8px 10px',
                                                            borderRadius: 12,
                                                            cursor: 'pointer',
                                                            background: currentTab === item.key ? 'rgba(0,82,204,0.08)' : 'transparent'
                                                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: { width: 30, height: 30, borderRadius: 8, background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: item.icon }), _jsx("span", { style: { fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)' }, children: item.label })] }), item.badge && (_jsx("span", { style: { fontSize: 9, fontWeight: 900, background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: 6 }, children: item.badge }))] }, item.key))) })] }), _jsxs("div", { style: { background: '#ffffff', borderRadius: 18, padding: '12px 10px', border: '1px solid rgba(0,82,204,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }, children: [_jsx("span", { style: { fontSize: 10, fontWeight: 900, color: '#0052cc', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', padding: '0 6px 8px' }, children: "\uD83D\uDCC2 Records & Documents" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [
                                                        { label: 'Student Document Vault', key: 'profile', icon: _jsx(BookOpen, { size: 15 }), color: '#0052cc' },
                                                        { label: 'Certificates & Badges', key: 'certificates', icon: _jsx(Award, { size: 15 }), color: '#be185d' },
                                                        { label: 'Bonafide & NOC Request', key: 'request-letters', icon: _jsx(FileText, { size: 15 }), color: '#0d9488' },
                                                    ].map(item => (_jsxs("div", { onClick: () => { handleCardClick(item.key); setIsDrawerOpen(false); }, style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '8px 10px',
                                                            borderRadius: 12,
                                                            cursor: 'pointer',
                                                            background: currentTab === item.key ? 'rgba(0,82,204,0.08)' : 'transparent'
                                                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: { width: 30, height: 30, borderRadius: 8, background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: item.icon }), _jsx("span", { style: { fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)' }, children: item.label })] }), _jsx(ChevronRight, { size: 13, opacity: 0.4 })] }, item.key))) })] }), _jsxs("div", { style: { background: '#ffffff', borderRadius: 18, padding: '12px 10px', border: '1px solid rgba(0,82,204,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }, children: [_jsx("span", { style: { fontSize: 10, fontWeight: 900, color: '#ff5f1f', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', padding: '0 6px 8px' }, children: "\u26A1 Services & Quests" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 2 }, children: [
                                                        { label: 'Period Attendance (1–7)', key: 'attendance', icon: _jsx(UserCheck, { size: 15 }), color: '#ff5f1f', badge: 'RADAR' },
                                                        { label: 'Mind Games & Puzzles', key: 'puzzle-games', icon: _jsx(Gamepad2, { size: 15 }), color: '#8b5cf6', badge: 'HOT' },
                                                        { label: 'Career Skill Tree & GATE', key: 'career', icon: _jsx(Zap, { size: 15 }), color: '#d97706', badge: 'TREE' },
                                                        { label: 'Campus & Lab Map', key: 'campus-map', icon: _jsx(Map, { size: 15 }), color: '#2563eb' },
                                                        { label: 'Anonymous Suggestions', key: 'suggestion', icon: _jsx(Inbox, { size: 15 }), color: '#ea580c' },
                                                        { label: 'Faculty Contacts', key: 'faculty', icon: _jsx(Phone, { size: 15 }), color: '#db2777' },
                                                    ].map(item => (_jsxs("div", { onClick: () => { handleCardClick(item.key); setIsDrawerOpen(false); }, style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            padding: '8px 10px',
                                                            borderRadius: 12,
                                                            cursor: 'pointer',
                                                            background: currentTab === item.key ? 'rgba(0,82,204,0.08)' : 'transparent'
                                                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: { width: 30, height: 30, borderRadius: 8, background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: item.icon }), _jsx("span", { style: { fontSize: 12.5, fontWeight: 700, color: 'var(--text-main)' }, children: item.label })] }), item.badge && (_jsx("span", { style: { fontSize: 9, fontWeight: 900, background: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: 6 }, children: item.badge }))] }, item.key))) })] }), isAdmin && (_jsxs("div", { style: { background: '#eff6ff', borderRadius: 18, padding: '12px 10px', border: '1.5px solid rgba(37,99,235,0.25)', boxShadow: '0 4px 12px rgba(37,99,235,0.06)' }, children: [_jsx("span", { style: { fontSize: 10, fontWeight: 900, color: '#1d4ed8', letterSpacing: 0.8, textTransform: 'uppercase', display: 'block', padding: '0 6px 8px' }, children: "\uD83D\uDC68\u200D\uD83C\uDFEB Faculty Administration" }), _jsxs("div", { onClick: () => { handleCardClick('student-manager'); setIsDrawerOpen(false); }, style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '10px 10px',
                                                        borderRadius: 12,
                                                        cursor: 'pointer',
                                                        background: currentTab === 'student-manager' ? 'rgba(37,99,235,0.18)' : '#ffffff',
                                                        border: '1px solid rgba(37,99,235,0.15)'
                                                    }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { style: { width: 32, height: 32, borderRadius: 8, background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(UserCheck, { size: 16 }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 12.5, fontWeight: 800, color: '#1e3a8a' }, children: "Student Database" }), _jsx("div", { style: { fontSize: 10, color: '#3b82f6' }, children: "View & Edit All Students" })] })] }), _jsx("span", { style: { fontSize: 9, fontWeight: 900, background: '#2563eb', color: '#ffffff', padding: '2px 6px', borderRadius: 6 }, children: "VIP" })] })] })), _jsxs("div", { style: { textAlign: 'center', padding: '12px 0 6px', color: '#94a3b8', fontSize: 10.5, fontWeight: 700 }, children: [_jsx("span", { children: "Sri Ramakrishna Engineering College" }), _jsx("span", { style: { display: 'block', fontSize: 9.5, opacity: 0.8, marginTop: 2 }, children: "EEE Department Autonomous \u00B7 v2.4" })] })] })] }) }), document.body), _jsx("main", { className: "mobile-app-content", children: currentTab === null ? (isDesktop ? (_jsx(DesktopVisionaDashboard, { currentUser: currentUser, onOpenTab: handleCardClick })) : (_jsx("div", { className: "home-dashboard-view", children: _jsxs("div", { className: "desktop-primary-col", style: { display: 'flex', flexDirection: 'column', gap: 20 }, children: [_jsx(StudentDetailsCard, { isAuthenticated: isAuthenticated, currentUser: currentUser, onOpenProfile: () => handleCardClick('profile'), onOpenSignIn: () => setShowSignInPage(true), onOpenTab: handleCardClick }), _jsxs("div", { id: "announcements-widget", children: [_jsx("div", { className: "mobile-section-header", children: _jsx("span", { className: "mobile-section-title", children: "\uD83D\uDD14 NOTICE BOARD & EVENTS" }) }), _jsx("div", { style: { background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--card-border)', padding: 12 }, children: _jsx(AnnouncementBanner, { announcements: announcements, isAdmin: isAdmin, onAddAnnouncement: handleAddAnnouncement, onDeleteAnnouncement: handleDeleteAnnouncement, onOpenAnnouncements: () => handleCardClick('announcements') }) })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }, children: [_jsxs("button", { onClick: () => {
                                                    const win = window.open('https://onduty.srecieee.org', '_blank', 'noopener,noreferrer');
                                                    if (!win)
                                                        window.location.href = 'https://onduty.srecieee.org';
                                                }, style: {
                                                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                                    border: '1.5px solid rgba(37, 99, 235, 0.25)',
                                                    borderRadius: 14,
                                                    padding: '12px 6px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
                                                    transition: 'transform 0.15s ease'
                                                }, children: [_jsx("div", { style: { width: 34, height: 34, borderRadius: 10, background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(FileText, { size: 18 }) }), _jsx("span", { style: { fontSize: 12, fontWeight: 800, color: '#1e3a8a' }, children: "Apply OD" })] }), _jsxs("button", { onClick: () => handleCardClick('attendance'), style: {
                                                    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                                                    border: '1.5px solid rgba(234, 88, 12, 0.25)',
                                                    borderRadius: 14,
                                                    padding: '12px 6px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.08)',
                                                    transition: 'transform 0.15s ease'
                                                }, children: [_jsx("div", { style: { width: 34, height: 34, borderRadius: 10, background: '#ea580c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(UserCheck, { size: 18 }) }), _jsx("span", { style: { fontSize: 12, fontWeight: 800, color: '#9a3412' }, children: "Attendance" })] }), _jsxs("button", { onClick: () => handleCardClick('timetable'), style: {
                                                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                                                    border: '1.5px solid rgba(217, 119, 6, 0.25)',
                                                    borderRadius: 14,
                                                    padding: '12px 6px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 6,
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)',
                                                    transition: 'transform 0.15s ease'
                                                }, children: [_jsx("div", { style: { width: 34, height: 34, borderRadius: 10, background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Calendar, { size: 18 }) }), _jsx("span", { style: { fontSize: 12, fontWeight: 800, color: '#78350f' }, children: "Timetable" })] })] }), isAdmin && (_jsxs("div", { onClick: () => handleCardClick('student-manager'), style: {
                                            background: 'linear-gradient(135deg, #1e3a8a 0%, #0052cc 100%)',
                                            borderRadius: 14,
                                            padding: '12px 16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 14px rgba(0, 82, 204, 0.25)',
                                            color: '#ffffff'
                                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12 }, children: [_jsx("div", { style: { width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(UserCheck, { size: 20 }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 13, fontWeight: 900 }, children: "\uD83D\uDC65 Student Database & Dossiers" }), _jsx("div", { style: { fontSize: 10.5, opacity: 0.85 }, children: "Search, edit, add, or delete department students" })] })] }), _jsx("span", { style: { fontSize: 10, fontWeight: 900, background: '#ffffff', color: '#0052cc', padding: '3px 8px', borderRadius: 99 }, children: "MANAGE" })] })), filteredCategories.map((cat, idx) => (_jsxs("div", { className: "category-folder-card", children: [_jsx("div", { className: "mobile-section-header", children: _jsx("span", { className: "mobile-section-title", children: cat.title }) }), _jsx("div", { className: "mobile-grid-4col", children: cat.items.map((item) => (_jsxs("div", { className: "mobile-app-tile", style: {
                                                        position: 'relative',
                                                        boxShadow: `0 2px 10px rgba(0,0,0,0.04), inset 0 0 0 1.5px ${item.color}30`,
                                                        border: `1.5px solid ${item.color}25`,
                                                    }, onClick: () => handleCardClick(item.key), children: [_jsx("div", { className: "mobile-tile-icon", style: { background: item.bg, color: item.color }, children: item.icon }), _jsx("span", { className: "mobile-tile-label", children: item.label })] }, item.key))) })] }, idx))), _jsxs("footer", { className: "app-global-footer", children: [_jsxs("div", { className: "footer-links-row", children: [_jsx("button", { className: "footer-link-btn", onClick: () => handleCardClick('home'), children: "Home" }), _jsx("button", { className: "footer-link-btn", onClick: () => handleCardClick('academics'), children: "Academics" }), _jsx("button", { className: "footer-link-btn", onClick: () => handleCardClick('attendance'), children: "Attendance" }), _jsx("button", { className: "footer-link-btn", onClick: () => handleCardClick('timetable'), children: "Timetable" }), _jsx("button", { className: "footer-link-btn", onClick: () => handleCardClick('college-rules'), children: "Rules" }), _jsx("button", { className: "footer-link-btn", onClick: () => handleCardClick('suggestion'), children: "Suggestion Box" })] }), _jsxs("div", { className: "footer-contact-info", children: [_jsxs("span", { children: ["Email: ", _jsx("a", { href: "mailto:hod.eee@srec.ac.in", children: "hod.eee@srec.ac.in" })] }), _jsxs("span", { children: ["Phone: ", _jsx("a", { href: "tel:+914222460088", children: "+91 422 246 0088" })] })] }), _jsx("p", { className: "footer-copy-text", children: `\u00A9 ${new Date().getFullYear()} Sri Ramakrishna Engineering College \u00B7 Department of EEE. All rights reserved.` })] })] }) }))) : (_jsx("div", { className: "dedicated-page-view page-slide-enter", children: _jsxs("div", { className: "dedicated-page-body", children: [currentTab === 'ai' && _jsx(AIChatbot, { isFullPage: true }), currentTab === 'announcements' && (_jsx("div", { style: { background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--card-border)', padding: 16 }, children: _jsx(AnnouncementBanner, { announcements: announcements, isAdmin: isAdmin, onAddAnnouncement: handleAddAnnouncement, onDeleteAnnouncement: handleDeleteAnnouncement }) })), currentTab === 'profile-details' && _jsx(ProfileDocs, { currentEmail: currentUser?.email || 'student@eee.com', isAdmin: isAdmin, onBack: handleCloseModal, mode: "profile", currentUser: currentUser, onUpdateUser: (updated) => setCurrentUser(updated) }), currentTab === 'profile' && _jsx(ProfileDocs, { currentEmail: currentUser?.email || 'student@eee.com', isAdmin: isAdmin, onBack: handleCloseModal, mode: "documents" }), currentTab === 'certificates' && _jsx(ProfileDocs, { currentEmail: currentUser?.email || 'student@eee.com', isAdmin: isAdmin, onBack: handleCloseModal, mode: "certificates" }), currentTab === 'request-letters' && _jsx(RequestLetters, { onBack: handleCloseModal, currentEmail: currentUser?.email || 'student@eee.com', currentName: currentUser?.name || 'Nithin Annamalai', currentRollNo: currentUser?.rollNo || '71812503104', isAdmin: isAdmin }), currentTab === 'lab-finder' && _jsx(LabSeatFinder, { onBack: handleCloseModal, rollNo: currentUser?.rollNo || '71812503104' }), currentTab === 'cgpa-calc' && _jsx(GpaCalculator, { onBack: handleCloseModal }), currentTab === 'attendance' && _jsx(AttendanceTracker, { currentStudentRollNo: currentUser?.rollNo || '71812503104', currentUserName: currentUser?.name || 'Nithin Annamalai', isAdmin: isAdmin, onBack: handleCloseModal }), currentTab === 'nptel' && _jsx(NptelTracker, { currentEmail: currentUser?.email || 'student@eee.com', isAdmin: isAdmin, onBack: handleCloseModal }), currentTab === 'academics' && _jsx(AcademicsTracker, { currentEmail: currentUser?.email || 'student@eee.com', isAdmin: isAdmin, onBack: handleCloseModal }), currentTab === 'career' && _jsx(CareerHub, { onBack: handleCloseModal, isAdmin: isAdmin }), currentTab === 'courses' && _jsx(AcademicCalendar, { onBack: handleCloseModal, isAdmin: isAdmin, viewMode: "courses", initialEditMode: academicInitEdit }), currentTab === 'calendar' && _jsx(AcademicCalendar, { onBack: handleCloseModal, isAdmin: isAdmin, viewMode: "calendar", initialEditMode: academicInitEdit }), currentTab === 'timetable' && _jsx(Timetable, { onBack: handleCloseModal, isAdmin: isAdmin, semester: 3 }), currentTab === 'tasks' && _jsx(TaskList, { onBack: handleCloseModal, currentEmail: currentUser?.email || 'user' }), currentTab === 'puzzle-games' && _jsx(PuzzleGames, { onBack: handleCloseModal }), currentTab === 'suggestion' && (_jsx(SuggestionBox, { onClose: handleCloseModal, userName: currentUser?.name || 'Guest' })), currentTab === 'campus-map' && _jsx(CampusMapPanel, { onClose: handleCloseModal, isAdmin: isAdmin }), currentTab === 'college-rules' && _jsx(CollegeRulesPanel, { onClose: handleCloseModal, isAdmin: isAdmin }), currentTab === 'faculty' && _jsx(FacultyPanel, { onClose: handleCloseModal, isAdmin: isAdmin }), currentTab === 'student-manager' && _jsx(StudentManager, { onBack: handleCloseModal, isAdmin: isAdmin, currentUser: currentUser }), !['ai', 'announcements', 'profile-details', 'profile', 'certificates', 'request-letters', 'lab-finder', 'cgpa-calc', 'attendance', 'nptel', 'academics', 'career', 'courses', 'calendar', 'timetable', 'tasks', 'puzzle-games', 'suggestion', 'campus-map', 'college-rules', 'faculty', 'student-manager'].includes(currentTab) && (_jsxs("div", { className: "not-found-view", children: [_jsx("div", { style: { fontSize: 44, marginBottom: 12 }, children: "\uD83E\uDDED" }), _jsx("h3", { style: { fontSize: 18, fontWeight: 800 }, children: "Feature Not Found" }), _jsx("p", { style: { fontSize: 12, color: 'var(--text-muted)', maxWidth: 280, margin: '8px 0 20px' }, children: "The requested section does not exist or has been relocated." }), _jsx("button", { className: "cta-button", onClick: () => handleCardClick('home'), children: "Back to Home Hub" })] }))] }) })) }), currentTab !== 'ai' && _jsx(AIChatbot, {}), _jsxs("nav", { className: "mobile-bottom-nav", children: [_jsxs("button", { className: `bottom-tab-item ${activeBottomNav === 'home' && currentTab === null ? 'active' : ''}`, onClick: () => { setActiveBottomNav('home'); setCurrentTab(null); }, children: [_jsx(Home, { size: 20 }), _jsx("span", { className: "bottom-tab-label", children: "Home" })] }), _jsxs("button", { className: `bottom-tab-item ${currentTab === 'academics' || currentTab === 'courses' ? 'active' : ''}`, onClick: () => { setActiveBottomNav('academics'); handleCardClick('academics'); }, children: [_jsx(GraduationCap, { size: 20 }), _jsx("span", { className: "bottom-tab-label", children: "Academics" })] }), _jsxs("button", { className: `bottom-tab-item ${currentTab === 'attendance' ? 'active' : ''}`, onClick: () => { setActiveBottomNav('attendance'); handleCardClick('attendance'); }, children: [_jsx(UserCheck, { size: 20 }), _jsx("span", { className: "bottom-tab-label", children: "Attendance" })] }), _jsxs("button", { className: `bottom-tab-item ${currentTab === 'puzzle-games' ? 'active' : ''}`, onClick: () => { setActiveBottomNav('puzzle-games'); handleCardClick('puzzle-games'); }, children: [_jsx(Gamepad2, { size: 20 }), _jsx("span", { className: "bottom-tab-label", children: "Mind Games" })] }), _jsxs("button", { className: `bottom-tab-item ${currentTab === 'profile-details' ? 'active' : ''}`, onClick: () => { setActiveBottomNav('profile'); handleCardClick('profile-details'); }, children: [_jsx(User, { size: 20 }), _jsx("span", { className: "bottom-tab-label", children: "Profile" })] })] }), showSignInPage && (_jsx(SignInPage, { onClose: () => setShowSignInPage(false), onLoginSuccess: handleLoginSuccess, demoProfiles: USER_PROFILES }))] })] }));
}
// ── Suggestion Box Panel ──────────────────────────────
function SuggestionBox({ onClose }) {
    const [cat, setCat] = useState('Academic');
    const [msg, setMsg] = useState('');
    const [done, setDone] = useState(false);
    const submit = () => {
        if (msg.trim())
            setDone(true);
    };
    return (_jsxs("div", { style: { padding: 24, maxWidth: 440, margin: '0 auto' }, children: [_jsx("h3", { style: { margin: '0 0 4px 0', fontSize: 18, fontWeight: 800 }, children: "\uD83D\uDCAC Anonymous Suggestion Box" }), _jsx("p", { style: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }, children: "Your feedback is confidential. Share freely with department administration." }), done ? (_jsxs("div", { style: { textAlign: 'center', padding: '30px 0' }, children: [_jsx(CheckCircle2, { size: 48, color: "#059669", style: { marginBottom: 12 } }), _jsx("h4", { style: { color: '#059669', margin: '0 0 8px 0' }, children: "Suggestion Submitted!" }), _jsx("p", { style: { color: 'var(--text-muted)', fontSize: 12 }, children: "Thank you. Your suggestion has been sent directly to the HOD office." }), _jsx("button", { className: "cta-button", style: { marginTop: 16 }, onClick: onClose, children: "Return to Mobile Hub" })] })) : (_jsxs(_Fragment, { children: [_jsx("label", { style: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }, children: "Category" }), _jsx("div", { style: { display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0 16px' }, children: ['Academic', 'Infrastructure', 'Faculty', 'Lab Equipments', 'Other'].map(c => (_jsx("button", { onClick: () => setCat(c), style: {
                                padding: '6px 12px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontSize: 11, fontWeight: 600,
                                borderColor: cat === c ? 'var(--accent-blue)' : 'var(--card-border)',
                                background: cat === c ? 'var(--accent-blue)' : 'transparent',
                                color: cat === c ? '#fff' : 'var(--text-muted)'
                            }, children: c }, c))) }), _jsx("label", { style: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }, children: "Your Suggestion / Feedback" }), _jsx("textarea", { value: msg, onChange: e => setMsg(e.target.value), placeholder: "Describe your issue or suggestion for EEE department...", style: {
                            width: '100%', minHeight: 110, marginTop: 8, padding: 12, borderRadius: 12,
                            border: '1.5px solid var(--card-border)', fontSize: 12, resize: 'vertical',
                            fontFamily: 'inherit', background: 'var(--bg-secondary)', color: 'var(--text-main)', boxSizing: 'border-box'
                        } }), _jsx("button", { className: "cta-button", style: { marginTop: 16, width: '100%' }, onClick: submit, children: "Submit Suggestion" })] }))] }));
}
function CampusMapPanel({ onClose: _onClose, isAdmin = false }) {
    const [labs, setLabs] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newBlock, setNewBlock] = useState('');
    const [newIcon, setNewIcon] = useState('⚡');
    useEffect(() => {
        dbService.getLabs().then(setLabs);
    }, []);
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim() || !newBlock.trim())
            return;
        const saved = await dbService.saveLab({ name: newName.trim(), block: newBlock.trim(), icon: newIcon.trim() });
        setLabs(prev => [...prev, saved]);
        setNewName('');
        setNewBlock('');
        setNewIcon('⚡');
        setShowAddForm(false);
    };
    const handleDelete = async (id) => {
        if (!id || !window.confirm('Delete this facility entry?'))
            return;
        await dbService.deleteLab(id);
        setLabs(prev => prev.filter(l => l.id !== id));
    };
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }, children: [_jsx("h3", { style: { margin: 0, fontSize: 18, fontWeight: 800 }, children: "\uD83D\uDDFA\uFE0F EEE Campus & Lab Facilities" }), isAdmin && (_jsx("button", { onClick: () => setEditMode(e => !e), style: {
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            border: `1.5px solid ${editMode ? '#f87171' : 'var(--accent-blue)'}`,
                            background: editMode ? 'rgba(248,113,113,0.12)' : 'rgba(56,189,248,0.12)',
                            color: editMode ? '#f87171' : 'var(--accent-blue)',
                        }, children: editMode ? _jsxs(_Fragment, { children: [_jsx(X, { size: 12 }), " Done"] }) : _jsxs(_Fragment, { children: [_jsx(Pencil, { size: 12 }), " Edit"] }) }))] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, children: [_jsx("p", { style: { fontSize: 11, color: 'var(--text-muted)', margin: 0 }, children: "Sri Ramakrishna Engineering College \u00B7 EEE Department" }), editMode && (_jsxs("button", { onClick: () => setShowAddForm(v => !v), style: { display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: 'var(--accent-blue)', color: '#fff', border: 'none' }, children: [_jsx(Plus, { size: 11 }), " Add Facility"] }))] }), editMode && showAddForm && (_jsxs("form", { onSubmit: handleAdd, style: { background: 'var(--bg-secondary)', borderRadius: 10, padding: 12, border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 15 }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 8 }, children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Icon" }), _jsx("input", { value: newIcon, onChange: e => setNewIcon(e.target.value), className: "form-input", placeholder: "\u26A1", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Facility Name" }), _jsx("input", { value: newName, onChange: e => setNewName(e.target.value), className: "form-input", placeholder: "e.g. Virtual Reality Lab", required: true, style: { fontSize: 11 } })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Location / Block" }), _jsx("input", { value: newBlock, onChange: e => setNewBlock(e.target.value), className: "form-input", placeholder: "e.g. Block C, 2F", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { style: { display: 'flex', gap: 6 }, children: [_jsx("button", { type: "submit", className: "btn-primary", style: { flex: 1, fontSize: 11 }, children: "Save Facility" }), _jsx("button", { type: "button", onClick: () => setShowAddForm(false), className: "btn-secondary", style: { fontSize: 11 }, children: "Cancel" })] })] })), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }, children: labs.map((l, i) => (_jsxs("div", { style: { background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 4, position: 'relative' }, children: [editMode && (_jsx("button", { onClick: () => handleDelete(l.id), style: { position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }, children: _jsx(Trash2, { size: 13 }) })), _jsx("span", { style: { fontSize: 24 }, children: l.icon }), _jsx("span", { style: { fontWeight: 700, fontSize: 12, paddingRight: editMode ? 20 : 0 }, children: l.name }), _jsx("span", { style: { fontSize: 10, color: 'var(--text-muted)' }, children: l.block })] }, l.id ?? i))) })] }));
}
// ── College Rules Panel ───────────────────────────────
function CollegeRulesPanel({ onClose: _onClose, isAdmin = false }) {
    const [rules, setRules] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newIcon, setNewIcon] = useState('📜');
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    useEffect(() => {
        dbService.getRules().then(setRules);
    }, []);
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDesc.trim())
            return;
        const saved = await dbService.saveRule({ icon: newIcon.trim(), title: newTitle.trim(), desc: newDesc.trim() });
        setRules(prev => [...prev, saved]);
        setNewIcon('📜');
        setNewTitle('');
        setNewDesc('');
        setShowAddForm(false);
    };
    const handleDelete = async (id) => {
        if (!id || !window.confirm('Delete this rule?'))
            return;
        await dbService.deleteRule(id);
        setRules(prev => prev.filter(r => r.id !== id));
    };
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }, children: [_jsx("h3", { style: { margin: 0, fontSize: 18, fontWeight: 800 }, children: "\uD83D\uDEE1\uFE0F Rules & Code of Conduct" }), isAdmin && (_jsx("button", { onClick: () => setEditMode(e => !e), style: {
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            border: `1.5px solid ${editMode ? '#f87171' : 'var(--accent-blue)'}`,
                            background: editMode ? 'rgba(248,113,113,0.12)' : 'rgba(56,189,248,0.12)',
                            color: editMode ? '#f87171' : 'var(--accent-blue)',
                        }, children: editMode ? _jsxs(_Fragment, { children: [_jsx(X, { size: 12 }), " Done"] }) : _jsxs(_Fragment, { children: [_jsx(Pencil, { size: 12 }), " Edit"] }) }))] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, children: [_jsx("p", { style: { fontSize: 11, color: 'var(--text-muted)', margin: 0 }, children: "EEE Department, SREC Academic Guidelines" }), editMode && (_jsxs("button", { onClick: () => setShowAddForm(v => !v), style: { display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: 'var(--accent-blue)', color: '#fff', border: 'none' }, children: [_jsx(Plus, { size: 11 }), " Add Rule"] }))] }), editMode && showAddForm && (_jsxs("form", { onSubmit: handleAdd, style: { background: 'var(--bg-secondary)', borderRadius: 10, padding: 12, border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 15 }, children: [_jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 8 }, children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Icon" }), _jsx("input", { value: newIcon, onChange: e => setNewIcon(e.target.value), className: "form-input", placeholder: "\uD83D\uDCDC", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Rule Title" }), _jsx("input", { value: newTitle, onChange: e => setNewTitle(e.target.value), className: "form-input", placeholder: "e.g. Lab Dress code", required: true, style: { fontSize: 11 } })] })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Rule Description" }), _jsx("input", { value: newDesc, onChange: e => setNewDesc(e.target.value), className: "form-input", placeholder: "e.g. Always wear closed shoes", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { style: { display: 'flex', gap: 6 }, children: [_jsx("button", { type: "submit", className: "btn-primary", style: { flex: 1, fontSize: 11 }, children: "Save Rule" }), _jsx("button", { type: "button", onClick: () => setShowAddForm(false), className: "btn-secondary", style: { fontSize: 11 }, children: "Cancel" })] })] })), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: rules.map((r, i) => (_jsxs("div", { style: { display: 'flex', gap: 12, background: 'var(--bg-secondary)', border: '1px solid var(--card-border)', borderRadius: 12, padding: '12px 14px', alignItems: 'flex-start', position: 'relative' }, children: [_jsx("span", { style: { fontSize: 22, flexShrink: 0 }, children: r.icon }), _jsxs("div", { style: { flex: 1, paddingRight: editMode ? 24 : 0 }, children: [_jsx("div", { style: { fontWeight: 700, fontSize: 12, marginBottom: 2 }, children: r.title }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }, children: r.desc })] }), editMode && (_jsx("button", { onClick: () => handleDelete(r.id), style: { position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }, children: _jsx(Trash2, { size: 13 }) }))] }, r.id ?? i))) })] }));
}
// ── Faculty Contacts Panel ────────────────────────────
function FacultyPanel({ onClose: _onClose, isAdmin = false }) {
    const [faculty, setFaculty] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    useEffect(() => {
        dbService.getFaculty().then(setFaculty);
    }, []);
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim() || !newRole.trim() || !newEmail.trim() || !newPhone.trim())
            return;
        const saved = await dbService.saveFaculty({ name: newName.trim(), role: newRole.trim(), email: newEmail.trim(), phone: newPhone.trim() });
        setFaculty(prev => [...prev, saved]);
        setNewName('');
        setNewRole('');
        setNewEmail('');
        setNewPhone('');
        setShowAddForm(false);
    };
    const handleDelete = async (id) => {
        if (!id || !window.confirm('Delete this faculty record?'))
            return;
        await dbService.deleteFaculty(id);
        setFaculty(prev => prev.filter(f => f.id !== id));
    };
    return (_jsxs("div", { style: { padding: 20 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }, children: [_jsx("h3", { style: { margin: 0, fontSize: 18, fontWeight: 800 }, children: "\uD83D\uDCDE Faculty Directory" }), isAdmin && (_jsx("button", { onClick: () => setEditMode(e => !e), style: {
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '3px 8px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                            border: `1.5px solid ${editMode ? '#f87171' : 'var(--accent-blue)'}`,
                            background: editMode ? 'rgba(248,113,113,0.12)' : 'rgba(56,189,248,0.12)',
                            color: editMode ? '#f87171' : 'var(--accent-blue)',
                        }, children: editMode ? _jsxs(_Fragment, { children: [_jsx(X, { size: 12 }), " Done"] }) : _jsxs(_Fragment, { children: [_jsx(Pencil, { size: 12 }), " Edit"] }) }))] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, children: [_jsx("p", { style: { fontSize: 11, color: 'var(--text-muted)', margin: 0 }, children: "EEE Department Professors & Mentors" }), editMode && (_jsxs("button", { onClick: () => setShowAddForm(v => !v), style: { display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: 'var(--accent-blue)', color: '#fff', border: 'none' }, children: [_jsx(Plus, { size: 11 }), " Add Faculty"] }))] }), editMode && showAddForm && (_jsxs("form", { onSubmit: handleAdd, style: { background: 'var(--bg-secondary)', borderRadius: 10, padding: 12, border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 15 }, children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Full Name" }), _jsx("input", { value: newName, onChange: e => setNewName(e.target.value), className: "form-input", placeholder: "e.g. Dr. A. Rajan", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Designation / Specialization" }), _jsx("input", { value: newRole, onChange: e => setNewRole(e.target.value), className: "form-input", placeholder: "e.g. Professor - Power Electronics", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: [_jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Email Address" }), _jsx("input", { type: "email", value: newEmail, onChange: e => setNewEmail(e.target.value), className: "form-input", placeholder: "rajan@srec.ac.in", required: true, style: { fontSize: 11 } })] }), _jsxs("div", { children: [_jsx("label", { className: "form-label", children: "Mobile Number" }), _jsx("input", { value: newPhone, onChange: e => setNewPhone(e.target.value), className: "form-input", placeholder: "+91-98400-12345", required: true, style: { fontSize: 11 } })] })] }), _jsxs("div", { style: { display: 'flex', gap: 6 }, children: [_jsx("button", { type: "submit", className: "btn-primary", style: { flex: 1, fontSize: 11 }, children: "Save Faculty" }), _jsx("button", { type: "button", onClick: () => setShowAddForm(false), className: "btn-secondary", style: { fontSize: 11 }, children: "Cancel" })] })] })), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: faculty.map((f, i) => (_jsxs("div", { style: {
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--card-border)',
                        borderRadius: 16,
                        padding: '16px 14px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                    }, children: [editMode && (_jsx("button", { onClick: () => handleDelete(f.id), style: { position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#f87171' }, children: _jsx(Trash2, { size: 14 }) })), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 68, flexShrink: 0 }, children: [_jsx("div", { style: {
                                        width: 52,
                                        height: 52,
                                        borderRadius: '50%',
                                        background: `hsl(${i * 60}, 60%, 85%)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 22,
                                        fontWeight: 900,
                                        color: '#111',
                                        boxShadow: `0 0 0 3px hsl(${i * 60}, 50%, 75%)40`,
                                    }, children: f.name.charAt(0) }), _jsx("div", { style: { fontWeight: 800, fontSize: 13, color: 'var(--text-main)', textAlign: 'center', lineHeight: 1.3, maxWidth: 80 }, children: f.name })] }), _jsx("div", { style: { width: 1, alignSelf: 'stretch', background: 'var(--card-border)', flexShrink: 0 } }), _jsxs("div", { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 700, color: 'var(--accent-blue)', lineHeight: 1.3 }, children: f.role }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }, children: "Dept of EEE \u00B7 SREC" }), _jsxs("a", { href: `mailto:${f.email}`, style: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }, children: ["\u2709\uFE0F ", f.email] }), _jsxs("a", { href: `tel:${(f.phone || '').replace(/[^0-9+]/g, '')}`, style: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }, children: ["\uD83D\uDCF1 ", f.phone] })] })] }, f.id ?? i))) })] }));
}
export default App;
