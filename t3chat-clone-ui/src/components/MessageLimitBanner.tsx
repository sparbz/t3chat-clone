'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function MessageLimitBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="text-white px-5 py-3 flex items-center justify-center text-sm font-normal" style={{ backgroundColor: 'var(--warning-banner)' }}>
      <div className="flex items-center gap-1.5">
        <span className="text-white">You only have 9 messages left.</span>
        <a href="#" className="text-white underline underline-offset-2 font-medium cursor-pointer transition-opacity duration-200 hover:no-underline hover:opacity-90">
          Sign in to reset your limits
        </a>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-transparent border-none text-white cursor-pointer flex items-center justify-center rounded opacity-80 transition-all duration-200 hover:opacity-100 hover:bg-white/10"
        aria-label="Close banner"
      >
        <X size={18} />
      </button>
    </div>
  );
}