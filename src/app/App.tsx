import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Onboarding } from '../pages/Onboarding';
import { Dashboard } from '../pages/Dashboard';
import { DailyCheckIn } from '../pages/DailyCheckIn';
import { DataEntry } from '../pages/DataEntry';
import { Settings } from '../pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboarded, hasConsented } = useAppStore();

  if (!isOnboarded || !hasConsented) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { isOnboarded, hasConsented } = useAppStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding route */}
        <Route
          path="/onboarding"
          element={
            isOnboarded && hasConsented ? (
              <Navigate to="/" replace />
            ) : (
              <Onboarding />
            )
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-in"
          element={
            <ProtectedRoute>
              <DailyCheckIn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data-entry"
          element={
            <ProtectedRoute>
              <DataEntry />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
