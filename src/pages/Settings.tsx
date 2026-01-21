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
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
            <Settings2 size={20} className="text-neutral-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        </div>

        {/* Theme Visibility */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-neutral-900">Theme Visibility</h2>
                <p className="text-sm text-neutral-500 mt-0.5">
                  Hide themes you don't want to track
                </p>
              </div>
              <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
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
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all duration-150
                      ${isHidden
                        ? 'bg-neutral-50 hover:bg-neutral-100'
                        : 'hover:bg-neutral-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full transition-opacity ${isHidden ? 'opacity-30' : ''}`}
                        style={{ backgroundColor: def.color }}
                      />
                      <span
                        className={`text-sm font-medium transition-colors ${
                          isHidden ? 'text-neutral-400 line-through' : 'text-neutral-900'
                        }`}
                      >
                        {def.name}
                      </span>
                    </div>
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                      ${isHidden ? 'bg-neutral-200' : 'bg-primary-100'}
                    `}>
                      {isHidden ? (
                        <EyeOff size={16} className="text-neutral-400" />
                      ) : (
                        <Eye size={16} className="text-primary-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <Database size={20} className="text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900">Data Management</h2>
              <p className="text-sm text-neutral-500 mt-0.5">Manage your stored data</p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <button
              onClick={handleLoadDemoData}
              disabled={loadingDemo}
              className="
                w-full flex items-center gap-3 p-4 rounded-xl
                bg-neutral-50 hover:bg-neutral-100 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <RefreshCw
                  size={18}
                  className={`text-emerald-600 ${loadingDemo ? 'animate-spin' : ''}`}
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-900">
                  {loadingDemo ? 'Loading...' : 'Load Demo Data'}
                </p>
                <p className="text-xs text-neutral-500">Populate with sample entries</p>
              </div>
            </button>

            <button
              onClick={handleExportData}
              className="
                w-full flex items-center gap-3 p-4 rounded-xl
                bg-neutral-50 hover:bg-neutral-100 transition-colors
              "
            >
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                <Download size={18} className="text-primary-600" />
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-medium text-neutral-900">Export Data as JSON</p>
                <p className="text-xs text-neutral-500">Download your data locally</p>
              </div>
              {exportStatus === 'success' && (
                <CheckCircle size={18} className="text-emerald-500" />
              )}
            </button>

            {exportStatus && (
              <p className={`text-sm text-center py-2 rounded-lg ${
                exportStatus === 'success'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-red-600 bg-red-50'
              }`}>
                {exportStatus === 'success' ? 'Data exported successfully!' : 'Export failed. Please try again.'}
              </p>
            )}

            <button
              onClick={() => setShowDeleteModal(true)}
              className="
                w-full flex items-center gap-3 p-4 rounded-xl
                bg-red-50 hover:bg-red-100 transition-colors
              "
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-red-600">Clear All Data</p>
                <p className="text-xs text-red-500">Remove all entries permanently</p>
              </div>
            </button>
          </div>
        </div>

        {/* Reset App */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h2 className="font-semibold text-neutral-900">Reset App</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              This will clear all data and return to onboarding
            </p>
          </div>
          <div className="p-4">
            <button
              onClick={() => setShowResetModal(true)}
              className="
                w-full flex items-center gap-3 p-4 rounded-xl
                bg-red-50 hover:bg-red-100 transition-colors border border-red-200
              "
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-red-600">Reset Everything</p>
                <p className="text-xs text-red-500">Clear data and restart from scratch</p>
              </div>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
              <Info size={20} className="text-neutral-600" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900">About</h2>
            </div>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">App Name</span>
              <span className="text-sm font-medium text-neutral-900">Character Insights</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Version</span>
              <span className="text-sm font-medium text-neutral-900">1.0.0 (Web PoC)</span>
            </div>
            <div className="pt-3 mt-3 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 leading-relaxed">
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
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-700 leading-relaxed">
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
              onClick={handleClearData}
              className="flex-1 !bg-red-600 hover:!bg-red-700"
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
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-700 leading-relaxed">
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
              onClick={handleResetApp}
              className="flex-1 !bg-red-600 hover:!bg-red-700"
            >
              Reset App
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
