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
  data,
}: {
  data: Prisma.OrderGetPayload<{
    include: { orderItems: { include: { product: true } } };
  }> | null;
}) => {
  const pageColors = ['#f6d186', '#f67280', '#c06c84'];
  const [isMounted, setIsMounted] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let totalPrice = 0;

    for (const item of data?.orderItems!) {
      totalPrice += Number(item.product.price) * item.quantity!;
    }

    setTotal(totalPrice);
  }, [data]);

  if (!isMounted) {
    return null;
  }

  return (
    <PDFViewer
      style={{
        width: '90vw',
        minHeight: '100vh',
      }}
    >
      <Document title="Daily report">
        <Page size="A4" style={styles.body}>
          <View>
            <Text style={styles.header}>Laporan harian</Text>
            <Text style={styles.title}>
              Laporan hari{' '}
              {new Date().toLocaleString('id-ID', {
                day: '2-digit',
                weekday: 'long',
                month: 'long',
                year: 'numeric',
              })}
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
            <Text>Items</Text>
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
            <View
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',

                flexDirection: 'row',
                marginTop: '10',
                width: '100%',
              }}
            >
              <Text>1</Text>
              <Text style={{ textTransform: 'capitalize' }}>
                {data?.customer}
              </Text>
              <View>
                {data?.orderItems.map((orderItem) => (
                  <Text key={orderItem.id}>
                    {orderItem.product.name} - {orderItem.quantity}x
                  </Text>
                ))}
              </View>
              <Text>{format(data?.createdAt!, 'd MMMM, yyyy')}</Text>
            </View>
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
