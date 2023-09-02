import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import SettingsForm from "./components/settings-form";

type SettingsPageProps = {
  params: {
    storeId: string;
  };
};

const SettingsPage = async ({ params: { storeId } }: SettingsPageProps) => {
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
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
