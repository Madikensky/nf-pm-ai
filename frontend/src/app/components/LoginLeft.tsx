'use client';

import InputField from './InputField';
import { FormEvent, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Loading from './Loading';

export default function LoginLeft({
  setIsLoading,
}: {
  setIsLoading: (value: boolean) => void;
}) {
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
    setIsLoading(true);
    console.log(trelloToken, trelloAuth);

    try {
      const apiKey = trelloToken.trim();
      const apiToken = trelloAuth.trim();

      const response = await axios.get(
        `https://api.trello.com/1/members/me/boards?key=${apiKey}&token=${apiToken}`
      );

      const boards = response.data;
      // console.log(boards);

      boards.forEach((board: any) => {
        console.log('board url:', board.shortUrl);
        console.log('board name:', board.name);
      });

      localStorage.setItem('trelloBoards', JSON.stringify(boards));
      localStorage.setItem('trelloToken', apiKey);
      localStorage.setItem('trelloAuth', apiToken);

      router.push('/');
    } catch (e) {
      console.log(e);
      setError('Неверный Trello API Token или Trello');
    } finally {
      // setIsLoading(false);
    }
  };

  return (
    <form
      className="login-left flex sm:w-1/2 w-full border-red-600 items-center justify-center "
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-10  border-blue-600 items-center p-10">
        <p className="text-main-color sm:text-lg lg:text-2xl font-semibold text-xl">
          Вход
        </p>
        <p className="text-gray-color font-semibold sm:text-sm lg:text-lg text-center">
          Введите свой Trello API Token и Trello Auth Token для входа в свою
          учетную запись
        </p>
        <InputField tokenType="Trello API Token" setToken={setTrelloToken} />
        <InputField tokenType="Trello Auth Token" setToken={setTrelloAuth} />
        <button className="text-white font-medium lg:text-smaller sm:text-sm bg-main-color p-2 lg:p-4 rounded-md w-full sm:w-1/2 lg:w-1/4">
          Войти
        </button>
        {error && <p className="text-red-600 text-lg">{error}</p>}
      </div>
    </form>
  );
}
