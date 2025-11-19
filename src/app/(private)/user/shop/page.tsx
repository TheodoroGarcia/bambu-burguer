"use client";

import { getAllProducts } from "@/actions/products";
import PageTitle from "@/components/ui/page-title";
import ProductTile from "./_components/product-tile";
import { IProduct } from "@/interfaces";
import { productCategories } from "@/constants";
import { ShoppingBag, UtensilsCrossed, Coffee } from "lucide-react";
import { useState, useEffect } from "react";

export default function UserShopPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'lanche' | 'bebida' | 'todos'>('todos');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: any = await getAllProducts({
          category: "",
          searchText: "",
        });
        
        if (response.success) {
          setProducts(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bambu-beige p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-bambu-brown/40 mb-4" />
            <p className="text-bambu-brown/60 text-lg">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bambu-beige p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-bambu-brown/40 mb-4" />
            <p className="text-bambu-brown/60 text-lg">Erro ao carregar produtos: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getProductsByCategory = (categoryValue: string) => {
    return products.filter(product => product.category === categoryValue);
  };

  const getFilteredProducts = () => {
    if (activeCategory === 'todos') return products;
    return getProductsByCategory(activeCategory);
  };

  const filteredProducts = getFilteredProducts();
  
  return (
    <div className="min-h-screen bg-bambu-beige p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-6 mb-8">
          <PageTitle title="Cardápio" />
          <p className="text-bambu-brown/70 mt-2">
            Descubra nossos hambúrguers artesanais e deliciosas bebidas
          </p>
        </div>

        {/* Abas de categoria */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-2 mb-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveCategory('todos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeCategory === 'todos'
                  ? 'bg-bambu-green text-white shadow-md'
                  : 'text-bambu-brown hover:bg-bambu-green/10'
              }`}
            >
              <ShoppingBag size={20} />
              Todos ({products.length})
            </button>
            
            {productCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value as 'lanche' | 'bebida')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === category.value
                    ? category.value === 'lanche' 
                      ? 'bg-bambu-terracota text-white shadow-md'
                      : 'bg-bambu-green-dark text-white shadow-md'
                    : 'text-bambu-brown hover:bg-bambu-brown/10'
                }`}
              >
                {category.value === 'lanche' ? <UtensilsCrossed size={20} /> : <Coffee size={20} />}
                {category.label}s ({getProductsByCategory(category.value).length})
              </button>
            ))}
          </div>
        </div>

        {/* Grid de produtos filtrados */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {filteredProducts.map((product: IProduct) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-bambu-beige/30 p-12 text-center">
            <ShoppingBag size={48} className="mx-auto text-bambu-brown/40 mb-4" />
            <p className="text-bambu-brown/60 text-lg">
              Nenhum produto encontrado na categoria {activeCategory === 'todos' ? 'selecionada' : activeCategory}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
