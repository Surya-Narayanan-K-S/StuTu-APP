import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { User, ClipboardCheck, Award, TrendingUp, Briefcase, CalendarRange } from 'lucide-react';
export const DashboardGrid = ({ onSelectTab }) => {
    const menuItems = [
        {
            id: 'profile',
            name: 'Profile & Documents',
            icon: _jsx(User, { size: 32 }),
            colorClass: 'profile'
        },
        {
            id: 'attendance',
            name: 'Period Attendance',
            icon: _jsx(ClipboardCheck, { size: 32 }),
            colorClass: 'attendance'
        },
        {
            id: 'nptel',
            name: 'NPTEL Tracker',
            icon: _jsx(Award, { size: 32 }),
            colorClass: 'nptel'
        },
        {
            id: 'academics',
            name: 'CGPA & Arrears',
            icon: _jsx(TrendingUp, { size: 32 }),
            colorClass: 'academics'
        },
        {
            id: 'career',
            name: 'Career Roadmaps',
            icon: _jsx(Briefcase, { size: 32 }),
            colorClass: 'career'
        },
        {
            id: 'courses',
            name: 'Courses & Calender',
            icon: _jsx(CalendarRange, { size: 32 }),
            colorClass: 'courses'
        }
    ];
    return (_jsxs("div", { children: [_jsx("h3", { className: "dashboard-grid-title", children: "Department Portals" }), _jsx("div", { className: "dashboard-grid", children: menuItems.map((item) => (_jsxs("div", { className: "square-btn", onClick: () => onSelectTab(item.id), children: [_jsx("div", { className: "square-btn-icon-wrapper", children: item.icon }), _jsx("span", { className: "square-btn-name", children: item.name })] }, item.id))) })] }));
};
