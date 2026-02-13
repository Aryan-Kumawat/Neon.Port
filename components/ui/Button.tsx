import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-bold tracking-wide transition-all duration-300 focus:outline-none transform active:scale-95 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary via-purple-500 to-secondary text-white shadow-[0_0_20px_rgba(var(--color-primary),0.5)] hover:shadow-[0_0_40px_rgba(var(--color-primary),0.8)] border border-white/20 hover:scale-105",
    secondary: "bg-surface text-white hover:bg-white/10 border border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)]",
    glass: "glass-panel text-white hover:bg-white/20 border-white/20 hover:border-white/40 hover:shadow-lg"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
      )}
    </button>
  );
};