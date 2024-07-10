import React, { useState } from 'react';

interface InputFieldProps {
  tokenType: string;
  setToken: (token: string) => void;
}

export default function InputField({ tokenType, setToken }: InputFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <label
        htmlFor={tokenType}
        className="text-smaller text-main-color font-semibold w-4/5"
      >
        {tokenType}
      </label>
      <input
        required
        type="text"
        placeholder={`Ваш ${tokenType}`}
        id={tokenType}
        className="border-2 text-smaller p-5 rounded-lg outline-none border-main-color w-4/5"
        onChange={handleChange}
      />
    </div>
  );
}
