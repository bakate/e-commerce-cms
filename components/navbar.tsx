"use client";

import MainNav from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex items-center  w-full h-16 px-4">
        <div>This will be a store switcher button</div>
        <MainNav className="mx-2" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
