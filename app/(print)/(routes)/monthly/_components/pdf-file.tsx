'use client';

import { Order } from '@prisma/client';
import {
  Page,
  Text,
  Document,
  StyleSheet,
  Font,
  PDFViewer,
} from '@react-pdf/renderer';
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
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: 'justify',
    fontFamily: 'Oswald',
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
    fontFamily: 'Oswald',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
    fontFamily: 'Oswald',
  },
});

const PDFFile = () => {
  const pageColors = ['#f6d186', '#f67280', '#c06c84'];

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const pages = [
    {
      text: 'Second page content goes here...',
      image:
        'https://www.si.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTcwMzExMzEwNTc0MTAxODM5/lebron-dunk.jpg',
    },
    {
      text: 'Third page content goes here...',
      image:
        'https://s.yimg.com/ny/api/res/1.2/Aj5UoHHKnNOpdwE6Zz9GIQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MA--/https://s.yimg.com/os/creatr-uploaded-images/2023-01/b02a71d0-a774-11ed-bf7f-08714e8ad300',
    },
  ];

  return (
    <Document>
      {pages.map((page, index) => {
        return (
          <Page
            key={index}
            style={{ ...styles.body, backgroundColor: pageColors[index] }}
          >
            <Text style={styles.header} fixed></Text>
            <Text style={styles.text}>{page.text}</Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          </Page>
        );
      })}
    </Document>
  );
};

export default PDFFile;