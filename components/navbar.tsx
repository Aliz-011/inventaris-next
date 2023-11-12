import { UserButton, auth } from '@clerk/nextjs';

import { MainNav } from './main-nav';
import Link from 'next/link';
import { ModeToggle } from './theme-toggle';

const Navbar = () => {
  const { userId } = auth();

  return (
    <div className="border-b max-w-screen-2xl mx-auto">
      <div className="flex h-16 items-center px-4">
        <Link
          href={'/'}
          className="hidden sm:inline text-lg font-semibold tracking-widest uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline"
        >
          MASPUR
        </Link>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
