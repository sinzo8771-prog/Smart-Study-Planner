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
      {/* Simple Gradient Icon */}
      <div 
        className="shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
        style={{ width: iconSize, height: iconSize }}
      >
        <svg
          width={iconSize * 0.6}
          height={iconSize * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Book Icon */}
          <path 
            d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Graduation Cap on top */}
          <path 
            d="M12 6L16 8L12 10L8 8L12 6Z" 
            fill="white"
          />
          <path 
            d="M12 10V13" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          <circle cx="12" cy="13.5" r="1" fill="#FBBF24"/>
        </svg>
      </div>
      
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
      <div 
        className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center"
        style={{ width: iconSize + 8, height: iconSize + 8 }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M12 6L16 8L12 10L8 8L12 6Z" 
            fill="white"
          />
          <path 
            d="M12 10V13" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          <circle cx="12" cy="13.5" r="1" fill="#FBBF24"/>
        </svg>
      </div>
    </div>
  );
}
