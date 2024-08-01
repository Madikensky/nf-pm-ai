import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import url from '../lib/url';
import { useSidebar } from './SidebarProvider';
import AudioRecorder from './AudioRecorder';
// import backendApiInstance from '@/lib/api';

export default function ChatFooter({
  setChatHistory,
  setIsStarted,
  setIsWaitingAIResponse,
  isWaitingAIResponse,
  setError,
}: any) {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [userInput, setLocalUserInput] = useState('');
  const { sidebarOpen } = useSidebar();
  const [chatHistory, setLocalChatHistory] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    if (userInput.trim().length > 0 && userInput !== 'Обработка аудио...') {
      setIsConversationStarted(true);
    }
  }, [chatHistory, userInput]);

  const getGeminiResponse = async () => {
    try {
      const email = localStorage.getItem('email');
      try {
        axios
          .post(`${url}/get-tokens`, {
            email: email,
          })
          .then((res) => {
            // console.log(res);
            const { trelloToken, trelloAuth } = res.data;

            const savedTrelloToken = trelloToken;
            const savedTrelloAuth = trelloAuth;

            // const userVoiceInput = localStorage.getItem('userVoiceInput');

            const requestToGPT = async () => {
              const response = await axios
                .post(`${url}/gemini`, {
                  userPrompt: userInput,
                  apiKey: savedTrelloToken,
                  token: savedTrelloAuth,
                  history: chatHistory,
                })
                .finally(() => setIsWaitingAIResponse(false));

              const data = response.data;

              setChatHistory((prevHistory: any) => [
                ...prevHistory,
                {
                  role: 'assistant',
                  content: data,
                },
              ]);

              setLocalChatHistory((prevHistory: any) => [
                ...prevHistory,
                {
                  role: 'assistant',
                  content: data,
                },
              ]);

              const updateBoards = await axios.get(
                `https://api.trello.com/1/members/me/boards?key=${trelloToken}&token=${trelloAuth}`
              );

              const boards = updateBoards.data;

              localStorage.setItem('trelloBoards', JSON.stringify(boards));
              localStorage.removeItem('userVoiceInput');

              setError('');
            };

            requestToGPT();
          });
      } catch (e) {
        console.log('error on footer: ', e);
      }
    } catch (e: any) {
      console.log(e);
      setError('Что-то пошло не так. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsWaitingAIResponse(false);
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
    if (isWaitingAIResponse || !isConversationStarted) {
      return;
    }

    setChatHistory((prevHistory: any) => [
      ...prevHistory,
      {
        role: 'user',
        content: userInput,
      },
    ]);

    setLocalChatHistory((prevHistory: any) => [
      ...prevHistory,
      {
        role: 'user',
        content: userInput,
      },
    ]);
    setIsConversationStarted(false);
    setLocalUserInput('');
    setIsStarted(true);
    getGeminiResponse();
    setError(false);
    setIsWaitingAIResponse(true);
  };

  return (
    <div
      className={`border-green-600 flex items-center ${
        sidebarOpen ? 'justify-start' : 'justify-center'
      } px-4 pb-6`}
    >
      <form
        className=" border-main-color  w-full rounded-xl flex flex-row p-2 gap-2 lg:w-3/4 bg-gray-200"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <textarea
          name=""
          className="w-full rounded-tl-lg rounded-bl-lg outline-none resize-none text-xs sm:text-sm lg:text-lg p-2 bg-gray-200"
          placeholder="Привет! Что ты умеешь?"
          value={userInput}
          onKeyDown={handleKeyDown}
          rows={1}
          onChange={handleInput}
        ></textarea>

        {isConversationStarted ? (
          <button
            type="submit"
            className={`flex border-red-600 min-w-10 items-center justify-end`}
            disabled={!isConversationStarted && isWaitingAIResponse}
          >
            <div
              className={`border-blue-600  w-9 h-9 rounded-full flex items-center justify-center ${
                isConversationStarted ? 'bg-main-color' : 'bg-gray-color'
              } flex items-center justify-center`}
            >
              <Image
                src="/up.png"
                width={20}
                height={20}
                alt="send"
                className={`${
                  isConversationStarted ? 'cursor-pointer' : 'cursor-no-drop'
                }`}
              />
            </div>
          </button>
        ) : (
          <AudioRecorder setUserInput={setLocalUserInput} />
        )}
      </form>
    </div>
  );
}
