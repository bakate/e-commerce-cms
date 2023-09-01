import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type StoreLayoutProps = {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
};
const StoreLayout = async ({
  children,
  params: { storeId },
}: StoreLayoutProps) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }
  if (!storeId.match(/^[0-9a-fA-F]{24}$/)) {
    redirect("/");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default StoreLayout;
