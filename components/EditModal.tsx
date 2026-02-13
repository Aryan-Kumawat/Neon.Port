import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  initialData: any;
  schema: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'array';
  }>;
}

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, title, initialData, schema }) => {
  const [formData, setFormData] = useState(initialData);

  // Only update formData when the modal is explicitly opened.
  // We exclude 'initialData' from the dependency array to prevent
  // parent component re-renders (like animations in Hero) from resetting 
  // the form state while the user is typing.
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-white/10 animate-[blob_0.3s_ease-out]">
        <h2 className="text-2xl font-display font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Edit {title}
        </h2>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {schema.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-400 mb-1">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none h-32 transition-colors"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              ) : field.type === 'array' ? (
                 <input
                  type="text"
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                  value={Array.isArray(formData[field.key]) ? formData[field.key].join(', ') : formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value.split(',').map((s: string) => s.trim()))}
                  placeholder="Comma separated values"
                />
              ) : (
                <input
                  type={field.type === 'text' || field.type === 'image' ? 'text' : field.type}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                  value={formData[field.key] || ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10">
          <Button variant="secondary" onClick={onClose} size="sm">Cancel</Button>
          <Button variant="primary" onClick={() => onSave(formData)} size="sm">Save Changes</Button>
        </div>
      </div>
    </div>
  );
};