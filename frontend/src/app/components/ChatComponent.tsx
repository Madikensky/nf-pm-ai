import React from 'react';
import Header from './Header';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

export default function ChatComponent() {
  return (
    <div className="flex flex-col  border-red-600 h-dvh">
      <Header
        showLogin={false}
        showProfile={true}
        showTrello={true}
        isAbsolute={false}
      />
      <ChatBody />
      <ChatFooter />
    </div>
  );
}
