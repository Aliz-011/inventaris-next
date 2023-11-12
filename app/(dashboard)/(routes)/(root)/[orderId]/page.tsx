import prismadb from '@/lib/prismadb';
import OrderIdClient from './_components/client';

const DetailOrderPage = async ({ params }: { params: { orderId: string } }) => {
  const order = await prismadb.order.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return <OrderIdClient order={order} />;
};

export default DetailOrderPage;
