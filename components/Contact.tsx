import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { EditModal } from './EditModal';

export const Contact: React.FC = () => {
  const { content, updateUI } = useContent();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Helper to handle saving combined title + contact data
  const handleSave = (data: any) => {
    // Split the data back into sectionTitles and contact config
    updateUI('sectionTitles', { ...content.ui.sectionTitles, contact: data.headline });
    updateUI('contact', { 
      description: data.description, 
      btnText: data.btnText,
      link: data.link 
    });
    setIsEditing(false);
  };

  const contactLink = content.ui.contact.link || `mailto:${content.about.email}`;

  return (
    <section id="contact" className="py-20 text-center px-4">
      <div className="glass-panel max-w-2xl mx-auto p-12 rounded-3xl border border-white/5 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
         
         {isAuthenticated && (
           <button 
             onClick={() => setIsEditing(true)}
             className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all z-20"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
           </button>
         )}

         <h2 className="text-3xl font-bold mb-6 text-white">{content.ui.sectionTitles.contact}</h2>
         <p className="text-gray-400 mb-8">
           {content.ui.contact.description}
         </p>
         <a href={contactLink} target={content.ui.contact.link ? "_blank" : "_self"} className="inline-block px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
           {content.ui.contact.btnText}
         </a>
      </div>

      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
        title="Contact Section"
        initialData={{
          headline: content.ui.sectionTitles.contact,
          description: content.ui.contact.description,
          btnText: content.ui.contact.btnText,
          link: content.ui.contact.link
        }}
        schema={[
          { key: 'headline', label: 'Headline', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'btnText', label: 'Button Text', type: 'text' },
          { key: 'link', label: 'Custom Link (leave empty for email)', type: 'text' }
        ]}
      />
    </section>
  );
};
