import { useState } from 'react';
import ChatPreview from './ChatPreview';

export default function ChatBody() {
  const [isStarted, setIsStarted] = useState(true);
  return (
    <div className=" border-blue-600 flex-1 flex items-center justify-center">
      {!isStarted && <ChatPreview />}
      {isStarted && (
        <div className=" border-pink-700 w-full max-w-full h-full text-xs p-10 chat-container flex flex-col gap-10 sm:text-sm lg:text-xl lg:w-3/4">
          <div className="user">
            <div className="user-prompt">User Prompt</div>
          </div>
          <div className="ai">
            <div className="ai-prompt">AI Prompt</div>
          </div>
          <div className="user">
            <div className="user-prompt">
              создай карточку "таск", добавь описание "дескрпшн", добавь таск в
              список "Done" на доске "N!". Таск должен быть выполнен с середины
              марта до середины мая. Ответственные за задачу Алина, Мадина
            </div>
          </div>
          <div className="ai">
            <div className="ai-prompt">AI Prompt</div>
          </div>
          <div className="user">
            <div className="user-prompt">
              создай карточку "таск", добавь описание "дескрпшн", добавь таск в
              список "Done" на доске "N!". Таск должен быть выполнен с середины
              марта до середины мая. Ответственные за задачу Алина, Мадина
            </div>
          </div>
          <div className="ai">
            <div className="ai-prompt">AI Prompt</div>
          </div>
        </div>
      )}
    </div>
  );
}
