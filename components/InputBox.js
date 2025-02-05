import { useState } from 'react';

export default function InputBox({ onSendMessage, disabled }) {
  const [input, setInput] = useState('');

  // Function to handle sending the message
  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  // Handle key press events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !disabled) {
      e.preventDefault(); // Prevent default behavior (e.g., new line in some cases)
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Add the keydown event handler
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={disabled}
        />
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}