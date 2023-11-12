'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFFile from './pdf-file';

const PageClient = () => {
  return (
    <PDFDownloadLink document={<PDFFile />} fileName="laporan">
      {({ loading }) =>
        loading ? <p>Loading document...</p> : <button>Download</button>
      }
    </PDFDownloadLink>
  );
};

export default PageClient;
