import Image from 'next/image';
import { useEffect } from 'react';

export default function ChatFooter() {
  return (
    <div className=" border-green-600 flex items-center justify-center p-6">
      <div className="border-2 border-main-color  w-full rounded-2xl flex flex-row p-2 gap-2 lg:w-1/2">
        <textarea
          name=""
          className="w-full rounded-tl-lg rounded-bl-lg outline-none resize-none text-xs sm:text-sm md:text-lg lg:text-xl p-2"
          placeholder='Создай карточку "Дейлик"...'
          // value=""
          rows={1}
        ></textarea>
        <div className="flex border-red-600 min-w-14 items-center justify-center">
          <div className="border-blue-600 w-9/12 h-10 rounded-full bg-gray-color  flex items-center justify-center">
            <Image
              src="/up.png"
              width={25}
              height={25}
              alt="send"
              className=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
