import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Loading from './Loading';

export default function SideBar({ isOpen, setIsOpen }: any) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [openIframe, setOpenIframe] = useState(false);
  const [currentBoard, setCurrentBoard] = useState('');

  useEffect(() => {
    if (localStorage.getItem('trelloBoards')) {
      setBoards(JSON.parse(localStorage.getItem('trelloBoards') as string));
    }
    // console.log(currentBoard);
  }, []);

  const reloadBoard = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div
      className={`trello-container h-full fixed top-0 right-[-100%] flex flex-col w-full sm:w-1/3 lg:w-1/4 ${
        isOpen ? 'open' : ''
      }`}
    >
      <div className="p-5 bg-main-color flex items-end justify-between sm:justify-end gap-4">
        <Image
          src={'/Reboot.svg'}
          width={27}
          height={27}
          alt="update board"
          className="cursor-pointer"
          onClick={reloadBoard}
        />
        <Image
          src={'/Close.svg'}
          width={27}
          height={27}
          alt="close window"
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(false);
            setOpenIframe(false);
          }}
        />
      </div>
      {openIframe ? (
        <iframe
          ref={iframeRef}
          src={`${currentBoard}.html`}
          width=""
          frameBorder={0}
          height=""
          className=" border-blue-900 h-full w-full bg-gray-400 flex items-center justify-center text-white"
        ></iframe>
      ) : (
        <div className="h-full w-full bg-main-color flex flex-col items-center justify-between p-5 sm:justify-around">
          <h1 className="font-semibold text-xl text-white">
            Ваши доски Trello:
          </h1>
          <div className="flex flex-col gap-4 w-full">
            {boards.map((board, id) => (
              <div
                key={id}
                className="rounded-md p-2 px-6 text-center text-white bg-trello-color w-full cursor-pointer"
                onClick={() => {
                  setCurrentBoard(board.shortUrl);
                  setOpenIframe(true);
                }}
              >
                {board.name}
              </div>
            ))}
          </div>
          <div className="w-full text-red-200 text-sm text-center flex flex-col gap-5">
            <span>
              Внимание! Сделайте вашу доску публичной, чтобы наблюдать за
              изменениями в реальном времени.
            </span>
            <span>
              Найдите значок, как показано ниже, возле названия доски,
            </span>
            <span className="flex items-center justify-center">
              <Image src="/icon.svg" alt="d" width={25} height={25} />
            </span>
            <span className="">
              нажмите на него и выберите &ldquo;Публичная видимость&rdquo;.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
