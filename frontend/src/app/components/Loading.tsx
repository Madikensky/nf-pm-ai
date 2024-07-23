import Image from 'next/image';

export default function Loading() {
  return (
    <div className="w-full h-screen items-center justify-center flex ">
      {/* <Image
        alt="loading"
        src="/loading-logo.gif"
        unoptimized={true}
        width={500}
        height={500}
      /> */}
      <video
        src="loading-logo.mp4"
        width={300}
        height={300}
        autoPlay
        controls={false}
        muted
        loop
        playsInline
      />
    </div>
  );
}
