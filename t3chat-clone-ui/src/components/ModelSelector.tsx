'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, Lock, Sparkles, Zap, Brain, Cpu, FlaskConical } from 'lucide-react';

export interface Model {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  isPro?: boolean;
  isNew?: boolean;
  category?: string;
}

interface ModelSelectorProps {
  models: Model[];
  selectedModel: Model;
  onSelectModel: (model: Model) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultIcons: Record<string, React.ReactNode> = {
  'gemini': <Sparkles size={18} />,
  'gpt': <Brain size={18} />,
  'claude': <Zap size={18} />,
  'llama': <Cpu size={18} />,
  'deepseek': <FlaskConical size={18} />
};

export default function ModelSelector({ models, selectedModel, onSelectModel, isOpen, onOpenChange }: ModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      
      // Calculate dropdown position
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.top - 8, // Position above button with 8px gap
          left: rect.left
        });
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedModels = showAll ? filteredModels : filteredModels.slice(0, 5);

  const getModelIcon = (model: Model) => {
    if (model.icon) return model.icon;
    const key = model.id.toLowerCase().split('-')[0];
    return defaultIcons[key] || <Sparkles size={18} />;
  };

  return (
    <div className="relative z-50">
      <button
        ref={buttonRef}
        onClick={() => onOpenChange(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200"
        style={{
          backgroundColor: 'var(--hover-bg)',
          border: '1px solid var(--border-medium)',
          color: 'var(--text-primary)'
        }}
      >
        <span className="flex items-center gap-2">
          {getModelIcon(selectedModel)}
          {selectedModel.name}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed w-[400px] rounded-xl shadow-lg overflow-hidden animate-dropdown-up"
          style={{
            backgroundColor: 'var(--bg-card, var(--bg-main))',
            border: '1px solid var(--border-light)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
        >
          {/* Search Bar */}
          <div className="p-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)'
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Upgrade Banner */}
          <div className="mx-3 mt-3 p-3 rounded-lg flex items-center justify-between" style={{
            backgroundColor: 'var(--primary-pale, rgba(233, 30, 99, 0.1))'
          }}>
            <div>
              <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                Unlock all models + higher limits
              </div>
              <div className="text-sm mt-0.5" style={{ color: 'var(--primary-pink, var(--accent-primary))' }}>
                $8/month
              </div>
            </div>
            <button className="px-4 py-1.5 rounded-md text-sm font-medium transition-all"
              style={{
                backgroundColor: 'var(--primary-pink, var(--accent-primary))',
                color: 'var(--text-on-primary, white)'
              }}
            >
              Upgrade now
            </button>
          </div>

          {/* Models List */}
          <div className="py-2 max-h-[300px] overflow-y-auto">
            {displayedModels.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  if (!model.isPro) {
                    onSelectModel(model);
                    onOpenChange(false);
                  }
                }}
                className={`w-full px-3 py-2.5 flex items-center gap-3 transition-all duration-200 ${
                  model.isPro ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-50 cursor-pointer'
                }`}
                style={{
                  backgroundColor: selectedModel.id === model.id ? 'var(--hover-bg)' : 'transparent',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  if (!model.isPro && selectedModel.id !== model.id) {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedModel.id !== model.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--hover-bg)',
                      color: 'var(--primary-pink, var(--accent-primary))'
                    }}
                  >
                    {getModelIcon(model)}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{model.name}</span>
                      {model.isNew && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor: 'var(--accent-light, rgba(156, 39, 176, 0.1))',
                            color: 'var(--accent-purple, var(--accent-primary))'
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                    {model.description && (
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {model.description}
                      </div>
                    )}
                  </div>
                </div>
                {model.isPro && (
                  <Lock size={16} style={{ color: 'var(--text-muted)' }} />
                )}
              </button>
            ))}
          </div>

          {/* Show All Button */}
          {filteredModels.length > 5 && (
            <div className="p-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full py-2 text-sm font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--primary-pink, var(--accent-primary))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {showAll ? 'Show less' : `Show all (${filteredModels.length})`}
                <ChevronDown size={16} className={`inline-block ml-1 transition-transform ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}