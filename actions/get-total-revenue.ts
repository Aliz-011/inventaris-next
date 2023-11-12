import prismadb from '@/lib/prismadb';

export const getTotalRevenue = async () => {
  const paidOrders = await prismadb.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    return (
      total +
      order.orderItems.reduce((orderSum, item) => {
        return orderSum + item.product.price * item.quantity;
      }, 0)
    );
  }, 0);

  return totalRevenue;
};
