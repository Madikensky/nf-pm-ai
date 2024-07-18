import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatFooter({
  setChatHistory,
  setIsStarted,
  setIsWaitingAIResponse,
  isWaitingAIResponse,
  setError,
}: any) {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [userInput, setLocalUserInput] = useState('');
  // const [error, setError] = useState('');
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
      // setIsWaitingResponse(true);
      setIsWaitingAIResponse(true);
      const response = await axios.post('http://localhost:5000/gemini', {
        userPrompt: userInput,
        apiKey: savedTrelloToken,
        token: savedTrelloAuth,
        history: chatHistory,
      });

      // console.log(response);

      const data = response.data;

      setChatHistory((prevHistory: any) => [
        ...prevHistory,
        {
          role: 'model',
          parts: [{ text: data }],
        },
      ]);

      setLocalChatHistory((prevHistory: any) => [
        ...prevHistory,
        {
          role: 'model',
          parts: [{ text: data }],
        },
      ]);
      // setLocalUserInput('');
      setError('');
    } catch (e: any) {
      console.log(e);
      setError('Что-то пошло не так. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsWaitingAIResponse(false);

      const apiKey = localStorage.getItem('trelloToken');
      const apiToken = localStorage.getItem('trelloAuth');
      const response = await axios.get(
        `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${apiToken}`
      );

      const boards = response.data;

      localStorage.setItem('trelloBoards', JSON.stringify(boards));
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
    if (e.target.value.trim().length > 0 && !isWaitingAIResponse) {
      setIsConversationStarted(true);
    } else {
      setIsConversationStarted(false);
    }
    setLocalUserInput(e.target.value);
    // console.log(e.target.value.trim());
  };

  const handleSubmit = () => {
    if (!isConversationStarted) {
      return;
    }

    setChatHistory((prevHistory: any) => [
      ...prevHistory,
      {
        role: 'user',
        parts: [{ text: userInput }],
      },
    ]);

    setLocalChatHistory((prevHistory: any) => [
      ...prevHistory,
      {
        role: 'user',
        parts: [{ text: userInput }],
      },
    ]);
    setIsConversationStarted(false);
    setLocalUserInput('');
    setIsStarted(true);
    getGeminiResponse();
  };

  return (
    <div className=" border-green-600 flex items-center justify-center px-4 pb-6">
      <form
        className=" border-main-color  w-full rounded-xl flex flex-row p-2 gap-2 lg:w-3/4 bg-gray-200"
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
          className={`flex border-red-600 min-w-14 items-center justify-end ${
            isConversationStarted ? 'cursor-pointer' : 'cursor-no-drop'
          }`}
          disabled={!isConversationStarted && isWaitingAIResponse}
        >
          <div
            className={`border-blue-600  w-7 h-7 rounded-full flex items-center justify-center ${
              isConversationStarted ? 'bg-main-color' : 'bg-gray-color'
            } flex items-center justify-center`}
          >
            <Image
              src="/up.png"
              width={20}
              height={20}
              alt="send"
              className=""
            />
          </div>
        </button>
      </form>
      {/* {error && <p className="text-red-600">{error}</p>} */}
    </div>
  );
}
