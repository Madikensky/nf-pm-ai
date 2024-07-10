import Image from 'next/image';

interface LoginProps {
  showLogin: boolean;
  onClick?: () => void;
}

export default function Header({ showLogin, onClick }: LoginProps) {
  return (
    <header className="flex border-red-900 p-3 items-center justify-between px-6 fixed w-full top-0 left-0">
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
    </header>
  );
}
