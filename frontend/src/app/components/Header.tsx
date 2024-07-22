import Image from 'next/image';
import SideBar from './Sidebar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginProps {
  showLogin: boolean;
  showProfile?: boolean;
  showTrello?: boolean;
  onClick?: () => void;
  isAbsolute?: boolean;
  // setIsOpen: (value: boolean) => void;
}

export default function Header({
  showLogin,
  showProfile,
  showTrello,
  onClick,
  isAbsolute,
}: // setIsOpen,
LoginProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const router = useRouter();

  return (
    <header
      className={`flex border-red-900 p-5 items-center justify-between px-4 sm:px-6  ${
        isAbsolute ? 'fixed top-0 left-0`' : ''
      } w-full`}
    >
      <div
        className="flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => router.push('/')}
      >
        <Image
          src="/Subtract.svg"
          alt="logo"
          width={0}
          height={0}
          className="w-8 h-8 sm:w-8 sm:h-8"
        />
        <p className="sm:text-sm md:text-xl lg:text-2xl text-white font-semibold">
          Taskify.ai
        </p>
      </div>
      {showLogin && (
        <button
          className="sm:text-xs md:text-sm lg:text-lg text-white font-medium rounded bg-test px-4 py-2"
          onClick={onClick}
        >
          Войти
        </button>
      )}
      {showProfile && showTrello && (
        <div className="flex flex-row gap-5">
          <span
            className="flex flex-row items-center justify-center text-white cursor-pointer gap-1"
            onClick={() => setIsOpen(true)}
          >
            <span className="text-xs sm:text-sm md:text-lg">Мои доски</span>
            <Image
              className="cursor-pointer"
              src="/trello-board.svg"
              alt="close"
              width={30}
              height={30}
            />
          </span>
          <Image
            src="/profile.svg"
            alt="profile"
            width={30}
            height={30}
            className="cursor-pointer"
            onClick={() => setIsProfileClicked(!isProfileClicked)}
          />
          {isProfileClicked && (
            <span className="fixed right-7 top-14 bg-main-color text-white p-3 px-10 rounded-xl">
              <button
                className="text-red-400"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Sign out
              </button>
            </span>
          )}
        </div>
      )}
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
}
