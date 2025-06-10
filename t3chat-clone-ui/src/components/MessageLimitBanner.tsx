'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function MessageLimitBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="message-banner text-white px-6 py-3.5 flex items-center justify-center text-sm font-normal relative" style={{ backgroundColor: 'var(--warning-banner)' }}>
      <div className="flex items-center gap-1.5">
        <span className="text-white/95">You only have 9 messages left.</span>
        <a href="#" className="text-white underline underline-offset-2 font-normal cursor-pointer transition-all duration-200 hover:no-underline hover:opacity-90">
          Sign in to reset your limits
        </a>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-transparent border-none text-white/80 cursor-pointer flex items-center justify-center rounded transition-all duration-200 hover:text-white hover:bg-white/10"
        aria-label="Close banner"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}