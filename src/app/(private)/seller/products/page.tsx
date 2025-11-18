"use client";

import { deleteProductById, getProductsBySellerId } from "@/actions/products";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IProduct } from "@/interfaces";
import dayjs from "dayjs";
import { Trash2, Pencil, Plus, ShoppingBag, Package } from "lucide-react";

export default function SellerProductsPage() {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: "",
    productName: "",
    isDeleting: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-bambu-beige to-bambu-green/10 p-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bambu-green"></div>
        </div>
      </div>
    );
  }

  const fetchData = async () => {
    if (!user?.id) {
      return;
    }
    
    try {
      setLoading(true);
      const response: any = await getProductsBySellerId(user.id);
      if (response.success) {
        setProducts(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Erro ao buscar produtos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (productId: string, productName: string) => {
    setDeleteModal({
      isOpen: true,
      productId,
      productName,
      isDeleting: false,
    });
  };

  const closeDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({
        isOpen: false,
        productId: "",
        productName: "",
        isDeleting: false,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

      const response = await deleteProductById(deleteModal.productId);
      if (response.success) {
        toast.success(response.message);
        fetchData();
        closeDeleteModal();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Erro ao deletar produto. Tente novamente.");
    } finally {
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const deleteProductHandler = async (productId: string) => {
    const product = products.find((p: IProduct) => p.id === Number(productId));
    if (product) {
      openDeleteModal(productId, product.name);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const columns = [
    "Produto",
    "Categoria",
    "Preço",
    "Estoque",
    "Criado em",
    "Ações",
  ];

  return (
    <div className="min-h-screen bg-bambu-beige to-bambu-green/10 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <PageTitle title="Meus Produtos" />
              <p className="text-bambu-brown/70 mt-2">
                Gerencie seu cardápio e mantenha seus produtos atualizados
              </p>
            </div>
            <Button className="bg-bambu-green hover:bg-bambu-green-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium px-6">
              <Link
                href="/seller/products/add"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Adicionar Produto
              </Link>
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bambu-green"></div>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <ShoppingBag
              size={48}
              className="mx-auto text-bambu-brown/40 mb-4"
            />
            <div className="text-bambu-brown/60 text-lg mb-4">
              Nenhum produto cadastrado ainda
            </div>
            <p className="text-bambu-brown/50 mb-6">
              Comece criando seu primeiro produto para o cardápio
            </p>
            <Button className="bg-bambu-terracota hover:bg-bambu-terracota/90 text-white">
              <Link
                href="/seller/products/add"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Criar Primeiro Produto
              </Link>
            </Button>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-bambu-beige/30 hover:bg-bambu-beige/40 border-b border-bambu-beige/50">
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className="text-bambu-brown font-semibold py-4 px-6"
                    >
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: IProduct, index: number) => (
                  <TableRow
                    key={product.id}
                    className={`
                      hover:bg-bambu-green/5 transition-colors duration-200 border-b border-bambu-beige/20
                      ${index % 2 === 0 ? "bg-white/50" : "bg-bambu-beige/5"}
                    `}
                  >
                    <TableCell className="py-4 px-6">
                      <div className="space-y-2">
                        <h3 className="font-medium text-bambu-brown">
                          {product.name}
                        </h3>
                        <p className="text-sm text-bambu-brown/60 line-clamp-2">
                          {product.description || "Sem descrição"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-bambu-brown/80 py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Package size={14} className="text-bambu-green-dark" />
                        <span className="px-3 py-1 rounded-full bg-bambu-green/10 text-bambu-green-dark text-xs font-medium capitalize">
                          {product.category}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-bambu-brown/80 py-4 px-6 font-semibold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(product.price)}
                    </TableCell>
                    <TableCell className="text-bambu-brown/80 py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.available_stock > 10
                            ? "bg-bambu-green/10 text-bambu-green-dark"
                            : product.available_stock > 5
                            ? "bg-bambu-terracota/10 text-bambu-terracota"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.available_stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-bambu-brown/60 py-4 px-6">
                      {dayjs(product.created_at).format("DD/MM/YYYY HH:mm")}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex gap-2 items-center">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-bambu-terracota/30 hover:bg-bambu-terracota/10 hover:border-bambu-terracota text-bambu-terracota"
                          onClick={() =>
                            deleteProductHandler(String(product.id))
                          }
                        >
                          <Trash2 size={14} />
                        </Button>

                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-bambu-green/30 hover:bg-bambu-green/10 hover:border-bambu-green text-bambu-green-dark"
                        >
                          <Link href={`/seller/products/edit/${product.id}`}>
                            <Pencil size={14} />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Excluir Produto"
          message={`Tem certeza que deseja excluir o produto "${deleteModal.productName}"? Esta ação não pode ser desfeita.`}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          isLoading={deleteModal.isDeleting}
          variant="danger"
        />
      </div>
    </div>
  );
}
