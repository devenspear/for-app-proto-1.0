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
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-large">
        <Sparkles size={44} className="text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Character Insights</h1>
        <p className="text-neutral-500 mt-3 text-lg leading-relaxed max-w-sm mx-auto">
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
        <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
          <Shield size={36} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">Your Privacy Matters</h2>
        <p className="text-neutral-500 mt-2">Here's how we protect your data</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-5 space-y-5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Database size={20} className="text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">100% Local Storage</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              All data stays on your device. Nothing is sent to any server.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Lock size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">No Tracking</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              No analytics, no ads, no data collection of any kind.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Eye size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Self-Report Based</p>
            <p className="text-sm text-neutral-500 mt-0.5">
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
        <h2 className="text-2xl font-bold text-neutral-900">Before We Begin</h2>
        <p className="text-neutral-500 mt-2">Please review and understand the following</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-5 space-y-4">
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm text-neutral-700 leading-relaxed">
            <strong className="text-amber-700">Not a diagnostic tool:</strong> This app provides reflection prompts, not clinical assessments or medical advice.
          </p>
        </div>
        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          <p className="text-sm text-neutral-700 leading-relaxed">
            <strong>Not affiliated with AA:</strong> While inspired by character themes common in recovery programs, this app is independent.
          </p>
        </div>
        <div className="p-4 bg-primary-50 rounded-xl border border-primary-200">
          <p className="text-sm text-neutral-700 leading-relaxed">
            <strong className="text-primary-700">For self-reflection only:</strong> Scores are proxies based on self-reported data, meant to prompt reflection.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-sm text-neutral-700 leading-relaxed">
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
        <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
          <CheckCircle size={36} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900">You're All Set!</h2>
        <p className="text-neutral-500 mt-2">
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

      <p className="text-xs text-neutral-400 text-center leading-relaxed">
        Demo data includes 2 weeks of sample entries to help you explore all features.
        You can clear it anytime in Settings.
      </p>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${i === step ? 'w-8 bg-primary-500' : i < step ? 'w-1.5 bg-primary-300' : 'w-1.5 bg-neutral-200'}
              `}
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
