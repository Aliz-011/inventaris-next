'use client';

import Modal from '@/components/modal';
import { usePictureModal } from '@/hooks/use-picture-modal';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

const PictureModal = () => {
  const { isOpen, onClose } = usePictureModal();

  return (
    <Modal
      title="QR code"
      description="Payment using qr code"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="h-[35rem]">
        <CardContent>
          <Image src="/qr.jpeg" alt="qr imagq" fill className="aspect-square" />
        </CardContent>
      </Card>
    </Modal>
  );
};

export default PictureModal;
