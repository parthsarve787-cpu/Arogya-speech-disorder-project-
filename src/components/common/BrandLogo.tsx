import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  lightMode?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base font-extrabold',
    md: 'text-xl font-black',
    lg: 'text-2xl font-black',
  };

  return (
    <div className="flex items-center space-x-3 group select-none">
      {/* Speech Therapist Geometric Logo Mark (Geometric Speech Bubbles & Sound Resonance by Andrii Kovalchuk inspired design) */}
      <div className={`relative ${iconSizes[size]} shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] shadow-sm group-hover:shadow-md transition-all duration-300`}>
        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Gentle inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/70 via-white to-teal-50/40"></div>
          
          {/* Geometric Speech Therapist Mark: Overlapping speech loop + vocal fold harmony */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 z-10 transform group-hover:scale-105 transition-transform"
          >
            {/* Primary Speech Bubble Curve */}
            <path
              d="M10 20C10 13.925 14.701 9 20.5 9C26.299 9 31 13.925 31 20C31 26.075 26.299 31 20.5 31C18.665 31 16.932 30.528 15.428 29.702L10 31L11.458 26.697C10.536 24.721 10 22.457 10 20Z"
              fill="#059669"
              fillOpacity="0.15"
            />
            {/* Geometric Overlapping Speech Wings (Therapist + Child Dialogue) */}
            <path
              d="M13 19C13 14.582 16.358 11 20.5 11C24.642 11 28 14.582 28 19C28 23.418 24.642 27 20.5 27C19.052 27 17.697 26.586 16.541 25.871L12.5 27L13.626 23.824C13.224 22.348 13 20.713 13 19Z"
              stroke="#059669"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Internal Sound Clarity Waves (Articulator) */}
            <path
              d="M17.5 19C17.5 17.343 18.843 16 20.5 16C22.157 16 23.5 17.343 23.5 19"
              stroke="#0D9488"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="20.5" cy="22" r="1.5" fill="#0D9488" />
            
            {/* Warm Growth Accent Dot (Pediatric Encouragement) */}
            <circle cx="29" cy="11.5" r="2.5" fill="#F59E0B" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          <span className={`${titleSizes[size]} text-slate-900 tracking-tight`}>
            Aarogya<span className="text-emerald-600">Speech</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wider uppercase">
            AI
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-500 font-medium tracking-normal -mt-0.5">
            Pediatric Speech & Articulation Companion
          </span>
        )}
      </div>
    </div>
  );
};
