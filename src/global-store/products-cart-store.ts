import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IProduct } from "@/interfaces";

interface CartItem extends IProduct {
  quantity: number;
  cartItemId: string;
}

const productsCartStore = create(
  persist(
    (set, get: any) => ({
      items: [] as CartItem[],

      addProductToCart: (product: IProduct) => {
        const existingItems = [...get().items];
        const existingItemIndex = existingItems.findIndex((item) => item.id.toString() === product.id.toString());
        
        if (existingItemIndex >= 0) {
          existingItems[existingItemIndex].quantity += 1;
        } else {
          const newItem: CartItem = {
            ...product,
            quantity: 1,
            cartItemId: `${product.id}-${Date.now()}`
          };
          existingItems.push(newItem);
        }
        set({ items: existingItems });
      },

      updateProductQuantity: (productId: string, quantity: number) => {
        const currentState = get();
        const existingItems = [...currentState.items];
        const itemIndex = existingItems.findIndex((item) => item.id.toString() === productId);
        
        if (itemIndex >= 0) {
          existingItems[itemIndex] = { 
            ...existingItems[itemIndex], 
            quantity: Math.max(1, quantity) 
          };
          set({ items: existingItems });
        }
      },

      deleteProductFromCart: (productId: string) => {
        const existingItems = [...get().items];
        const newItems = existingItems.filter((item) => item.id.toString() !== productId);
        set({ items: newItems });
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'bambu-cart-storage',
      partialize: (state: any) => ({ items: state.items }),
    }
  )
);

export default productsCartStore;

export interface IProductsCartStore {
  items: CartItem[];
  addProductToCart: (product: IProduct) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  deleteProductFromCart: (productId: string) => void;
  clearCart: () => void;
}
