'use client';
import { useState, useRef } from 'react';
import ChatBox from '../components/ChatBox';
import InputBox from '../components/InputBox';
import { sendMessage } from '../utils/api';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const botId = useRef(null);
  const isFirstChunk = useRef(true);

  const handleSendMessage = async (userMessage) => {
    setLoading(true);
    isFirstChunk.current = true;
    const userEntry = { sender: 'user', text: userMessage };
    botId.current = Date.now();
    const botEntry = { sender: 'bot', text: '', id: botId.current };
    setMessages(prev => [...prev, userEntry, botEntry]);

    await sendMessage(userMessage, messages, ({ response, think }) => {
      setMessages(prev => {
        const newMessages = [...prev];
        const lastBotIndex = newMessages.findIndex(msg => msg.id === botId.current);

        if (response && lastBotIndex !== -1) {
          newMessages[lastBotIndex] = {
            ...newMessages[lastBotIndex],
            text: newMessages[lastBotIndex].text + response
          };
        }

        // Handle think messages
        if (think) {
          const thinkIndex = lastBotIndex + 1;
          if (newMessages[thinkIndex]?.sender === 'bot-think') {
            newMessages[thinkIndex].text = think;
          } else {
            newMessages.splice(thinkIndex, 0, {
              sender: 'bot-think',
              text: think
            });
          }
        }

        return newMessages;
      });

      if (isFirstChunk.current) {
        setLoading(false);
        isFirstChunk.current = false;
      }
    });

    if (isFirstChunk.current) {
      setLoading(false);
      isFirstChunk.current = false;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      <div className="p-4 bg-white border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Ziqx-R1</h1>
        <p className="text-gray-600 text-sm">AI Assistant</p>
      </div>

      <ChatBox messages={messages} loading={loading} />
      <InputBox onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
}