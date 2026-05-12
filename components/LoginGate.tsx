'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginGateProps {
  children: React.ReactNode;
}

export default function LoginGate({ children }: LoginGateProps) {
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simple local storage check to keep session active
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('sada_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Using a simple master password for now
    // In a real app, this would be an API call or env variable
    setTimeout(() => {
      if (password === 'SADA2025') {
        setIsAuthenticated(true);
        localStorage.setItem('sada_auth', 'true');
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 800);
  };

  if (!mounted) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00B0BE] opacity-10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1B3A6B] opacity-20 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#00B0BE] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#00B0BE]/20">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Accès Sécurisé</h1>
            <p className="text-slate-400 text-center text-sm">
              Veuillez saisir le mot de passe pour accéder au générateur de certificats SADA.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <label htmlFor="master-password" className="sr-only">Mot de passe</label>
              <input
                id="master-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className={`w-full bg-slate-900/50 border ${
                  error ? 'border-red-500' : 'border-slate-700'
                } rounded-xl py-3.5 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00B0BE]/50 transition-all`}
                required
              />
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"
                  >
                    <AlertCircle size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00B0BE] to-[#1B3A6B] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-[#00B0BE]/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <ShieldCheck size={14} />
            <span>Protection par cryptage Smart Africa</span>
          </div>
        </div>

        <p className="text-center mt-6 text-slate-500 text-xs">
          © 2025 Smart Africa Digital Academy. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  );
}
