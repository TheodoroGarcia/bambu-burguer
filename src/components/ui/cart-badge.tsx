"use client";

import productsCartStore, { IProductsCartStore } from "@/global-store/products-cart-store";
import { ShoppingCart } from "lucide-react";

export default function CartBadge() {
  const { items } = productsCartStore() as IProductsCartStore;
  
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  if (totalItems === 0) return null;
  
  return (
    <div className="relative">
      <ShoppingCart size={20} className="text-bambu-green-dark" />
      <span className="absolute -top-2 -right-2 bg-bambu-terracota text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
        {totalItems > 99 ? '99+' : totalItems}
      </span>
    </div>
  );
}