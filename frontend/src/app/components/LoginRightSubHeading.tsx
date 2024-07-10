interface RightSubheadingProps {
  title: string;
  subtitle: { content: string; color?: string; weight?: string }[];
}

export default function LoginRightSubHeading({
  title,
  subtitle,
}: RightSubheadingProps) {
  return (
    <div className="flex flex-col gap-2 w-full break-words">
      <h2 className="text-sm sm:text-lg lg:text-xl text-main-color font-semibold w-full">
        {title}
      </h2>
      <p className="text-xs sm:text-sm  w-full">
        {subtitle.map((str, idx) =>
          str.content === '<br>' ? (
            <br key={idx} />
          ) : (
            <span key={idx} style={{ fontWeight: str.weight }}>
              {str.content}
            </span>
          )
        )}
      </p>
    </div>
  );
}
