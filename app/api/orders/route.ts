import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productIds, customer, paymentType, phone } = body;

    if (!productIds || Object.keys(productIds).length === 0) {
      return new NextResponse('Product ids are required', {
        status: 400,
        statusText: 'Product ids are required',
      });
    }

    if (!customer) {
      return new NextResponse('Customer is required', { status: 400 });
    }

    const orderItems = Object.entries(productIds).map(
      ([productId, quantity]) => ({
        product: {
          connect: {
            id: productId,
          },
        },
        quantity: parseInt(quantity as string, 10),
      })
    );

    const order = await prismadb.order.create({
      data: {
        customer,
        isPaid: true,
        phone,
        paymentType,
        orderItems: {
          create: orderItems,
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
