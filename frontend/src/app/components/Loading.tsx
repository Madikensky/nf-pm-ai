import Image from 'next/image';

export default function Loading() {
  return (
    <div className="w-full h-screen items-center justify-center flex">
      <Image
        alt="loading"
        src="/download.gif"
        unoptimized={true}
        width={500}
        height={500}
      />
    </div>
  );
}
