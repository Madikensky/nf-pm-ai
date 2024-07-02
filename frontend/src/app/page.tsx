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
        apiKey: trelloToken,
        token: trelloAuth,
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
    } catch (e: any) {
      console.log(e);
      // setError('Что-то пошло не так. Пожалуйста, попробуйте еще раз.');
      setError(e);
    }
  };

  const [trelloToken, setTrelloToken] = useState('');
  const [trelloAuth, setTrelloAuth] = useState('');

  const submitTokens = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.setItem('TrelloToken', trelloToken);
    localStorage.setItem('AuthToken', trelloAuth);

    axios
      .post('http://localhost:5000/token_login', {
        trelloToken,
        authToken: trelloAuth,
      })
      .then((e) => console.log(e.data));

    // здесь потом проверять, существую токены или нет путем отправки гет запроса с этими токенами

    console.log(trelloToken);
    console.log(trelloAuth);
  };

  return (
    <div className="app">
      <form className="flex flex-col gap-3" onSubmit={submitTokens}>
        <div className="flex gap-5 items-center">
          <label htmlFor="trelloAPI">Trello API Token</label>
          <input
            type="text"
            id="trelloAPI"
            className="border-2 w-1/2 outline-none p-1 rounded border-blue-950"
            required
            value={trelloToken}
            onChange={(e) => setTrelloToken(e.target.value)}
          />
        </div>
        <div className="flex gap-5 items-center">
          <label htmlFor="trelloAUTH">Trello Auth Token</label>
          <input
            type="text"
            id="trelloAUTH"
            className="border-2 w-1/2 outline-none p-1 rounded border-blue-950"
            required
            value={trelloAuth}
            onChange={(e) => setTrelloAuth(e.target.value)}
          />
        </div>
        <button className="w-1/4 bg-blue-950 text-white rounded" type="submit">
          Save
        </button>
      </form>
      <p className="mt-20">Что вы хотите создать в Trello сегодня?</p>
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
