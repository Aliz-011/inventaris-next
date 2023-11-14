import prismadb from '@/lib/prismadb';
import PDFFile from './_components/pdf-file';

const OrderIdPage = async () => {
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

  const orders = await prismadb.order.findMany({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
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
