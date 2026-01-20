import React, { useState } from 'react';
import {
  Workflow,
  Shield,
  Bell,
  BarChart3,
  Zap,
  Moon,
  Sun,
  CheckCircle,
  Play,
  ArrowRight,
  Github,
  ExternalLink,
} from 'lucide-react';
import { AuthModal } from './AuthModal';

interface LandingPageProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ darkMode, toggleTheme }) => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const openSignIn = () => {
    setAuthMode('signin');
    setShowAuth(true);
  };

  const openSignUp = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track executions with live updates, 7-day history charts, and detailed success/error metrics.',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get browser notifications when workflows fail or complete. Never miss an important execution.',
    },
    {
      icon: Shield,
      title: 'Encrypted Storage',
      description: 'Your n8n API keys are encrypted with AES-256 and stored securely. We never see your credentials.',
    },
    {
      icon: Zap,
      title: 'One-Click Actions',
      description: 'Trigger, activate, or pause workflows instantly. Manage everything from a single dashboard.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 font-sans text-neutral-900 dark:text-neutral-100 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/50 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-900/90 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Workflow size={18} className="text-white" />
              </div>
              <span className="font-semibold">n8n Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-all"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={openSignIn}
                className="hidden sm:block px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={openSignUp}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-transparent to-transparent dark:from-indigo-500/10 dark:via-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-400/20 to-purple-400/20 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-5xl text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm mb-8 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-600 dark:text-neutral-300">Open source workflow monitoring</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
            Monitor your{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              n8n workflows
            </span>
            <br />
            from anywhere
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            A beautiful dashboard to track your workflow executions, catch errors instantly,
            and keep your automations running smoothly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={openSignUp}
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center gap-2 group"
            >
              Start Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://github.com/janmaaarc/n8n-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Github size={18} />
              View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16 text-sm">
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">100%</div>
              <div className="text-neutral-500 dark:text-neutral-300">Open Source</div>
            </div>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700" />
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">Free</div>
              <div className="text-neutral-500 dark:text-neutral-300">Self-hosted</div>
            </div>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-700" />
            <div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">Secure</div>
              <div className="text-neutral-500 dark:text-neutral-300">Encrypted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-2xl shadow-neutral-900/10 dark:shadow-indigo-500/5 bg-white dark:bg-neutral-800">
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 rounded-md bg-neutral-100 dark:bg-neutral-700 text-xs text-neutral-500 dark:text-neutral-300 font-mono">
                  dashboard.example.com
                </div>
              </div>
            </div>
            {/* Dashboard Mockup */}
            <div className="p-6 bg-neutral-50 dark:bg-neutral-900">
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Workflows', value: '24', icon: Workflow },
                  { label: 'Executions', value: '1,847', icon: Play },
                  { label: 'Success Rate', value: '98.5%', icon: CheckCircle },
                  { label: 'Active', value: '18', icon: Zap },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</span>
                      <stat.icon size={14} className="text-neutral-400 dark:text-neutral-500" />
                    </div>
                    <div className="text-xl font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
              {/* Chart Placeholder */}
              <div className="h-32 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-end gap-1 p-4">
                {[40, 65, 45, 80, 55, 70, 90, 75, 85, 60, 95, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t opacity-80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              A complete monitoring solution for your n8n automations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 bg-neutral-100/50 dark:bg-neutral-800/50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get started in minutes</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Three simple steps to monitor your workflows
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create account',
                description: 'Sign up with your email — no credit card required.',
              },
              {
                step: '2',
                title: 'Connect n8n',
                description: 'Add your n8n instance URL and API key securely.',
              },
              {
                step: '3',
                title: 'Start monitoring',
                description: 'See your workflows and executions in real-time.',
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-neutral-300 dark:border-neutral-600" />
                )}
                <div className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtMnYtMmgydi0yaC0ydi0yaDJ2LTJoLTJ2LTJoMnYtMmgtMlY4aDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2MmgtMnYyaDJ2NGgtMnYyaDJ2Mmgtdjh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

            <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to monitor your workflows?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join now and get full visibility into your n8n automations. Free forever for personal use.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={openSignUp}
                  className="w-full sm:w-auto px-8 py-4 text-base font-medium text-indigo-600 bg-white hover:bg-neutral-100 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                >
                  Get Started Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={openSignIn}
                  className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Sign In
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-neutral-200 dark:border-neutral-700">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
              <a href="https://github.com/janmaaarc/n8n-dashboard" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                <Github size={16} />
                GitHub
              </a>
              <span className="text-neutral-400 dark:text-neutral-500">·</span>
              <span>Open source monitoring for n8n</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialMode={authMode}
      />
    </div>
  );
};
