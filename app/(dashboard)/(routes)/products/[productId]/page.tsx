import ProductForm from './_components/product-form';

import prismadb from '@/lib/prismadb';

const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
  });

  const categories = await prismadb.category.findMany();

  return (
    <>
      <ProductForm initialData={product} categories={categories} />
    </>
  );
};

export default ProductPage;
