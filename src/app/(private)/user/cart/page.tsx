"use client";

import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCartSync } from "@/hooks/useCartSync";
import { IProduct } from "@/interfaces";
import { useRouter } from "next/navigation";

export default function UserCartPage() {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const { items, updateProductQuantity, deleteProductFromCart } = useCartSync();
  const router = useRouter();

  const deliveryFee = 4.0;

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const total = items.length > 0 ? subtotal + deliveryFee : 0;

  const handleIncreaseQuantity = (product: IProduct) => {
    try {
      const newQuantity = product.quantity + 1;
      updateProductQuantity(product.id.toString(), newQuantity);
      toast.success("Quantidade aumentada!");
    } catch (error) {
      toast.error("Erro ao atualizar quantidade. Tente novamente.");
    }
  };

  const handleDecreaseQuantity = (product: IProduct) => {
    try {
      if (product.quantity === 1) {
        deleteProductFromCart(product.id.toString());
        toast.success("Produto removido do carrinho");
      } else {
        const newQuantity = product.quantity - 1;
        updateProductQuantity(product.id.toString(), newQuantity);
        toast.success("Quantidade diminuída!");
      }
    } catch (error) {
      toast.error("Erro ao atualizar quantidade. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-bambu-beige p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <PageTitle title="Carrinho" />
          <p className="text-bambu-brown/70 mt-2">
            Aqui você pode revisar os itens no seu carrinho, ajustar quantidades
            e finalizar sua compra.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center mt-8">
            <ShoppingCart
              size={48}
              className="mx-auto text-bambu-brown/40 mb-4"
            />
            <div className="text-bambu-brown/60 text-lg mb-4">
              Seu carrinho está vazio
            </div>
            <p className="text-bambu-brown/50 mb-6">
              Adicione alguns produtos deliciosos ao seu carrinho!
            </p>
            <Button className="bg-bambu-terracota hover:bg-bambu-terracota/90 text-white">
              <Link href="/user/shop">Ir ao Cardápio</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-5 mt-7">
            <div className="col-span-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 overflow-hidden">
                <div className="grid grid-cols-7 bg-bambu-beige/30 p-4 text-sm font-semibold text-bambu-brown border-b border-bambu-beige/50">
                  <span className="col-span-4">Produto</span>
                  <span className="col-span-1 text-center">Quantidade</span>
                  <span className="col-span-1 text-center">Preço</span>
                  <span className="col-span-1 text-center">Total</span>
                </div>

                <div className="divide-y divide-bambu-beige/20">
                  {items.map((item, index) => (
                    <div
                      key={item.cartItemId}
                      className={`grid grid-cols-7 p-4 transition-colors hover:bg-bambu-green/5 ${
                        index % 2 === 0 ? "bg-white/50" : "bg-bambu-beige/5"
                      }`}
                    >
                      <div className="flex items-center col-span-4 gap-4">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-bambu-beige/30"
                        />
                        <div>
                          <h3 className="font-semibold text-bambu-brown">
                            {item.name}
                          </h3>
                          <p className="text-sm text-bambu-brown/60 line-clamp-1">
                            {item.description || "Produto delicioso"}
                          </p>
                        </div>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        <div className="flex items-center gap-2 bg-bambu-beige/20 rounded-lg p-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecreaseQuantity(item)}
                            className="h-8 w-8 p-0 border-bambu-green/30 hover:bg-bambu-green/10 hover:border-bambu-green text-bambu-green-dark"
                          >
                            <Minus size={12} />
                          </Button>
                          <span className="mx-2 min-w-8 text-center font-semibold text-bambu-brown">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleIncreaseQuantity(item)}
                            className="h-8 w-8 p-0 border-bambu-green/30 hover:bg-bambu-green/10 hover:border-bambu-green text-bambu-green-dark"
                          >
                            <Plus size={12} />
                          </Button>
                        </div>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        <span className="font-medium text-bambu-brown">
                          R$ {item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="col-span-1 flex items-center justify-center">
                        <span className="font-semibold text-bambu-green-dark">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 p-6 h-fit">
                <h3 className="font-semibold text-bambu-brown mb-6 text-lg flex items-center gap-2">
                  Resumo do Pedido
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-bambu-brown/80">
                    <span>Itens ({items.length}):</span>
                    <span>
                      {items.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-bambu-brown/80">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-bambu-brown/80">
                    <span>Taxa de Entrega:</span>
                    <span>R$ {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-bambu-beige/30 pt-4">
                    <div className="flex justify-between font-bold text-lg text-bambu-brown">
                      <span>Total:</span>
                      <span className="text-bambu-green-dark">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-bambu-green hover:bg-bambu-green-dark text-white font-semibold py-3 mt-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => router.push("/user/checkout")}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
