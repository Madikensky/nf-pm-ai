import React from 'react';
import Header from './components/Header';
import Image from 'next/image';
import FaqContainer from './components/FaqContainer';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <Header showLogin={true} />
      <div className="flex flex-col gap-10 mt-48  border-blue-800 ">
        <div className="flex flex-row items-center justify-center text-center">
          <p className="font-semibold text-2xl text-main-color">
            Taskify.ai - Ваш персональный помощник на платформе Trello
          </p>
          <Image src={'./Trello.svg'} width={45} height={45} alt="logo" />
        </div>
        <p className="flex justify-center items-center font-semibold text-2xl text-center text-main-color">
          {' '}
          Упростите и оптимизируйте управление задачами с помощью чат-бота на
          базе искусственного интеллекта.
        </p>
      </div>
      <div className="flex items-center justify-center">
        <div className="border-2 flex gap-2 py-3 px-4 rounded-lg border-black cursor-pointer bg-main-color">
          <span className="font-medium text-white">Попробовать сейчас</span>
          <Image src="./Vector.svg" width={15} height={15} alt="arrow" />
        </div>
      </div>
      <p className="text-center font-semibold text-xl text-main-color">
        Как это работает?
      </p>
      <div className="flex items-center justify-center w-full">
        <div className="h-96 flex items-center justify-center bg-main-color rounded-lg text-white w-2/3">
          video
        </div>
      </div>
      <FaqContainer />
      <Footer />
    </div>
  );
}
