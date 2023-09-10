import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
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

  const monthlyRevenue: { [key: number]: number } = {};

  // generate the 12 months in fr-FR and set the value to 0
  const graphData: GraphData[] = Array.from({ length: 12 }, (_, i) => {
    return {
      name: new Date(0, i).toLocaleString("fr-FR", { month: "long" }),
      total: 0,
    };
  });

  for (const order of paidOrders) {
    const orderTotal = order.orderItems.reduce((totalProducts, orderItem) => {
      return totalProducts + orderItem.product.price;
    }, 0);

    const orderMonth = new Date(order.createdAt).getMonth();

    monthlyRevenue[orderMonth] = (monthlyRevenue[orderMonth] || 0) + orderTotal;
  }

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[month];
  }

  return graphData;
};
