import React from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminGuardProps {
  currentUser: { email: string; role: 'admin' | 'user'; name?: string } | null;
  onSignUpClick: () => void;
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ currentUser, onSignUpClick, children }) => {
  const isAdmin = currentUser && currentUser.email.toLowerCase() === 'mohabmohnad9@gmail.com';

  if (!isAdmin) {
    return (
      <motion.div 
        id="admin-lock-screen" 
        className="max-w-md mx-auto py-16 px-4 text-center space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-20 h-20 bg-rose-950/80 border border-rose-500/40 rounded-full flex items-center justify-center mx-auto text-rose-400 shadow-xl glow-pink">
          <Lock className="w-10 h-10 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight font-mono">Bypassed Security Protocol</h2>
          <span className="text-xs bg-rose-950 text-rose-400 font-mono font-bold px-3 py-1 rounded-full border border-rose-500/30 inline-block uppercase">
            ADMIN PRIVILEGES REQUIRED
          </span>
          <p className="text-xs text-slate-400 leading-relaxed">
            You are currently signed in with standard User tier roles. Access to customer listings, database parameters, and live user profile hosting is protected.
          </p>
        </div>

        <div className="bg-slate-950/85 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
          <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
            You should Sign Up to have Admin page
          </span>
          <button
            onClick={onSignUpClick}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg hover:scale-103 font-mono"
          >
            🔐 Sign Up / Login
          </button>
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
};

// High-Order Component wrapping version
export function withAdminGuard<P extends object>(
  Component: React.ComponentType<P>,
  getAuthProps: (props: P) => {
    currentUser: { email: string; role: 'admin' | 'user'; name?: string } | null;
    onSignUpClick: () => void;
  }
) {
  return function AdminGuardedComponent(props: P) {
    const { currentUser, onSignUpClick } = getAuthProps(props);
    return (
      <AdminGuard currentUser={currentUser} onSignUpClick={onSignUpClick}>
        <Component {...props} />
      </AdminGuard>
    );
  };
}
