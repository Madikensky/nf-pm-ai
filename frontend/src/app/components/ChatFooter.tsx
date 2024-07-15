import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatFooter({ setChatHistory, setIsStarted }: any) {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [userInput, setLocalUserInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setLocalChatHistory] = useState<
    {
      role: string;
      parts: { text: string }[];
    }[]
  >([]);

  const getGeminiResponse = async () => {
    try {
      const savedTrelloToken = localStorage.getItem('trelloToken');
      const savedTrelloAuth = localStorage.getItem('trelloAuth');
      setIsLoading(true);

      const response = await axios.post('http://localhost:5000/gemini', {
        userPrompt: userInput,
        apiKey: savedTrelloToken,
        token: savedTrelloAuth,
        history: chatHistory,
      });

      console.log(response);

      const data = response.data;

      setLocalChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: 'user',
          parts: [{ text: userInput }],
        },
        {
          role: 'model',
          parts: [{ text: data }],
        },
      ]);

      setChatHistory((oldChatHistory: any) => [
        ...oldChatHistory,
        {
          role: 'user',
          parts: [{ text: userInput }],
        },
        {
          role: 'model',
          parts: [{ text: data }],
        },
      ]);

      setLocalUserInput('');
      setIsLoading(false);
      setError('');
    } catch (e: any) {
      console.log(e);
      setError('Что-то пошло не так. Пожалуйста, попробуйте еще раз.');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.trim().length > 0) {
      setIsConversationStarted(true);
    } else {
      setIsConversationStarted(false);
    }
    setLocalUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (!isConversationStarted) {
      return;
    }
    setLocalUserInput('');
    setIsStarted(true);
    getGeminiResponse();
  };

  return (
    <div className=" border-green-600 flex items-center justify-center px-6 pb-6 ">
      <form
        className=" border-main-color  w-full rounded-2xl flex flex-row p-2 gap-2 lg:w-3/4 bg-gray-200"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <textarea
          name=""
          className="w-full rounded-tl-lg rounded-bl-lg outline-none resize-none text-xs sm:text-sm md:text-lg lg:text-md p-2 bg-gray-200"
          placeholder='Создай карточку "Дейлик"...'
          value={userInput}
          onKeyDown={handleKeyDown}
          rows={1}
          onChange={handleInput}
        ></textarea>
        <button
          type="submit"
          className="flex border-red-600 min-w-14 items-center justify-center"
          disabled={!isConversationStarted}
        >
          <div
            className={`border-blue-600 w-9/12 h-10 rounded-full ${
              isConversationStarted ? 'bg-main-color' : 'bg-gray-color'
            } flex items-center justify-center`}
          >
            <Image
              src="/up.png"
              width={25}
              height={25}
              alt="send"
              className=""
            />
          </div>
        </button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
