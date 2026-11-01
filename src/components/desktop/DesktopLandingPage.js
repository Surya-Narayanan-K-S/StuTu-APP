import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ArrowUpRight, Menu, LayoutGrid, Briefcase } from 'lucide-react';
import appLogo from '../../assets/app-logo.png';
import cosmicBg from '../../assets/cosmic-planet.jpg';
export const DesktopLandingPage = ({ onOpenLogin, demoProfiles, onDemoLogin }) => {
    return (_jsx("div", { className: "cosmic-landing-wrapper", children: _jsxs("div", { className: "cosmic-screen-frame", style: {
                backgroundImage: `linear-gradient(180deg, rgba(3,5,12,0.4) 0%, rgba(3,5,12,0.7) 100%), url(${cosmicBg})`,
            }, children: [_jsxs("header", { className: "cosmic-top-nav", children: [_jsx("button", { className: "cosmic-menu-btn", onClick: () => onOpenLogin(false), title: "Menu", children: _jsx(Menu, { size: 26, strokeWidth: 2.5, color: "#ffffff" }) }), _jsx("div", { className: "cosmic-center-brand", children: _jsx("span", { className: "cosmic-brand-text", children: "TUTORWARD" }) }), _jsxs("div", { className: "cosmic-nav-right", children: [demoProfiles && onDemoLogin && (_jsx("div", { style: { display: 'flex', gap: 8, marginRight: 10 }, children: demoProfiles.map((p, idx) => (_jsxs("button", { onClick: () => onDemoLogin(p), style: {
                                            background: p.role === 'teacher' ? 'rgba(234, 88, 12, 0.8)' : 'rgba(37, 99, 235, 0.8)',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            color: '#ffffff',
                                            borderRadius: 20,
                                            padding: '4px 12px',
                                            fontSize: 11,
                                            fontWeight: 800,
                                            cursor: 'pointer',
                                            backdropFilter: 'blur(6px)'
                                        }, children: ["\u26A1 Demo ", p.role === 'teacher' ? 'Faculty' : 'Student'] }, idx))) })), _jsx("button", { className: "cosmic-icon-btn", onClick: () => onOpenLogin(false), title: "Modules", children: _jsx(LayoutGrid, { size: 18, color: "#ffffff" }) }), _jsx("button", { className: "cosmic-icon-btn", onClick: () => onOpenLogin(false), title: "Career Hub", children: _jsx(Briefcase, { size: 18, color: "#ffffff" }) }), _jsx("div", { className: "cosmic-avatar-circle", onClick: () => onOpenLogin(false), title: "Sign In", children: _jsx("img", { src: appLogo, alt: "TutorWard Logo", style: { width: '100%', height: '100%', objectFit: 'cover' } }) })] })] }), _jsxs("main", { className: "cosmic-main-hero", children: [_jsxs("div", { className: "cosmic-hero-content", children: [_jsx("span", { className: "cosmic-sub-tag", children: "Academic Dynamicron \u00B7 Dept of EEE" }), _jsx("h1", { className: "cosmic-huge-title", children: "TUTOR-WARD" })] }), _jsx("button", { className: "cosmic-circle-action-btn", onClick: () => onOpenLogin(false), title: "Enter Student Portal", children: _jsx(ArrowUpRight, { size: 32, strokeWidth: 2.5, color: "#03050c" }) })] }), _jsxs("footer", { className: "cosmic-bottom-footer", children: [_jsxs("div", { className: "cosmic-footer-left", children: [_jsx("h3", { className: "cosmic-footer-heading", children: "Academic Intelligence & Autonomous Records" }), _jsx("p", { className: "cosmic-footer-desc", children: "Sri Ramakrishna Engineering College \u00B7 Autonomous Institution Affiliated to Anna University." })] }), _jsx("div", { className: "cosmic-footer-right", children: _jsx("div", { className: "cosmic-capsule-badge", onClick: () => onOpenLogin(true), children: _jsx("span", { children: "EEE \u00B7 SREC" }) }) })] })] }) }));
};
