"use client";

import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { useEffect, useState } from "react";
import AddressForm from "./_components/address-form";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import toast from "react-hot-toast";
import { getAddressesByUserId, deleteAddress } from "@/actions/addresses";
import Spinner from "@/components/ui/spinner";
import { IAddress } from "@/interfaces";
import { MapPin, Phone, Home, Edit, Trash2, Plus } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function UserAddressesPage() {
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [addresses = [], setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [formType, setFormType] = useState<"add" | "edit">("add");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<IAddress | null>(null);
  const { user } = usersGlobalStore() as IUsersGlobalStore;

  const fetchData = async () => {
    try {
      setLoading(true);
      const reponse: any = await getAddressesByUserId(user.id);
      if (reponse.success) {
        setAddresses(reponse.data);
      } else {
        toast.error(reponse.message);
      }
    } catch (error) {
      toast.error("Erro ao carregar endereços. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setFormType("add");
    setOpenAddressForm(true);
  };

  const handleEditAddress = (address: IAddress) => {
    setSelectedAddress(address);
    setFormType("edit");
    setOpenAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      setDeleteLoading(true);
      const response = await deleteAddress(addressId);
      if (response.success) {
        toast.success("Endereço excluído com sucesso!");
        fetchData();
        setShowDeleteModal(false);
        setAddressToDelete(null);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Erro ao excluir endereço. Tente novamente.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (address: IAddress) => {
    setAddressToDelete(address);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAddressToDelete(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-bambu-beige p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <PageTitle title="Meus Endereços" />
              <p className="text-bambu-brown/70 mt-2">
                Gerencie seus endereços de entrega
              </p>
            </div>
            <Button 
              onClick={handleAddAddress}
              className="bg-bambu-green hover:bg-bambu-green-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={18} />
              Adicionar Endereço
            </Button>
          </div>
        </div>

        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <Spinner />
          </div>
        )}

        {!loading && addresses.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <MapPin size={48} className="mx-auto text-bambu-brown/40 mb-4" />
            <h3 className="text-lg font-semibold text-bambu-brown mb-2">
              Nenhum endereço cadastrado
            </h3>
            <p className="text-bambu-brown/60 mb-6">
              Adicione seu primeiro endereço para facilitar suas entregas!
            </p>
            <Button 
              onClick={handleAddAddress}
              className="bg-bambu-green hover:bg-bambu-green-dark text-white"
            >
              <Plus size={18} className="mr-2" />
              Adicionar Primeiro Endereço
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address: IAddress) => (
            <div
              key={address.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-bambu-brown flex items-center gap-2">
                  <Home size={20} />
                  {address.name}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                    className="border-bambu-green/30 hover:bg-bambu-green/10 hover:border-bambu-green text-bambu-green-dark"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDeleteModal(address)}
                    className="border-bambu-terracota/30 hover:bg-bambu-terracota/10 hover:border-bambu-terracota text-bambu-terracota"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-bambu-brown/80">
                  <Phone size={16} />
                  <span className="font-medium">{address.phone_number}</span>
                </div>
                
                <div className="flex items-start gap-2 text-bambu-brown/80">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{address.address}, {address.number}</p>
                    <p className="text-sm text-bambu-brown/60">{address.neighborhood}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {openAddressForm && (
          <AddressForm
            openAddressForm={openAddressForm}
            setOpenAddressForm={setOpenAddressForm}
            initialValues={selectedAddress}
            formType={formType}
          />
        )}

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={() => addressToDelete && handleDeleteAddress(addressToDelete.id)}
          title="Excluir Endereço"
          message={`Tem certeza que deseja excluir o endereço "${addressToDelete?.name}"? Esta ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          isLoading={deleteLoading}
          variant="danger"
        />
      </div>
    </div>
  );
}
