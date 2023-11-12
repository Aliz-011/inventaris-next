import prismadb from '@/lib/prismadb';
import CategoryClient from './_components/client';
import { CategoryColumn } from './_components/columns';
import { format } from 'date-fns';

const CategoryPage = async () => {
  const categories = await prismadb.category.findMany();

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));
  return (
    <>
      <CategoryClient data={formattedCategories} />
    </>
  );
};

export default CategoryPage;
