'use client';
import React from 'react';
import { CSSTransition } from 'react-transition-group';

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
        className="flex justify-between items-center w-full text-left gap-5"
      >
        <span className="text-xs sm:text-sm lg:text-xl text-main-color font-semibold">
          {question}
        </span>
        <span className="text-black">{isOpen ? '×' : '+'}</span>
      </button>
      <CSSTransition in={isOpen} timeout={300} classNames="faq" unmountOnExit>
        <div className="faq-content">
          <p className="mt-2 text-xs sm:text-sm text-gray-600">{answer}</p>
        </div>
      </CSSTransition>
      {/* {isOpen && (
        <p className="mt-2 text-xs sm:text-sm  text-gray-600">{answer}</p>
      )} */}
    </div>
  );
}
