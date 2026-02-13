export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  link: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  year: string;
  description: string;
}

export interface UserProfile {
  name: string;
  roles: string[];
  bio: string;
  avatarUrl: string;
  email: string;
  phone?: string;
  address?: string;
  skills: string[];
  socials: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  style: 'neon' | 'metallic' | 'minimal';
}

export interface UIConfig {
  nav: {
    brand: string;
    brandAccent: string;
    itemAbout: string;
    itemEdu: string;
    itemProj: string;
    itemContact: string;
  };
  hero: {
    rolePrefix: string;
    btnPrimary: string;
    btnSecondary: string;
  };
  sectionTitles: {
    about: string;
    education: string;
    projects: string;
    contact: string;
  };
  contact: {
    description: string;
    btnText: string;
    link: string;
  };
  chat: {
    title: string;
    welcomeMessage: string;
    placeholder: string;
  };
  background: {
    type: 'default' | 'image';
    value: string;
    overlayOpacity: number;
  };
  theme: ThemeConfig;
  footer: string;
}

export interface AppContent {
  hero: {
    greeting: string;
    headline: string;
    subheadline: string;
  };
  about: UserProfile;
  education: EducationItem[];
  projects: Project[];
  ui: UIConfig;
}

export interface AuthState {
  user: { name: string; email: string; photoURL: string } | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

export interface ContentContextType {
  content: AppContent;
  updateSection: <K extends keyof AppContent>(section: K, data: AppContent[K]) => void;
  updateUI: <K extends keyof UIConfig>(section: K, data: UIConfig[K]) => void;
  updateProject: (project: Project) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addEducation: (edu: EducationItem) => void;
  updateEducation: (edu: EducationItem) => void;
  deleteEducation: (id: string) => void;
  resetToDefaults: () => void;
}
