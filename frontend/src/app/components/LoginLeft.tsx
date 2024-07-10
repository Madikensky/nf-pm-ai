'use client';

import InputField from './InputField';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginLeft() {
  const [trelloToken, setTrelloToken] = useState('');
  const [trelloAuth, setTrelloAuth] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trelloToken || !trelloAuth) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    setError('');
    console.log(trelloToken, trelloAuth);

    try {
      const apiKey = trelloToken.trim();
      const apiToken = trelloAuth.trim();

      const response = await axios.get(
        `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${apiToken}`
      );

      console.log(response.data);

      localStorage.setItem('trelloToken', apiKey);
      localStorage.setItem('trelloAuth', apiToken);

      router.push('/');
    } catch (e) {
      console.log(e);
      setError('Неверный Trello API Token или Trello');
    }
  };

  return (
    <form
      className="login-left flex w-1/2 border-red-600 items-center justify-center"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-10  border-blue-600 items-center p-10">
        <p className="text-main-color text-default font-semibold">Вход</p>
        <p className="text-gray-color font-semibold text-lg text-center">
          Введите свой Trello API Token и Trello Auth Token для входа в свою
          учетную запись
        </p>
        <InputField tokenType="Trello API Token" setToken={setTrelloToken} />
        <InputField tokenType="Trello Auth Token" setToken={setTrelloAuth} />
        <button className="text-white font-medium text-smaller bg-main-color p-2 rounded-md w-1/4">
          Войти
        </button>
        {error && <p className="text-red-600 text-lg">{error}</p>}
      </div>
    </form>
  );
}
