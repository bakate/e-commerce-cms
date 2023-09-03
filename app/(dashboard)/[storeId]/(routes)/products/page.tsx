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
      color: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    category: item.category.name,
    color: item.color.value,
    size: item.size.value,
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    name: item.name,
    description: item.description,
    price: currencyFormatter(item.price),
    id: item.id,
    createdAt: dateFormatter(item.createdAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
