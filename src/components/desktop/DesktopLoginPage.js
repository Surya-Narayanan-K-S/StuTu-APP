import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Eye, EyeOff, Sparkles, UserCheck, User, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import appLogo from '../../assets/app-logo.png';
import cosmicBg from '../../assets/cosmic-planet.jpg';
export const DesktopLoginPage = ({ onClose, onLoginSuccess, demoProfiles, initialIsSignUp = false }) => {
    const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
    const [email, setEmail] = useState('student@eee.com');
    const [name, setName] = useState('Nithin Annamalai');
    const [rollNo, setRollNo] = useState('71812503104');
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const quotes = [
        "“Engineering is the closest thing to magic that exists in the world.” – Elon Musk",
        "“Education is the passport to the future, for tomorrow belongs to those who prepare for it today.” – Malcolm X",
        "“Continuous learning is the minimum requirement for success in any field.” – Brian Tracy",
    ];
    const [quoteIndex, setQuoteIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % quotes.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const targetEmail = email.trim();
        const targetPassword = password.trim();
        const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
        if (isSignUp) {
            if (!name.trim() || !rollNo.trim()) {
                setError('Please fill in your name and roll number.');
                setLoading(false);
                return;
            }
            if (isSupabaseConfigured) {
                try {
                    const { data, error: signUpError } = await supabase.auth.signUp({
                        email: targetEmail,
                        password: targetPassword,
                        options: {
                            data: {
                                name: name.trim(),
                                rollNo: rollNo.trim(),
                            }
                        }
                    });
                    if (signUpError) {
                        onLoginSuccess({
                            email: targetEmail,
                            name: name.trim(),
                            rollNo: rollNo.trim(),
                            role: targetEmail.toLowerCase() === 'teacher@eee.com' ? 'teacher' : 'student',
                            className: 'II EEE-B',
                            yearOfStudy: '2nd Year',
                            semester: 'Semester III',
                            department: 'Dept of EEE'
                        });
                        setLoading(false);
                        return;
                    }
                    if (data?.user) {
                        onLoginSuccess({
                            email: targetEmail,
                            name: name.trim(),
                            rollNo: rollNo.trim(),
                            role: targetEmail.toLowerCase() === 'teacher@eee.com' ? 'teacher' : 'student',
                            className: 'II EEE-B',
                            yearOfStudy: '2nd Year',
                            semester: 'Semester III',
                            department: 'Dept of EEE'
                        });
                        setLoading(false);
                        return;
                    }
                }
                catch (err) {
                    console.warn('Sign up fallback:', err);
                }
            }
            onLoginSuccess({
                email: targetEmail,
                name: name.trim(),
                rollNo: rollNo.trim(),
                role: targetEmail.toLowerCase() === 'teacher@eee.com' ? 'teacher' : 'student',
                className: 'II EEE-B',
                yearOfStudy: '2nd Year',
                semester: 'Semester III',
                department: 'Dept of EEE'
            });
            setLoading(false);
            return;
        }
        // SIGN IN
        if (isSupabaseConfigured) {
            try {
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email: targetEmail,
                    password: targetPassword,
                });
                if (signInError) {
                    const matchedDemo = demoProfiles.find(p => p.email.toLowerCase() === targetEmail.toLowerCase());
                    if (matchedDemo) {
                        onLoginSuccess(matchedDemo);
                        setLoading(false);
                        return;
                    }
                    onLoginSuccess({
                        email: targetEmail,
                        name: targetEmail.split('@')[0].toUpperCase(),
                        rollNo: '71812503104',
                        role: targetEmail.toLowerCase() === 'teacher@eee.com' ? 'teacher' : 'student',
                        className: 'II EEE-B',
                        yearOfStudy: '2nd Year',
                        semester: 'Semester III',
                        department: 'Dept of EEE'
                    });
                    setLoading(false);
                    return;
                }
                if (data?.user) {
                    const userMeta = data.user.user_metadata || {};
                    onLoginSuccess({
                        email: data.user.email || targetEmail,
                        name: userMeta.name || targetEmail.split('@')[0].toUpperCase(),
                        rollNo: userMeta.rollNo || '71812503104',
                        role: targetEmail.toLowerCase() === 'teacher@eee.com' ? 'teacher' : 'student',
                        className: 'II EEE-B',
                        yearOfStudy: '2nd Year',
                        semester: 'Semester III',
                        department: 'Dept of EEE'
                    });
                    setLoading(false);
                    return;
                }
            }
            catch (err) {
                console.warn('Sign in exception:', err);
            }
        }
        const matchedDemo = demoProfiles.find(p => p.email.toLowerCase() === targetEmail.toLowerCase());
        if (matchedDemo) {
            onLoginSuccess(matchedDemo);
        }
        else {
            onLoginSuccess({
                email: targetEmail,
                name: targetEmail.split('@')[0].toUpperCase(),
                rollNo: '71812503104',
                role: targetEmail.toLowerCase() === 'teacher@eee.com' ? 'teacher' : 'student',
                className: 'II EEE-B',
                yearOfStudy: '2nd Year',
                semester: 'Semester III',
                department: 'Dept of EEE'
            });
        }
        setLoading(false);
    };
    const _fillDemo = (profile) => {
        setEmail(profile.email);
        setName(profile.name);
        setRollNo(profile.rollNo);
        setPassword('password123');
        setIsSignUp(false);
    };
    void _fillDemo;
    return (_jsx("div", { className: "cosmic-login-fullscreen", style: {
            backgroundImage: `linear-gradient(180deg, rgba(3,5,12,0.8) 0%, rgba(3,5,12,0.92) 100%), url(${cosmicBg})`,
        }, children: _jsxs("div", { className: "cosmic-login-card", children: [_jsxs("div", { className: "cosmic-login-left", children: [_jsxs("button", { className: "cosmic-back-btn", onClick: onClose, children: [_jsx(ArrowLeft, { size: 16 }), " Back to Space Landing"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 16, margin: '30px 0 24px' }, children: [_jsx("div", { className: "cosmic-login-logo", children: _jsx("img", { src: appLogo, alt: "TutorWard Logo", style: { width: '100%', height: '100%', objectFit: 'cover' } }) }), _jsxs("div", { children: [_jsx("h2", { style: { fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: -0.5 }, children: "TutorWard" }), _jsx("p", { style: { fontSize: 13, color: '#60a5fa', margin: 0, fontWeight: 700 }, children: "Sri Ramakrishna Eng. College \u00B7 Dept of EEE" })] })] }), _jsxs("div", { className: "cosmic-quote-box", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', marginBottom: 8 }, children: [_jsx(Sparkles, { size: 14 }), " ACADEMIC INSPIRATION"] }), _jsx("p", { style: { fontSize: 14, color: '#e2e8f0', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }, children: quotes[quoteIndex] })] }), _jsxs("div", { style: { display: 'flex', gap: 10, flexWrap: 'wrap' }, children: [_jsxs("span", { className: "cosmic-pill-badge", children: [_jsx(ShieldCheck, { size: 14, style: { color: '#4ade80' } }), " NAAC A+ Grade"] }), _jsxs("span", { className: "cosmic-pill-badge", children: [_jsx(ShieldCheck, { size: 14, style: { color: '#60a5fa' } }), " NBA Accredited"] }), _jsxs("span", { className: "cosmic-pill-badge", children: [_jsx(ShieldCheck, { size: 14, style: { color: '#c084fc' } }), " Anna University"] })] })] }), _jsxs("div", { className: "cosmic-login-right", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }, children: [_jsxs("div", { children: [_jsx("h2", { style: { fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0 }, children: isSignUp ? 'Create Account' : 'Portal Login' }), _jsx("p", { style: { fontSize: 12, color: '#94a3b8', margin: '4px 0 0 0' }, children: "Enter credentials to access academic workspace" })] }), _jsx("button", { onClick: onClose, className: "cosmic-close-icon", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "cosmic-auth-toggle", children: [_jsx("button", { className: `cosmic-toggle-btn ${!isSignUp ? 'active' : ''}`, onClick: () => setIsSignUp(false), children: "Sign In" }), _jsx("button", { className: `cosmic-toggle-btn ${isSignUp ? 'active' : ''}`, onClick: () => setIsSignUp(true), children: "Register Account" })] }), error && (_jsxs("div", { style: { background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, marginBottom: 16 }, children: ["\u26A0\uFE0F ", error] })), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: 14 }, children: [isSignUp && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "cosmic-field-group", children: [_jsx("label", { children: "Full Name" }), _jsxs("div", { className: "cosmic-input-wrapper", children: [_jsx(User, { size: 16, className: "cosmic-input-icon" }), _jsx("input", { type: "text", className: "cosmic-input", placeholder: "e.g. Nithin Annamalai", value: name, onChange: e => setName(e.target.value), required: true })] })] }), _jsxs("div", { className: "cosmic-field-group", children: [_jsx("label", { children: "Roll Number" }), _jsxs("div", { className: "cosmic-input-wrapper", children: [_jsx(UserCheck, { size: 16, className: "cosmic-input-icon" }), _jsx("input", { type: "text", className: "cosmic-input", placeholder: "e.g. 71812503104", value: rollNo, onChange: e => setRollNo(e.target.value), required: true })] })] })] })), _jsxs("div", { className: "cosmic-field-group", children: [_jsx("label", { children: "College Email Address" }), _jsxs("div", { className: "cosmic-input-wrapper", children: [_jsx(Mail, { size: 16, className: "cosmic-input-icon" }), _jsx("input", { type: "email", className: "cosmic-input", placeholder: "student@eee.com", value: email, onChange: e => setEmail(e.target.value), required: true })] })] }), _jsxs("div", { className: "cosmic-field-group", children: [_jsx("label", { children: "Account Password" }), _jsxs("div", { className: "cosmic-input-wrapper", children: [_jsx(Lock, { size: 16, className: "cosmic-input-icon" }), _jsx("input", { type: showPassword ? 'text' : 'password', className: "cosmic-input", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: e => setPassword(e.target.value), required: true }), _jsx("button", { type: "button", className: "cosmic-eye-btn", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] })] }), _jsxs("button", { type: "submit", className: "cosmic-login-submit-btn", disabled: loading, children: [loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In to Portal', " ", _jsx(ArrowRight, { size: 16 })] })] }), _jsxs("div", { style: { marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }, children: [_jsx("span", { style: { fontSize: 10, fontWeight: 900, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }, children: "\u26A1 1-CLICK DEV DEMO SIGN IN" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: demoProfiles.map((p, idx) => (_jsxs("button", { type: "button", onClick: () => onLoginSuccess(p), className: "cosmic-demo-btn", style: { cursor: 'pointer' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("div", { style: { fontSize: 11, fontWeight: 800, color: p.role === 'teacher' ? '#fb923c' : '#60a5fa' }, children: p.role === 'teacher' ? '👨‍🏫 Faculty Admin' : '🎓 UG Student' }), _jsx("span", { style: { fontSize: 8, fontWeight: 800, background: '#2563eb', color: '#fff', padding: '1px 5px', borderRadius: 4 }, children: "INSTANT" })] }), _jsx("div", { style: { fontSize: 12, fontWeight: 700, color: '#ffffff', marginTop: 2 }, children: p.name }), _jsx("div", { style: { fontSize: 10, color: '#94a3b8' }, children: p.email })] }, idx))) })] })] })] }) }));
};
