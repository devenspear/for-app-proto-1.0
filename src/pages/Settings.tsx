import React, { useState } from 'react';
import { Trash2, Download, RefreshCw, Eye, EyeOff, AlertTriangle, Settings2, Database, Info, CheckCircle } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useAppStore } from '../store/useAppStore';
import { useDataStore } from '../store/useDataStore';
import { generateMockData } from '../services/storage/mockData';
import { CharacterTheme } from '../types';
import { THEME_DEFINITIONS } from '../constants/themes';
import { db } from '../services/storage/db';

export const Settings: React.FC = () => {
  const { hiddenThemes, toggleThemeVisibility, reset: resetApp } = useAppStore();
  const { clearAllData, loadWeeklyReport } = useDataStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [exportStatus, setExportStatus] = useState<'success' | 'error' | null>(null);

  const handleLoadDemoData = async () => {
    setLoadingDemo(true);
    await generateMockData();
    await loadWeeklyReport();
    setLoadingDemo(false);
  };

  const handleClearData = async () => {
    await clearAllData();
    setShowDeleteModal(false);
  };

  const handleResetApp = async () => {
    await clearAllData();
    resetApp();
    setShowResetModal(false);
    window.location.href = '/';
  };

  const handleExportData = async () => {
    try {
      const usage = await db.dailyUsage.toArray();
      const checkIns = await db.dailyCheckIns.toArray();

      const data = {
        exportDate: new Date().toISOString(),
        dailyUsage: usage,
        dailyCheckIns: checkIns,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `character-insights-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const visibleCount = Object.values(CharacterTheme).length - hiddenThemes.length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#f4f4f5' }}
          >
            <Settings2 size={20} color="#52525b" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: '#18181b' }}>Settings</h1>
        </div>

        {/* Theme Visibility */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold" style={{ color: '#18181b' }}>Theme Visibility</h2>
                <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>
                  Hide themes you don't want to track
                </p>
              </div>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: '#f4f4f5', color: '#52525b' }}
              >
                {visibleCount} visible
              </span>
            </div>
          </div>
          <div className="p-3">
            <div className="space-y-1">
              {Object.values(CharacterTheme).map((theme) => {
                const def = THEME_DEFINITIONS[theme];
                const isHidden = hiddenThemes.includes(theme);
                return (
                  <button
                    key={theme}
                    onClick={() => toggleThemeVisibility(theme)}
                    className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-150"
                    style={{
                      backgroundColor: isHidden ? '#f9fafb' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: def.color,
                          opacity: isHidden ? 0.3 : 1
                        }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{
                          color: isHidden ? '#a1a1aa' : '#18181b',
                          textDecoration: isHidden ? 'line-through' : 'none'
                        }}
                      >
                        {def.name}
                      </span>
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: isHidden ? '#e4e4e7' : '#e0e7ff'
                      }}
                    >
                      {isHidden ? (
                        <EyeOff size={16} color="#71717a" />
                      ) : (
                        <Eye size={16} color="#4f46e5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#e0e7ff' }}
            >
              <Database size={20} color="#4f46e5" />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: '#18181b' }}>Data Management</h2>
              <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>Manage your stored data</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={handleLoadDemoData}
              disabled={loadingDemo}
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors"
              style={{
                backgroundColor: '#f9fafb',
                opacity: loadingDemo ? 0.5 : 1,
                cursor: loadingDemo ? 'not-allowed' : 'pointer'
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#d1fae5' }}
              >
                <RefreshCw
                  size={18}
                  color="#059669"
                  className={loadingDemo ? 'animate-spin' : ''}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: '#18181b' }}>
                  {loadingDemo ? 'Loading...' : 'Load Demo Data'}
                </p>
                <p className="text-xs" style={{ color: '#71717a' }}>Populate with sample entries</p>
              </div>
            </button>

            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors"
              style={{ backgroundColor: '#f9fafb' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#e0e7ff' }}
              >
                <Download size={18} color="#4f46e5" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium" style={{ color: '#18181b' }}>Export Data as JSON</p>
                <p className="text-xs" style={{ color: '#71717a' }}>Download your data locally</p>
              </div>
              {exportStatus === 'success' && (
                <CheckCircle size={18} color="#10b981" />
              )}
            </button>

            {exportStatus && (
              <p
                className="text-sm text-center py-2 rounded-lg"
                style={{
                  backgroundColor: exportStatus === 'success' ? '#d1fae5' : '#fee2e2',
                  color: exportStatus === 'success' ? '#047857' : '#dc2626'
                }}
              >
                {exportStatus === 'success' ? 'Data exported successfully!' : 'Export failed. Please try again.'}
              </p>
            )}

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors"
              style={{ backgroundColor: '#fef2f2' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#fee2e2' }}
              >
                <Trash2 size={18} color="#dc2626" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: '#dc2626' }}>Clear All Data</p>
                <p className="text-xs" style={{ color: '#f87171' }}>Remove all entries permanently</p>
              </div>
            </button>
          </div>
        </div>

        {/* Reset App */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <h2 className="font-semibold" style={{ color: '#18181b' }}>Reset App</h2>
            <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>
              This will clear all data and return to onboarding
            </p>
          </div>
          <div className="p-4">
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center gap-3 p-4 rounded-xl transition-colors"
              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: '#fee2e2' }}
              >
                <AlertTriangle size={18} color="#dc2626" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: '#dc2626' }}>Reset Everything</p>
                <p className="text-xs" style={{ color: '#f87171' }}>Clear data and restart from scratch</p>
              </div>
            </button>
          </div>
        </div>

        {/* About */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
        >
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: '#f4f4f5' }}
            >
              <Info size={20} color="#52525b" />
            </div>
            <div>
              <h2 className="font-semibold" style={{ color: '#18181b' }}>About</h2>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#71717a' }}>App Name</span>
              <span className="text-sm font-medium" style={{ color: '#18181b' }}>Character Insights</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: '#71717a' }}>Version</span>
              <span className="text-sm font-medium" style={{ color: '#18181b' }}>1.0.0 (Web PoC)</span>
            </div>
            <div className="pt-3 mt-3" style={{ borderTop: '1px solid #e4e4e7' }}>
              <p className="text-xs leading-relaxed" style={{ color: '#a1a1aa' }}>
                This is a proof-of-concept application for self-reflection and personal
                growth. It is not a diagnostic tool and should not be used as a
                substitute for professional help.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Clear All Data?"
      >
        <div className="space-y-5">
          <div
            className="flex items-start gap-4 p-4 rounded-xl"
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
          >
            <AlertTriangle size={20} color="#dc2626" className="flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed" style={{ color: '#3f3f46' }}>
              This will permanently delete all your usage entries and check-ins. This
              action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleClearData}
              className="flex-1"
            >
              Delete All
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Everything?"
      >
        <div className="space-y-5">
          <div
            className="flex items-start gap-4 p-4 rounded-xl"
            style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
          >
            <AlertTriangle size={20} color="#dc2626" className="flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed" style={{ color: '#3f3f46' }}>
              This will clear all data and settings, and return you to the onboarding
              screen. This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowResetModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleResetApp}
              className="flex-1"
            >
              Reset App
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
