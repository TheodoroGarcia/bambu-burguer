"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CurrencyInput } from "@/components/ui/currency-input";
import { productCatergories } from "@/constants";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { uploadFileAndGetUrl } from "@/utils/file-uploads";
import {
  resizeMultipleImages,
  isValidImageFile,
  isValidFileSize,
} from "@/utils/image-resize";
import { Camera, Save, X, Package, DollarSign, FileText, Tag, Hash } from "lucide-react";
import usersGlobalStore, {
  IUsersGlobalStore,
} from "@/global-store/users-store";
import { addNewProduct, editProductById } from "@/actions/products";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  formType?: "add" | "edit";
  initialValues?: any;
}

export default function ProductForm({
  formType = "add",
  initialValues = {},
}: ProductFormProps) {
  const { user } = usersGlobalStore() as IUsersGlobalStore;
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<any>(
    initialValues.images || []
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const productFormSchema = z.object({
    name: z.string().min(1, "Nome do produto é obrigatório").min(3, "Nome deve ter pelo menos 3 caracteres"),
    description: z.string().min(1, "Descrição é obrigatória").min(10, "Descrição deve ter pelo menos 10 caracteres"),
    price: z.number({
      message: "Preço deve ser um número válido"
    }).min(0.01, "Preço deve ser maior que zero"),
    category: z.string().min(1, "Categoria é obrigatória"),
    available_stock: z.number({
      message: "Estoque deve ser um número válido"
    }).min(0, "Estoque não pode ser negativo"),
  });

  type ProductFormData = z.infer<typeof productFormSchema>;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: initialValues.name || "",
      description: initialValues.description || "",
      price: initialValues.price || 0,
      category: initialValues.category || "",
      available_stock: initialValues.available_stock || 0,
    },
  });

  async function onSubmit(values: ProductFormData) {
    try {
      setLoading(true);

      let allImageUrls = [...existingImageUrls];

      if (selectedFiles.length > 0) {
        const resizedFiles = await resizeMultipleImages(
          selectedFiles,
          800,
          600,
          0.7
        );

        for (const file of resizedFiles) {
          const response = await uploadFileAndGetUrl(file);
          if (response.success) {
            allImageUrls.push(response.url);
          } else {
            throw new Error("Erro ao fazer upload da imagem.");
          }
        }
      }

      if (allImageUrls.length === 0) {
        toast.error("Por favor, selecione pelo menos uma imagem.");
        return;
      }

      const payload = {
        ...values,
        images: allImageUrls,
        seller_id: user?.id,
      };

      let response: any = null;
      if (formType === "add") {
        response = await addNewProduct(payload);
      } else {
        response = await editProductById(initialValues.id, payload);
      }

      if (!response.success) {
        throw new Error(response.message);
      } else {
        toast.success(response.message);
        router.push("/seller/products");
      }
    } catch (error) {
      toast.error("Erro ao processar o produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const imageUrlsToDisplay = useMemo(() => {
    let urls: any = [];
    
    if (existingImageUrls.length > 0) {
      urls = [...existingImageUrls];
    }
    
    if (selectedFiles.length > 0) {
      const newFileUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      urls = [...urls, ...newFileUrls];
    }
    
    return urls;
  }, [selectedFiles, existingImageUrls]);

  const onSelectedImageDelete = (index: number) => {
    try {
      const existingCount = existingImageUrls.length;
      
      if (index < existingCount) {
        const filteredExisting = existingImageUrls.filter((_: any, i: number) => i !== index);
        setExistingImageUrls(filteredExisting);
      } else {
        const newFileIndex = index - existingCount;
        const filteredFiles = selectedFiles.filter((_: any, i: number) => i !== newFileIndex);
        setSelectedFiles(filteredFiles);
      }
    } catch (error) {
      toast.error("Erro ao deletar a imagem. Tente novamente.");
    }
  };

  const onExistingImageDelete = (index: number) => {
    try {
      const filteredFiles = existingImageUrls.filter(
        (_: any, i: number) => i !== index
      );
      setExistingImageUrls(filteredFiles);
    } catch (error) {
      toast.error("Erro ao deletar a imagem. Tente novamente.");
    }
  };

  return (
    <div className="p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-bambu-brown font-medium flex items-center gap-2">
                    <Package size={16} />
                    Nome do Produto
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Bambu Classic Burger" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-bambu-brown font-medium flex items-center gap-2">
                    <Tag size={16} />
                    Categoria
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorias</SelectLabel>
                        {productCatergories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-bambu-brown font-medium flex items-center gap-2">
                  <FileText size={16} />
                  Descrição
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva os ingredientes e características do produto..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-bambu-brown font-medium flex items-center gap-2">
                    <DollarSign size={16} />
                    Preço
                  </FormLabel>
                  <FormControl>
                    <CurrencyInput
                      placeholder="R$ 0,00"
                      value={field.value}
                      onChange={(value) => {
                        const numericValue =
                          typeof value === "number" && !isNaN(value)
                            ? value
                            : 0;
                        field.onChange(numericValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="available_stock"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-bambu-brown font-medium flex items-center gap-2">
                    <Hash size={16} />
                    Estoque Disponível
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Quantidade em estoque"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 p-6 bg-bambu-beige/10 rounded-xl border border-bambu-beige/30">
            <div className="flex items-center gap-2">
              <Camera size={20} className="text-bambu-green-dark" />
              <label className="text-bambu-brown font-medium">Imagens do Produto</label>
            </div>
            <Input
              placeholder="Clique para selecionar as imagens do produto"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={async (e) => {
                const files = e.target.files;
                if (files) {
                  const fileArray = Array.from(files);

                  const invalidFiles = fileArray.filter(
                    (file) =>
                      !isValidImageFile(file) || !isValidFileSize(file, 10)
                  );

                  if (invalidFiles.length > 0) {
                    toast.error(
                      "Alguns arquivos são inválidos. Use apenas imagens JPG, PNG ou WebP menores que 10MB."
                    );
                    return;
                  }

                  setSelectedFiles(fileArray);
                  toast.success(
                    `${fileArray.length} imagem(ns) selecionada(s)`
                  );
                }
              }}
            />
            <p className="text-xs text-bambu-brown/60 bg-white/50 p-2 rounded-md">
               Aceita JPG, PNG, WebP. Máximo: 10MB por arquivo. As imagens serão redimensionadas automaticamente para 800x600px para melhor performance.
            </p>
          </div>

          {(existingImageUrls.length > 0 || selectedFiles.length > 0) && (
            <div className="space-y-4 p-6 bg-bambu-green/5 rounded-xl border border-bambu-green/20">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-bambu-green-dark" />
                <h4 className="text-bambu-brown font-medium">
                  {formType === "edit" ? "Imagens do produto:" : "Imagens selecionadas:"}
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {imageUrlsToDisplay.map((url: string, index: number) => {
                  const isExistingImage = index < existingImageUrls.length;
                  const fileIndex = isExistingImage ? index : index - existingImageUrls.length;
                  
                  return (
                    <div
                      className={`relative group flex flex-col gap-2 p-3 items-center rounded-lg transition-all hover:shadow-md ${
                        isExistingImage 
                          ? 'border-2 border-bambu-green bg-bambu-green/10' 
                          : 'border-2 border-bambu-beige bg-white'
                      }`}
                      key={index}
                    >
                      <div className="relative overflow-hidden rounded-lg">
                        <img src={url} className="w-20 h-20 object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                      </div>
                      <div className="text-center text-xs">
                        {isExistingImage ? (
                          <>
                            <p className="text-bambu-green-dark font-medium"> Existente</p>
                            <p className="text-bambu-brown/60">#{index + 1}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-bambu-brown font-medium truncate w-20" title={selectedFiles[fileIndex]?.name}>
                              {selectedFiles[fileIndex]?.name}
                            </p>
                            <p className="text-bambu-brown/60">
                              {(
                                (selectedFiles[fileIndex]?.size || 0) /
                                1024 /
                                1024
                              ).toFixed(2)}MB
                            </p>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-bambu-terracota hover:bg-bambu-terracota/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        onClick={() => onSelectedImageDelete(index)}
                        title="Remover imagem"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex justify-center sm:justify-end gap-4 pt-6 border-t border-bambu-beige/30">
            <Button
              onClick={() => router.push("/seller/products")}
              disabled={loading}
              type="button"
              variant="outline"
              className="w-full sm:w-auto border-bambu-brown/20 text-bambu-brown hover:bg-bambu-brown/5 hover:border-bambu-brown/40 px-8 py-3 font-medium"
            >
              {loading ? "Processando..." : "Cancelar"}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto bg-bambu-green hover:bg-bambu-green-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save size={16} />
                  {formType === "add" ? "Criar Produto" : "Atualizar Produto"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
