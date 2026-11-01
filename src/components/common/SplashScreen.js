import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';
import appLogo from '../../assets/app-logo.png';
export const SplashScreen = ({ onFinish, onSelectAuth }) => {
    const handleAction = (isSignUp) => {
        if (onSelectAuth) {
            onSelectAuth(isSignUp);
        }
        onFinish();
    };
    return (_jsxs("div", { className: "splash-screen-container", children: [_jsx("div", { className: "splash-glow-bg" }), _jsxs("div", { className: "splash-content", children: [_jsxs("div", { className: "splash-logo-wrapper", children: [_jsx("div", { className: "splash-logo-circle", style: { padding: 0, background: '#ffffff', borderRadius: 24, overflow: 'hidden', border: '3px solid rgba(255, 255, 255, 0.8)' }, children: _jsx("img", { src: appLogo, alt: "EEE SREC Logo", style: { width: '100%', height: '100%', objectFit: 'cover' } }) }), _jsxs("div", { className: "splash-logo-badge", children: [_jsx(Sparkles, { size: 12, fill: "currentColor" }), _jsx("span", { children: "2026 EDITION" })] })] }), _jsxs("div", { className: "splash-text-section", children: [_jsx("h1", { className: "splash-title", children: "EEE SREC PORTAL" }), _jsx("p", { className: "splash-subtitle", children: "Smart Mobile Student Hub" }), _jsx("p", { className: "splash-college", children: "Sri Ramakrishna Engineering College \u00B7 Dept of EEE" })] }), _jsx("div", { className: "splash-divider-line" }), _jsxs("div", { className: "splash-auth-actions", children: [_jsxs("button", { className: "splash-auth-btn signin", onClick: () => handleAction(false), children: [_jsx(LogIn, { size: 16 }), _jsx("span", { children: "Sign In" })] }), _jsxs("button", { className: "splash-auth-btn signup", onClick: () => handleAction(true), children: [_jsx(UserPlus, { size: 16 }), _jsx("span", { children: "Sign Up" })] })] })] })] }));
};
