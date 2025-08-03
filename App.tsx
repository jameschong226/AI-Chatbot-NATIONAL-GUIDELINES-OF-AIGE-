import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Message } from './types';
import { getStreamingResponse } from './services/geminiService';
import type { Content } from '@google/genai';
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I am AIGE Expert, ready to answer your questions based on the provided document. How can I assist you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmedInput };
    
    const historyWithUserMessage = [...messages, userMessage];
    
    // Update state to show user message and model placeholder for streaming
    setMessages([...historyWithUserMessage, { role: 'model', content: '' }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare chat history for the API, excluding the initial system greeting
      const historyForAPI: Content[] = historyWithUserMessage
        .slice(1) // Remove the initial greeting message
        .map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        }));

      const stream = await getStreamingResponse(historyForAPI);

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          const updatedLastMessage = { ...lastMessage, content: lastMessage.content + chunkText };
          return [...prev.slice(0, -1), updatedLastMessage];
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          const updatedLastMessage = { ...lastMessage, content: "Sorry, I encountered an error. Please try again." };
          return [...prev.slice(0, -1), updatedLastMessage];
        });
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <Header />
      <div ref={messageListRef} className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      <ChatInput
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default App;
