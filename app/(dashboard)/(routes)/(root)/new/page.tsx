import prismadb from '@/lib/prismadb';
import OrderForm from './_components/order-form';

const NewOrderPage = async () => {
  const products = await prismadb.product.findMany();

  return (
    <>
      <OrderForm products={products} />
    </>
  );
};

export default NewOrderPage;
