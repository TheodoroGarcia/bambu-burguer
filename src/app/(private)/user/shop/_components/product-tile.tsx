"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/interfaces";
import { Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartSync } from "@/hooks/useCartSync";

export default function ProductTile({ product }: { product: IProduct }) {
  const {
    items,
    addProductToCart,
    updateProductQuantity,
    deleteProductFromCart,
  } = useCartSync();

  const productInCart = items.find((item) => item.id.toString() === product.id.toString());
  let quantityInCart = productInCart ? productInCart.quantity : 0;

  const handleAddToCart = () => {
    try {
      if (product.available_stock <= 0) {
        toast.error("Produto indisponível no momento");
        return;
      }
      
      if (quantityInCart >= product.available_stock) {
        toast.error("Estoque insuficiente para adicionar mais itens");
        return;
      }
      
      const itemsBefore = items.length;
      
      if (productInCart) {
        const newQuantity = quantityInCart + 1;
        updateProductQuantity(product.id.toString(), newQuantity);
        toast.success(`${product.name} - quantidade: ${newQuantity}`);
      } else {
        addProductToCart({
          ...product,
          quantity: 1,
        });
        toast.success(`${product.name} adicionado ao carrinho!`);
      }
      
    } catch (error) {
      toast.error("Erro ao adicionar o produto ao carrinho. Tente novamente.");
    }
  };

  const handleRemoveFromCart = () => {
    try {
      if (quantityInCart === 1) {
        deleteProductFromCart(product.id.toString());
        toast.success(`${product.name} removido do carrinho`);
      } else {
        const newQuantity = quantityInCart - 1;
        updateProductQuantity(product.id.toString(), newQuantity);
        toast.success(`${product.name} - quantidade: ${newQuantity}`);
      }
      
    } catch (error) {
      toast.error("Erro ao remover o produto do carrinho. Tente novamente.");
    }
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <h1 className="text-lg font-bold text-bambu-brown mb-2">{product.name}</h1>
      <hr className="my-3 border border-bambu-beige/50" />

      <div className="h-48 flex justify-center items-center mb-4 shrink-0 overflow-hidden rounded-lg">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover rounded-lg hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      <div className="mb-4 grow">
        <p className="text-sm text-bambu-brown/70 leading-relaxed">{product.description}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-bambu-green-dark">
          R$ {product.price.toFixed(2)}
        </h1>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemoveFromCart}
          disabled={quantityInCart === 0}
          className="border-bambu-terracota/30 hover:bg-bambu-terracota/10 hover:border-bambu-terracota text-bambu-terracota disabled:opacity-50"
        >
          <Minus size={14} />
        </Button>

        {quantityInCart > 0 && (
          <span className="px-3 py-1 bg-bambu-green/10 text-bambu-green-dark font-semibold rounded-full min-w-12 text-center">
            {quantityInCart}
          </span>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddToCart}
          disabled={product.available_stock <= 0 || quantityInCart >= product.available_stock}
          className="border-bambu-green/30 hover:bg-bambu-green/10 hover:border-bambu-green text-bambu-green-dark disabled:opacity-50"
        >
          <Plus size={14} />
        </Button>
      </div>
      
      {product.available_stock <= 0 && (
        <p className="text-red-500 text-xs text-center mt-2 font-medium">
          Produto indisponível
        </p>
      )}
      
      {quantityInCart >= product.available_stock && product.available_stock > 0 && (
        <p className="text-bambu-terracota text-xs text-center mt-2 font-medium">
          Estoque limitado atingido
        </p>
      )}
    </div>
  );
}
