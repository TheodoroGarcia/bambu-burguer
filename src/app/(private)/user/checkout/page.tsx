"use client";

import { getAddressesByUserId } from "@/actions/addresses";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import productsCartStore, {
  IProductsCartStore,
} from "@/global-store/products-cart-store";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { IAddress } from "@/interfaces";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import AddressForm from "../addresses/_components/address-form";
import { useRouter } from "next/navigation";
import { getStripePaymentIntentToken } from "@/actions/payments";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./_components/checkout-form";
import { saveOrderAndOrderItems } from "@/actions/orders";
import { MapPin, Phone, User, CreditCard, ShoppingBag, Plus } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function UserCheckoutPage() {
  const router = useRouter();
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<null | IAddress>(
    null
  );
  const [openCheckoutForm, setOpenCheckoutForm] = useState(false);
  const [paymentIntentToken, setPaymentIntentToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const { items } = productsCartStore() as IProductsCartStore;

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response: any = await getAddressesByUserId(user.id);
      if (!response.success) {
        toast.error("Erro ao carregar endereços. Tente novamente.");
      } else {
        setAddresses(response.data || []);
      }
    } catch (error) {
      toast.error("Erro ao carregar endereços. Tente novamente.");
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  let subTotal = 0;
  items?.forEach((item) => {
    subTotal += item.price * item.quantity;
  });

  const deliveryFee = 4.0;
  const total = subTotal + deliveryFee;

  const onCheckout = async () => {
    try {
      setLoading(true);
      const response = await getStripePaymentIntentToken(total);
      if (!response.success) {
        toast.error("Erro ao processar o checkout. Tente novamente.");
        return;
      }
      setPaymentIntentToken(response.data);
      setOpenCheckoutForm(true);
    } catch (error) {
      toast.error("Erro ao processar o checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSuccess = async (paymentId: string) => {
    try {
      const payload = {
        orderPayload: {
          customer_id: user.id,
          payment_id: paymentId,
          address_id: selectedAddressId?.id,
          sub_total: subTotal,
          tax_shipping_fee: deliveryFee,
          total,
          order_status: "order_placed",
        },
        items,
      };
      const response: any = await saveOrderAndOrderItems(payload);
      if (!response.success) {
        toast.error("Erro ao salvar o pedido. Entre em contato com o suporte.");
        return;
      }
      toast.success("Pedido realizado com sucesso!");
      router.push("/user/orders");
    } catch (error) {
      toast.error("Erro ao salvar o pedido. Entre em contato com o suporte.");
    }
  };

  const options = {
    clientSecret: paymentIntentToken,
  };

  return (
    <div className="min-h-screen bg-bambu-beige p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <PageTitle title="Finalizar Pedido" />
          <p className="text-bambu-brown/70 mt-2">
            Confirme seus dados e finalize seu pedido no Bambu Burger.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 p-6">
              <h2 className="text-lg font-semibold text-bambu-brown mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-bambu-green-dark" />
                Endereço de Entrega
              </h2>
              
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin size={48} className="mx-auto text-bambu-brown/40 mb-4" />
                  <p className="text-bambu-brown/60 mb-4">
                    Nenhum endereço cadastrado
                  </p>
                  <Button 
                    className="bg-bambu-green hover:bg-bambu-green-dark text-white"
                    onClick={() => setOpenAddressForm(true)}
                  >
                    <Plus size={16} className="mr-2" />
                    Cadastrar Endereço
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address: IAddress) => (
                    <div
                      key={address.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedAddressId?.id === address.id
                          ? "border-bambu-green bg-bambu-green/10"
                          : "border-bambu-beige/50 hover:border-bambu-green/50 bg-white/50"
                      }`}
                      onClick={() => setSelectedAddressId(address)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User size={14} className="text-bambu-brown/60" />
                            <span className="font-semibold text-bambu-brown">
                              {address.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <Phone size={14} className="text-bambu-brown/60" />
                            <span className="text-sm text-bambu-brown/80">
                              {address.phone_number}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-bambu-brown/60 mt-0.5" />
                            <span className="text-sm text-bambu-brown/80">
                              {address.address}, {address.number} - {address.neighborhood}
                            </span>
                          </div>
                        </div>
                        {selectedAddressId?.id === address.id && (
                          <div className="w-5 h-5 bg-bambu-green rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    className="w-full p-3 border-2 border-dashed border-bambu-beige/50 rounded-lg text-bambu-brown/60 hover:border-bambu-green/50 hover:text-bambu-brown transition-colors duration-200 flex items-center justify-center gap-2"
                    onClick={() => setOpenAddressForm(true)}
                  >
                    <Plus size={16} />
                    Adicionar novo endereço
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 p-6">
              <h2 className="text-lg font-semibold text-bambu-brown mb-4 flex items-center gap-2">
                <ShoppingBag size={20} className="text-bambu-green-dark" />
                Itens do Pedido ({items?.length || 0})
              </h2>
              <div className="space-y-3">
                {items?.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-4 p-3 bg-bambu-beige/20 rounded-lg">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border border-bambu-beige/30"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-bambu-brown text-sm">
                        {item.name}
                      </h3>
                      <p className="text-xs text-bambu-brown/60">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-bambu-green-dark text-sm">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 p-6 h-fit">
              <h2 className="text-lg font-semibold text-bambu-brown mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-bambu-green-dark" />
                Resumo do Pedido
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-bambu-brown/80">
                  <span>Subtotal:</span>
                  <span>R$ {subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-bambu-brown/80">
                  <span>Taxa de Entrega:</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-bambu-beige/30 pt-3">
                  <div className="flex justify-between font-bold text-lg text-bambu-brown">
                    <span>Total:</span>
                    <span className="text-bambu-green-dark">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full border-bambu-beige/50 hover:bg-bambu-beige/20 text-bambu-brown"
                  onClick={() => router.push("/user/cart")}
                >
                  Voltar ao carrinho
                </Button>
                <Button 
                  className="w-full bg-bambu-terracota hover:bg-bambu-terracota/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!selectedAddressId || loading} 
                  onClick={onCheckout}
                >
                  {loading ? 'Processando...' : 'Finalizar Pedido'}
                </Button>
              </div>

              {!selectedAddressId && (
                <p className="text-xs text-bambu-brown/60 mt-2 text-center">
                  Selecione um endereço para continuar
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {openAddressForm && (
        <AddressForm
          openAddressForm={openAddressForm}
          setOpenAddressForm={setOpenAddressForm}
        />
      )}

      {openCheckoutForm && paymentIntentToken && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm
            openCheckoutForm={openCheckoutForm}
            setOpenCheckoutForm={setOpenCheckoutForm}
            onPaymentSuccess={onPaymentSuccess}
          />
        </Elements>
      )}
    </div>
  );
}
