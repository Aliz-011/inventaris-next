'use client';

import { Plus } from 'lucide-react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/data-table';
import { ProductColumn, columns } from './columns';

const ProductClient = ({ data }: { data: ProductColumn[] }) => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading title="Products" subtitle="Here's a list of your products" />
        <Button size="sm" onClick={() => router.push(`/products/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default ProductClient;
