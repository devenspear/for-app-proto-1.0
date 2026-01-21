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
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100/50">
      {/* Header */}
      <header className="sticky top-0 z-20 glass border-b border-neutral-200/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-soft">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-neutral-900">
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
      <nav className="fixed bottom-0 left-0 right-0 z-20 glass border-t border-neutral-200/50">
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex justify-around py-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex flex-col items-center py-2 px-4 rounded-xl
                    transition-all duration-200 min-w-[64px]
                    ${isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                    }
                  `}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`
                    text-xs mt-1 font-medium
                    ${isActive ? 'text-primary-600' : 'text-neutral-500'}
                  `}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        {/* Safe area for mobile */}
        <div className="h-safe-area-inset-bottom bg-white/80" />
      </nav>
    </div>
  );
};
