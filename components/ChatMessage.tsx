
import React from 'react';
import type { Message } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import LoadingIndicator from './LoadingIndicator';

interface ChatMessageProps {
  message: Message;
  isStreaming: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const { role, content } = message;
  const isModel = role === 'model';

  const wrapperClasses = `flex items-start gap-4 p-4 ${isModel ? 'bg-gray-800' : ''}`;
  const iconClasses = `w-8 h-8 flex-shrink-0 rounded-full p-1.5 ${isModel ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}`;
  const contentClasses = `prose prose-invert prose-sm max-w-none text-gray-200 pt-1`;

  const renderContent = () => {
    if (isModel && content.length === 0 && isStreaming) {
      return <LoadingIndicator />;
    }
    // A simple markdown-like renderer for bold text
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
  };

  return (
    <div className={wrapperClasses}>
      <div className="flex-shrink-0">
        {isModel ? <BotIcon className={iconClasses} /> : <UserIcon className={iconClasses} />}
      </div>
      <div className="flex-grow">
        <p className="font-bold text-white capitalize">{isModel ? 'AIGE Expert' : 'You'}</p>
        <div className={contentClasses}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
