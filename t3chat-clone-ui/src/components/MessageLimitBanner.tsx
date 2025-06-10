'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function MessageLimitBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="message-banner px-6 py-3 flex items-center justify-center text-sm font-normal relative rounded-full shadow-lg" style={{ 
      backgroundColor: 'var(--warning-banner)',
      color: 'var(--color-warning)',
      border: '1px solid rgba(255, 152, 0, 0.15)',
      boxShadow: '0 4px 24px rgba(255, 152, 0, 0.15)'
    }}>
      <div className="flex items-center gap-1.5">
        <span style={{ color: 'inherit' }}>You only have 9 messages left.</span>
        <a href="#" className="underline underline-offset-2 font-medium cursor-pointer transition-all duration-200 hover:no-underline" style={{ color: 'inherit' }}>
          Sign in to reset your limits
        </a>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 bg-transparent border-none cursor-pointer flex items-center justify-center rounded transition-all duration-200 hover:bg-black/5"
        style={{ color: 'var(--color-warning)' }}
        aria-label="Close banner"
      >
        <X size={16} strokeWidth={2} />
      </button>
    </div>
  );
}