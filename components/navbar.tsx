import MainNav from "@/components/main-nav";
import { ModeToggle } from "@/components/mode-toggle";
import StoreSwitcher from "@/components/store-switcher";
import prismadb from "@/lib/prismadb";
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex items-center  w-full h-16 px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-2" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
