import { Product } from '@prisma/client';
import { create } from 'zustand';

import { v4 as uuid } from 'uuid';

interface CartStore {
  items: any[];
  addItem: () => void;
  removeItem: (id: string) => void;
}

const useCart = create<CartStore>((set, get) => ({
  items: [],
  addItem() {
    set({
      items: [
        ...get().items,
        {
          id: uuid(),
          products: {},
          quantity: 0,
        },
      ],
    });
  },
  removeItem(id) {
    set({ items: [...get().items.filter((item) => item.id !== id)] });
  },
}));

export default useCart;
