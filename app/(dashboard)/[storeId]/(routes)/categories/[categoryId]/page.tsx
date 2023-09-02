import prismadb from "@/lib/prismadb";
import CategoriesForm from "./components/categories-form";

type CategoryDynamicPageProps = {
  params: {
    categoryId: string;
    storeId: string;
  };
};
const CategoryDynamicPage = async ({
  params: { categoryId, storeId },
}: CategoryDynamicPageProps) => {
  let category;

  if (categoryId !== "new") {
    category = await prismadb.category.findUnique({
      where: {
        id: categoryId,
      },
    });
  } else {
    category = null;
  }

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryDynamicPage;
