'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import MessageLimitBanner from '@/components/MessageLimitBanner';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messageCount, setMessageCount] = useState(9);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

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
    <div className="flex h-screen w-full" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
      <Sidebar 
        selectedChatId={selectedChatId}
        onSelectChat={(chatId) => {
          setSelectedChatId(chatId);
        }}
        isCollapsed={!sidebarOpen}
        onToggleCollapse={(collapsed) => setSidebarOpen(!collapsed)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden relative transition-all duration-300" style={{ 
        backgroundColor: 'var(--bg-main)',
        marginLeft: sidebarOpen ? '220px' : '0',
        marginTop: '8px',
        paddingLeft: '20px',
        borderRadius: '20px 0 0 0',
        borderTop: '1px solid var(--border-subtle)',
        borderLeft: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Top Bar with carved out section */}
        <div className="absolute top-0 right-0 z-10" style={{
          backgroundColor: 'var(--bg-sidebar)',
          padding: '12px 16px 12px 24px',
          borderRadius: '0 0 0 24px',
          borderLeft: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div className="h-full flex items-center gap-2">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200" 
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title="Share">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="2.5" fill="currentColor"/>
                  <circle cx="16" cy="4" r="2.5" fill="currentColor"/>
                  <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
                  <circle cx="4" cy="10" r="2.5" fill="currentColor"/>
                  <path d="M10 10L16 4M10 10L16 16M10 10L4 10" 
                        stroke="currentColor" 
                        strokeWidth="1.5"/>
                </svg>
              </button>
              <button 
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200" 
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-light)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                {theme === 'dark' ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="4.5" fill="currentColor"/>
                    <path d="M10 1.5v2.5m0 12v2.5m8.5-8.5h-2.5m-12 0H1.5" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round"/>
                    <path d="M16.5 3.5l-2 2m-9 9l-2 2m11-2l2 2m-11-11l-2-2" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.39 15.908A7 7 0 0 1 4.092 2.61 9 9 0 1 0 17.39 15.908z" 
                          fill="currentColor"/>
                  </svg>
                )}
              </button>
          </div>
        </div>


        <div className="flex flex-col flex-1">
          <ChatArea 
            chatId={selectedChatId}
            onNewMessage={() => setMessageCount(prev => prev + 1)}
            showMessageLimit={!isAuthenticated}
            sidebarOpen={sidebarOpen}
          />
        </div>
      </main>
    </div>
  );
}