import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  PenSquare,
  FileInput,
  Settings,
  Sparkles,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/check-in', icon: PenSquare, label: 'Check-In' },
  { path: '/data-entry', icon: FileInput, label: 'Data' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #fafafa, #f4f4f5)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e4e4e7'
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Sparkles className="w-4 h-4" color="#ffffff" />
            </div>
            <h1 className="text-lg font-bold" style={{ color: '#18181b' }}>
              Character Insights
            </h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-28 animate-fade-in">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid #e4e4e7'
        }}
      >
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex justify-around py-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className="flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 min-w-[64px]"
                  style={{
                    backgroundColor: isActive ? '#eef2ff' : 'transparent',
                  }}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    color={isActive ? '#4f46e5' : '#71717a'}
                  />
                  <span
                    className="text-xs mt-1 font-medium"
                    style={{ color: isActive ? '#4f46e5' : '#52525b' }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        {/* Safe area for mobile */}
        <div
          className="h-safe-area-inset-bottom"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        />
      </nav>
    </div>
  );
};
