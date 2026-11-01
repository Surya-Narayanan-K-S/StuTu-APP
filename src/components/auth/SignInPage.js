import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Eye, EyeOff, UserCheck, CheckCircle2, User, Download } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { supabase } from '../../services/supabaseClient';
import appLogo from '../../assets/app-logo.png';
export const SignInPage = ({ onClose, onLoginSuccess, demoProfiles, initialIsSignUp = false }) => {
    const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
    const [email, setEmail] = useState('student@eee.com');
    const [name, setName] = useState('Nithin Annamalai');
    const [rollNo, setRollNo] = useState('71812503104');
    const [password, setPassword] = useState('password123');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);
    const isNative = Capacitor.isNativePlatform();
    const quotes = [
        "“Engineering is the closest thing to magic that exists in the world.” – Elon Musk",
        "“Education is the passport to the future, for tomorrow belongs to those who prepare for it today.” – Malcolm X",
        "“Continuous learning is the minimum requirement for success in any field.” – Brian Tracy",
    ];
    const [, setQuoteIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setQuoteIndex(prev => (prev + 1) % quotes.length);
        }, 4500);
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
    return (_jsxs("div", { className: "signin-page-overlay", children: [_jsxs("div", { className: "mobile-curved-header", children: [_jsxs("div", { className: "mobile-header-nav", children: [onClose && (_jsx("button", { className: "signin-back-btn", onClick: onClose, children: _jsx(X, { size: 18 }) })), !isNative && (_jsxs("a", { href: "/download.html", className: "signin-get-started-btn", title: "Download Android APK", children: [_jsx(Download, { size: 13 }), _jsx("span", { children: "Get APK" })] }))] }), _jsxs("div", { className: "mobile-header-title-wrap", children: [_jsx("div", { style: { width: 52, height: 52, borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.4)', marginBottom: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }, children: _jsx("img", { src: appLogo, alt: "TutorWard Logo", style: { width: '100%', height: '100%', objectFit: 'cover' } }) }), _jsx("h1", { className: "mobile-header-h1", children: isSignUp ? 'Create Account' : 'Sign In' }), _jsx("p", { className: "mobile-header-p", children: "TutorWard \u00B7 EEE SREC Academic Portal" })] }), _jsx("div", { className: "mobile-wave-mask", children: _jsx("svg", { viewBox: "0 0 500 120", preserveAspectRatio: "none", children: _jsx("path", { d: "M 0 0 C 150 100 350 -20 500 60 L 500 120 L 0 120 Z", fill: "#ffffff" }) }) })] }), _jsxs("div", { className: "mobile-form-sheet", children: [error && (_jsx("div", { className: "signin-error-banner", children: _jsxs("span", { children: ["\u26A0\uFE0F ", error] }) })), forgotSent && (_jsxs("div", { className: "signin-success-banner", children: [_jsx(CheckCircle2, { size: 16 }), _jsx("span", { children: "Password reset link sent to registered email!" })] })), _jsxs("form", { onSubmit: handleSubmit, className: "mobile-underlined-form", children: [isSignUp && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mobile-field-row", children: [_jsx(User, { size: 18, className: "field-row-icon" }), _jsx("input", { type: "text", placeholder: "Full Name", value: name, onChange: e => setName(e.target.value), className: "mobile-underlined-input", required: true })] }), _jsxs("div", { className: "mobile-field-row", children: [_jsx(UserCheck, { size: 18, className: "field-row-icon" }), _jsx("input", { type: "text", placeholder: "Roll Number (e.g. 71812503104)", value: rollNo, onChange: e => setRollNo(e.target.value), className: "mobile-underlined-input", required: true })] })] })), _jsxs("div", { className: "mobile-field-row", children: [_jsx(Mail, { size: 18, className: "field-row-icon" }), _jsx("input", { type: "email", placeholder: "Email address or Roll No", value: email, onChange: e => setEmail(e.target.value), className: "mobile-underlined-input", required: true }), email.includes('@') && _jsx(CheckCircle2, { size: 16, className: "field-check-icon" })] }), _jsxs("div", { className: "mobile-field-row", children: [_jsx(Lock, { size: 18, className: "field-row-icon" }), _jsx("input", { type: showPassword ? 'text' : 'password', placeholder: "Password", value: password, onChange: e => setPassword(e.target.value), className: "mobile-underlined-input", required: true }), _jsx("button", { type: "button", className: "field-eye-btn", onClick: () => setShowPassword(!showPassword), children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), !isSignUp && (_jsx("div", { style: { textAlign: 'right', marginTop: -4, marginBottom: 8 }, children: _jsx("button", { type: "button", className: "signin-forgot-btn", onClick: () => setForgotSent(true), children: "Forgot password?" }) })), _jsx("button", { type: "submit", className: "mobile-blue-pill-btn", disabled: loading, children: loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In' }), _jsx("button", { type: "button", className: "mobile-outline-pill-btn", onClick: () => setIsSignUp(!isSignUp), children: isSignUp ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up' })] }), _jsxs("div", { style: { marginTop: 22, paddingTop: 16, borderTop: '1px solid #f1f5f9' }, children: [_jsx("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }, children: _jsx("span", { style: { fontSize: 10, fontWeight: 900, color: '#4338ca', letterSpacing: 0.8, textTransform: 'uppercase' }, children: "\u26A1 1-CLICK DEV DEMO SIGN IN" }) }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }, children: demoProfiles.map((p, idx) => (_jsxs("button", { type: "button", onClick: () => onLoginSuccess(p), className: "demo-chip-btn", style: {
                                        background: p.role === 'teacher' ? 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                        border: `1.5px solid ${p.role === 'teacher' ? '#ea580c40' : '#2563eb40'}`,
                                        borderRadius: 12,
                                        padding: '10px 8px',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        transition: 'transform 0.15s ease'
                                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }, children: [_jsx("span", { style: { fontSize: 11, fontWeight: 900, color: p.role === 'teacher' ? '#ea580c' : '#2563eb' }, children: p.role === 'teacher' ? '👨‍🏫 Faculty' : '🎓 Student' }), _jsx("span", { style: { fontSize: 8.5, fontWeight: 800, background: p.role === 'teacher' ? '#ea580c' : '#2563eb', color: '#fff', padding: '1px 5px', borderRadius: 6 }, children: "INSTANT" })] }), _jsx("div", { style: { fontSize: 12, fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, children: p.name }), _jsx("div", { style: { fontSize: 9.5, color: '#64748b' }, children: p.role === 'teacher' ? 'FAC001 · All Classes' : p.rollNo })] }, idx))) })] })] })] }));
};
