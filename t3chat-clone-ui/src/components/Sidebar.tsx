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
}

export default function Sidebar({ selectedChatId, onSelectChat }: SidebarProps) {
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

  return (
    <aside className="w-[280px] h-screen flex flex-col flex-shrink-0 relative lg:translate-x-0 transition-transform duration-300" style={{
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-subtle)'
    }}>
      
      {/* Header */}
      <div className="flex items-center px-4 py-5 gap-3 border-b border-white/5">
        <button className="w-8 h-8 bg-transparent border-none text-[#6b7280] cursor-pointer flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/5 hover:text-[#a8a3b8]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"/>
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-white">T3.chat</h1>
      </div>
      
      {/* New Chat Button */}
      <div className="px-4 py-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 btn-primary rounded-lg text-white text-sm font-medium cursor-pointer"
        >
          <span className="text-xl font-light leading-none">+</span>
          <span>New Chat</span>
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 pb-4 relative">
        <svg className="absolute left-7 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)' }}>
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search your threads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2.5 pl-9 pr-4 text-white text-sm outline-none transition-all duration-200"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border-medium)',
            borderRadius: '0'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderBottomColor = 'var(--accent-primary)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderBottomColor = 'var(--border-medium)';
          }}
        />
      </div>
      
      {/* Chat History */}
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
                      className={`w-full text-left px-2 py-2.5 rounded-md cursor-pointer transition-all duration-200 text-sm ${
                        selectedChatId === chat.id
                          ? 'bg-white/[0.08] text-white'
                          : 'hover:text-white'
                      }`}
                      style={{
                        backgroundColor: selectedChatId === chat.id ? 'rgba(168, 83, 125, 0.12)' : 'transparent',
                        color: selectedChatId === chat.id ? '#ffffff' : 'var(--text-secondary)'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedChatId !== chat.id) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.color = '#ffffff';
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
      
      {/* User Section */}
      <div className="p-4 border-t border-white/5 mt-auto">
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
    </aside>
  );
}