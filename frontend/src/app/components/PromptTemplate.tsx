import Image from 'next/image';

interface PromptTemplateProps {
  logo: string;
  title: string;
  isThird?: boolean;
}

export default function PromptTemplate({
  logo,
  title,
  isThird,
}: PromptTemplateProps) {
  return (
    !isThird && (
      <div className="border-2 rounded-3xl flex flex-col p-5 gap-2 border-main-color bg-main-color w-32 sm:w-36 md:w-48">
        <div className="">
          <Image src={logo} alt="logo" width={30} height={30} />
        </div>
        <div className="text-gray-400 font-semibold text-start w-1/2 text-xs sm:text-sm md:text-lg lg:text-xl">
          {title}
        </div>
      </div>
    )
  );
}
