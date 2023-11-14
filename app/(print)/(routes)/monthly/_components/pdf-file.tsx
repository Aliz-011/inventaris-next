'use client';

import { formatter } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import {
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
  PDFViewer,
  View,
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
});

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Oswald',
  },
  author: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: 'Oswald',
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const PDFFile = ({
  orders,
}: {
  orders: Prisma.OrderGetPayload<{
    include: { orderItems: { include: { product: true } } };
  }>[];
}) => {
  const pageColors = ['#f6d186', '#f67280', '#c06c84'];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const total = orders.reduce((total, order) => {
    return (
      total +
      order.orderItems.reduce((orderTotal, item) => {
        return orderTotal + Number(item.product.price) * item.quantity;
      }, 0)
    );
  }, 0);

  return (
    <PDFViewer
      style={{
        width: '100vw',
        minHeight: '100vh',
      }}
    >
      <Document title="Monthly report">
        <Page size="A4" style={styles.body}>
          <View>
            <Text style={styles.header}>Laporan bulanan</Text>
            <Text style={styles.title}>
              Laporan Bulan{' '}
              {new Date().toLocaleString('id-ID', { month: 'long' })}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8',
              flexDirection: 'row',
              marginTop: '20',
            }}
          >
            <Text>No</Text>
            <Text>Customer</Text>
            <Text>Date</Text>
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',

              flexDirection: 'column',
              marginTop: '10',
            }}
          >
            {orders.map((order, i) => (
              <View
                key={order.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',

                  flexDirection: 'row',
                  marginTop: '10',
                  width: '100%',
                }}
              >
                <Text>{i + 1}</Text>
                <Text style={{ textTransform: 'capitalize' }}>
                  {order.customer}
                </Text>
                <Text>{format(order.createdAt, 'd MMMM, yyyy')}</Text>
              </View>
            ))}
          </View>
          <View
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginTop: 20,
            }}
          >
            <Text>Total: {formatter.format(total)}</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default PDFFile;
