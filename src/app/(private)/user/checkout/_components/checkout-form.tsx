import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from "@stripe/react-stripe-js";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { CreditCard, Lock } from "lucide-react";

interface CheckoutFormProps {
  openCheckoutForm: boolean;
  setOpenCheckoutForm: (open: boolean) => void;
  onPaymentSuccess: (paymentId: string) => void;
}

export default function CheckoutForm({
  openCheckoutForm,
  setOpenCheckoutForm,
  onPaymentSuccess,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (result.error) {
      toast.error(`Erro ao realizar pagamento: ${result.error.message}`);
    } else {
      toast.success("Pagamento realizado com sucesso!");
      onPaymentSuccess(result.paymentIntent.id);
    }
  };

  return (
    <Dialog open={openCheckoutForm} onOpenChange={setOpenCheckoutForm}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-bambu-beige/30">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-bambu-brown text-xl flex items-center gap-2">
            <CreditCard size={24} className="text-bambu-green-dark" />
            Pagamento Seguro
          </DialogTitle>
          <DialogDescription className="text-bambu-brown/70">
            Finalize seu pedido com segurança. Seus dados estão protegidos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-bambu-beige/20 rounded-xl p-3 border border-bambu-beige/40">
              <h3 className="font-semibold text-bambu-brown mb-2 flex items-center gap-2">
                <Lock size={16} className="text-bambu-green-dark" />
                Dados do Cartão
              </h3>
              <PaymentElement 
                options={{
                  layout: "tabs"
                }}
              />
            </div>

            <div className="bg-bambu-beige/20 rounded-xl p-3 border border-bambu-beige/40">
              <h3 className="font-semibold text-bambu-brown mb-2">
                Endereço de Cobrança
              </h3>
              <AddressElement
                options={{
                  mode: "billing",
                  allowedCountries: ["BR"],
                  fields: {
                    phone: 'always',
                  },
                  validation: {
                    phone: {
                      required: 'always',
                    },
                  },
                }}
              />
            </div>

            <div className="bg-linear-to-r from-bambu-green/10 to-bambu-terracota/10 rounded-lg p-3 border border-bambu-green/20">
              <div className="flex items-center gap-2 mb-1">
                <Lock size={16} className="text-bambu-green-dark" />
                <span className="text-sm font-medium text-bambu-brown">Pagamento Seguro</span>
              </div>
              <p className="text-xs text-bambu-brown/70">
                Seus dados são protegidos com criptografia SSL. Não armazenamos informações do cartão.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-bambu-beige/30 bg-white/80 sticky bottom-0">
              <Button
                type="button"
                variant="outline"
                className="border-bambu-beige/50 hover:bg-bambu-beige/20 text-bambu-brown"
                onClick={() => setOpenCheckoutForm(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-bambu-terracota hover:bg-bambu-terracota/90 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={!stripe || !elements || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                    Processando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock size={16} />
                    Pagar Agora
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
