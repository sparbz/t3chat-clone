'use client';

import { useState } from 'react';
import { Menu, Plus, Search, LogIn } from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export default function Sidebar({ selectedChatId, onSelectChat, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [chats, setChats] = useState<Chat[]>([
    { id: '1', title: 'Who Made You?', timestamp: new Date() }
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      timestamp: new Date(),
    };
    setChats([newChat, ...chats]);
    onSelectChat(newChat.id);
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupChatsByDate = (chats: Chat[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const groups: { [key: string]: Chat[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: [],
    };

    chats.forEach(chat => {
      const chatDate = new Date(chat.timestamp);
      chatDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        groups.Today.push(chat);
      } else if (daysDiff === 1) {
        groups.Yesterday.push(chat);
      } else if (daysDiff < 7) {
        groups['This Week'].push(chat);
      } else {
        groups.Older.push(chat);
      }
    });

    return groups;
  };

  const groupedChats = groupChatsByDate(filteredChats);

  if (isCollapsed) {
    return (
      <button
        onClick={() => onToggleCollapse(false)}
        className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 animate-fade-in"
        style={{
          backgroundColor: 'var(--bg-sidebar)',
          border: '1px solid var(--border-medium)'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-primary)' }}>
          <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M1 5h5m0-4v14M10 5h5m0 6h-5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
    );
  }

  return (
    <aside className="w-[240px] h-screen flex flex-col flex-shrink-0 fixed left-0 top-0 z-40 transition-all duration-300 animate-slide-in" style={{
      backgroundColor: 'var(--bg-sidebar)'
    }}>
      
      {/* Header */}
      <div className="relative flex items-center justify-between px-3 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <button 
          onClick={() => onToggleCollapse(!isCollapsed)}
          className="w-7 h-7 bg-transparent border-none cursor-pointer flex items-center justify-center rounded-md transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M1 5h5m0-4v14M10 5h5m0 6h-5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>
        {!isCollapsed && <h1 className="text-base font-semibold absolute left-0 right-0 text-center pointer-events-none" style={{ color: 'var(--text-primary)' }}>T3.chat</h1>}
        <div className="w-7 h-7" /> {/* Spacer for balance */}
      </div>
      
      {/* New Chat Button */}
      {!isCollapsed && (
        <div className="px-3 py-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] text-white text-[13px] font-medium cursor-pointer transition-all duration-200 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #c2185b 0%, #a8537d 100%)',
              boxShadow: '0 2px 4px rgba(168, 83, 125, 0.15)',
              height: '36px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #d81b60 0%, #b85f89 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(168, 83, 125, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #c2185b 0%, #a8537d 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(168, 83, 125, 0.15)';
            }}
          >
            <span className="text-base font-light" style={{ marginTop: '-1px' }}>+</span>
            <span>New Chat</span>
          </button>
        </div>
      )}
      
      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-3 pb-3 relative">
        <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)' }}>
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
          <path d="M11.5 11.5l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search your threads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2.5 pl-9 pr-4 text-sm outline-none transition-all duration-200"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border-medium)',
            borderRadius: '0',
            color: 'var(--text-primary)'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderBottomColor = 'var(--accent-primary)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderBottomColor = 'var(--border-medium)';
          }}
        />
        </div>
      )}
      
      {/* Chat History */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-2">
        {Object.entries(groupedChats).map(([group, chats]) => (
          chats.length > 0 && (
            <div key={group} className="mb-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.5px] px-2 py-2 m-0" style={{ color: 'var(--text-muted)' }}>{group}</h3>
              <ul className="list-none p-0 m-0">
                {chats.map(chat => (
                  <li key={chat.id}>
                    <button
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full text-left px-2 py-2.5 rounded-md cursor-pointer transition-all duration-200 text-sm`}
                      style={{
                        backgroundColor: selectedChatId === chat.id ? 'var(--hover-bg-strong)' : 'transparent',
                        color: selectedChatId === chat.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedChatId !== chat.id) {
                          e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedChatId !== chat.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <span className="block truncate">{chat.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        ))}
        </div>
      )}
      
      {/* User Section */}
      {!isCollapsed && (
        <div className="p-4 border-t mt-auto" style={{ borderColor: 'var(--border-subtle)' }}>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-200"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-medium)',
            color: 'var(--text-secondary)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
            e.currentTarget.style.borderColor = 'var(--border-light)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border-medium)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 13l4-4-4-4M11 9H3M9 3h6v12H9" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
          </svg>
          <span>Login</span>
        </button>
        </div>
      )}
    </aside>
  );
}