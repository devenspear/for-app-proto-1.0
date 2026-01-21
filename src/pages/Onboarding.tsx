import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Database, Eye, CheckCircle, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAppStore } from '../store/useAppStore';
import { generateMockData } from '../services/storage/mockData';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const navigate = useNavigate();
  const { setOnboarded, setConsent: saveConsent } = useAppStore();

  const completeOnboarding = async (withDemoData: boolean) => {
    if (withDemoData) {
      setLoadingDemo(true);
      await generateMockData();
      setLoadingDemo(false);
    }
    saveConsent(true);
    setOnboarded(true);
    navigate('/');
  };

  const steps = [
    // Welcome
    <div key="welcome" className="text-center space-y-8">
      <div
        className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          boxShadow: '0 10px 40px -10px rgba(79, 70, 229, 0.5)'
        }}
      >
        <Sparkles size={44} color="#ffffff" />
      </div>
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#18181b' }}>Character Insights</h1>
        <p className="mt-3 text-lg leading-relaxed max-w-sm mx-auto" style={{ color: '#52525b' }}>
          A tool for self-reflection based on 12 character themes to support personal growth.
        </p>
      </div>
      <Button
        onClick={() => setStep(1)}
        size="lg"
        className="w-full"
        rightIcon={<ArrowRight size={18} />}
      >
        Get Started
      </Button>
    </div>,

    // Privacy
    <div key="privacy" className="space-y-6">
      <div className="text-center">
        <div
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: '#d1fae5' }}
        >
          <Shield size={36} color="#059669" />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: '#18181b' }}>Your Privacy Matters</h2>
        <p className="mt-2" style={{ color: '#71717a' }}>Here's how we protect your data</p>
      </div>

      <div
        className="rounded-2xl p-5 space-y-5"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e4e4e7',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="flex gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#e0e7ff' }}
          >
            <Database size={20} color="#4f46e5" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#18181b' }}>100% Local Storage</p>
            <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>
              All data stays on your device. Nothing is sent to any server.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#d1fae5' }}
          >
            <Lock size={20} color="#059669" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#18181b' }}>No Tracking</p>
            <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>
              No analytics, no ads, no data collection of any kind.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: '#fef3c7' }}
          >
            <Eye size={20} color="#d97706" />
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#18181b' }}>Self-Report Based</p>
            <p className="text-sm mt-0.5" style={{ color: '#71717a' }}>
              You manually enter your data. No automatic monitoring.
            </p>
          </div>
        </div>
      </div>

      <Button onClick={() => setStep(2)} size="lg" className="w-full" rightIcon={<ArrowRight size={18} />}>
        Continue
      </Button>
    </div>,

    // Consent
    <div key="consent" className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: '#18181b' }}>Before We Begin</h2>
        <p className="mt-2" style={{ color: '#71717a' }}>Please review and understand the following</p>
      </div>

      <div
        className="rounded-2xl p-5 space-y-4"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e4e4e7',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#3f3f46' }}>
            <strong style={{ color: '#b45309' }}>Not a diagnostic tool:</strong> This app provides reflection prompts, not clinical assessments or medical advice.
          </p>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#f4f4f5', border: '1px solid #d4d4d8' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#3f3f46' }}>
            <strong style={{ color: '#18181b' }}>Not affiliated with AA:</strong> While inspired by character themes common in recovery programs, this app is independent.
          </p>
        </div>
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#eef2ff', border: '1px solid #c7d2fe' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#3f3f46' }}>
            <strong style={{ color: '#4338ca' }}>For self-reflection only:</strong> Scores are proxies based on self-reported data, meant to prompt reflection.
          </p>
        </div>
      </div>

      <label
        className="flex items-start gap-3 cursor-pointer p-4 rounded-xl transition-colors"
        style={{ backgroundColor: '#ffffff', border: '1px solid #d4d4d8' }}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
          style={{ accentColor: '#4f46e5' }}
        />
        <span className="text-sm leading-relaxed" style={{ color: '#3f3f46' }}>
          I understand that this is a self-reflection tool and not a substitute for professional help.
        </span>
      </label>

      <Button
        onClick={() => setStep(3)}
        disabled={!consent}
        size="lg"
        className="w-full"
        rightIcon={<ArrowRight size={18} />}
      >
        I Agree & Continue
      </Button>
    </div>,

    // Demo data option
    <div key="demo" className="space-y-6">
      <div className="text-center">
        <div
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5"
          style={{ backgroundColor: '#d1fae5' }}
        >
          <CheckCircle size={36} color="#059669" />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: '#18181b' }}>You're All Set!</h2>
        <p className="mt-2" style={{ color: '#71717a' }}>
          Would you like to start with demo data?
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => completeOnboarding(true)}
          isLoading={loadingDemo}
          size="lg"
          className="w-full"
        >
          Load Demo Data
        </Button>

        <Button
          variant="outline"
          onClick={() => completeOnboarding(false)}
          disabled={loadingDemo}
          size="lg"
          className="w-full"
        >
          Start Fresh
        </Button>
      </div>

      <p className="text-xs text-center leading-relaxed" style={{ color: '#71717a' }}>
        Demo data includes 2 weeks of sample entries to help you explore all features.
        You can clear it anytime in Settings.
      </p>
    </div>,
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(to bottom, #fafafa, #f4f4f5)' }}
    >
      <div className="max-w-md w-full">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? '2rem' : '0.375rem',
                backgroundColor: i === step ? '#4f46e5' : i < step ? '#a5b4fc' : '#d4d4d8'
              }}
            />
          ))}
        </div>

        <div className="animate-fade-in">
          {steps[step]}
        </div>
      </div>
    </div>
  );
};
