'use client';

import { ColumnDef } from '@tanstack/react-table';
import CellAction from './cell-action';
import { DataTableColumnHeader } from './data-table-column-header';

export type OrderColumn = {
  id: string;
  customer: string;

  products: string;
  totalPrice: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'customer',
    header: 'Customer',
  },
  {
    accessorKey: 'products',
    header: 'Items',
  },
  {
    accessorKey: 'totalPrice',
    header: ({ column }) => (
      <DataTableColumnHeader title="Total" column={column} />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader title="Date" column={column} />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
