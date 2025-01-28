'use client';

import { useState } from 'react';
import { findResponse } from '@/data/chatbotResponses';

interface Message {
  text: string;
  isUser: boolean;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm here to help answer questions about Lovitt's BJJ. What would you like to know?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate typing delay for more natural interaction
    setTimeout(() => {
      const response = findResponse(inputValue);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-900 hover:bg-purple-800 text-white rounded-full p-4 shadow-lg transition-all duration-200"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 left-0 w-80 bg-[#1c1c23] border border-gray-800 rounded-lg shadow-xl">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800">
            <h3 className="font-[--font-bebas-neue] text-xl text-white tracking-wide">
              Lovitt's BJJ Assistant
            </h3>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isUser
                      ? 'bg-purple-900/20 border border-purple-900/50'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                >
                  <p className="text-sm text-gray-300 whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-900/50"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="bg-purple-900 hover:bg-purple-800 text-white rounded-lg px-4 py-2 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
