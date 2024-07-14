import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ChatFooter() {
  const [isConversationStarted, setIsConversationStarted] = useState(false);
  const [userInput, setUserInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return;
      } else {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.trim().length > 0) {
      setIsConversationStarted(true);
    } else {
      setIsConversationStarted(false);
    }

    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    if (!isConversationStarted) {
      return;
    }
    console.log('Form submitted');
    console.log('Data:', userInput);
  };

  return (
    <div className=" border-green-600 flex items-center justify-center p-6">
      <form
        className="border-2 border-main-color  w-full rounded-2xl flex flex-row p-2 gap-2 lg:w-1/2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <textarea
          name=""
          className="w-full rounded-tl-lg rounded-bl-lg outline-none resize-none text-xs sm:text-sm md:text-lg lg:text-xl p-2"
          placeholder='Создай карточку "Дейлик"...'
          value={userInput}
          onKeyDown={handleKeyDown}
          rows={1}
          onChange={handleInput}
        ></textarea>
        <button
          type="submit"
          className="flex border-red-600 min-w-14 items-center justify-center"
          disabled={!isConversationStarted}
        >
          <div
            className={`border-blue-600 w-9/12 h-10 rounded-full ${
              isConversationStarted ? 'bg-main-color' : 'bg-gray-color'
            } flex items-center justify-center`}
          >
            <Image
              src="/up.png"
              width={25}
              height={25}
              alt="send"
              className=""
            />
          </div>
        </button>
      </form>
    </div>
  );
}
