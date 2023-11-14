'use client';

import { Plus } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/data-table';
import { CategoryColumn, columns } from './columns';

import { isAdmin } from '@/lib/admin';

const CategoryClient = ({ data }: { data: CategoryColumn[] }) => {
  const router = useRouter();
  const { userId } = useAuth();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title="Categories"
          subtitle="Manage categories for your products"
        />
        {isAdmin(userId) && (
          <Button size="sm" onClick={() => router.push(`/categories/new`)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        )}
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};

export default CategoryClient;
