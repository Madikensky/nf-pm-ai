import { useState, useRef, useEffect } from 'react';
import ChatPreview from './ChatPreview';
import Markdown from 'react-markdown';
import ChatContainer from './ChatContainer';
import Image from 'next/image';

export default function ChatBody({
  chatHistory,
  isStarted,
  isWaitingAIResponse,
  error,
}: any) {
  // const [isStarted, setIsStarted] = useState(false);

  // useEffect(() => {
  //   console.log(chatHistory);
  //   console.log(isWaitingAIResponse);
  // }, [chatHistory, isWaitingAIResponse]);

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
          {isWaitingAIResponse && (
            <div className="ai">
              <div className="ai-prompt-loader">
                <Image
                  alt="loading"
                  src="/loading2.gif"
                  unoptimized={true}
                  width={0}
                  height={0}
                  className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12"
                />
              </div>
            </div>
          )}
          {error && (
            <div className="ai">
              <div className="ai-prompt">{error}</div>
            </div>
          )}
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
