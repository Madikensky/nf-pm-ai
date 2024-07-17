import React from 'react';
import Header from './Header';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import { useState } from 'react';

export default function ChatComponent() {
  const [chatHistory, setChatHistory] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [error, setError] = useState('');
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col  border-red-600 h-dvh">
      <Header
        showLogin={false}
        showProfile={true}
        showTrello={true}
        isAbsolute={false}
        // setIsOpen={setIsOpen}
      />
      <ChatBody
        chatHistory={chatHistory}
        isStarted={isStarted}
        isWaitingAIResponse={isWaitingResponse}
        error={error}
        // isOpen={isOpen}
      />
      <ChatFooter
        setChatHistory={setChatHistory}
        setIsStarted={setIsStarted}
        setIsWaitingAIResponse={setIsWaitingResponse}
        isWaitingAIResponse={isWaitingResponse}
        setError={setError}
      />
    </div>
  );
}
