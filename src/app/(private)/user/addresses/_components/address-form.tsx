import { addAddress, updateAddress } from "@/actions/addresses";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Phone, Home, User, Hash, X } from "lucide-react";
import { parse } from "path";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z, { number, set } from "zod";

interface AddressFormProps {
  openAddressForm: boolean;
  setOpenAddressForm: (open: boolean) => void;
  initialValues?: any;
  formType?: "add" | "edit";
}

export default function AddressForm({
  openAddressForm,
  setOpenAddressForm,
  initialValues,
  formType,
}: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const addressFormSchema = z.object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres"),
    phone_number: z
      .number()
      .min(1, "Número de telefone é obrigatório"),
    address: z.string().min(1, "Endereço é obrigatório"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    number: z
      .number()
      .min(1, "Número é obrigatório"),
  });

  type AddressFormData = z.infer<typeof addressFormSchema>;

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: initialValues?.name || "",
      phone_number: initialValues?.phone_number || 0,
      address: initialValues?.address || "",
      neighborhood: initialValues?.neighborhood || "",
      number: initialValues?.number || 0,
    },
  });

  async function onSubmit(values: AddressFormData) {
    try {
      setLoading(true);
      
      let response;
      if (formType === "edit" && initialValues?.id) {
        response = await updateAddress(initialValues.id, {
          ...values,
          user_id: user.id,
        });
      } else {
        response = await addAddress({
          ...values,
          user_id: user.id,
        });
      }

      if (response.success) {
        toast.success(
          formType === "edit" 
            ? "Endereço atualizado com sucesso!" 
            : "Endereço adicionado com sucesso!"
        );
        setOpenAddressForm(false);
        form.reset();
        window.location.reload();
      } else {
        toast.error(`Erro ao ${formType === "edit" ? "atualizar" : "adicionar"} endereço: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Erro ao ${formType === "edit" ? "atualizar" : "adicionar"} endereço: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={openAddressForm} onOpenChange={setOpenAddressForm}>
      <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-md border border-bambu-beige/30">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-bambu-green/10 rounded-lg">
                <MapPin size={20} className="text-bambu-green-dark" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-bambu-brown">
                  {formType === "add" ? "Adicionar Endereço" : "Editar Endereço"}
                </DialogTitle>
                <DialogDescription className="text-bambu-brown/60">
                  {formType === "add" 
                    ? "Adicione um novo endereço para facilitar suas entregas"
                    : "Atualize as informações do seu endereço"
                  }
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-bambu-brown font-semibold flex items-center gap-2">
                      <User size={16} className="text-bambu-green-dark" />
                      Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite seu nome completo" 
                        {...field} 
                        className="border-bambu-beige/50 focus:border-bambu-green focus:ring-bambu-green/20"
                      />
                    </FormControl>
                    <FormMessage className="text-bambu-terracota text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-bambu-brown font-semibold flex items-center gap-2">
                      <Phone size={16} className="text-bambu-green-dark" />
                      Telefone
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="11999999999"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="border-bambu-beige/50 focus:border-bambu-green focus:ring-bambu-green/20"
                      />
                    </FormControl>
                    <FormMessage className="text-bambu-terracota text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-bambu-brown font-semibold flex items-center gap-2">
                    <MapPin size={16} className="text-bambu-green-dark" />
                    Endereço
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Rua, Avenida, etc." 
                      {...field} 
                      className="border-bambu-beige/50 focus:border-bambu-green focus:ring-bambu-green/20"
                    />
                  </FormControl>
                  <FormMessage className="text-bambu-terracota text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-bambu-brown font-semibold flex items-center gap-2">
                      <Home size={16} className="text-bambu-green-dark" />
                      Bairro
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome do bairro" 
                        {...field} 
                        className="border-bambu-beige/50 focus:border-bambu-green focus:ring-bambu-green/20"
                      />
                    </FormControl>
                    <FormMessage className="text-bambu-terracota text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-bambu-brown font-semibold flex items-center gap-2">
                      <Hash size={16} className="text-bambu-green-dark" />
                      Número
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="123"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="border-bambu-beige/50 focus:border-bambu-green focus:ring-bambu-green/20"
                      />
                    </FormControl>
                    <FormMessage className="text-bambu-terracota text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-bambu-beige/20">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenAddressForm(false)}
                disabled={loading}
                className="border-bambu-brown/20 text-bambu-brown hover:bg-bambu-brown/5"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                className="bg-bambu-green hover:bg-bambu-green-dark text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    {formType === "edit" ? "Atualizando..." : "Salvando..."}
                  </div>
                ) : (
                  <>
                    {formType === "edit" ? "Atualizar Endereço" : "Salvar Endereço"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
