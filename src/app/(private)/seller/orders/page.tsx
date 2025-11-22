"use client";

import { getOrderedItemsOfSeller, markOrderAsDelivered, cancelOrder } from "@/actions/orders";
import PageTitle from "@/components/ui/page-title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Package, ShoppingCart, Calendar, DollarSign, MapPin, Phone, User, X, Clock, Eye, CheckCircle, Truck, AlertTriangle } from "lucide-react";

interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  created_at: string;
  orders: {
    id: string;
    order_status: 'active' | 'cancelled' | 'delivered';
    payment_id: string;
    created_at: string;
    addresses: {
      name: string;
      address: string;
      neighborhood: string;
      number: string;
      phone_number: string;
    };
  };
}

export default function sellerOrdersPage() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const [loading, setLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState<{
    orderId: string;
    paymentId: string;
  } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        toast.error("Usuário não identificado.");
        return;
      }

      const response: any = await getOrderedItemsOfSeller(user.id);
      
      if (response.success) {
        setItems(response.data || []);
        
        if (!response.data || response.data.length === 0) {
          toast.success("Nenhum pedido encontrado ainda.");
        }
      } else {
        toast.error("Erro ao carregar pedidos: " + (response.message || "Erro desconhecido"));
      }
    } catch (error) {
      toast.error("Erro ao carregar pedidos: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const groupedOrders: { [order_id: string]: { items: OrderItem[], order: OrderItem['orders'] } } = {};
  
  items.forEach((item: OrderItem) => {
    if (!groupedOrders[item.order_id]) {
      groupedOrders[item.order_id] = {
        items: [],
        order: item.orders
      };
    }
    groupedOrders[item.order_id].items.push(item);
  });

  const sortedOrderEntries = Object.entries(groupedOrders).sort(([, a], [, b]) => {
    return new Date(b.order.created_at).getTime() - new Date(a.order.created_at).getTime();
  });

  const getStatusBadge = (status: string) => {
    if (status === "cancelled") {
      return <Badge variant="destructive" className="flex items-center gap-1"><X className="w-3 h-3" />Cancelado</Badge>;
    } else if (status === "delivered") {
      return <Badge variant="default" className="bg-bambu-green-dark text-white flex items-center gap-1"><CheckCircle className="w-3 h-3" />Entregue</Badge>;
    }
    return <Badge variant="default" className="bg-bambu-green text-white flex items-center gap-1"><Clock className="w-3 h-3" />Ativo</Badge>;
  };

  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + (item.total || item.price * item.quantity), 0);
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      const response = await markOrderAsDelivered(orderId);
      if (response.success) {
        toast.success(response.message);
        fetchData();
      } else {
        toast.error("Erro ao marcar como entregue: " + response.message);
      }
    } catch (error) {
      toast.error("Erro ao marcar como entregue: " + (error as Error).message);
    }
  };

  const handleCancelOrder = (orderId: string, paymentId: string) => {
    setSelectedOrderForCancel({ orderId, paymentId });
    setCancelModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrderForCancel) return;

    try {
      setCancelLoading(true);
      const response = await cancelOrder(
        parseInt(selectedOrderForCancel.orderId), 
        selectedOrderForCancel.paymentId
      );
      
      if (response.success) {
        toast.success(response.message);
        fetchData();
        setCancelModalOpen(false);
        setSelectedOrderForCancel(null);
      } else {
        toast.error("Erro ao cancelar pedido: " + response.message);
      }
    } catch (error) {
      toast.error("Erro ao cancelar pedido: " + (error as Error).message);
    } finally {
      setCancelLoading(false);
    }
  };

  const closeCancelModal = () => {
    if (!cancelLoading) {
      setCancelModalOpen(false);
      setSelectedOrderForCancel(null);
    }
  };

  const columns = [
    { label: "Id do Pedido", icon: <Package size={16} /> },
    { label: "Status", icon: <Clock size={16} /> },
    { label: "Cliente", icon: <User size={16} /> },
    { label: "Endereço", icon: <MapPin size={16} /> },
    { label: "Total", icon: <DollarSign size={16} /> },
    { label: "Data", icon: <Calendar size={16} /> },
    { label: "Ações", icon: null },
  ];

  return (
    <div className="min-h-screen bg-bambu-beige p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <PageTitle title="Pedidos Recebidos" />
          <p className="text-bambu-brown/70 mt-2">
            Gerencie todos os pedidos dos seus produtos no Bambu Burger.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-bambu-beige/30 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-bambu-beige/30 hover:bg-bambu-beige/40 border-b border-bambu-beige/50">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className="text-bambu-brown font-semibold py-4 px-6"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-bambu-green-dark">{column.icon}</span>
                      {column.label}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex items-center justify-center gap-3 text-bambu-brown/60">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-bambu-brown/20 border-t-bambu-brown"></div>
                      <span>Carregando pedidos...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : Object.keys(groupedOrders).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-4 text-bambu-brown/60">
                      <Package size={48} className="text-bambu-brown/40" />
                      <div>
                        <h3 className="font-semibold text-bambu-brown mb-1">Nenhum pedido encontrado</h3>
                        <p className="text-sm">Seus produtos ainda não receberam pedidos.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedOrderEntries.map(([orderId, { items: orderItems, order }]) => (
                  <TableRow key={orderId} className="hover:bg-bambu-beige/10 transition-colors">
                    <TableCell className="font-medium text-bambu-brown px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-bambu-green/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-bambu-green-dark">#</span>
                        </div>
                        {orderId}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {getStatusBadge(order.order_status)}
                    </TableCell>
                    <TableCell className="text-bambu-brown px-6 py-4">
                      <div className="font-medium">{order.addresses.name}</div>
                    </TableCell>
                    <TableCell className="text-bambu-brown px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-bambu-terracota" />
                        <span className="text-sm truncate max-w-[150px]" title={`${order.addresses.address}, ${order.addresses.number} - ${order.addresses.neighborhood}`}>
                          {order.addresses.neighborhood}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-bambu-green-dark font-semibold px-6 py-4">
                      <div className="bg-bambu-green/10 px-2 py-1 rounded-lg inline-block">
                        R$ {calculateOrderTotal(orderItems).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="text-bambu-brown/80 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-bambu-brown/40" />
                        {order.created_at ? dayjs(order.created_at).format("DD/MM/YYYY HH:mm") : "Data não disponível"}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-bambu-brown text-bambu-brown hover:bg-bambu-brown hover:text-white transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-bambu-brown">
                              <Package className="w-5 h-5" />
                              Detalhes do Pedido #{orderId}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">Status</p>
                                  {getStatusBadge(order.order_status)}
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Data do Pedido</p>
                                  <p className="font-medium">
                                    {dayjs(order.created_at).format("DD/MM/YYYY HH:mm")}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-xl font-bold text-bambu-green">
                                  R$ {calculateOrderTotal(orderItems).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="p-4 border border-gray-200 rounded-lg">
                              <h4 className="font-semibold text-bambu-brown mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Endereço de Entrega
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{order.addresses.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-gray-500" />
                                  <span>{order.addresses.phone_number}</span>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-gray-700">
                                    {order.addresses.address}, {order.addresses.number} - {order.addresses.neighborhood}
                                  </p>
                            </div>
                          </div>
                          
                          {order.order_status === 'active' && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleCancelOrder(order.id, order.payment_id);
                                }}
                                className="border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Cancelar Pedido
                              </Button>
                              
                              <Button
                                size="sm"
                                onClick={() => {
                                  handleMarkAsDelivered(order.id);
                                }}
                                className="bg-bambu-green hover:bg-bambu-green-dark text-white transition-colors"
                              >
                                <Truck className="w-4 h-4 mr-1" />
                                Marcar como Entregue
                              </Button>
                            </div>
                          )}
                        </div>                            <div>
                              <h4 className="font-semibold text-bambu-brown mb-3 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Itens do Pedido
                              </h4>
                              <div className="space-y-3">
                                {orderItems.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                      <p className="font-medium">{item.product_name || item.name}</p>
                                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">R$ {Number(item.price).toFixed(2)}</p>
                                      <p className="text-sm text-gray-600">
                                        Subtotal: R$ {(item.total || item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {order.order_status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsDelivered(order.id)}
                            className="bg-bambu-green hover:bg-bambu-green-dark text-white transition-colors"
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Entregar
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id, order.payment_id)}
                            className="border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        </>
                      )}
                    </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={cancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={confirmCancelOrder}
        title="Cancelar Pedido"
        message="Tem certeza que deseja cancelar este pedido? O cliente será reembolsado automaticamente e esta ação não pode ser desfeita."
        confirmText="Sim, Cancelar"
        cancelText="Não, Manter Pedido"
        isLoading={cancelLoading}
        variant="danger"
      />
    </div>
  );
}
