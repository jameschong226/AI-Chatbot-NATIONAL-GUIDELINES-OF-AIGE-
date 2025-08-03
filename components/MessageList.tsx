
import React from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<React.PropsWithChildren<MessageListProps>> = ({ messages, isLoading }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          message={msg}
          isStreaming={isLoading && index === messages.length - 1}
        />
      ))}
    </div>
  );
};

export default MessageList;
