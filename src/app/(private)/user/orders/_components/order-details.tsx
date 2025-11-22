import { cancelOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogHeader, 
  DialogContent, 
  DialogTitle 
} from "@/components/ui/dialog";
import { IOrderItem } from "@/interfaces";
import { useState } from "react";
import toast from "react-hot-toast";
import { User, Phone, MapPin, Hash, X, AlertTriangle } from "lucide-react";

interface IOrderDetailsModalProps {
  openOrderDetailsModal: boolean;
  setOpenOrderDetailsModal: (open: boolean) => void;
  selectedOrder: IOrderItem;
  reloadData: () => void;
}

export default function OrderDetailsModal({
  openOrderDetailsModal,
  setOpenOrderDetailsModal,
  selectedOrder,
  reloadData,
}: IOrderDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const renderOrderProperty = (icon: any, key: string, value: string | number) => {
    return (
      <div className="flex items-start gap-3 p-4 bg-bambu-beige/10 rounded-lg border border-bambu-beige/20">
        <div className="w-8 h-8 bg-bambu-green/10 rounded-full flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs text-bambu-brown/60 font-medium mb-1">{key}</span>
          <span className="text-sm font-semibold text-bambu-brown wrap-break-word">{value}</span>
        </div>
      </div>
    );
  };

  const cancelOrderHandler = async () => {
    try {
      setLoading(true);
      const response = await cancelOrder(
        selectedOrder.id,
        selectedOrder.payment_id
      );
      if (response.success) {
        toast.success(response.message);
        reloadData();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Erro ao cancelar o pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={openOrderDetailsModal}
      onOpenChange={setOpenOrderDetailsModal}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-bambu-beige/30">
        <DialogHeader className="pb-4 border-b border-bambu-beige/20">
          <DialogTitle className="text-bambu-brown text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 bg-bambu-green/10 rounded-full flex items-center justify-center">
              <MapPin size={20} className="text-bambu-green-dark" />
            </div>
            Detalhes do Pedido #{selectedOrder.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-semibold text-bambu-brown mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-bambu-green-dark" />
              Informações de Entrega
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderOrderProperty(
                <User size={16} className="text-bambu-green-dark" />,
                "Nome:",
                selectedOrder.addresses.name
              )}
              {renderOrderProperty(
                <Phone size={16} className="text-bambu-green-dark" />,
                "Telefone:",
                selectedOrder.addresses.phone_number
              )}
              {renderOrderProperty(
                <MapPin size={16} className="text-bambu-green-dark" />,
                "Endereço:",
                `${selectedOrder.addresses.address}, ${selectedOrder.addresses.number}`
              )}
              {renderOrderProperty(
                <Hash size={16} className="text-bambu-green-dark" />,
                "Bairro:",
                selectedOrder.addresses.neighborhood
              )}
              {renderOrderProperty(
                <Hash size={16} className="text-bambu-green-dark" />,
                "ID do Pedido:",
                selectedOrder.id
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-bambu-beige/20 bg-white/80 sticky bottom-0">
          {(selectedOrder.order_status === "order_placed" || selectedOrder.order_status === "active") && (
            <Button 
              variant="outline" 
              className="border-red-300 text-red-700 hover:bg-red-50 flex items-center gap-2"
              onClick={cancelOrderHandler}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-300 border-t-red-700"></div>
                  Cancelando...
                </div>
              ) : (
                <>
                  <AlertTriangle size={16} />
                  Cancelar Pedido
                </>
              )}
            </Button>
          )}
          <Button 
            className="bg-bambu-green hover:bg-bambu-green-dark text-white flex items-center gap-2"
            onClick={() => setOpenOrderDetailsModal(false)}
          >
            <X size={16} />
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
