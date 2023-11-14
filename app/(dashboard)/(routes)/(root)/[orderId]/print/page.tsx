import prismadb from '@/lib/prismadb';
import PDFFile from './_components/pdf-file';

const PrintPage = async ({ params }: { params: { orderId: string } }) => {
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
  return (
    <div>
      <PDFFile data={order} />
    </div>
  );
};

export default PrintPage;
