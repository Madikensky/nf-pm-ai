import Image from 'next/image';

interface LoginProps {
  showLogin: boolean;
  showProfile?: boolean;
  showTrello?: boolean;
  onClick?: () => void;
  isAbsolute?: boolean;
}

export default function Header({
  showLogin,
  showProfile,
  showTrello,
  onClick,
  isAbsolute,
}: LoginProps) {
  return (
    <header
      className={`flex border-red-900 p-3 items-center justify-between px-6 ${
        isAbsolute ? 'fixed top-0 left-0`' : ''
      } w-full`}
    >
      <div className="flex items-center justify-center">
        <Image src="/logo_taskify.svg" alt="logo" width={40} height={40} />
        <p className="cursor-default sm:text-sm md:text-xl lg:text-2xl text-white font-medium">
          Taskify.AI
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
          <Image src="/profile.svg" alt="profile" width={30} height={30} />
          <Image src="/Trello_board.svg" alt="close" width={30} height={30} />
        </div>
      )}
    </header>
  );
}
