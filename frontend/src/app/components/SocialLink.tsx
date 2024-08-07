import Link from 'next/link';
import Image from 'next/image';

interface SocialLinkProps {
  href: string;
  src: string;
}

export default function SocialLink({ href, src }: SocialLinkProps) {
  return (
    <Link href={href} target="_blank">
      <Image
        src={src}
        width={0}
        height={0}
        className="w-8 h-8 sm:w-11 sm:h-11"
        alt="logo"
      />{' '}
    </Link>
  );
}
