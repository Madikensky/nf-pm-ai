import Image from 'next/image';
import PromptTemplate from './PromptTemplate';

export default function ChatPreview() {
  return (
    <div className="border-4 border-red-600 w-full h-full flex items-center justify-center flex-col gap-10">
      <div>
        <Image
          src="./dark_taskify.svg"
          alt="dark_logo"
          width={300}
          height={300}
          className="border-4"
        />
      </div>
      <div className="border-4 flex flex-row gap-14">
        <PromptTemplate logo="" title="" />
        <PromptTemplate logo="" title="" />
        <PromptTemplate logo="" title="" />
      </div>
    </div>
  );
}
