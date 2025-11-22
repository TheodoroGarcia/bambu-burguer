"use client";

import { getOrdersOfUser } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { IOrderItem } from "@/interfaces";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Package, Calendar, CreditCard, MapPin, ShoppingBag, Eye } from "lucide-react";
import OrderDetailsModal from "./_components/order-details";

export default function UserOrdersPage() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrderItem | null>(null);
  const [openOrderDetailsModal, setOpenOrderDetailsModal] = useState(false);
  const { user } = usersGlobalStore() as IUsersGlobalStore;

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        toast.error("Usuário não identificado.");
        return;
      }

      const response: any = await getOrdersOfUser(user.id);
      if (response.success) {
        setOrders(response.data || []);
      } else {
        toast.error("Erro ao carregar pedidos.");
      }
    } catch (error) {
      toast.error("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const renderOrderProperty = (icon: any, key: string, value: string | number) => {
    return (
      <div className="flex items-start gap-3 p-3 bg-bambu-beige/10 rounded-lg">
        {icon}
        <div className="flex flex-col">
          <span className="text-xs text-bambu-brown/60 font-medium">{key}</span>
          <span className="text-sm font-semibold text-bambu-brown capitalize">{value}</span>
        </div>
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-bambu-green/10 text-bambu-green-dark border-bambu-green/20";
      case "order_placed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-bambu-green/10 text-bambu-green-dark border-bambu-green/20";
      case "preparing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "order_placed":
        return "Pedido Realizado";
      case "confirmed":
        return "Confirmado";
      case "preparing":
        return "Preparando";
      case "out_for_delivery":
        return "Saiu para Entrega";
      case "delivered":
        return "Entregue";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-bambu-beige p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <PageTitle title="Meus Pedidos" />
          <p className="text-bambu-brown/70 mt-2">
            Acompanhe o status dos seus pedidos no Bambu Burger.
          </p>
        </div>

        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 p-8 text-center">
            <div className="flex items-center justify-center gap-3 text-bambu-brown">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-bambu-brown/20 border-t-bambu-brown"></div>
              Carregando seus pedidos...
            </div>
          </div>
        )}

        {!loading && !orders.length && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <Package size={48} className="mx-auto text-bambu-brown/40 mb-4" />
            <h3 className="text-lg font-semibold text-bambu-brown mb-2">Nenhum pedido encontrado</h3>
            <p className="text-bambu-brown/60 mb-6">Você ainda não fez nenhum pedido. Que tal explorar nosso cardápio?</p>
            <Button className="bg-bambu-terracota hover:bg-bambu-terracota/90 text-white">
              Ver Cardápio
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order: IOrderItem) => (
            <div key={order.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 overflow-hidden">
              <div className="bg-bambu-beige/20 p-6 border-b border-bambu-beige/30">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-bambu-green/10 rounded-full flex items-center justify-center">
                      <Package size={20} className="text-bambu-green-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-bambu-brown">Pedido #{order.id}</h3>
                      <p className="text-sm text-bambu-brown/60">
                        {new Date(order.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.order_status)}`}>
                      {getStatusText(order.order_status)}
                    </span>
                    <div className="text-right">
                      <span className="text-sm text-bambu-brown/60">Total</span>
                      <p className="text-lg font-bold text-bambu-green-dark">R$ {order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {renderOrderProperty(
                    <Package size={16} className="text-bambu-green-dark mt-1" />,
                    "ID do Pedido:",
                    `#${order.id}`
                  )}
                  {renderOrderProperty(
                    <Calendar size={16} className="text-bambu-green-dark mt-1" />,
                    "Data do Pedido:",
                    new Date(order.created_at).toLocaleDateString('pt-BR')
                  )}
                  {renderOrderProperty(
                    <CreditCard size={16} className="text-bambu-green-dark mt-1" />,
                    "Total:",
                    `R$ ${order.total.toFixed(2)}`
                  )}
                  {renderOrderProperty(
                    <MapPin size={16} className="text-bambu-green-dark mt-1" />,
                    "Taxa de Entrega:",
                    `R$ ${order.tax_shipping_fee?.toFixed(2) || '0.00'}`
                  )}
                </div>

                <div className="bg-bambu-beige/10 rounded-lg p-4">
                  <h4 className="font-semibold text-bambu-brown mb-4 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-bambu-green-dark" />
                    Itens do Pedido ({order.order_items.length})
                  </h4>
                  
                  <div className="space-y-3">
                    {order.order_items.map((item: any, index: number) => (
                      <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-3 bg-white/60 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-bambu-beige/30"
                        />
                        
                        <div className="flex-1">
                          <h5 className="font-medium text-bambu-brown">{item.name}</h5>
                          <p className="text-sm text-bambu-brown/60">
                            Quantidade: {item.quantity} × R$ {Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-bambu-green-dark">
                            R$ {Number(item.total).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    className="bg-bambu-green hover:bg-bambu-green-dark text-white flex items-center gap-2"
                    onClick={() => {
                      setSelectedOrder(order);
                      setOpenOrderDetailsModal(true);
                    }}
                  >
                    <Eye size={16} />
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {openOrderDetailsModal && selectedOrder && (
          <OrderDetailsModal
            openOrderDetailsModal={openOrderDetailsModal}
            setOpenOrderDetailsModal={setOpenOrderDetailsModal}
            selectedOrder={selectedOrder}
            reloadData={fetchData}
          />
        )}
      </div>
    </div>
  );
}
