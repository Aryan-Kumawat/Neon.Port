import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { EditModal } from './EditModal';

export const Hero: React.FC = () => {
  const { content, updateSection, updateUI } = useContent();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter Effect
  useEffect(() => {
    const roles = content.about.roles || [];
    if (roles.length === 0) return;

    const currentRole = roles[textIndex % roles.length];
    const speed = isDeleting ? 50 : 150;

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentRole.length) {
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCharIndex(charIndex - 1);
      } else {
        if (!isDeleting) {
          setTimeout(() => setIsDeleting(true), 2000);
        } else {
          setIsDeleting(false);
          setTextIndex(textIndex + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [textIndex, charIndex, isDeleting, content.about.roles]);

  const handleSave = (data: any) => {
    const heroData = {
      greeting: data.greeting,
      headline: data.headline,
      subheadline: data.subheadline
    };
    const uiData = {
      rolePrefix: data.rolePrefix,
      btnPrimary: data.btnPrimary,
      btnSecondary: data.btnSecondary
    };
    
    if (data.roles) {
      updateSection('about', { ...content.about, roles: data.roles });
    }

    updateSection('hero', heroData);
    updateUI('hero', uiData);
    setIsEditing(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-10 overflow-hidden">
      {/* Background Elements - Hyper Speed Blobs */}
      <div className="absolute top-0 -left-20 w-[800px] h-[800px] bg-primary rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob" />
      <div className="absolute bottom-0 -right-20 w-[800px] h-[800px] bg-accent rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-blob-fast" />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Greeting & Name */}
        <div className="group relative inline-block mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl md:text-2xl text-accent font-medium tracking-widest uppercase mb-4 animate-pulse-fast">
            {content.hero.greeting}
          </h2>
          
          {/* Main Headline - Clean & Solid */}
          <div className="relative inline-block hover:scale-105 transition-transform duration-500">
            <h1 
              className="text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-tight text-white drop-shadow-[0_0_25px_rgba(var(--color-primary),0.6)] pb-4" 
            >
              {content.hero.headline}
            </h1>
          </div>
          
          {isAuthenticated && (
             <button 
               onClick={() => setIsEditing(true)}
               className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white hover:bg-primary transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(var(--color-primary),0.8)]"
               title="Edit Hero Text"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </button>
          )}
        </div>

        {/* Dynamic Typewriter Bar - Solid Colors for Legibility */}
        <div className="h-12 md:h-16 mb-8 flex items-center justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
           <span className="text-2xl md:text-4xl font-bold text-gray-300 mr-3 font-display">{content.ui.hero.rolePrefix}</span>
           <span className="text-2xl md:text-4xl font-bold text-primary border-r-4 border-accent pr-2 drop-shadow-md">
             {content.about.roles[textIndex % content.about.roles.length]?.substring(0, charIndex)}
           </span>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-10 animate-slide-up font-light" style={{ animationDelay: '0.4s' }}>
          {content.hero.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <a 
            href="#projects" 
            className="px-8 py-3 bg-white text-black font-bold text-lg rounded-full hover:scale-110 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_50px_rgba(255,255,255,0.7)] relative overflow-hidden group"
          >
            <span className="relative z-10">{content.ui.hero.btnPrimary}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </a>
          <a 
            href="#about" 
            className="px-8 py-3 glass-panel text-white font-bold text-lg rounded-full border border-white/20 hover:bg-white/10 hover:border-accent/50 hover:text-accent hover:shadow-[0_0_30px_rgba(var(--color-accent),0.3)] transition-all duration-300"
          >
            {content.ui.hero.btnSecondary}
          </a>
        </div>
      </div>

      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        title="Hero Section"
        initialData={{ ...content.hero, ...content.ui.hero, roles: content.about.roles }}
        schema={[
          { key: 'greeting', label: 'Greeting Text', type: 'text' },
          { key: 'headline', label: 'Main Headline (Name)', type: 'text' },
          { key: 'rolePrefix', label: 'Role Prefix (e.g., "I am a")', type: 'text' },
          { key: 'roles', label: 'Running Text Roles (Comma Separated)', type: 'array' },
          { key: 'subheadline', label: 'Sub Headline', type: 'textarea' },
          { key: 'btnPrimary', label: 'Primary Button Text', type: 'text' },
          { key: 'btnSecondary', label: 'Secondary Button Text', type: 'text' },
        ]}
      />
    </section>
  );
};