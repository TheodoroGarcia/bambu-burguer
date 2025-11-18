import PageTitle from "@/components/ui/page-title";
import ProductForm from "../../_common/product-form";
import { getProductById } from "@/actions/products";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const response: any = await getProductById(id!);
  if (!response.success) {
    return (
      <div className="min-h-screen bg-bambu-beige to-bambu-green/10 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <div className="text-bambu-terracota text-lg mb-4">
               {response.message}
            </div>
            <p className="text-bambu-brown/70">
              Não foi possível carregar o produto para edição.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-bambu-beige to-bambu-green/10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <div className="text-center">
            <PageTitle title="Editar Produto" />
            <p className="text-bambu-brown/70 mt-2">
              Atualize as informações do produto: {response?.data[0]?.name}
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 overflow-hidden">
          <ProductForm formType="edit" initialValues={response?.data[0]} />
        </div>
      </div>
    </div>
  );
}
