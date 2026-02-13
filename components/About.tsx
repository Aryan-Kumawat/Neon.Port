import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { EditModal } from './EditModal';

export const About: React.FC = () => {
  const { content, updateSection, updateUI } = useContent();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Scroll Animation State
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Trigger once
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSave = (data: any) => {
    // Separate title update from profile data update
    const title = data.sectionTitle;
    delete data.sectionTitle; // Remove from profile data object
    
    updateUI('sectionTitles', { ...content.ui.sectionTitles, about: title });
    updateSection('about', data);
    setIsEditing(false);
  };

  return (
    <section id="about" ref={sectionRef} className="py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Profile Picture Column - Slide in from Left */}
          <div className={`relative group flex justify-center md:justify-end transition-all duration-1000 ease-out transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="animate-float">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Neon Glow Rings */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-pulse-slow"></div>
                
                {/* Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border border-white/10 glass-panel shadow-2xl">
                  <img 
                    src={content.about.avatarUrl} 
                    alt={content.about.name}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {isAuthenticated && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/80 transition-colors z-20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Skills Column - Staggered Animations */}
          <div className="relative">
            <h2 className={`text-4xl font-display font-bold text-white mb-6 flex items-center gap-3 transition-all duration-700 delay-100 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              {content.ui.sectionTitles.about}
              <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent ml-4" />
            </h2>
            
            <div className={`glass-panel p-8 rounded-2xl relative group hover:border-white/20 transition-all duration-700 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
               {isAuthenticated && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
               )}
               
               <p className={`text-gray-300 leading-relaxed text-lg mb-8 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                 {content.about.bio}
               </p>

               <div className="space-y-4">
                 <h3 className={`text-xl font-bold text-accent transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>Skills & Technologies</h3>
                 <div className="flex flex-wrap gap-2">
                   {content.about.skills.map((skill, i) => (
                     <span 
                       key={i} 
                       className={`px-3 py-1 bg-white/5 border border-white/5 rounded-full text-sm text-gray-300 hover:bg-white/10 hover:text-white hover:border-primary/50 transition-all duration-300 cursor-default ${isVisible ? 'animate-zoom-in' : 'opacity-0'}`}
                       style={{ animationDelay: `${600 + i * 50}ms`, animationFillMode: 'forwards' }}
                     >
                       {skill}
                     </span>
                   ))}
                 </div>
               </div>

               <div className={`mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="hover:text-primary transition-colors">
                   <span className="block text-sm text-gray-500">Email</span>
                   <span className="text-white">{content.about.email}</span>
                 </div>
                 {content.about.phone && (
                    <div className="hover:text-primary transition-colors">
                      <span className="block text-sm text-gray-500">Phone</span>
                      <span className="text-white">{content.about.phone}</span>
                    </div>
                 )}
                 {content.about.address && (
                    <div className="hover:text-primary transition-colors">
                      <span className="block text-sm text-gray-500">Location</span>
                      <span className="text-white">{content.about.address}</span>
                    </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        title="About & Profile"
        initialData={{ ...content.about, sectionTitle: content.ui.sectionTitles.about }}
        schema={[
          { key: 'sectionTitle', label: 'Section Title', type: 'text' },
          { key: 'name', label: 'Full Name', type: 'text' },
          { key: 'avatarUrl', label: 'Profile Picture URL', type: 'image' },
          { key: 'roles', label: 'Roles (Typewriter Effect - Comma Separated)', type: 'array' },
          { key: 'bio', label: 'Biography', type: 'textarea' },
          { key: 'skills', label: 'Skills (Comma Separated)', type: 'array' },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'phone', label: 'Phone', type: 'text' },
          { key: 'address', label: 'Location', type: 'text' },
        ]}
      />
    </section>
  );
};