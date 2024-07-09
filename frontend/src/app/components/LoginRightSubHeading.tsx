interface RightSubheadingProps {
  title: string;
  subtitle: { content: string; color?: string; weight?: string }[];
}

export default function LoginRightSubHeading({
  title,
  subtitle,
}: RightSubheadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl text-main-color font-semibold">{title}</h2>
      <p className="text-sm">
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
