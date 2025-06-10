import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  };
}

export default function Message({ message }: MessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (message.role === 'user') {
    return (
      <div className="mb-6 flex justify-end">
        <div className="bg-[#a8537d]/20 px-4 py-3 rounded-xl max-w-[70%]">
          <p className="text-white text-base leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="py-3">
        <p className="text-white text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
        
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-[#6b6979] hover:text-[#a8a3b8] transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}