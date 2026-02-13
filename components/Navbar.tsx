import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { EditModal } from './EditModal';

export const Navbar: React.FC = () => {
  const { content, updateUI } = useContent();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-[2px] pointer-events-none animate-slide-down">
        <div className="pointer-events-auto font-display font-bold text-2xl tracking-tighter relative group hover:scale-105 transition-transform duration-300">
          <span className="text-white">{content.ui.nav.brand}</span>
          <span className="text-primary animate-pulse">{content.ui.nav.brandAccent}</span>
          
          {isAuthenticated && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -right-6 top-0 p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          )}
        </div>
        
        <div className="pointer-events-auto hidden sm:flex gap-6 text-sm font-medium text-gray-300">
          <a href="#about" className="hover:text-primary hover:-translate-y-1 transition-all duration-300">{content.ui.nav.itemAbout}</a>
          <a href="#education" className="hover:text-primary hover:-translate-y-1 transition-all duration-300">{content.ui.nav.itemEdu}</a>
          <a href="#projects" className="hover:text-primary hover:-translate-y-1 transition-all duration-300">{content.ui.nav.itemProj}</a>
          <a href="#contact" className="hover:text-primary hover:-translate-y-1 transition-all duration-300">{content.ui.nav.itemContact}</a>
        </div>
      </nav>

      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={(data) => {
          updateUI('nav', data);
          setIsEditing(false);
        }}
        title="Navigation Bar"
        initialData={content.ui.nav}
        schema={[
          { key: 'brand', label: 'Brand Name', type: 'text' },
          { key: 'brandAccent', label: 'Brand Accent (Colored)', type: 'text' },
          { key: 'itemAbout', label: 'Link: About', type: 'text' },
          { key: 'itemEdu', label: 'Link: Education', type: 'text' },
          { key: 'itemProj', label: 'Link: Projects', type: 'text' },
          { key: 'itemContact', label: 'Link: Contact', type: 'text' },
        ]}
      />
    </>
  );
};
