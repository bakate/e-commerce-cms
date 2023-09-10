import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeId: string) => {
  return prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });
};
