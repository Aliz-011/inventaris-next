import Link from 'next/link';
import {
  DollarSignIcon,
  CreditCardIcon,
  PlusIcon,
  LineChart,
  Banknote,
  TrendingUp,
} from 'lucide-react';
import { format } from 'date-fns';

import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';

import { OrderColumn, columns } from './_components/columns';
import { buttonVariants } from '@/components/ui/button';
import Heading from '@/components/heading';
import CardOverview from '@/components/card-overview';
import { DataTable } from '@/components/data-table';

import {
  getRevenueThisMonth,
  getSalesThisMonth,
} from '@/actions/get-current-month';
import { getSalesCount } from '@/actions/get-sales-count';
import { getTotalRevenue } from '@/actions/get-total-revenue';
import { getRevenueToday } from '@/actions/get-today';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/overview';
import { getGraphRevenue } from '@/actions/get-graph-revenue';

const SetupPage = async () => {
  const orders = await prismadb.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedOrder: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    customer: order.customer,
    products: order.orderItems.map((item) => item.product.name).join(', '),
    createdAt: format(order.createdAt, 'MMMM do, yyyy'),
    totalPrice: formatter.format(
      order.orderItems.reduce((total, item) => {
        return total + Number(item.product.price) * Number(item.quantity);
      }, 0)
    ),
  }));

  const totalRevenue = formatter.format(await getTotalRevenue());
  const sales = await getSalesCount();
  const revenueThisMonth = formatter.format(await getRevenueThisMonth());
  const salesThisMonth = await getSalesThisMonth();
  const revenueToday = formatter.format(await getRevenueToday());
  const graphRevenue = await getGraphRevenue();

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title="Dashboard"
          subtitle="Here's an all-time list of your product's sales"
        />
        <Link className={buttonVariants({ variant: 'default' })} href="/new">
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CardOverview
          title="Total Revenue"
          description="All-time revenue"
          icon={DollarSignIcon}
          total={totalRevenue}
        />
        <CardOverview
          title="Total Orders"
          description="All-time product's sales"
          icon={LineChart}
          total={`+${sales}`}
        />
        <CardOverview
          title="Revenue"
          description="This month's revenue"
          icon={TrendingUp}
          total={revenueThisMonth}
        />
        <CardOverview
          title="Orders"
          description="Orders this month"
          icon={CreditCardIcon}
          total={`+${salesThisMonth}`}
        />
        <CardOverview
          title="Today"
          description="Today's revenue"
          icon={Banknote}
          total={revenueToday}
        />
      </div>
      <Card className="col-span-4 shadow-lg">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview data={graphRevenue} />
        </CardContent>
      </Card>

      <DataTable searchKey="customer" columns={columns} data={formattedOrder}>
        <Link
          href="/monthly"
          className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        >
          Monthly
        </Link>
      </DataTable>
    </>
  );
};

export default SetupPage;
