'use client';
import React from 'react';

export interface FaqItemProps {
  question: string;
  answer: string;
  isLast?: boolean;
}

export default function FaqItem({ question, answer, isLast }: FaqItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div
      className={`border-t-2 ${isLast ? 'border-b-2' : ''} border-black py-4`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <span className="text-xl text-main-color font-semibold">
          {question}
        </span>
        <span className="text-black">{isOpen ? '×' : '+'}</span>
      </button>
      {isOpen && <p className="mt-2 text-gray-600">{answer}</p>}
    </div>
  );
}
