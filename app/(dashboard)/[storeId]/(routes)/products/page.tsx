import prismadb from "@/lib/prismadb";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { ProductColumn } from "./components/columns";
import { ProductsClient } from "./components/products-client";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      colors: true,
      sizes: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => {
    return {
      category: item.category.name,
      colors: item.colors.map((color) => ({
        label: color.name,
        value: color.value,
        id: color.id,
      })),
      sizes: item.sizes.map((size) => ({
        label: size.name,
        value: size.value,
        id: size.id,
      })),
      isArchived: item.isArchived,
      isFeatured: item.isFeatured,
      name: item.name,
      description: item.description,
      price: currencyFormatter(item.price),
      id: item.id,
      createdAt: dateFormatter(item.createdAt),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
