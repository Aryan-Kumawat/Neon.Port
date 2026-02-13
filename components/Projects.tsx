import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';
import { EditModal } from './EditModal';
import { Project } from '../types';

export const Projects: React.FC = () => {
  const { content, updateProject, deleteProject, addProject, updateUI } = useContent();
  const { isAuthenticated } = useAuth();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleAddNew = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setEditingProject({
      id: newId,
      title: 'New Project',
      description: 'Project description goes here.',
      imageUrl: 'https://picsum.photos/600/400',
      tags: ['Tag 1'],
      link: '#'
    });
  };

  const handleSave = (data: Project) => {
    if (content.projects.find(p => p.id === data.id)) {
      updateProject(data);
    } else {
      addProject(data);
    }
    setEditingProject(null);
  };

  return (
    <section id="projects" className="py-24 px-4 md:px-12 max-w-[1400px] mx-auto perspective-1000">
      <div className="flex justify-between items-end mb-16">
        <div className="relative group">
           <h2 className="text-5xl font-display font-bold text-white mb-2 tracking-tight">
             {content.ui.sectionTitles.projects}
           </h2>
           <div className="h-2 w-24 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500 group-hover:w-full group-hover:shadow-[0_0_20px_rgba(var(--color-primary),0.8)]" />
           {isAuthenticated && (
            <button 
               onClick={() => setIsEditingTitle(true)}
               className="absolute -right-8 top-1 p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
             </button>
          )}
        </div>
        {isAuthenticated && (
           <button 
             onClick={handleAddNew}
             className="px-6 py-2 bg-green-600/20 text-green-400 border border-green-500/50 rounded-full hover:bg-green-600/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all flex items-center gap-2 font-bold"
           >
             <span>+ Add Project</span>
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.projects.map((project, index) => (
          <div 
            key={project.id}
            className={`
              group relative gradient-border overflow-hidden rounded-2xl
              ${index === 0 || index === 3 ? 'md:col-span-2' : ''}
              min-h-[400px] flex flex-col justify-end p-8
              animate-zoom-in hover:z-20
              transition-all duration-500 hover:scale-[1.02] hover:-rotate-1 hover:shadow-2xl
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background Image with Scale Effect */}
            <div className="absolute inset-0 z-0 overflow-hidden">
               <img 
                 src={project.imageUrl} 
                 alt={project.title} 
                 className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
               <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Floating Content - Fades in and slides up on hover */}
            <div className="relative z-10 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
               <div className="flex gap-2 mb-4 flex-wrap">
                 {project.tags.map(tag => (
                   <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-white border border-white/10 backdrop-blur-md group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_10px_rgba(var(--color-primary),0.6)] transition-all duration-300">
                     {tag}
                   </span>
                 ))}
               </div>
               
               <h3 className="text-3xl font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary transition-all duration-300 drop-shadow-lg">
                 {project.title}
               </h3>
               
               <p className="text-gray-300 text-sm mb-6 line-clamp-2 group-hover:line-clamp-none transition-all duration-300 group-hover:text-white">
                 {project.description}
               </p>
               
               <div className="flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                 <a href={project.link} className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white hover:shadow-[0_0_20px_rgba(var(--color-primary),0.6)] transition-all duration-300 flex items-center gap-2">
                   View Project <span className="text-xl">→</span>
                 </a>
                 
                 {isAuthenticated && (
                   <div className="flex gap-2">
                     <button 
                       onClick={(e) => { e.preventDefault(); setEditingProject(project); }}
                       className="p-2 bg-blue-500/80 text-white rounded-full hover:bg-blue-400 hover:shadow-lg"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                     </button>
                     <button 
                       onClick={(e) => { e.preventDefault(); deleteProject(project.id); }}
                       className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-400 hover:shadow-lg"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                   </div>
                 )}
               </div>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <EditModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSave}
          title="Project"
          initialData={editingProject}
          schema={[
            { key: 'title', label: 'Project Title', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'imageUrl', label: 'Image URL', type: 'image' },
            { key: 'tags', label: 'Tags (comma separated)', type: 'array' },
            { key: 'link', label: 'Project Link', type: 'text' }
          ]}
        />
      )}

      <EditModal
        isOpen={isEditingTitle}
        onClose={() => setIsEditingTitle(false)}
        onSave={(data) => {
          updateUI('sectionTitles', { ...content.ui.sectionTitles, projects: data.title });
          setIsEditingTitle(false);
        }}
        title="Projects Section Title"
        initialData={{ title: content.ui.sectionTitles.projects }}
        schema={[{ key: 'title', label: 'Title', type: 'text' }]}
      />
    </section>
  );
};