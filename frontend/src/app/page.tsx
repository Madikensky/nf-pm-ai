'use client';

import React from 'react';
import Header from './components/Header';
import Image from 'next/image';
import FaqContainer from './components/FaqContainer';
import Footer from './components/Footer';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChatComponent from './components/ChatComponent';
import Loading from './components/Loading';
import { Analytics } from '@vercel/analytics/react';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem('email');

    if (email) {
      try {
        axios
          .post('http://localhost:5000/get-tokens', { email: email })
          .then((res) => {
            // console.log(res);
            const { trelloToken, trelloAuth } = res.data;
            if (trelloToken && trelloAuth) {
              setIsLogged(true);
            }
            setIsLoading(false);
          });
      } catch (e) {
        console.log('error on main page: ', e);
      }
    } else {
      // router.push('/');
      setIsLogged(false);
      setIsLoading(false);
    }
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  if (isLoading) return <Loading />;

  return !isLogged ? (
    <div className="flex flex-col gap-10 sm:gap-20">
      <Header showLogin={true} onClick={handleLogin} isAbsolute={true} />
      <div className="flex flex-col gap-20  mt-20 sm:mt-48 sm:flex-row sm:gap-5 border-blue-800 p-10">
        <div className="flex flex-col gap-10 w-full sm:w-1/2 justify-center ">
          <p className="font-black text-smaller md:text-xl lg:text-3xl sm:text-start text-center">
            Taskify.ai - Ваш персональный помощник на платформе&nbsp;
            <span className="inline-flex flex-row items-center justify-center gap-1">
              <span>Trello</span>
              <Image
                src={'/trello-b.svg'}
                alt="trello"
                width={25}
                height={25}
                className=""
              />
            </span>
          </p>
          <p className="font-normal sm:text-xs md:text-sm lg:text-xl sm:text-start text-center">
            {' '}
            Упростите и оптимизируйте управление задачами с помощью чат-бота на
            базе искусственного интеллекта.
          </p>
          <div
            className="flex gap-2 py-3 px-4 rounded-lg border-black cursor-pointer bg-main-color w-full sm:w-2/3 items-center justify-center"
            onClick={handleLogin}
          >
            <span className="font-medium text-white sm:text-xs md:text-sm lg:text-lg">
              Попробовать сейчас
            </span>
            <Image src="./Vector.svg" width={15} height={15} alt="arrow" />
          </div>
        </div>
        <div className="flex items-center justify-center  bg-main-color text-white rounded-lg sm:w-1/2">
          <div className="h-full flex items-center justify-center">
            <video
              src="video.mp4"
              className=" border-main-color rounded"
              autoPlay
              controls={false}
              muted
              loop
              playsInline
            />
          </div>
        </div>
      </div>
      <FaqContainer />
      <Footer />
      <Analytics />
    </div>
  ) : (
    <>
      <ChatComponent />
      <Analytics />
    </>
  );
}
