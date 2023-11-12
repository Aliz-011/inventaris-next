'use client';

import { useEffect, useState } from 'react';
import PictureModal from '../modals/picture-modal';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <PictureModal />
    </>
  );
};

export default ModalProvider;
