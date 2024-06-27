'use client';

import { useState } from 'react';
import context from './context';
import axios from 'axios';
import Markdown from 'react-markdown';

export default function Home() {
  const [error, setError] = useState('');
  const [value, setValue] = useState('');
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
      const response = await axios.post('http://localhost:5000/gemini', {
        userPrompt: value,
        history: chatHistory,
      });

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
    } catch (e) {
      console.log(e);
      setError('Что-то пошло не так. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <div className="app">
      <p>Что вы хотите создать в Trello сегодня?</p>
      <div className="input-container">
        <input
          value={value}
          placeholder="Создай мне карточку с названием 'Тестовая карточка...'"
          onChange={(e) => setValue(e.target.value)}
        ></input>
        {!error && <button onClick={getGeminiResponse}>Ask me</button>}
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
  );
}
