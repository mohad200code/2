/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';

// Custom high-quality vector brand icons
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-slate-900">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.94-1.39z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#1877F2]">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#5865F2]">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

const GitLabIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#e24329" d="M12 22.075L22.66 14.33 19.5 4.606a.795.795 0 0 0-1.513 0L15.343 12.8H8.657L6.013 4.606a.795.795 0 0 0-1.513 0L1.34 14.33 12 22.075z" />
    <path fill="#fc6d26" d="M12 22.075l3.343-10.275H8.657L12 22.075z" />
    <path fill="#fca326" d="M1.34 14.33l10.66 7.745V11.8H1.34a.79.79 0 0 0 0 2.53z" />
    <path fill="#fca326" d="M22.66 14.33l-10.66 7.745V11.8h10.66c.47 0 .84.51.66.99l-.66 1.54z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#F25022" d="M1 1h10v10H1V1z" />
    <path fill="#7FBA00" d="M13 1h10v10H13V1z" />
    <path fill="#01A6F0" d="M1 13h10v10H1V13z" />
    <path fill="#FFB900" d="M13 13h10v10H13V13z" />
  </svg>
);

const TwitchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#9146FF]">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-slate-900">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-slate-800">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

interface ClerkAuthProps {
  onSuccess: (email: string) => void;
  onClose: () => void;
}

export const ClerkAuth: React.FC<ClerkAuthProps> = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onSuccess(email);
  };

  const socialLogins = [
    { name: 'Google', icon: <GoogleIcon /> },
    { name: 'Apple', icon: <AppleIcon /> },
    { name: 'Facebook', icon: <FacebookIcon /> },
    { name: 'Discord', icon: <DiscordIcon /> },
    { name: 'GitLab', icon: <GitLabIcon /> },
    { name: 'Microsoft', icon: <MicrosoftIcon /> },
    { name: 'Twitch', icon: <TwitchIcon /> },
    { name: 'X', icon: <XIcon /> },
    { name: 'GitHub', icon: <GitHubIcon /> },
  ];

  return (
    <div id="clerk-auth-container" className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-white font-sans">
      
      {/* 1. Left Side: Real High-Resolution Graphic / Image Column (Requested "Really Image") */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-slate-950 overflow-hidden flex-col justify-between p-12 text-white">
        {/* Actual high-quality lifestyle/sportswear background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-65 transition-transform duration-[12s] ease-out hover:scale-105" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200')" }}
        />
        {/* Premium smooth radial mask & color tone overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-indigo-950/20 to-slate-950/90" />
        
        {/* Top Branding Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white font-black border border-white/20 text-lg shadow-inner">
            N
          </div>
          <span className="font-extrabold tracking-tight text-xl text-white drop-shadow-sm">Nike Premium Portal</span>
        </div>

        {/* Core Marketing message */}
        <div className="relative z-10 space-y-4 max-w-sm">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full text-amber-300 font-bold tracking-widest uppercase text-[10px]">
            <Sparkles className="w-3 h-3" /> Exclusive Athlete Pass
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md">
            The Hub for Athletic Performance.
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed font-medium">
            Join the community to unlock specialized gear drops, faster checkout lanes, and personalized size-recommender tools.
          </p>
        </div>

        {/* Real User Social Proof Widget */}
        <div className="relative z-10 flex items-center gap-3.5 bg-white/5 backdrop-blur-lg p-4 rounded-2xl border border-white/10 max-w-md shadow-2xl">
          <div className="flex -space-x-2.5">
            <img 
              className="w-9 h-9 rounded-full border-2 border-slate-950 object-cover" 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
              alt="Athlete 1" 
              referrerPolicy="no-referrer"
            />
            <img 
              className="w-9 h-9 rounded-full border-2 border-slate-950 object-cover" 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" 
              alt="Athlete 2" 
              referrerPolicy="no-referrer"
            />
            <img 
              className="w-9 h-9 rounded-full border-2 border-slate-950 object-cover" 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" 
              alt="Athlete 3" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-white flex items-center gap-1">Joined by 15,000+ athletes worldwide</p>
            <p className="text-[10px] text-slate-300 italic">"The fastest checkout experience on any activewear brand."</p>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Auth Form Column */}
      <div className="col-span-1 lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-slate-50 relative min-h-screen">
        
        {/* Floating Close / Back to Store button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 rounded-full shadow-sm hover:shadow transition-all duration-200 cursor-pointer flex items-center justify-center group"
          title="Back to store"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <div id="clerk-auth-card" className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-10 flex flex-col transition-all">
          <div className="text-center pb-6">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4 shadow-md">
              N
            </div>
            <h2 id="clerk-title" className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isSignUp ? 'Create your account' : 'Sign in to Nike'}
            </h2>
            <p id="clerk-subtitle" className="text-xs text-slate-500 mt-1.5 font-medium">
              Welcome! Please {isSignUp ? 'register' : 'sign in'} with one of our authentication partners or your email.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Social Logins Grid - Crisp SVG Logos with light-styled buttons */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
                Continue with Social Identity
              </p>
              <div id="clerk-socials" className="grid grid-cols-3 gap-2.5">
                {socialLogins.map((social) => (
                  <button
                    key={social.name}
                    id={`social-${social.name.toLowerCase()}`}
                    type="button"
                    onClick={() => onSuccess(`${social.name.toLowerCase()}user@gmail.com`)}
                    className="py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-center transition-all hover:shadow-sm duration-150 cursor-pointer active:scale-95"
                    title={`Continue with ${social.name}`}
                  >
                    <span className="flex items-center justify-center">{social.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center gap-3">
              <div className="h-px bg-slate-200 flex-1"></div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">or email auth</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            {/* Email input form */}
            <form id="clerk-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="clerk-email-input"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-slate-800 outline-none text-sm text-slate-800 transition-all shadow-inner focus:shadow-none"
                />
                {error && (
                  <p id="clerk-email-error" className="text-xs text-rose-500 font-semibold mt-1">
                    {error}
                  </p>
                )}
              </div>

              <button
                id="clerk-submit-btn"
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span className="tracking-wide text-sm font-bold">Continue with Email</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            {/* Mode toggling text */}
            <div className="text-center pt-2">
              <p id="clerk-toggle-mode" className="text-xs text-slate-500 font-medium">
                {isSignUp ? 'Already have an account?' : "New to Nike's digital store?"}{' '}
                <span
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-indigo-600 font-extrabold underline cursor-pointer hover:text-indigo-800 ml-1"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </span>
              </p>
            </div>
          </div>

          {/* Security & Verification Badging */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center flex flex-col items-center gap-1.5">
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
              <span>Secured and powered by</span>
              <span className="font-extrabold text-slate-700 flex items-center gap-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 fill-indigo-50/50" /> clerk
              </span>
            </p>
            <p id="clerk-dev-mode" className="text-[9px] text-amber-700 font-bold uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
              Developer sandbox Mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

