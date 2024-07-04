'use client';

import { useState, useEffect } from 'react';
import context from './context';
import axios from 'axios';
import Markdown from 'react-markdown';
import TokenForm from './components/TokenForm/page';

export default function Home() {
  const [trelloToken, setTrelloToken] = useState('');
  const [trelloAuth, setTrelloAuth] = useState('');
  const [showElement, setShowElement] = useState(true);
  const [error, setError] = useState('');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'user',
      parts: [
        {
          text: context,
        },
      ],
    },
  ]);

  const getGeminiResponse = async () => {
    if (!value) {
      setError('Пожалуйста, введите ваш запрос.');
      return;
    }
    try {
      const savedTrelloToken = localStorage.getItem('TrelloToken');
      const savedTrelloAuth = localStorage.getItem('AuthToken');
      setIsLoading(true);

      const response = await axios.post(
        'https://nf-pm-ai.onrender.com/gemini',
        {
          userPrompt: value,
          apiKey: savedTrelloToken ? savedTrelloToken : trelloToken,
          token: savedTrelloAuth ? savedTrelloAuth : trelloAuth,
          history: chatHistory,
        }
      );

      console.log(response);

      const data = response.data;
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: 'user',
          parts: [{ text: value }],
        },
        {
          role: 'model',
          parts: [{ text: data }],
        },
      ]);
      setValue('');
      setIsLoading(false);
    } catch (e: any) {
      console.log(e);
      setError(e);
    }
  };

  return (
    <>
      <div className="app border-2 flex items-center justify-center h-screen flex-col">
        {showElement ? (
          <TokenForm
            setTrelloAuth={setTrelloAuth}
            setShowElement={setShowElement}
            setTrelloToken={setTrelloToken}
            setIsLoading={setIsLoading}
          />
        ) : (
          <div className="w-full h-screen p-5">
            <p className="mt-20">Что вы хотите создать в Trello сегодня?</p>
            <div className="input-container">
              <input
                value={value}
                placeholder="Создай мне карточку с названием 'Тестовая карточка...'"
                onChange={(e) => setValue(e.target.value)}
              ></input>
              {!error && <button onClick={getGeminiResponse}>Send</button>}
            </div>
            {error && <p>{error}</p>}
            <div className="search-result">
              {chatHistory.map(
                (e, id) =>
                  id !== 0 && (
                    <div key={id}>
                      {' '}
                      <p className="answer">
                        {e.role === 'user' ? (
                          <span className="text-red-500">{e.role}: </span>
                        ) : (
                          <span className="text-green-500">{e.role}: </span>
                        )}
                        {e.parts.map((item, id) => (
                          <Markdown key={id}>{item.text}</Markdown>
                        ))}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
      {isLoading && <div className="loader">Loading...</div>}
    </>
  );
}
