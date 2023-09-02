import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";

type BillBoardDynamicPageProps = {
  params: {
    billboardId: string;
  };
};
const BillBoardDynamicPage = async ({
  params: { billboardId },
}: BillBoardDynamicPageProps) => {
  let billboard;

  if (billboardId !== "new") {
    billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });
  } else {
    billboard = null;
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillBoardDynamicPage;
