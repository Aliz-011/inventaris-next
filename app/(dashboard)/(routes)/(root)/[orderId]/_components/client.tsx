'use client';

import { format } from 'date-fns';
import Link from 'next/link';

import { Card, CardContent, CardTitle } from '@/components/ui/card';

import { formatter } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePictureModal } from '@/hooks/use-picture-modal';
import { useRouter } from 'next/navigation';

const OrderIdClient = ({
  order,
}: {
  order: Prisma.OrderGetPayload<{
    include: { orderItems: { include: { product: true } } };
  }> | null;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [total, setTotal] = useState(0);
  const open = usePictureModal((state) => state.onOpen);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let totalPrice = 0;

    for (const item of order?.orderItems!) {
      totalPrice += Number(item.product.price) * item.quantity!;
    }

    setTotal(totalPrice);
  }, [order]);

  if (!isMounted) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-center justify-between w-full p-6">
        <div>
          <CardTitle>Order #{order?.id}</CardTitle>
          <div className="flex flex-col">
            {order?.orderItems.map((orderItem) => (
              <Link
                key={orderItem.id}
                href={`/products/${orderItem.productId}`}
                className="font-medium text-gray-500 dark:text-gray-400 hover:underline w-fit"
              >
                {orderItem.product.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-end text-sm">
          <span>Taman Imbi, Jayapura Utara</span>
          <span>Jayapura</span>
          <span>99351</span>
          <span>Indonesia</span>
        </div>
      </div>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between mt-12 mb-10">
          <div className="flex flex-col justify-between gap-y-4">
            <div>
              <h6 className="text-sm text-violet-500 dark:text-violet-400 font-medium mb-2">
                Tanggal Transaksi
              </h6>
              <span className="font-semibold">
                {format(order?.createdAt!, 'MMMM do, yyyy')}
              </span>
            </div>
            <div>
              <h6 className="text-sm text-violet-500 dark:text-violet-400 font-medium mb-2">
                Tipe pembayaran:
              </h6>
              <span className="font-semibold uppercase">
                {order?.paymentType}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-y-4">
            <div>
              <h5 className="text-sm text-violet-500 dark:text-violet-400 font-medium mb-2">
                Bill To
              </h5>
              <span className="font-semibold capitalize">
                {order?.customer}
              </span>
            </div>

            <div className="flex flex-col items-start text-sm">
              <span>Phone: {order?.phone}</span>
            </div>
          </div>

          <div>
            <h5 className="text-sm text-violet-500 dark:text-violet-400 font-medium mb-2">
              Sent To
            </h5>
            <span className="font-semibold">Angkringan Mas Pur</span>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-slate-800/90 p-6 rounded-lg">
          <table className="w-full">
            <tr className="flex gap-4 mb-4">
              <th className="font-light text-sm basis-1/2 text-start">
                Item Name
              </th>
              <th className="font-light text-sm basis-[10%] text-end">
                Quantity
              </th>
              <th className="font-light text-sm basis-1/5 text-end">Price</th>
              <th className="font-light text-sm self-center text-end basis-1/5">
                Total
              </th>
            </tr>
            {order?.orderItems.map((orderItem) => (
              <tr className="flex gap-4" key={orderItem.id}>
                <td className="font-medium basis-1/2 capitalize">
                  {orderItem.product.name}
                </td>
                <td className="font-medium basis-[10%] text-end">
                  {orderItem.quantity}
                </td>
                <td className="font-medium basis-1/5 text-end">
                  {formatter.format(Number(orderItem.product.price))}
                </td>
                <td className="font-medium self-center basis-1/5 text-end">
                  {formatter.format(
                    Number(orderItem.product.price) * orderItem.quantity
                  )}
                </td>
              </tr>
            ))}

            <div className="border-t border-gray-700 mt-2 pt-2 flex items-center justify-end">
              <span className="font-medium">{formatter.format(total)}</span>
            </div>
          </table>
        </div>

        {order?.paymentType === 'cash' ? (
          <Button
            className="block w-full"
            onClick={() => router.push(`/${order.id}/print`)}
          >
            Cetak
          </Button>
        ) : (
          <Button className="block w-full" onClick={open}>
            Bayar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderIdClient;
