'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import MessageLimitBanner from '@/components/MessageLimitBanner';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messageCount, setMessageCount] = useState(9);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (window.innerWidth <= 768 && sidebarOpen) {
        const sidebar = document.querySelector('aside');
        if (sidebar && !sidebar.contains(e.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen w-full" style={{ backgroundColor: 'var(--bg-main)' }}>
      {/* Mobile menu button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center border rounded-lg"
        style={{ 
          backgroundColor: 'var(--bg-sidebar)',
          borderColor: 'var(--border-medium)'
        }}
      >
        <Menu size={20} className="text-white" />
      </button>

      {/* Overlay for mobile */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <div className={`${sidebarOpen ? 'open' : ''}`}>
        <Sidebar 
          selectedChatId={selectedChatId}
          onSelectChat={(chatId) => {
            setSelectedChatId(chatId);
            setSidebarOpen(false);
          }}
        />
      </div>
      
      <main className="flex-1 flex flex-col overflow-hidden relative" style={{ 
        backgroundColor: 'var(--bg-main)',
        marginLeft: '-20px',
        paddingLeft: '20px',
        borderRadius: '20px 0 0 20px'
      }}>
        {/* Top Bar */}
        <div className="absolute top-0 right-0 left-0 h-16 z-10 px-6">
          <div className="h-full flex items-center justify-between">
            <div>{/* Optional breadcrumb */}</div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200" 
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                title="Share">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8 3H3v5M17 8V3h-5M12 17h5v-5M3 12v5h5" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"/>
                </svg>
              </button>
              <button className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200" 
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
                title="Toggle theme">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 1v2m0 14v2m9-9h-2M3 10H1m14.14 4.14l-1.41 1.41M6.27 6.27L4.86 4.86m10.28 0l-1.41 1.41M6.27 13.73l-1.41 1.41" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>


        {/* Message Banner at TOP of main content */}
        {!isAuthenticated && (
          <MessageLimitBanner />
        )}
        
        <div className="flex flex-col flex-1">
          <ChatArea 
            chatId={selectedChatId}
            onNewMessage={() => setMessageCount(prev => prev + 1)}
          />
        </div>
      </main>
    </div>
  );
}