'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Globe } from 'lucide-react';
import Message from './Message';
import MessageLimitBanner from './MessageLimitBanner';
import ModelSelector, { Model } from './ModelSelector';

interface ChatAreaProps {
  chatId: string | null;
  onNewMessage: () => void;
  showMessageLimit?: boolean;
  sidebarOpen?: boolean;
}

interface MessageType {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AI_MODELS: Model[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast & efficient', isNew: true },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Advanced reasoning', isPro: true },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Latest GPT model', isPro: true },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast responses' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced performance', isPro: true },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Quick & efficient' },
  { id: 'llama-3', name: 'Llama 3', description: 'Open source model' },
  { id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Chinese optimization', isNew: true, isPro: true },
];

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  create: [
    'Write a short story about a robot discovering emotions',
    'Design a logo concept for a sustainable coffee shop',
    'Create a haiku about artificial intelligence',
    'Generate a recipe using only 5 ingredients'
  ],
  explore: [
    'Good books for fans of Rick Rubin',
    'Hidden gems in Japanese cuisine',
    'Underrated sci-fi movies from the 90s',
    'Interesting facts about deep sea creatures'
  ],
  code: [
    'Write code to invert a binary search tree in Python',
    'Create a responsive navigation bar with CSS',
    'Build a simple REST API with Node.js',
    'Implement a debounce function in JavaScript'
  ],
  learn: [
    'Beginner\'s guide to TypeScript',
    'How does blockchain technology work?',
    'Explain quantum computing in simple terms',
    'What are the basics of machine learning?'
  ]
};

export default function ChatArea({ chatId, onNewMessage, showMessageLimit = false, sidebarOpen = true }: ChatAreaProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('create');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async (message?: string) => {
    const messageText = message || inputValue.trim();
    if (!messageText || isStreaming) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    onNewMessage();
    setIsStreaming(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a simulated response from ${selectedModel.name}. In a real implementation, this would connect to the actual AI API.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsStreaming(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Empty state - no chat selected or no messages
  if (!chatId || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col relative">

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-5 py-10 flex items-center justify-center pb-[120px]">
          <div className="w-full max-w-[600px] text-center">
            <h1 className="text-[28px] font-normal mb-12" style={{ color: 'var(--text-primary)' }}>How can I help you?</h1>
            
            {/* Quick Actions */}
            <div className="flex gap-2.5 justify-center mb-10 flex-wrap">
              <button 
                onClick={() => setSelectedCategory('create')}
                className="glass min-w-[130px] flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-medium cursor-pointer transition-all duration-300 group"
                style={{
                  backgroundColor: selectedCategory === 'create' ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedCategory === 'create' ? '1px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: selectedCategory === 'create' ? 'var(--text-on-primary, white)' : 'var(--text-primary)',
                  boxShadow: selectedCategory === 'create' ? '0 8px 32px rgba(236, 72, 153, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.2)' : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  transform: selectedCategory === 'create' ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== 'create') {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                  }
                  e.currentTarget.style.transform = selectedCategory === 'create' ? 'scale(1.05) translateY(-2px)' : 'scale(1.02) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== 'create') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }
                  e.currentTarget.style.transform = selectedCategory === 'create' ? 'scale(1.05)' : 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                  <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z" 
                        fill="currentColor"/>
                  <path d="M16 14l.75 2.25L19 17l-2.25.75L16 20l-.75-2.25L13 17l2.25-.75L16 14z" 
                        fill="currentColor" opacity="0.6"/>
                  <path d="M5 15l.5 1.5L7 17l-1.5.5L5 19l-.5-1.5L3 17l1.5-.5L5 15z" 
                        fill="currentColor" opacity="0.4"/>
                </svg>
                <span>Create</span>
              </button>
              <button 
                onClick={() => setSelectedCategory('explore')}
                className="quick-action-button min-w-[120px] flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] text-sm font-normal cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: selectedCategory === 'explore' ? 'var(--accent-primary)' : 'transparent',
                  border: selectedCategory === 'explore' ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  color: selectedCategory === 'explore' ? 'var(--text-on-primary, white)' : 'var(--text-secondary)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: selectedCategory === 'explore' ? '0 2px 8px rgba(194, 24, 91, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== 'explore') {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                  }
                  e.currentTarget.style.transform = selectedCategory === 'create' ? 'scale(1.05) translateY(-2px)' : 'scale(1.02) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== 'explore') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }
                  e.currentTarget.style.transform = selectedCategory === 'create' ? 'scale(1.05)' : 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                  <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M7 7h6m-6 3h6m-6 3h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>Explore</span>
              </button>
              <button 
                onClick={() => setSelectedCategory('code')}
                className="quick-action-button min-w-[120px] flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] text-sm font-normal cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: selectedCategory === 'code' ? 'var(--accent-primary)' : 'transparent',
                  border: selectedCategory === 'code' ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  color: selectedCategory === 'code' ? 'var(--text-on-primary, white)' : 'var(--text-secondary)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: selectedCategory === 'code' ? '0 2px 8px rgba(194, 24, 91, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== 'code') {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                  }
                  e.currentTarget.style.transform = selectedCategory === 'create' ? 'scale(1.05) translateY(-2px)' : 'scale(1.02) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== 'code') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }
                  e.currentTarget.style.transform = selectedCategory === 'create' ? 'scale(1.05)' : 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                  <path d="M7 7l-3 3l3 3m6-6l3 3l-3 3m-1-9l-2 10" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                </svg>
                <span>Code</span>
              </button>
              <button 
                onClick={() => setSelectedCategory('learn')}
                className="quick-action-button min-w-[120px] flex items-center justify-center gap-2 px-5 py-3 rounded-[10px] text-sm font-normal cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: selectedCategory === 'learn' ? 'var(--accent-primary)' : 'transparent',
                  border: selectedCategory === 'learn' ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  color: selectedCategory === 'learn' ? 'var(--text-on-primary, white)' : 'var(--text-secondary)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: selectedCategory === 'learn' ? '0 2px 8px rgba(194, 24, 91, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== 'learn') {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
                    e.currentTarget.style.borderColor = 'var(--border-medium)';
                  }
                  e.currentTarget.style.transform = selectedCategory === 'create' ? 'scale(1.05) translateY(-2px)' : 'scale(1.02) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== 'learn') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }
                  e.currentTarget.style.transform = selectedCategory === 'create' ? 'scale(1.05)' : 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
                  <path d="M10 4C10 4 7 3 4 3C2.5 3 2 3.5 2 5v10c0 1 .5 1.5 2 1.5c3 0 6 1 6 1s3-1 6-1c1.5 0 2-.5 2-1.5V5c0-1.5-.5-2-2-2c-3 0-6 1-6 1z" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                  <path d="M10 4v12.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
                <span>Learn</span>
              </button>
            </div>

            {/* Example Prompts */}
            <div className="flex flex-col gap-2.5 w-full max-w-[500px] mx-auto">
              {EXAMPLE_PROMPTS[selectedCategory].map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="example-prompt group w-full px-3 py-2.5 rounded-lg text-sm font-normal text-left cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
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
                >
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Limit Banner */}
        {showMessageLimit && (
          <div className="fixed bottom-[160px] left-0 right-0 z-20 flex justify-center" style={{ paddingLeft: sidebarOpen ? '240px' : '0' }}>
            <div className="max-w-[500px] w-full mx-6">
              <MessageLimitBanner />
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="fixed bottom-0 left-0 right-0 p-6 z-20" style={{
          paddingLeft: sidebarOpen ? '260px' : '20px'
        }}>
          <div className="max-w-[800px] mx-auto w-full">
            <div className="rounded-2xl overflow-hidden transition-all duration-300 focus-within:shadow-[0_0_40px_rgba(236,72,153,0.3)] group"
              style={{
                backgroundColor: 'var(--input-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border-light)',
                boxShadow: '0 2px 8px var(--shadow-light)'
              }}
            >
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="w-full px-5 py-3.5 bg-transparent border-0 text-white text-base leading-relaxed resize-none outline-none font-inherit min-h-[24px] max-h-[200px] block"
                style={{ color: 'var(--text-primary)' }}
                rows={1}
              />
              
              <div className="flex items-center justify-between px-4 py-3 gap-3" style={{ 
                borderTop: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-secondary, rgba(0, 0, 0, 0.05))'
              }}>
                <div className="flex items-center gap-2">
                  <ModelSelector
                    models={AI_MODELS}
                    selectedModel={selectedModel}
                    onSelectModel={setSelectedModel}
                    isOpen={showModelDropdown}
                    onOpenChange={setShowModelDropdown}
                  />

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-secondary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <Globe size={16} />
                      <span>Search</span>
                    </button>

                    <button className="w-8 h-8 p-0 flex items-center justify-center rounded-md cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-secondary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10m5-5H3" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                  className={`w-8 h-8 rounded-md border-none text-white flex items-center justify-center cursor-pointer ml-auto transition-all duration-200 ${inputValue.trim() ? 'animate-pulse-glow' : ''}`}
                  style={{ 
                    backgroundColor: inputValue.trim() ? 'var(--button-pink)' : 'rgba(168, 83, 125, 0.4)',
                    opacity: inputValue.trim() ? 1 : 0.6
                  }}
                  onMouseEnter={(e) => {
                    if (inputValue.trim()) {
                      e.currentTarget.style.backgroundColor = 'var(--button-pink-hover)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (inputValue.trim()) {
                      e.currentTarget.style.backgroundColor = 'var(--button-pink)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 10L14 2M14 2H8M14 2V8" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat with messages
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto pb-[120px]">
        <div className="max-w-[800px] mx-auto px-5 py-8">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isStreaming && (
            <div className="py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-[typing_1.4s_infinite]" style={{ backgroundColor: 'var(--silver-dim)' }}></div>
                <div className="w-2 h-2 rounded-full animate-[typing_1.4s_infinite_0.2s]" style={{ backgroundColor: 'var(--silver-dim)' }}></div>
                <div className="w-2 h-2 rounded-full animate-[typing_1.4s_infinite_0.4s]" style={{ backgroundColor: 'var(--silver-dim)' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Limit Banner */}
      {showMessageLimit && (
        <div className="fixed bottom-[88px] left-0 right-0 z-20" style={{ paddingLeft: sidebarOpen ? '240px' : '0' }}>
          <MessageLimitBanner />
        </div>
      )}

      {/* Input Section */}
      <div className="fixed bottom-0 left-0 right-0 p-5 z-20" style={{
        paddingLeft: sidebarOpen ? '260px' : '20px', 
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-main)'
      }}>
        <div className="max-w-[800px] mx-auto w-full">
          <div className="rounded-lg overflow-hidden transition-all duration-300 focus-within:border-[rgba(168,83,125,0.3)] focus-within:shadow-[0_0_0_1px_rgba(168,83,125,0.1)]" style={{
            backgroundColor: 'var(--input-bg)',
            border: '1px solid var(--border-light)'
          }}>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="w-full px-5 py-4 bg-transparent border-0 text-white text-base leading-relaxed resize-none outline-none font-inherit min-h-[24px] max-h-[200px] block placeholder:text-[var(--silver-dim)]"
              rows={1}
            />
            
            <div className="flex items-center justify-between px-4 py-3 gap-3" style={{ 
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div className="flex items-center gap-2">
                <ModelSelector
                  models={AI_MODELS}
                  selectedModel={selectedModel}
                  onSelectModel={setSelectedModel}
                  isOpen={showModelDropdown}
                  onOpenChange={setShowModelDropdown}
                />

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-transparent border border-white/10 rounded-md text-[#a8a3b8] text-sm cursor-pointer transition-all duration-200 hover:bg-white/5 hover:text-white hover:border-white/[0.15]">
                    <Globe size={16} />
                    <span>Search</span>
                  </button>

                  <button className="w-8 h-8 p-0 flex items-center justify-center bg-transparent border border-white/10 rounded-md text-[#a8a3b8] cursor-pointer transition-all duration-200 hover:bg-white/5 hover:text-white hover:border-white/[0.15]">
                    <Paperclip size={16} />
                  </button>
                </div>
              </div>

              <button 
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="w-8 h-8 rounded-md border-none text-white flex items-center justify-center cursor-pointer ml-auto transition-all duration-200"
                style={{ 
                  backgroundColor: inputValue.trim() ? 'var(--button-pink)' : 'rgba(168, 83, 125, 0.4)',
                  opacity: inputValue.trim() ? 1 : 0.6
                }}
                onMouseEnter={(e) => {
                  if (inputValue.trim()) {
                    e.currentTarget.style.backgroundColor = 'var(--button-pink-hover)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (inputValue.trim()) {
                    e.currentTarget.style.backgroundColor = 'var(--button-pink)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 10L14 2M14 2H8M14 2V8" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}