'use client';

import Header from '../components/Header';
import LoginLeft from '../components/LoginLeft';
import LoginRight from '../components/LoginRight';
import { useState } from 'react';
import Loading from '../components/Loading';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="">
      <Header showLogin={false} isAbsolute={true} />
      <div className="flex flex-col sm:flex-row mt-20 sm:mt-0">
        <LoginLeft setIsLoading={setIsLoading} />
        <LoginRight />
      </div>
    </div>
  );
}
