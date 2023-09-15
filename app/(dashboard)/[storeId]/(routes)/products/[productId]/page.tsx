import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

type BillBoardDynamicPageProps = {
  params: {
    productId: string;
    storeId: string;
  };
};
const ProductPage = async ({
  params: { productId, storeId },
}: BillBoardDynamicPageProps) => {
  let product;

  // if (billboardId !== "new") {
  //   billboard = await prismadb.billboard.findUnique({
  //     where: {
  //       id: billboardId,
  //     },
  //   });
  // } else {
  //   billboard = null;
  // }

  if (productId !== "new") {
    product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
      },
    });
  } else {
    product = null;
  }

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
