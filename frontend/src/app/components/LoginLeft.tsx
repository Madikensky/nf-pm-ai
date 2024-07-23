'use client';

import InputField from './InputField';
import { FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Loading from './Loading';

export default function LoginLeft({
  setIsLoading,
  error,
  setError,
}: {
  setIsLoading: (value: boolean) => void;
  error: string;
  setError: (value: string) => void;
}) {
  const [trelloToken, setTrelloToken] = useState('');
  const [trelloAuth, setTrelloAuth] = useState('');
  const [email, setEmail] = useState<string>('');
  // const [isLoading, setLocalIsLoading] = useState(false);
  // const [error, setError] = useState('');
  const router = useRouter();

  // if (isLoading) {
  //   return <Loading />;
  // }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setLocalIsLoading(true);
    setIsLoading(true);

    try {
      const userEmail = email.trim();
      const apiKey = trelloToken.trim();
      const apiToken = trelloAuth.trim();

      const response = await axios.post(
        'https://nf-pm-ai-production.up.railway.app/register',
        {
          email: userEmail,
          trelloToken: apiKey,
          authToken: apiToken,
        }
      );

      localStorage.setItem('email', userEmail);

      // setIsLoading(false);
      setError('');

      router.replace('/');
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setError('Неверный Trello API Token или Trello Auth Token');
      console.log('error:', error);
      // setLocalIsLoading(false);
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
        <InputField tokenType="Email" setToken={setEmail} />
        <InputField tokenType="Trello API Token" setToken={setTrelloToken} />
        <InputField tokenType="Trello Auth Token" setToken={setTrelloAuth} />
        {/* <input placeholder="Ваш email" /> */}
        <button className="text-white font-medium lg:text-smaller sm:text-sm bg-main-color p-2 lg:p-4 rounded-md w-full sm:w-1/2 lg:w-1/4">
          Войти
        </button>
        {error && <p className="text-red-600 text-lg text-center">{error}</p>}
      </div>
    </form>
  );
}
