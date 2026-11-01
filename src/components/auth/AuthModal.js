import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, User, Sparkles } from 'lucide-react';
export const AuthModal = ({ onClose, onLoginSuccess, demoProfiles }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        // Simulate login verification
        setTimeout(() => {
            // Find if email matches one of the demo profiles
            const matchedProfile = demoProfiles.find(p => p.email.toLowerCase() === email.toLowerCase().trim());
            if (matchedProfile) {
                onLoginSuccess(matchedProfile);
            }
            else {
                // Allow general custom sign-in for testing purposes
                onLoginSuccess({
                    email: email.trim(),
                    name: email.split('@')[0].toUpperCase(),
                    rollNo: 'EEE' + Math.floor(100 + Math.random() * 900),
                    role: 'student'
                });
            }
            setLoading(false);
        }, 800);
    };
    const handleQuickLogin = (profile) => {
        setLoading(true);
        setTimeout(() => {
            onLoginSuccess(profile);
            setLoading(false);
        }, 400);
    };
    return (_jsx("div", { className: "auth-modal-overlay", children: _jsxs("div", { className: "auth-card", children: [_jsxs("div", { className: "auth-card-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsx("div", { className: "auth-card-logo", children: _jsx(Sparkles, { size: 16, fill: "currentColor", style: { color: 'var(--bg-primary)' } }) }), _jsxs("div", { children: [_jsx("h3", { style: { fontSize: 16, fontWeight: 800, margin: 0 }, children: "EEE Scholar Hub" }), _jsx("p", { style: { fontSize: 10, color: 'var(--text-muted)', margin: 0 }, children: "Student & Faculty Portal" })] })] }), _jsx("button", { className: "auth-close-btn", onClick: onClose, "aria-label": "Close Login", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "auth-card-body", children: [_jsx("h4", { style: { fontSize: 18, fontWeight: 700, marginBottom: 6 }, children: "Welcome Back" }), _jsx("p", { style: { fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }, children: "Please sign in to access your EEE dashboard, curriculum tracker, and academic files." }), error && (_jsx("div", { className: "auth-error-banner", children: _jsx("span", { children: error }) })), _jsxs("form", { onSubmit: handleSubmit, style: { display: 'flex', flexDirection: 'column', gap: 14 }, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", htmlFor: "email-input", children: "Email Address" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Mail, { size: 16, className: "auth-input-icon" }), _jsx("input", { id: "email-input", type: "email", placeholder: "student@eee.com", value: email, onChange: (e) => setEmail(e.target.value), className: "form-input auth-input", disabled: loading })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", htmlFor: "password-input", children: "Password" }), _jsxs("div", { style: { position: 'relative' }, children: [_jsx(Lock, { size: 16, className: "auth-input-icon" }), _jsx("input", { id: "password-input", type: showPassword ? 'text' : 'password', placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), className: "form-input auth-input", disabled: loading }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "password-toggle-btn", tabIndex: -1, children: showPassword ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] })] }), _jsx("button", { type: "submit", className: "btn-primary auth-submit-btn", disabled: loading, children: loading ? 'Verifying Credentials...' : 'Sign In' })] }), _jsx("div", { className: "auth-divider", children: _jsx("span", { children: "Or Quick Login for Evaluation" }) }), _jsx("div", { className: "quick-login-grid", children: demoProfiles.map((profile, index) => (_jsxs("button", { className: `quick-login-btn ${profile.role}`, onClick: () => handleQuickLogin(profile), disabled: loading, children: [_jsx(User, { size: 14, style: { marginBottom: 4 } }), _jsx("span", { className: "profile-name", children: profile.name.split(' ')[0] }), _jsx("span", { className: "profile-role", children: profile.role === 'teacher' ? 'Faculty Admin' : 'Student' })] }, index))) })] })] }) }));
};
