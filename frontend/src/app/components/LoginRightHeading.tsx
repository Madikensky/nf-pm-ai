interface LoginRightHeadingProps {
  title: string;
  subtitle: string;
}

export default function LoginRightHeading({
  title,
  subtitle,
}: LoginRightHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-main-color lg:text-2xl  text-xl font-semibold">
        {title}
      </h1>
      <p className="text-gray-color text-xs sm:text-sm">{subtitle}</p>
    </div>
  );
}
