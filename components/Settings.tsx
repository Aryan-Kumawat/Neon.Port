import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { Button } from './ui/Button';
import { ThemeConfig } from '../types';
import { applyThemeToDocument } from '../utils/themeUtils';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEMES = {
  cyberpunk: {
    primary: '#A855F7',
    secondary: '#EC4899',
    accent: '#06B6D4',
    background: '#030014',
    surface: '#0F172A'
  },
  matrix: {
    primary: '#00FF41',
    secondary: '#008F11',
    accent: '#D4FF00',
    background: '#0D0208',
    surface: '#003B00'
  },
  ocean: {
    primary: '#0EA5E9',
    secondary: '#3B82F6',
    accent: '#2DD4BF',
    background: '#020617',
    surface: '#0B1120'
  },
  sunset: {
    primary: '#F97316',
    secondary: '#E11D48',
    accent: '#FBBF24',
    background: '#1c0505',
    surface: '#2d0a0a'
  },
  monochrome: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
    accent: '#D1D5DB',
    background: '#000000',
    surface: '#111111'
  }
};

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { content, updateUI } = useContent();
  const [activeTab, setActiveTab] = useState<'theme' | 'background'>('theme');
  const [theme, setTheme] = useState(content.ui.theme);
  const [bg, setBg] = useState(content.ui.background);
  
  // Track if we actually applied the changes to context
  const isApplied = useRef(false);
  const initialTheme = useRef(content.ui.theme);

  // Live Preview: Apply colors immediately when state changes locally
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Cleanup: Revert to original content colors ONLY if we closed without applying
  useEffect(() => {
    return () => {
      if (!isApplied.current) {
        applyThemeToDocument(initialTheme.current);
      }
    };
  }, []);

  const handleApply = () => {
    isApplied.current = true;
    updateUI('theme', theme);
    updateUI('background', bg);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const applyPreset = (key: keyof typeof THEMES) => {
    setTheme(prev => ({ ...prev, ...THEMES[key] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-white/10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold text-white">Site Settings</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            className={`flex-1 p-4 text-sm font-medium transition-colors ${activeTab === 'theme' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('theme')}
          >
            Theme & Colors
          </button>
          <button 
            className={`flex-1 p-4 text-sm font-medium transition-colors ${activeTab === 'background' ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('background')}
          >
            Background
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {activeTab === 'theme' ? (
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Color Presets</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.keys(THEMES).map((key) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key as any)}
                      className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-sm hover:bg-white/10 capitalize hover:scale-105 transition-transform"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Primary Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={theme.primary} onChange={(e) => setTheme({...theme, primary: e.target.value})} className="bg-transparent w-8 h-8 rounded cursor-pointer" />
                    <input type="text" value={theme.primary} onChange={(e) => setTheme({...theme, primary: e.target.value})} className="flex-1 bg-black/50 border border-white/10 rounded px-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Secondary Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={theme.secondary} onChange={(e) => setTheme({...theme, secondary: e.target.value})} className="bg-transparent w-8 h-8 rounded cursor-pointer" />
                    <input type="text" value={theme.secondary} onChange={(e) => setTheme({...theme, secondary: e.target.value})} className="flex-1 bg-black/50 border border-white/10 rounded px-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Accent Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={theme.accent} onChange={(e) => setTheme({...theme, accent: e.target.value})} className="bg-transparent w-8 h-8 rounded cursor-pointer" />
                    <input type="text" value={theme.accent} onChange={(e) => setTheme({...theme, accent: e.target.value})} className="flex-1 bg-black/50 border border-white/10 rounded px-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={theme.background} onChange={(e) => setTheme({...theme, background: e.target.value})} className="bg-transparent w-8 h-8 rounded cursor-pointer" />
                    <input type="text" value={theme.background} onChange={(e) => setTheme({...theme, background: e.target.value})} className="flex-1 bg-black/50 border border-white/10 rounded px-2 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
               <div>
                <label className="block text-sm text-gray-400 mb-2">Background Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="bgType" 
                      checked={bg.type === 'default'} 
                      onChange={() => setBg({...bg, type: 'default'})}
                      className="text-primary focus:ring-primary" 
                    />
                    <span>Default Pattern</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="bgType" 
                      checked={bg.type === 'image'} 
                      onChange={() => setBg({...bg, type: 'image'})}
                      className="text-primary focus:ring-primary" 
                    />
                    <span>Custom Image</span>
                  </label>
                </div>
              </div>

              {bg.type === 'image' && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                  <input 
                    type="text" 
                    value={bg.value || ''} 
                    onChange={(e) => setBg({...bg, value: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-primary focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Direct link to an image file.</p>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">Overlay Opacity ({bg.overlayOpacity ?? 0.5})</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={bg.overlayOpacity ?? 0.5} 
                  onChange={(e) => setBg({...bg, overlayOpacity: parseFloat(e.target.value)})}
                  className="w-full accent-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Controls darkness of the overlay (0 = transparent, 1 = solid black).</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} size="sm">Cancel</Button>
          <Button variant="primary" onClick={handleApply} size="sm">Apply Changes</Button>
        </div>
      </div>
    </div>
  );
};