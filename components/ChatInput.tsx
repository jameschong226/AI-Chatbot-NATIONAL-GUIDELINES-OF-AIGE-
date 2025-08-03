
import React from 'react';

interface ChatInputProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.534h6.105a.75.75 0 000-1.5H4.994L3.75 3.105a.75.75 0 00-.645-.816z" />
        <path d="M16.905 2.289a.75.75 0 00-.826-.95l-1.414 4.949a.75.75 0 00.95.534h6.105a.75.75 0 000-1.5H18.206l1.25-4.375a.75.75 0 00-.645-.816z" clipRule="evenodd" />
    </svg>
);


const ChatInput: React.FC<ChatInputProps> = ({ inputValue, onInputChange, onSendMessage, isLoading }) => {
  return (
    <div className="p-4 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700">
      <form onSubmit={onSendMessage} className="flex items-center space-x-3">
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Ask AIGE Expert anything..."
          className="flex-1 w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="p-3 bg-blue-600 text-white rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
            <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
