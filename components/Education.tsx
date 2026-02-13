import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { EditModal } from './EditModal';
import { EducationItem } from '../types';

export const Education: React.FC = () => {
  const { content, addEducation, updateEducation, deleteEducation, updateUI } = useContent();
  const { isAuthenticated } = useAuth();
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  // F1 Car Logic
  const sectionRef = useRef<HTMLElement>(null);
  const [carPosition, setCarPosition] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate track boundaries relative to the section
      // matches CSS: top-40 (10rem = 160px) and bottom-20 (5rem = 80px)
      const trackTopOffset = 160; 
      const trackBottomOffset = 80;
      
      // The height of the track itself
      const trackHeight = rect.height - trackTopOffset - trackBottomOffset;
      
      // The point in the viewport that acts as the "cursor" (center of screen)
      // relative to the top of the section
      const cursorPositionInSection = (windowHeight / 2) - rect.top;

      // Calculate percentage progress along the track
      let progress = 0;
      if (trackHeight > 0) {
        progress = ((cursorPositionInSection - trackTopOffset) / trackHeight) * 100;
      }

      // Clamp values between 0 and 100
      progress = Math.max(0, Math.min(100, progress));
      
      setCarPosition(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll);
    // Initial calculation
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [content.education]); // Recalculate when items change

  // Item Scroll Animation Logic
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          if (id) {
            setVisibleItems((prev) => {
               const next = new Set(prev);
               next.add(id);
               return next;
            });
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    itemsRef.current.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content.education]);

  const handleAddNew = () => {
    setEditingItem({
      id: Math.random().toString(36).substr(2, 9),
      school: 'New University',
      degree: 'Degree Name',
      year: '202X - 202X',
      description: 'Description of studies...'
    });
  };

  const handleSaveItem = (data: EducationItem) => {
    if (content.education.find(e => e.id === data.id)) {
      updateEducation(data);
    } else {
      addEducation(data);
    }
    setEditingItem(null);
  };

  return (
    <section id="education" ref={sectionRef} className="py-24 px-4 max-w-6xl mx-auto relative overflow-hidden">
      
      <div className="flex justify-between items-end mb-20 relative z-20">
        <h2 className="text-5xl font-display font-bold text-white mb-2 relative group cursor-default">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-primary group-hover:to-secondary transition-all duration-500">
            {content.ui.sectionTitles.education}
          </span>
          <span className="absolute -bottom-2 left-0 w-24 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full group-hover:w-full transition-all duration-700 ease-out" />
          {isAuthenticated && (
            <button 
               onClick={() => setIsEditingTitle(true)}
               className="absolute -right-8 top-1 p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </button>
          )}
        </h2>
        {isAuthenticated && (
           <button 
             onClick={handleAddNew}
             className="px-6 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full hover:bg-green-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2 font-bold"
           >
             <span>+ Add Education</span>
           </button>
        )}
      </div>

      {/* Timeline Track & F1 Car */}
      <div className="absolute left-4 md:left-1/2 top-40 bottom-20 w-1 bg-white/10 -translate-x-1/2 rounded-full hidden md:block z-0">
        <div 
          className="absolute w-1 bg-gradient-to-b from-primary via-secondary to-accent shadow-[0_0_15px_rgba(var(--color-primary),0.8)] transition-all duration-75 ease-linear rounded-full"
          style={{ height: `${carPosition}%` }}
        />
        {/* F1 Car Icon */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 z-10 transition-transform duration-75 ease-linear filter drop-shadow-[0_0_10px_rgba(var(--color-secondary),0.8)]"
          style={{ top: `${carPosition}%` }}
        >
          <div className="relative -rotate-180 transform scale-75 md:scale-100">
             {/* Simple F1 Car SVG */}
             <svg width="40" height="80" viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M20 0L24 10H16L20 0Z" fill="#EC4899"/>
               <rect x="12" y="10" width="16" height="40" rx="4" fill="#0F172A" stroke="#A855F7" strokeWidth="2"/>
               <rect x="4" y="15" width="8" height="12" rx="2" fill="white"/>
               <rect x="28" y="15" width="8" height="12" rx="2" fill="white"/>
               <rect x="2" y="50" width="10" height="15" rx="2" fill="white"/>
               <rect x="28" y="50" width="10" height="15" rx="2" fill="white"/>
               <rect x="16" y="25" width="8" height="8" rx="4" fill="#EC4899"/>
               <path d="M12 70L28 70L32 80H8L12 70Z" fill="#A855F7"/>
               {/* Engine Glow */}
               <circle cx="20" cy="80" r="4" fill="#06B6D4" className="animate-pulse">
                 <animate attributeName="opacity" values="0.5;1;0.5" dur="0.2s" repeatCount="indefinite" />
               </circle>
             </svg>
             {/* Nitro Flames */}
             <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-8 bg-gradient-to-b from-blue-400 to-transparent blur-sm animate-nitro origin-top" />
          </div>
        </div>
      </div>

      <div className="space-y-16 relative z-10">
        {content.education.map((item, index) => (
          <div 
            key={item.id} 
            data-id={item.id}
            ref={(el) => {
              if (el) itemsRef.current.set(item.id, el);
              else itemsRef.current.delete(item.id);
            }}
            className={`
              relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group
              transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)
              ${visibleItems.has(item.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}
            `}
          >
            
            {/* Connection Line to Center (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-1/2 w-[calc(50%-2rem)] h-px bg-gradient-to-r from-primary/50 to-transparent -translate-y-1/2 z-0 group-odd:-translate-x-full group-odd:bg-gradient-to-l" />

            {/* Dot on Line */}
            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-black shadow-[0_0_20px_rgba(var(--color-primary),0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-20 group-hover:scale-150 transition-transform duration-300">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
            
            {/* Card */}
            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-4rem)] glass-panel p-8 rounded-2xl hover:border-primary/50 transition-all duration-500 relative group-hover:-translate-y-2 group-hover:shadow-[0_10px_40px_-10px_rgba(var(--color-primary),0.3)]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h3 className="font-display font-bold text-2xl text-white group-hover:text-primary transition-colors">{item.school}</h3>
                  <span className="text-xs font-bold font-mono text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 shadow-[0_0_10px_rgba(var(--color-accent),0.2)]">
                    {item.year}
                  </span>
                </div>
                <div className="text-gray-200 font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  {item.degree}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  {item.description}
                </p>
              </div>

              {isAuthenticated && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button 
                    onClick={() => setEditingItem(item)}
                    className="p-2 bg-black/50 rounded-lg text-blue-400 hover:text-white hover:bg-blue-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button 
                    onClick={() => deleteEducation(item.id)}
                    className="p-2 bg-black/50 rounded-lg text-red-400 hover:text-white hover:bg-red-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <EditModal
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
          title="Education Item"
          initialData={editingItem}
          schema={[
            { key: 'school', label: 'School / University', type: 'text' },
            { key: 'degree', label: 'Degree / Certificate', type: 'text' },
            { key: 'year', label: 'Years (e.g. 2020-2022)', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
          ]}
        />
      )}

      <EditModal
        isOpen={isEditingTitle}
        onClose={() => setIsEditingTitle(false)}
        onSave={(data) => {
          updateUI('sectionTitles', { ...content.ui.sectionTitles, education: data.title });
          setIsEditingTitle(false);
        }}
        title="Education Section Title"
        initialData={{ title: content.ui.sectionTitles.education }}
        schema={[{ key: 'title', label: 'Title', type: 'text' }]}
      />
    </section>
  );
};