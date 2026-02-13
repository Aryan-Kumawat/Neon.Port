import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';

export const Login: React.FC = () => {
  const { isAuthenticated, login, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      setIsOpen(false);
      setEmail('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="fixed top-6 right-6 z-40">
        <div className="flex items-center gap-3 p-2 pl-4 rounded-full glass-panel border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img 
                src={user?.photoURL} 
                alt="Admin" 
                className="w-8 h-8 rounded-full border border-green-400"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black" />
            </div>
            <span className="text-sm font-medium text-green-400 hidden sm:block">Admin Mode</span>
          </div>
          <button 
            onClick={logout}
            className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 flex items-center justify-center transition-colors"
            title="Logout"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-6 right-6 z-40">
        <Button 
          variant="glass" 
          size="sm" 
          onClick={() => setIsOpen(true)}
          className="bg-black/40 backdrop-blur-xl border-primary/30 text-primary shadow-[0_0_15px_rgba(var(--color-primary),0.2)]"
        >
          <span className="mr-2">⚡</span> Admin Login
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-panel w-full max-w-sm rounded-2xl p-8 border border-white/10 relative">
             <button 
               onClick={() => setIsOpen(false)}
               className="absolute top-4 right-4 text-gray-400 hover:text-white"
             >
               ✕
             </button>
             
             <h2 className="text-2xl font-display font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
               Admin Access
             </h2>

             <form onSubmit={handleLogin} className="space-y-4">
               <div>
                 <label className="block text-sm text-gray-400 mb-1">Email</label>
                 <input 
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                   placeholder="admin@neonfolio.com"
                 />
               </div>
               <div>
                 <label className="block text-sm text-gray-400 mb-1">Password</label>
                 <input 
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none"
                   placeholder="admin123"
                 />
               </div>
               
               {error && <p className="text-red-400 text-sm text-center">{error}</p>}
               
               <Button variant="primary" className="w-full mt-2" type="submit">
                 Sign In
               </Button>

               <p className="text-xs text-center text-gray-500 mt-4">
                 Demo Credentials: <br/>admin@neonfolio.com / admin123
               </p>
             </form>
          </div>
        </div>
      )}
    </>
  );
};
