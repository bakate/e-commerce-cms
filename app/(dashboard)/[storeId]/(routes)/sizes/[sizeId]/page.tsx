import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/sizes-form";
import SizesForm from "./components/sizes-form";

type DynamicSizesPageProps = {
  params: {
    sizeId: string;
  };
};
const BillBoardDynamicPage = async ({
  params: { sizeId },
}: DynamicSizesPageProps) => {
  let size;

  if (sizeId !== "new") {
    size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });
  } else {
    size = null;
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesForm initialData={size} />
      </div>
    </div>
  );
};

export default BillBoardDynamicPage;
