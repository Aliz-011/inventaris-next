import prismadb from '@/lib/prismadb';

export const getRevenueToday = async () => {
  const currentDate = new Date();

  // Set the time to the beginning of the day
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);

  // Set the time to the end of the day
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const orders = await prismadb.order.findMany({
    where: {
      createdAt: { gte: startOfDay, lte: endOfDay },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders.reduce((total, order) => {
    return (
      total +
      order.orderItems.reduce((orderTotal, item) => {
        return orderTotal + Number(item.product.price) * Number(item.quantity);
      }, 0)
    );
  }, 0);
};
