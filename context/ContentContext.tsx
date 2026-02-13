import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContent, ContentContextType, Project, EducationItem, UIConfig } from '../types';
import { INITIAL_CONTENT } from '../constants';

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppContent>(INITIAL_CONTENT);

  useEffect(() => {
    const stored = localStorage.getItem('folio_content');
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Deep merge logic
      const mergedContent = { 
        ...INITIAL_CONTENT, 
        ...parsed, 
        ui: { 
          ...INITIAL_CONTENT.ui, 
          ...parsed.ui,
          background: { ...INITIAL_CONTENT.ui.background, ...parsed.ui?.background },
          theme: { ...INITIAL_CONTENT.ui.theme, ...parsed.ui?.theme },
          chat: { ...INITIAL_CONTENT.ui.chat, ...parsed.ui?.chat },
          contact: { ...INITIAL_CONTENT.ui.contact, ...parsed.ui?.contact },
          nav: { ...INITIAL_CONTENT.ui.nav, ...parsed.ui?.nav },
          hero: { ...INITIAL_CONTENT.ui.hero, ...parsed.ui?.hero },
          sectionTitles: { ...INITIAL_CONTENT.ui.sectionTitles, ...parsed.ui?.sectionTitles }
        } 
      };
      
      setContent(mergedContent);
    }
  }, []);

  // Helper to persist to localStorage after state update
  const persistContent = (newContent: AppContent) => {
    localStorage.setItem('folio_content', JSON.stringify(newContent));
    return newContent;
  };

  // Functional update wrappers to prevent race conditions
  const updateSection = <K extends keyof AppContent>(section: K, data: AppContent[K]) => {
    setContent(prev => persistContent({ ...prev, [section]: data }));
  };

  const updateUI = <K extends keyof UIConfig>(section: K, data: UIConfig[K]) => {
    setContent(prev => persistContent({
      ...prev,
      ui: {
        ...prev.ui,
        [section]: data
      }
    }));
  };

  const updateProject = (project: Project) => {
    setContent(prev => {
      const newProjects = prev.projects.map(p => p.id === project.id ? project : p);
      return persistContent({ ...prev, projects: newProjects });
    });
  };

  const addProject = (project: Project) => {
    setContent(prev => persistContent({ ...prev, projects: [...prev.projects, project] }));
  };

  const deleteProject = (id: string) => {
    setContent(prev => persistContent({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const updateEducation = (edu: EducationItem) => {
    setContent(prev => {
      const newEdu = prev.education.map(e => e.id === edu.id ? edu : e);
      return persistContent({ ...prev, education: newEdu });
    });
  };

  const addEducation = (edu: EducationItem) => {
    setContent(prev => persistContent({ ...prev, education: [...prev.education, edu] }));
  };

  const deleteEducation = (id: string) => {
    setContent(prev => persistContent({ ...prev, education: prev.education.filter(e => e.id !== id) }));
  };

  const resetToDefaults = () => {
    setContent(persistContent(INITIAL_CONTENT));
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      updateSection, 
      updateUI,
      updateProject, 
      addProject, 
      deleteProject,
      updateEducation,
      addEducation,
      deleteEducation,
      resetToDefaults 
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};