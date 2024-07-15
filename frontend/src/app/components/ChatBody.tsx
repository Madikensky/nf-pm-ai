import { useState, useRef, useEffect } from 'react';
import ChatPreview from './ChatPreview';
import Markdown from 'react-markdown';
import ChatContainer from './ChatContainer';

export default function ChatBody({ chatHistory, isStarted }: any) {
  // const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    console.log(chatHistory);
  }, [chatHistory]);

  return (
    <div className=" border-blue-600 flex-1 flex items-center justify-center px-4">
      {!isStarted && <ChatPreview />}
      {isStarted && (
        <ChatContainer>
          {chatHistory.map((message: any, id: number) => (
            <div className={message.role === 'model' ? 'ai' : 'user'} key={id}>
              <Markdown
                className={`${message.role === 'model' ? 'ai' : 'user'}-prompt`}
              >
                {message.parts[0].text}
              </Markdown>
            </div>
          ))}
        </ChatContainer>
      )}
      {/* <div className="trello-container">
        <iframe
          src="https://trello.com/b/Atc5OQru.html"
          width="300"
          frameBorder={0}
          height="300"
          className="border-2 border-blue-900"
        ></iframe>
      </div> */}
    </div>
  );
}
