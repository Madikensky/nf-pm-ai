import Image from 'next/image';
import PromptTemplate from './PromptTemplate';
import { useState, useEffect, useCallback } from 'react';

export default function ChatPreview() {
  const useMediaQuery = (width: number) => {
    const [targetReached, setTargetReached] = useState(false);

    const updateTarget = useCallback((e: any) => {
      if (e.matches) {
        setTargetReached(true);
      } else {
        setTargetReached(false);
      }
    }, []);

    useEffect(() => {
      const media = window.matchMedia(`(max-width: ${width}px)`);
      media.addEventListener('change', updateTarget);

      if (media.matches) {
        setTargetReached(true);
      }

      return () => media.removeEventListener('change', updateTarget);
    }, []);

    return targetReached;
  };

  const isBreakpoint = useMediaQuery(768);

  return (
    <div className=" border-red-600 w-full h-full flex items-center justify-center flex-col gap-0 flex-wrap">
      <div>
        <Image
          src="./taskif2.svg"
          alt="dark_logo"
          width={300}
          height={300}
          className=""
        />
      </div>
      <div className="flex sm:flex-row gap-4 flex-wrap items-center justify-center md:items-start ">
        <PromptTemplate
          logo="/Create.svg"
          title="Создавайте
карточки"
        />
        <PromptTemplate
          logo="/Calendar.svg"
          title="Определяйте
дедлайн"
        />
        {!isBreakpoint && (
          <PromptTemplate
            logo="People.svg"
            title="Делегируйте
задачи"
          />
        )}
      </div>
    </div>
  );
}
