import { getAllProducts } from "@/actions/products";
import PageTitle from "@/components/ui/page-title";
import ProductTile from "./_components/product-tile";
import { IProduct } from "@/interfaces";
import { ShoppingBag } from "lucide-react";

export default async function UserShopPage() {
  const response: any = await getAllProducts({
    category: "",
    searchText: "",
  });

  if (!response.success) {
    return (
      <div className="min-h-screen bg-bambu-beige/20 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-bambu-brown/40 mb-4" />
            <p className="text-bambu-brown/60 text-lg">Erro ao carregar produtos: {response.message}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-bambu-beige p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <PageTitle title="Cardápio" />
          <p className="text-bambu-brown/70 mt-2">
            Descubra nossos hambúrguers artesanais e deliciosos acompanhamentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {response.data.map((product: IProduct) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
