"use client";

import { useEffect, useState } from "react";
import productsCartStore from "@/global-store/products-cart-store";
import { IProduct } from "@/interfaces";

interface CartItem extends IProduct {
  quantity: number;
  cartItemId: string;
}

export function useCartSync() {
  const [items, setItems] = useState<CartItem[]>(productsCartStore.getState().items);
  const [addProductToCart, setAddProductToCart] = useState(() => productsCartStore.getState().addProductToCart);
  const [updateProductQuantity, setUpdateProductQuantity] = useState(() => productsCartStore.getState().updateProductQuantity);
  const [deleteProductFromCart, setDeleteProductFromCart] = useState(() => productsCartStore.getState().deleteProductFromCart);
  const [clearCart, setClearCart] = useState(() => productsCartStore.getState().clearCart);

  useEffect(() => {
    const unsubscribe = productsCartStore.subscribe((state) => {
      setItems(state.items);
      setAddProductToCart(() => state.addProductToCart);
      setUpdateProductQuantity(() => state.updateProductQuantity);
      setDeleteProductFromCart(() => state.deleteProductFromCart);
      setClearCart(() => state.clearCart);
    });

    return unsubscribe;
  }, []);

  return {
    items,
    addProductToCart,
    updateProductQuantity,
    deleteProductFromCart,
    clearCart,
  };
}