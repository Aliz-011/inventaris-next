import { format } from 'date-fns';

import ProductClient from './_components/client';
import { ProductColumn } from './_components/columns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

const ProductPage = async () => {
  const products = await prismadb.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    category: item.category.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <>
      <ProductClient data={formattedProducts} />
    </>
  );
};

export default ProductPage;
