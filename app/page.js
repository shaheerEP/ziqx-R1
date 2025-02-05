'use client';
import { useState } from 'react';
import ChatBox from '../components/ChatBox';
import InputBox from '../components/InputBox';
import { sendMessage } from '../utils/api';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (userMessage) => {
    setLoading(true);

    // Add user message to the chat
    const updatedMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(updatedMessages);

    // Fetch bot response and think content
    const { response: botResponse, think: thinkContent } = await sendMessage(userMessage, updatedMessages);

    // Add bot response to the chat
    setMessages((prev) => [
      ...prev,
      { sender: 'bot', text: botResponse }, // Main response
      ...(thinkContent
        ? [{ sender: 'bot-think', text: thinkContent }] // Think content as non-priority
        : []),
    ]);

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">ziqx-R1</h1>
        <p className="text-gray-600 text-sm">AI Assistant</p>
      </div>

      <ChatBox messages={messages} loading={loading} />
      <InputBox onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
}