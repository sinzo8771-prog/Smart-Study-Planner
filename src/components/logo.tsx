'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 24, text: 'text-sm' },
  md: { icon: 32, text: 'text-base' },
  lg: { icon: 40, text: 'text-lg' },
  xl: { icon: 48, text: 'text-xl' },
};

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        
        {/* Background Circle */}
        <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" opacity="0.15" />
        
        {/* Book Base */}
        <path d="M12 20 L32 14 L52 20 L52 48 L32 42 L12 48 Z" fill="url(#bookGradient)" opacity="0.9" />
        <path d="M12 20 L32 26 L32 42 L12 48 Z" fill="url(#bookGradient)" />
        <path d="M52 20 L32 26 L32 42 L52 48 Z" fill="url(#logoGradient)" opacity="0.8" />
        
        {/* Book Spine */}
        <line x1="32" y1="14" x2="32" y2="42" stroke="#fff" strokeWidth="1" opacity="0.3" />
        
        {/* Graduation Cap */}
        <path d="M32 8 L52 16 L32 24 L12 16 Z" fill="url(#logoGradient)" />
        
        {/* Cap Tassel */}
        <path d="M32 24 L32 32" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
        <circle cx="32" cy="34" r="3" fill="#FBBF24" />
        
        {/* Book Pages Lines */}
        <line x1="18" y1="28" x2="28" y2="32" stroke="#fff" strokeWidth="1" opacity="0.5" />
        <line x1="18" y1="34" x2="28" y2="38" stroke="#fff" strokeWidth="1" opacity="0.5" />
        <line x1="36" y1="32" x2="46" y2="28" stroke="#fff" strokeWidth="1" opacity="0.5" />
        <line x1="36" y1="38" x2="46" y2="34" stroke="#fff" strokeWidth="1" opacity="0.5" />
        
        {/* Accent Dot */}
        <circle cx="52" cy="16" r="4" fill="#FBBF24" />
      </svg>
      
      {showText && (
        <span className={cn(
          'font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent',
          textSize
        )}>
          StudyPlanner
        </span>
      )}
    </div>
  );
}

// Icon-only version for compact spaces
export function LogoIcon({ className, size = 'md' }: Omit<LogoProps, 'showText'>) {
  const { icon: iconSize } = sizeMap[size];

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50" />
      <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <defs>
            <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          {/* Book Base */}
          <path d="M12 20 L32 14 L52 20 L52 48 L32 42 L12 48 Z" fill="url(#iconGradient)" opacity="0.9" />
          <path d="M12 20 L32 26 L32 42 L12 48 Z" fill="#fff" />
          <path d="M52 20 L32 26 L32 42 L52 48 Z" fill="url(#iconGradient)" opacity="0.8" />
          
          {/* Graduation Cap */}
          <path d="M32 8 L52 16 L32 24 L12 16 Z" fill="#fff" />
          
          {/* Cap Tassel */}
          <path d="M32 24 L32 32" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="34" r="3" fill="#FBBF24" />
          
          {/* Accent Dot */}
          <circle cx="52" cy="16" r="4" fill="#FBBF24" />
        </svg>
      </div>
    </div>
  );
}
