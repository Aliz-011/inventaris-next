import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    if (!params.orderId)
      return new NextResponse('Order id is required', { status: 400 });

    const order = await prismadb.order.findUnique({
      where: {
        id: params.orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log('[ORDER_ID_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    if (!params.orderId)
      return new NextResponse('Order id is required', { status: 400 });

    await prismadb.order.delete({
      where: {
        id: params.orderId,
      },
    });

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[ORDER_ID_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
