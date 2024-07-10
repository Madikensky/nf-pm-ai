import SocialLink from './SocialLink';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 flex flex-col gap-5">
      <div className="flex flex-row gap-10 items-center justify-center">
        <SocialLink
          href="https://www.linkedin.com/in/madiyar-kenzhebayev/"
          src="./Linkedin.svg"
        />
        <SocialLink href="https://github.com/Madikensky" src="./Github.svg" />
        <SocialLink href="https://t.me/madikensky" src="./Telegram App.svg" />
      </div>
      <p className="text-gray-400 text-xs sm:text-sm">
        Copyright © 2024 Taskify.AI. All rights reserved.
      </p>
    </footer>
  );
}
