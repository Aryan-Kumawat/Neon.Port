import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { EditModal } from './EditModal';

export const Footer: React.FC = () => {
  const { content, updateUI } = useContent();
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <footer className="py-8 text-center text-gray-600 text-sm relative z-10 bg-black border-t border-white/5 group">
        <p className="inline-block relative">
          {content.ui.footer}
          {isAuthenticated && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute -right-8 top-0 p-1 text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          )}
        </p>
      </footer>

      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={(data) => {
          // Flattening the structure for saving single string, need to handle differently or just wrap it
          // EditModal expects object. So we pass { footer: string }
          updateUI('footer', data.footer);
          setIsEditing(false);
        }}
        title="Footer"
        initialData={{ footer: content.ui.footer }}
        schema={[
          { key: 'footer', label: 'Copyright Text', type: 'text' }
        ]}
      />
    </>
  );
};
