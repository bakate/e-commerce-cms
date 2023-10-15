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

  if (productId !== "new") {
    product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        sizes: true,
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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
