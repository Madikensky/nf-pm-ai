'use client';

import React from 'react';
import Header from './components/Header';
import Image from 'next/image';
import FaqContainer from './components/FaqContainer';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const trelloToken = localStorage.getItem('trelloToken');
    const trelloAuth = localStorage.getItem('trelloAuth');

    if (trelloToken && trelloAuth) {
      router.push('/main');
    }
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div className="flex flex-col gap-20">
      <Header showLogin={true} onClick={handleLogin} />
      <div className="flex flex-row gap-2 mt-48  border-blue-800 p-10">
        <div className="flex flex-col gap-10  w-1/2 p-10">
          <p className="font-semibold text-2xl">
            Taskify.ai - Ваш персональный помощник на платформе&nbsp;
            <span className="inline-flex flex-row items-center justify-center">
              <span>Trello</span>
              <Image
                src={'/Trello.svg'}
                alt="trello"
                width={35}
                height={35}
                className=""
              />
            </span>
          </p>
          <p className="font-semibold text-xl">
            {' '}
            Упростите и оптимизируйте управление задачами с помощью чат-бота на
            базе искусственного интеллекта.
          </p>
          {
            <div className="flex gap-2 py-3 px-4 rounded-lg border-black cursor-pointer bg-main-color w-1/2 items-center justify-center">
              <span className="font-medium text-white" onClick={handleLogin}>
                Попробовать сейчас
              </span>
              <Image src="./Vector.svg" width={15} height={15} alt="arrow" />
            </div>
          }
        </div>
        <div className="flex items-center justify-center  bg-main-color text-white rounded-lg w-1/2">
          <div className="">Video</div>
        </div>
      </div>
      <FaqContainer />
      <Footer />
    </div>
  );
}
