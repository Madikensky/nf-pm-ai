import Link from 'next/link';
import Image from 'next/image';

interface SocialLinkProps {
  href: string;
  src: string;
}

export default function SocialLink({ href, src }: SocialLinkProps) {
  return (
    <Link href={href} target="_blank">
      <Image src={src} width={45} height={45} alt="logo" />{' '}
    </Link>
  );
}
