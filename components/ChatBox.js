import React from 'react';

export default function ChatBox({ messages, loading }) {
  // Helper function to parse and style <think> tags
  const formatMessage = (text) => {
    // Split the text into parts based on <think> tags
    const parts = text.split(/(<think>|<\/think>)/);

    return parts.map((part, index) => {
      if (part === '<think>' || part === '</think>') {
        // Ignore the actual <think> tags
        return null;
      }

      // Check if the part is inside a <think> tag
      const isThinkContent = index > 0 && parts[index - 1] === '<think>';

      return (
        <span
          key={index}
          className={isThinkContent ? 'text-gray-500' : ''}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-xl p-4 ${
              message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : message.sender === 'bot-think'
                ? 'bg-gray-100 text-gray-500 border border-gray-200 shadow-sm'
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            {/* Render formatted message */}
            <div className="space-y-2">
              {formatMessage(message.text)}
            </div>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white border border-gray-200 shadow-sm rounded-xl p-4">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}