import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { GeminiChat } from './components/GeminiChat';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ContentProvider, useContent } from './context/ContentContext';
import { Settings } from './components/Settings';
import { applyThemeToDocument } from './utils/themeUtils';

const AppContent: React.FC = () => {
  const { content } = useContent();
  const { isAuthenticated } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply Theme Variables
  useEffect(() => {
    applyThemeToDocument(content.ui.theme);
    // Kept for backward compatibility if any CSS still uses the attribute
    document.documentElement.setAttribute('data-theme-style', content.ui.theme.style);
  }, [content.ui.theme]);

  // Derive background properties
  const isImageMode = content.ui.background.type === 'image';
  const imageUrl = content.ui.background.value;
  const overlayOpacity = content.ui.background.overlayOpacity ?? 0.5;

  return (
    <div className="min-h-screen relative font-sans selection:bg-primary/30 selection:text-primary">
      
      {/* --- LAYER 1: Background Base (Color & Image) --- */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-500 ease-in-out"
        style={{
          backgroundColor: 'rgb(var(--color-background))',
          backgroundImage: isImageMode && imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />

      {/* --- LAYER 2: Pattern (Only for Default Mode) --- */}
      {!isImageMode && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none opacity-30"
          style={{ 
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%)'
          }} 
        />
      )}

      {/* --- LAYER 3: Overlay (Opacity Control) --- */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-colors duration-300" 
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />

      {/* --- LAYER 4: Content --- */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="pb-20">
          <Hero />
          <About />
          <Education />
          <Projects />
          <Contact />
        </main>
        
        <Footer />
      </div>
      
      {/* --- Floating Elements --- */}
      <Login />
      <GeminiChat />
      
      {/* Settings Button (Admin Only) */}
      {isAuthenticated && (
        <div className="fixed top-20 right-6 z-40">
           <button
             onClick={() => setIsSettingsOpen(true)}
             className="w-10 h-10 rounded-full bg-surface/80 hover:bg-surface border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg group"
             title="Site Settings"
           >
             <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
             </svg>
           </button>
        </div>
      )}

      {isSettingsOpen && (
        <Settings 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <AppContent />
      </ContentProvider>
    </AuthProvider>
  );
}
