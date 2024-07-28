import { useState, useRef, useEffect } from 'react';
import ChatPreview from './ChatPreview';
import Markdown from 'react-markdown';
import ChatContainer from './ChatContainer';
import Image from 'next/image';
import SideBar from './Sidebar';
import MarkdownIt from 'markdown-it';
import { useSidebar } from './SidebarProvider';

const md = new MarkdownIt();

export default function ChatBody({
  chatHistory,
  isStarted,
  isWaitingAIResponse,
  error,
  isOpen,
}: any) {
  const [isBoardsOpen, setIsBoardsOpen] = useState(false);

  const { sidebarOpen, setSidebarOpen } = useSidebar();

  useEffect(() => {
    // console.log(chatHistory);
    console.log(sidebarOpen);
  }, [chatHistory, sidebarOpen]);

  return (
    <div
      className={`border-blue-600 flex-1 flex items-center ${
        sidebarOpen ? 'justify-start' : 'justify-center'
      }  px-4`}
    >
      {!isStarted && <ChatPreview />}
      {isStarted && (
        <ChatContainer>
          {chatHistory.map((message: any, id: number) => (
            <div
              className={message.role === 'assistant' ? 'ai' : 'user'}
              key={id}
            >
              <div
                className={`${
                  message.role === 'assistant' ? 'ai' : 'user'
                }-prompt`}
                dangerouslySetInnerHTML={{ __html: md.render(message.content) }}
              >
                {/* {message.content} */}
              </div>
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
      {/* {<SideBar />} */}
    </div>
  );
}
