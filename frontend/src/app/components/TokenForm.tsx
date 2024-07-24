'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TokenFormProps {
  setTrelloToken: (token: string) => void;
  setTrelloAuth: (auth: string) => void;
  setShowElement: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

export function TokenForm({
  setTrelloAuth,
  setTrelloToken,
  setShowElement,
  setIsLoading,
}: TokenFormProps) {
  const [trelloToken, setTrelloTokenLocal] = useState('');
  const [trelloAuth, setTrelloAuthLocal] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenT = localStorage.getItem('TrelloToken');
      const tokenA = localStorage.getItem('AuthToken');
      if (tokenT && tokenA) {
        // console.log('bar');
        setTrelloToken(tokenT);
        setTrelloAuth(tokenA);
        setShowElement(false);
      }
    }
  }, []);

  const submitTokens = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    localStorage.setItem('TrelloToken', trelloToken);
    localStorage.setItem('AuthToken', trelloAuth);
    setIsLoading(true);

    axios
      .post('http://localhost:5000/token_login', {
        trelloToken,
        authToken: trelloAuth,
      })
      .then((e) => {
        setTrelloAuth(trelloAuth);
        setTrelloToken(trelloToken);
        setShowElement(false);
        // console.log(e.data);
        setIsLoading(false);
      });

    // console.log(trelloToken);
    // console.log(trelloAuth);
  };
  return (
    <form
      className="flex flex-col gap-5 border-blue-950 border-2 w-1/3 h-1/2 rounded items-center justify-center"
      onSubmit={submitTokens}
    >
      <div className="flex flex-col w-1/2 gap-2">
        <label htmlFor="trelloAPI">Trello API Token </label>
        <input
          type="text"
          id="trelloAPI"
          className="border-2 w-full outline-none p-1 rounded border-blue-950"
          required
          value={trelloToken}
          onChange={(e) => setTrelloTokenLocal(e.target.value)}
        />
      </div>
      <div className="flex flex-col w-1/2 gap-2">
        <label htmlFor="trelloAUTH">Trello Auth Token</label>
        <input
          type="text"
          id="trelloAUTH"
          className="border-2 w-full outline-none p-1 rounded border-blue-950"
          required
          value={trelloAuth}
          onChange={(e) => setTrelloAuthLocal(e.target.value)}
        />
      </div>
      <a
        href="https://docs.google.com/document/d/1qsmaFBXlkPrt2W9G1nZ9hKX1ODHF-O7oGQfVBN0XnFI/edit?usp=sharing"
        className="text-blue-700"
        target="_blank"
      >
        Где я могу получить оба токена?
      </a>
      <button className="w-1/4 bg-blue-950 text-white rounded" type="submit">
        Save
      </button>
    </form>
  );
}
