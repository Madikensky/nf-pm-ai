import { useState } from 'react';
import ChatPreview from './ChatPreview';

export default function ChatBody() {
  const [isStarted, setIsStarted] = useState(false);
  return (
    <div className=" border-blue-600 flex-1">
      {!isStarted && <ChatPreview />}
    </div>
  );
}
