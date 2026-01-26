import React, { useState } from 'react';
import { Lock, Heart } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication
    if (password === 'haninge2026') {
      onLogin();
    } else {
      setError('Incorrect password. Access denied.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <style>
        {`
          @keyframes sparkle-text {
            0%, 100% { transform: scale(1); opacity: 1; text-shadow: 0 0 0px transparent; }
            50% { transform: scale(1.3); opacity: 0.7; text-shadow: 0 0 8px rgba(0,0,0,0.2); }
          }
          .animate-sparkle-text {
            animation: sparkle-text 1.5s infinite ease-in-out;
            display: inline-block;
          }
        `}
      </style>

      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>

      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-wedding-gold/10 text-wedding-gold mb-6 shadow-inner">
            <Heart size={40} className="fill-wedding-gold/20" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-wedding-charcoal">Tara & Caner</h1>
          <p className="text-wedding-gold font-bold uppercase tracking-[0.2em] text-[10px] mt-2">10.10.2026 Planner Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Access Code</label>

            <div className="relative h-16 w-full">
              {/* Hidden Actual Input */}
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-text"
                autoFocus
              />

              {/* Visual Asterisk Display Container */}
              <div className="absolute inset-0 w-full h-full bg-white/50 border border-gray-200 rounded-xl flex items-center justify-center gap-2 px-4 transition-all pointer-events-none z-10 overflow-hidden">
                {password.length === 0 ? (
                  <span className="text-gray-300 text-sm font-bold uppercase tracking-widest animate-pulse">
                    Type Code...
                  </span>
                ) : (
                  <div className="flex flex-wrap justify-center gap-1">
                    {password.split('').map((_, idx) => (
                      <span
                        key={idx}
                        className="text-2xl font-bold text-wedding-charcoal animate-in fade-in zoom-in duration-200 animate-sparkle-text"
                        style={{ animationDelay: `${idx * 0.1}s`, lineHeight: '1' }}
                      >
                        *
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-[10px] font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100 uppercase tracking-widest">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-wedding-charcoal text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-xl hover:shadow-wedding-gold/20 active:scale-[0.98]"
          >
            Unlock Platform
          </button>
        </form>

        <div className="mt-8 text-center text-[9px] text-gray-400 uppercase tracking-widest font-bold">
          Authorized for Tara & Caner Personnel <br />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;