'use client';

import Header from '../components/Header';
import LoginLeft from '../components/LoginLeft';
import LoginRight from '../components/LoginRight';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '../components/Loading';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem('email')) {
      router.push('/');
    }
  });
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="">
      <Header showLogin={false} isAbsolute={true} />
      <div className="flex flex-col sm:flex-row mt-20 sm:mt-0">
        {/* {isLoading ? (
          <Loading />
        ) : ( */}
        <>
          <LoginLeft
            setIsLoading={setIsLoading}
            error={error}
            setError={setError}
          />
          <LoginRight />
        </>
        {/* )} */}
      </div>
    </div>
  );
}
