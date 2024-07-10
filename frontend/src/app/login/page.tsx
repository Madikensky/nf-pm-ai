import Header from '../components/Header';
import LoginLeft from '../components/LoginLeft';
import LoginRight from '../components/LoginRight';
import { useState } from 'react';

export default function Login() {
  return (
    <div className="">
      <Header showLogin={false} />
      <div className="flex flex-col sm:flex-row mt-20 sm:mt-0">
        <LoginLeft />
        <LoginRight />
      </div>
    </div>
  );
}
