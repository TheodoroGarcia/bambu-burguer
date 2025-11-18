import PageTitle from "@/components/ui/page-title";
import ProductForm from "../_common/product-form";

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-bambu-beige to-bambu-green/10 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <div className="text-center">
            <PageTitle title="Adicionar Produto" />
            <p className="text-bambu-brown/70 mt-2">
              Crie um novo item para o seu cardápio do Bambu Burger
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 overflow-hidden">
          <ProductForm formType="add" />
        </div>
      </div>
    </div>
  );
}
