
import React, { useState } from 'react';
import { Product, CartItem, User } from '../types';

interface ProductDetailProps {
  product: Product;
  user: User | null;
  onAddToCart: (item: CartItem) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, user, onAddToCart, onBack }) => {
  const [qty, setQty] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState<string>(product.flavors?.[0] || '');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-primary h-20 flex items-center px-6 shadow-lg">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-white">
          <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-widest">Voltar</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-tighter uppercase leading-none">ILL &<br />DISTRIBUIDORA</h1>
          </div>
          <div className="flex items-center gap-3">
            <img alt="User" className="size-8 rounded-full border-2 border-white/20" src={user?.avatar || "https://picsum.photos/seed/user/100/100"} />
            <span className="text-sm font-medium">{user?.companyName || user?.name || 'Empresa Cadastrada'}</span>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-xl">
              <img alt={product.name} className="w-full h-full object-cover" src={product.image} />
            </div>

            <div className="flex flex-col">
              <nav className="flex items-center gap-2 text-neutral-400 text-xs uppercase tracking-widest mb-8">
                <span>Catálogo</span>
                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                <span className="text-primary">{product.category}</span>
              </nav>

              <h2 className="text-accent-gold font-bold tracking-[0.3em] text-sm uppercase mb-4">Experiência Platinum</h2>
              <h1 className="text-4xl md:text-5xl font-black text-dark-charcoal tracking-tight uppercase mb-6">{product.name}</h1>

              <p className="text-neutral-500 leading-relaxed text-lg mb-8 max-w-lg">
                {product.description || "O ápice da sofisticação e qualidade, desenhado para os paladares mais exigentes da ILL & DISTRIBUIDORA LTDA."}
              </p>

              <div className="mb-4">
                <span className="text-3xl font-light text-primary">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {product.flavors && product.flavors.length > 0 && (
                <div className="mb-8">
                  <label className="block text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Selecione o Sabor</label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full border transition-all ${selectedFlavor === flavor
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-primary/50'
                          }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-8 border-t border-neutral-100 pt-8">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">Quantidade</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:text-primary">
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <input className="w-12 text-center border-none font-bold focus:ring-0" value={qty} readOnly />
                      <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:text-primary">
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <span className="text-neutral-400 text-xs italic">Unidades individuais</span>
                  </div>
                </div>


                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => onAddToCart({ product, quantity: qty, selectedFlavor })}
                    className="w-full bg-primary text-white py-5 rounded-lg font-bold text-lg hover:bg-blue-600 transition-all shadow-lg uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    Adicionar ao Pedido
                  </button>
                  <button className="w-full border-2 border-neutral-100 text-neutral-400 py-4 rounded-lg font-bold text-xs hover:border-primary hover:text-primary transition-all uppercase tracking-widest">
                    Adicionar aos Favoritos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary py-6 text-white text-center mt-auto">
        <p className="opacity-80 text-sm font-medium">© 2026 ILL & DISTRIBUIDORA LTDA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default ProductDetail;
