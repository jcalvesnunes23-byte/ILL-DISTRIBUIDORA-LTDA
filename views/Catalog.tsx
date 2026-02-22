import React, { useEffect, useRef } from 'react';
import { Product, User, CartItem } from '../types';

interface CatalogProps {
    user: User | null;
    products: Product[];
    categories: string[];
    cartCount: number;
    restoreScrollY?: number;
    onGoToCart: () => void;
    onGoToProfile: () => void;
    onProductClick: (product: Product) => void;
    onGoToAdminLogin: () => void;
    onAddToCart: (item: CartItem) => void;
}

const Catalog: React.FC<CatalogProps> = ({
    user,
    products,
    categories,
    cartCount,
    restoreScrollY,
    onGoToCart,
    onGoToProfile,
    onProductClick,
    onGoToAdminLogin,
    onAddToCart
}) => {
    const [configProductId, setConfigProductId] = React.useState<string | null>(null);
    const [selectedFlavor, setSelectedFlavor] = React.useState('');
    const [qty, setQty] = React.useState(1);
    const [crates, setCrates] = React.useState(0);
    const catalogRef = useRef<HTMLDivElement>(null);

    // Restaura a posição do scroll ao voltar de um detalhe de produto
    useEffect(() => {
        if (restoreScrollY) {
            window.scrollTo({ top: restoreScrollY, behavior: 'instant' });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const scrollToCatalog = () => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [products, categories]); // Re-run when products change

    const handleStartConfig = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        setConfigProductId(product.id);
        setSelectedFlavor(product.flavors?.[0] || '');
        setQty(1);
    };

    const handleConfirmAdd = (e: React.MouseEvent, product: Product) => {
        e.stopPropagation();
        onAddToCart({
            product,
            quantity: qty,
            selectedFlavor
        });
        setConfigProductId(null);
    };

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #1e3a5f 100%)' }}>
            {/* Header Bar */}
            <header className="fixed top-0 w-full z-50 bg-blue-600 shadow-lg h-16 md:h-20 flex items-center px-4 md:px-6">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <div className="flex items-center gap-2 md:gap-3 text-white min-w-0">
                        <svg className="size-6 md:size-8 shrink-0" fill="currentColor" viewBox="0 0 48 48">
                            <path d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" />
                        </svg>
                        <h1 className="text-sm md:text-2xl font-extrabold tracking-tighter uppercase truncate">ILL & DISTRIBUIDORA LTDA</h1>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    </div>
                </div>
            </header>

            {/* Product Section */}
            <section ref={catalogRef} className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto pt-24 md:pt-32">
                {/* Product Sections by Category */}
                <div className="space-y-24">
                    {categories.map(category => {
                        const categoryProducts = products.filter(p => p.category === category);

                        return (
                            <section key={category}>
                                <div className="flex items-center gap-4 mb-12 reveal">
                                    <div className="h-px bg-white/20 flex-1"></div>
                                    <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter text-center px-4 drop-shadow-lg">
                                        {category}
                                    </h3>
                                    <div className="h-px bg-white/20 flex-1"></div>
                                </div>

                                {categoryProducts.length === 0 ? (
                                    <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10">
                                        <span className="material-symbols-outlined text-4xl text-white/30 mb-3">inventory_2</span>
                                        <p className="text-white/50 font-medium">Nenhum produto cadastrado nesta categoria ainda.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {categoryProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => onProductClick(product)}
                                                className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer reveal transition-all duration-300 hover:-translate-y-1"
                                                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.35), 0 1.5px 6px rgba(30,160,255,0.08)' }}
                                            >
                                                <div className="flex flex-row sm:h-36">
                                                    {/* Imagem e Botão Esquerdo */}
                                                    <div className="w-32 h-36 sm:w-40 sm:h-full shrink-0 relative flex flex-col items-center justify-center p-2 sm:p-4">
                                                        <div className="w-full h-full relative">
                                                            <img
                                                                alt={product.name}
                                                                className="w-full h-full object-cover rounded-lg border border-slate-200/50 shadow-sm"
                                                                src={product.image}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Informações do Lado Direito */}
                                                    <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
                                                        <div>
                                                            <h4 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-800 line-clamp-2 leading-tight mb-1">{product.name}</h4>
                                                            {product.description && product.description.trim() !== '' && (
                                                                <p className="text-xs text-slate-500 line-clamp-2 leading-snug">
                                                                    {product.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <p className="text-base sm:text-lg font-black text-slate-900">
                                                                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Painel de Configuração Expandido */}
                                                {configProductId === product.id && (
                                                    <div className="bg-slate-50 border-t border-slate-100 p-4" onClick={e => e.stopPropagation()}>
                                                        {product.flavors && product.flavors.length > 0 && (
                                                            <div className="space-y-2 mb-4">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sabor/Opções</label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {product.flavors.map(f => (
                                                                        <button
                                                                            key={f}
                                                                            onClick={() => setSelectedFlavor(f)}
                                                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${selectedFlavor === f ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:border-red-600 hover:text-red-600'}`}
                                                                        >
                                                                            {f}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="flex gap-4 mb-4">
                                                            <div className="w-1/2 space-y-2">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quantidade</label>
                                                                <div className="flex items-center bg-white rounded-lg overflow-hidden border border-slate-200">
                                                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex-1 p-2 text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-sm">remove</span></button>
                                                                    <span className="w-10 text-center text-sm font-bold text-slate-800 border-x border-slate-200 py-1">{qty}</span>
                                                                    <button onClick={() => setQty(q => q + 1)} className="flex-1 p-2 text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-sm">add</span></button>
                                                                </div>
                                                            </div>
                                                            <div className="w-1/2 space-y-2">
                                                                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fardos</label>
                                                                <div className="flex items-center bg-white rounded-lg overflow-hidden border border-slate-200">
                                                                    <button onClick={() => setCrates(c => Math.max(0, c - 1))} className="flex-1 p-2 text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-sm">remove</span></button>
                                                                    <span className="w-10 text-center text-sm font-bold text-slate-800 border-x border-slate-200 py-1">{crates}</span>
                                                                    <button onClick={() => setCrates(c => c + 1)} className="flex-1 p-2 text-slate-600 hover:bg-slate-50"><span className="material-symbols-outlined text-sm">add</span></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => handleConfirmAdd(e, product)}
                                                            className="w-full bg-red-600 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2"
                                                        >
                                                            <span className="material-symbols-outlined text-base">shopping_bag</span>
                                                            Adicionar ao Pedido
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </section>


            <footer className="py-10 text-white text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <p className="opacity-80 text-sm font-medium">© 2024 ILL & DISTRIBUIDORA LTDA. Todos os direitos reservados.</p>
                <button onClick={onGoToAdminLogin} className="text-[10px] opacity-60 uppercase tracking-widest hover:opacity-100 mt-2">Administração</button>
            </footer>
        </div>
    );
};

export default Catalog;
