import prismadb from '@/lib/prismadb';
import PDFFile from './_components/pdf-file';

const OrderIdPage = async () => {
  const currentDate = new Date();
  // Set the time to the beginning of the day
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);

  // Set the time to the end of the day
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  const orders = await prismadb.order.findMany({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <>
      <PDFFile orders={orders} />
    </>
  );
};

export default OrderIdPage;
