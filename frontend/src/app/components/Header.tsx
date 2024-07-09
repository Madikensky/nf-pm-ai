import Image from 'next/image';

interface LoginProps {
  showLogin: boolean;
}

export default function Header({ showLogin }: LoginProps) {
  return (
    <header className="flex border-red-900 p-3 items-center justify-between px-6 fixed w-full top-0 left-0">
      <div className="flex items-center justify-center">
        <Image src="/logo_taskify.svg" alt="logo" width={40} height={40} />
        <p className="cursor-default text-2xl text-white font-medium">
          Taskify.AI
        </p>
      </div>
      {showLogin && (
        <button className="text-lg text-white font-medium">Войти</button>
      )}
    </header>
  );
}
