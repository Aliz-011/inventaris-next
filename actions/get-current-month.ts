import prismadb from '@/lib/prismadb';

const currentDate = new Date();
const startOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth(),
  1
);
const endOfMonth = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  0,
  23,
  59,
  59,
  999
);

export const getSalesThisMonth = async () => {
  const orders = await prismadb.order.findMany({
    where: {
      createdAt: { gte: startOfMonth, lt: endOfMonth },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders.map((order) => {
    return order.orderItems;
  }).length;
};

export const getRevenueThisMonth = async () => {
  const orders = await prismadb.order.findMany({
    where: {
      createdAt: { gte: startOfMonth, lte: endOfMonth },
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
        return orderTotal + Number(item.product.price) * item.quantity;
      }, 0)
    );
  }, 0);
};
