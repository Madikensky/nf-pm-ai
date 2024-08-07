import Link from 'next/link';
import Image from 'next/image';

interface RightSubheadingProps {
  title: string;
  subtitle: { content: string; color?: string; weight?: string }[];
  image?: string;
  link?: string;
}

export default function LoginRightSubHeading({
  title,
  subtitle,
  image,
  link,
}: RightSubheadingProps) {
  return (
    <div className="flex flex-col gap-2 w-full break-words">
      <h2 className="text-sm sm:text-lg lg:text-xl text-main-color font-semibold w-full">
        {title}
      </h2>
      <p className="text-xs sm:text-sm  w-full">
        {image && (
          <Image
            src={image}
            alt="Trello API Key"
            width={500}
            height={400}
            className="rounded-md mb-5"
          />
        )}
        {subtitle.map((str, idx) =>
          str.content === '<br>' ? (
            <br key={idx} />
          ) : str.content === 'link ' ? (
            <span key={idx} style={{ fontWeight: str.weight }}>
              {
                <Link
                  href="https://trello.com/power-ups/admin"
                  target="_blank"
                  className="text-blue-600"
                >
                  Trello Power Ups&nbsp;
                </Link>
              }
            </span>
          ) : str.content === 'Trello' ? (
            <span key={idx} style={{ fontWeight: str.weight }}>
              {
                <Link
                  href="https://trello.com/"
                  target="_blank"
                  className="text-blue-600"
                >
                  Trello&nbsp;
                </Link>
              }
            </span>
          ) : str.content === 'Как должен выглядеть ключ: ' ? (
            <span key={idx} className="text-red-600 font-semibold text-base">
              {str.content}
            </span>
          ) : str.content === 'auth' ? (
            <span key={idx} style={{ fontWeight: str.weight }}>
              {
                <Link
                  href={`https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&key=${link}`}
                  target="_blank"
                  className="text-blue-600"
                >
                  Auth Token&nbsp;
                </Link>
              }
            </span>
          ) : (
            <span
              key={idx}
              style={{ fontWeight: str.weight }}
              className="text-blue-600"
            >
              <span className="text-black">{str.content}</span>
            </span>
          )
        )}
      </p>
    </div>
  );
}
