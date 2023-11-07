import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
  // we want to cumulate the stock count of all products in the store by adding together all the inventory counts
  const allAvailableProducts = await prismadb.product.findMany({
    where: {
      storeId,
      isArchived: false,
    },
    select: {
      inventory: true,
    },
  });

  return allAvailableProducts.reduce((totalStock, product) => {
    return totalStock + product.inventory;
  }, 0);
};
