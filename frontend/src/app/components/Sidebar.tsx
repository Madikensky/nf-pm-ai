import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Loading from './Loading';
import axios from 'axios';
import url from '../lib/url';
import { useSidebar } from './SidebarProvider';

export default function SideBar({ isOpen, setIsOpen }: any) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // const sidebarStatus = useSidebar();
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  const [boards, setBoards] = useState<any[]>([]);
  const [openIframe, setOpenIframe] = useState(false);
  const [currentBoard, setCurrentBoard] = useState('');

  useEffect(() => {
    if (localStorage.getItem('email')) {
      axios
        .post(`${url}/get-tokens`, {
          email: localStorage.getItem('email'),
        })
        .then((res) => {
          // console.log(res);
          const { trelloToken, trelloAuth } = res.data;
          const savedTrelloToken = trelloToken;
          const savedTrelloAuth = trelloAuth;
          (async () => {
            const responseBoards = await axios.get(
              `https://api.trello.com/1/members/me/boards?key=${savedTrelloToken}&token=${savedTrelloAuth}`
            );
            const boards = responseBoards.data;
            setBoards(boards);
          })();
        });
    }

    // console.log(currentBoard);
  }, []);

  const reloadBoard = () => {
    // setIsBoardLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      // setIsBoardLoading(false);
    }
  };

  return (
    <div
      className={`trello-container h-full fixed top-0 right-[-100%] flex flex-col w-full sm:w-1/3 lg:w-1/4  ${
        isOpen ? 'open' : ''
      }`}
    >
      <div className="p-5 bg-main-color flex items-end justify-between sm:justify-end gap-4 pt-6">
        {openIframe && (
          <div
            className="flex flex-row gap-2 text-white items-center cursor-pointer"
            onClick={reloadBoard}
          >
            <span>Обновить доску</span>
            <Image
              src={'/Reboot.svg'}
              width={27}
              height={27}
              alt="update board"
              className="cursor-pointer"
              // onClick={reloadBoard}
            />
          </div>
        )}
        <Image
          src={'/Close.svg'}
          width={27}
          height={27}
          alt="close window"
          className="cursor-pointer"
          onClick={() => {
            setIsOpen(false);
            setOpenIframe(false);
            setSidebarOpen(false);
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
        <div className="h-full w-full bg-main-color flex flex-col items-center justify-between p-5 sm:justify-around gap-5">
          <h1 className="font-semibold text-xl text-light-blue">
            Ваши доски Trello:
          </h1>
          <div className="flex flex-col gap-4 w-full p-2 sidebar">
            {boards.length !== 0 &&
              boards.map((board, id) => (
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
            {boards.length === 0 && (
              <div className="text-white text-center">
                Доски не найдены ;(
                <br />
                Вам нужно создать доски в Trello, чтобы они отобразились здесь.
              </div>
            )}
          </div>
          <div className="w-full text-red-200 text-sm text-center flex flex-col gap-5">
            <span>
              Внимание! Сделайте вашу доску публичной, чтобы наблюдать за
              изменениями в реальном времени.
            </span>
            <span>
              Найдите значок на сайте Trello рядом с названием доски, и как
              показано ниже,
            </span>
            <span className="flex items-center justify-center">
              <Image src="/icon.svg" alt="d" width={25} height={25} />
            </span>
            <span className="">нажмите на него и выберите</span>
            <span className="flex items-center justify-center gap-2">
              <Image
                src={'/public.svg'}
                width={25}
                height={25}
                alt="public-mode"
              />
              &ldquo;Публичная&rdquo;
            </span>
            <span className="text-pink-100">
              Если вы удалили старую доску, или добавили новую - не забудьте
              обновить страницу.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
