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
      <h1 className="text-main-color text-3xl font-semibold">{title}</h1>
      <p className="text-gray-color text-sm">{subtitle}</p>
    </div>
  );
}
