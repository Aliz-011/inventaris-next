import prismadb from '@/lib/prismadb';
import PageClient from './_components/client';

const OrderIdPage = async () => {
  const orders = await prismadb.order.findMany();

  return (
    <>
      <PageClient />
    </>
  );
};

export default OrderIdPage;
