import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return paidOrders.reduce((totalOrders, order) => {
    const orderTotal = order.orderItems.reduce((totalProducts, orderItem) => {
      return totalProducts + orderItem.product.price;
    }, 0);
    return totalOrders + orderTotal;
  }, 0);
};
