import prismadb from "@/lib/prismadb";
import ColorsForm from "./components/colors-form";

type DynamicSizesPageProps = {
  params: {
    colorId: string;
  };
};
const BillBoardDynamicPage = async ({
  params: { colorId },
}: DynamicSizesPageProps) => {
  let color;

  if (colorId !== "new") {
    color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });
  } else {
    color = null;
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsForm initialData={color} />
      </div>
    </div>
  );
};

export default BillBoardDynamicPage;
