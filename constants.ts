import { AppContent } from './types';

export const INITIAL_CONTENT: AppContent = {
  hero: {
    greeting: "Welcome to my world",
    headline: "I'm Alex Chen",
    subheadline: "A passionate creator building the future of the web.",
  },
  about: {
    name: "Alex Chen",
    roles: ["Full Stack Developer", "UI/UX Designer", "AI Engineer", "Creative Coder"],
    bio: "I am a dedicated developer with a knack for creating immersive digital experiences. My journey began with a curiosity for how things work on the web, and it has evolved into a career where I blend art with engineering. I specialize in React, WebGL, and Generative AI.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=400&h=400",
    email: "alex@neonfolio.com",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
    skills: ["React", "TypeScript", "Node.js", "Three.js", "Python", "TailwindCSS", "PostgreSQL", "AWS"],
    socials: {
      github: "https://github.com",
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
  },
  education: [
    {
      id: "1",
      school: "Stanford University",
      degree: "Master of Computer Science",
      year: "2020 - 2022",
      description: "Specialized in Artificial Intelligence and Human-Computer Interaction. Graduated with Honors."
    },
    {
      id: "2",
      school: "University of California, Berkeley",
      degree: "B.S. Electrical Engineering & CS",
      year: "2016 - 2020",
      description: "Core curriculum in algorithms, systems, and software engineering. President of the Web Design Club."
    }
  ],
  projects: [
    {
      id: "1",
      title: "Neon Nexus",
      description: "A cyberpunk-inspired e-commerce dashboard with real-time data visualization.",
      imageUrl: "https://picsum.photos/600/400?random=1",
      tags: ["React", "Three.js", "Tailwind"],
      link: "#",
    },
    {
      id: "2",
      title: "Gemini Vision",
      description: "AI-powered image analysis tool using Google's latest multimodal models.",
      imageUrl: "https://picsum.photos/600/400?random=2",
      tags: ["TypeScript", "Gemini API", "Vite"],
      link: "#",
    },
    {
      id: "3",
      title: "Sonic Wave",
      description: "Browser-based audio synthesizer with WebAudio API and canvas visualizations.",
      imageUrl: "https://picsum.photos/600/400?random=3",
      tags: ["WebAudio", "Canvas", "React"],
      link: "#",
    },
    {
      id: "4",
      title: "Crypto Pulse",
      description: "DeFi portfolio tracker with real-time price websockets and glassmorphism UI.",
      imageUrl: "https://picsum.photos/600/400?random=4",
      tags: ["D3.js", "WebSocket", "Tailwind"],
      link: "#",
    }
  ],
  ui: {
    nav: {
      brand: "NEON",
      brandAccent: ".FOLIO",
      itemAbout: "About",
      itemEdu: "Education",
      itemProj: "Projects",
      itemContact: "Contact"
    },
    hero: {
      rolePrefix: "I am a",
      btnPrimary: "Explore My Work",
      btnSecondary: "More About Me"
    },
    sectionTitles: {
      about: "About Me",
      education: "Education",
      projects: "Featured Projects",
      contact: "Let's Build Something Amazing"
    },
    contact: {
      description: "Have a project in mind or just want to say hi? I'm always open to discussing new ideas.",
      btnText: "Get in Touch",
      link: "" 
    },
    chat: {
      title: "GEMINI ASSISTANT",
      welcomeMessage: "Hi! I'm Alex Chen's AI assistant. Ask me anything about their work!",
      placeholder: "Ask about projects..."
    },
    background: {
      type: 'default',
      value: "",
      overlayOpacity: 0.7
    },
    theme: {
      primary: "#A855F7",
      secondary: "#EC4899",
      accent: "#06B6D4",
      background: "#030014",
      surface: "#0F172A",
      style: "neon"
    },
    footer: "© 2024 NeonFolio. Built with React, Tailwind & Gemini API."
  }
};
