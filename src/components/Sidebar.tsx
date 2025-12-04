// Local store: Updated Sidebar - removed old compliance checkers, added Media Checker
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

// Local store: Simplified menu items - Media Checker, Agent Discovery, and FAQ
const menuItems: MenuItem[] = [
  {
    path: '/media-checker',
    label: 'Media Analysis',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    path: '/agent-discovery',
    label: 'Agent Discovery',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    path: '/faq',
    label: 'FAQ',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-[73px] h-[calc(100vh-73px)] bg-white border-r border-gray-200 shadow-lg transition-all duration-300 z-40 dark:bg-gray-800 dark:border-gray-700',
          isExpanded ? 'w-64' : 'w-20'
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-6 bg-primary-600 text-white rounded-full p-1.5 shadow-lg hover:bg-primary-700 transition-colors"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <svg
            className={clsx('w-4 h-4 transition-transform', !isExpanded && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                )
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span
                className={clsx(
                  'whitespace-nowrap transition-opacity duration-200',
                  !isExpanded && 'opacity-0 w-0 overflow-hidden'
                )}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Spacer to push content */}
      <div className={clsx('transition-all duration-300', isExpanded ? 'w-64' : 'w-20')} />
    </>
  );
};

export default Sidebar;
