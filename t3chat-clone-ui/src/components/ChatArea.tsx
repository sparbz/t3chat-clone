'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Globe, Sparkles, Search as SearchIcon, Code, BookOpen, ChevronDown, Maximize2, Sun } from 'lucide-react';
import Message from './Message';
import MessageLimitBanner from './MessageLimitBanner';

interface ChatAreaProps {
  chatId: string | null;
  onNewMessage: () => void;
}

interface MessageType {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AI_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'claude-3', name: 'Claude 3' },
];

const EXAMPLE_PROMPTS = [
  'How does AI work?',
  'Are black holes real?',
  'How many Rs are in the word "strawberry"?',
  'What is the meaning of life?'
];

export default function ChatArea({ chatId, onNewMessage }: ChatAreaProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
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
        {/* Top Right Icons */}
        <div className="absolute top-5 right-5 flex gap-3 z-10">
          <button 
            className="w-9 h-9 bg-transparent border-none text-[#6b7280] cursor-pointer flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/5 hover:text-[#a8a3b8]"
            title="Share"
          >
            <Maximize2 size={20} />
          </button>
          <button 
            className="w-9 h-9 bg-transparent border-none text-[#6b7280] cursor-pointer flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/5 hover:text-[#a8a3b8]"
            title="Toggle theme"
          >
            <Sun size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-5 py-10 flex items-center justify-center pb-[120px]">
          <div className="w-full max-w-[600px] text-center">
            <h1 className="text-[32px] font-semibold text-white mb-12">How can I help you?</h1>
            
            {/* Quick Actions */}
            <div className="flex gap-4 justify-center mb-12 flex-wrap">
              <button 
                onClick={() => console.log('Quick action clicked: Create')}
                className="min-w-[120px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] text-sm font-medium cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Sparkles size={20} className="flex-shrink-0" />
                <span>Create</span>
              </button>
              <button 
                onClick={() => console.log('Quick action clicked: Explore')}
                className="min-w-[120px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] text-sm font-medium cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <SearchIcon size={20} className="flex-shrink-0" />
                <span>Explore</span>
              </button>
              <button 
                onClick={() => console.log('Quick action clicked: Code')}
                className="min-w-[120px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] text-sm font-medium cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Code size={20} className="flex-shrink-0" />
                <span>Code</span>
              </button>
              <button 
                onClick={() => console.log('Quick action clicked: Learn')}
                className="min-w-[120px] flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] text-sm font-medium cursor-pointer transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <BookOpen size={20} className="flex-shrink-0" />
                <span>Learn</span>
              </button>
            </div>

            {/* Example Prompts */}
            <div className="flex flex-col gap-3 w-full max-w-[500px] mx-auto">
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="group w-full px-5 py-4 rounded-lg text-sm font-normal text-left cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--input-bg)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="fixed bottom-0 left-[280px] right-0 p-5 z-20" style={{ 
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-main)'
        }}>
          <div className="max-w-[800px] mx-auto w-full">
            <div className="rounded-lg overflow-hidden transition-all duration-300 focus-within:border-[rgba(168,83,125,0.3)] focus-within:shadow-[0_0_0_1px_rgba(168,83,125,0.1)]"
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--border-light)'
              }}
            >
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                className="w-full px-5 py-4 bg-transparent border-0 text-white text-base leading-relaxed resize-none outline-none font-inherit min-h-[24px] max-h-[200px] block"
                style={{ color: 'var(--text-primary)' }}
                rows={1}
              />
              
              <div className="flex items-center justify-between px-4 py-3 gap-3" style={{ 
                borderTop: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--hover-bg)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-primary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg-strong)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                      }}
                    >
                      <span>{selectedModel.name}</span>
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                        <path d="M1 1l4 4 4-4"/>
                      </svg>
                    </button>
                    
                    {showModelDropdown && (
                      <div className="absolute bottom-full left-0 mb-2 border rounded-lg shadow-lg overflow-hidden" style={{ 
                        backgroundColor: 'var(--bg-sidebar)',
                        borderColor: 'var(--border-medium)'
                      }}>
                        {AI_MODELS.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                          >
                            {model.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

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

      {/* Input Section */}
      <div className="fixed bottom-0 left-[280px] right-0 p-5 z-20" style={{ 
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
                <div className="relative">
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-md text-white text-sm cursor-pointer transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.15]"
                  >
                    <span>{selectedModel.name}</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor">
                      <path d="M1 1l4 4 4-4"/>
                    </svg>
                  </button>
                  
                  {showModelDropdown && (
                    <div className="absolute bottom-full left-0 mb-2 bg-[#1a1625] border border-white/10 rounded-lg shadow-lg overflow-hidden">
                      {AI_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model);
                            setShowModelDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                        >
                          {model.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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