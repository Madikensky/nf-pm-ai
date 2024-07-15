import { use, useEffect, useRef, RefObject } from 'react';

export default function ChatContainer({ children }: any) {
  const containerRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="border-gray-500 w-full max-w-full h-full text-xs p-3 sm:p-5 lg:p-10 chat-container flex flex-col gap-10 sm:text-sm lg:text-xl lg:w-3/4 bg-gray-200 rounded-xl"
    >
      {children}
    </div>
  );
}
