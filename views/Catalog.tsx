import React, { useEffect, useRef } from 'react';
import { Product, User, CartItem } from '../types';

interface CatalogProps {
    user: User | null;
    products: Product[];
    categories: string[];
    cartCount: number;
    onGoToCart: () => void;
    onLogin: () => void;
    onRegister: () => void;
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
    onGoToCart,
    onLogin,
    onRegister,
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
        if (!user) {
            if (confirm('Você precisa estar logado para adicionar produtos ao carrinho. Deseja fazer login agora?')) {
                onLogin();
            }
            return;
        }
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
        <div className="min-h-screen bg-white">
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
                        {!user ? (
                            <>
                                <button onClick={() => onRegister()} className="hidden sm:block bg-white text-blue-600 hover:bg-white/90 px-3 md:px-6 py-2 text-[9px] md:text-xs font-bold tracking-widest uppercase transition-colors">
                                    CADASTRE SUA EMPRESA
                                </button>
                                <button onClick={() => onLogin()} className="border border-white text-white hover:bg-white/10 px-3 md:px-8 py-2 text-[9px] md:text-xs font-bold tracking-widest uppercase transition-colors">
                                    ENTRAR
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onGoToProfile}
                                className="flex items-center gap-2 md:gap-3 group"
                            >
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/20 overflow-hidden group-hover:scale-105 transition-transform">
                                    <img
                                        src={user.avatar || 'https://via.placeholder.com/40'}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-white text-sm font-medium hidden md:block">
                                    {user.companyName || user.name || 'Empresa Cadastrada'}
                                </span>
                            </button>
                        )}
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
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter text-center px-4">
                                        {category}
                                    </h3>
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </div>

                                {categoryProducts.length === 0 ? (
                                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">inventory_2</span>
                                        <p className="text-slate-500 font-medium">Nenhum produto cadastrado nesta categoria ainda.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                        {categoryProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => onProductClick(product)}
                                                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/50 cursor-pointer hover:-translate-y-2 transition-transform duration-500 reveal"
                                            >
                                                <div className="aspect-[3/4] overflow-hidden relative">
                                                    <img
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        src={product.image}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                                </div>

                                                <div className="absolute bottom-0 inset-x-0 p-8 text-white">
                                                    <h4 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-blue-400 transition-colors">{product.name}</h4>
                                                    <p className="text-lg font-bold">
                                                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </p>

                                                    {product.flavors && product.flavors.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                                            {product.flavors.slice(0, 3).map((flavor, index) => (
                                                                <span key={index} className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider rounded-md border border-white/10">
                                                                    {flavor}
                                                                </span>
                                                            ))}
                                                            {product.flavors.length > 3 && (
                                                                <span className="text-[9px] font-bold opacity-60">+{product.flavors.length - 3}</span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {configProductId === product.id ? (
                                                        <div className="mt-4 space-y-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                                                            {product.flavors && product.flavors.length > 0 && (
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Sabor</label>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {product.flavors.map(f => (
                                                                            <button
                                                                                key={f}
                                                                                onClick={() => setSelectedFlavor(f)}
                                                                                className={`px-2 py-1 rounded text-[9px] font-bold transition-all ${selectedFlavor === f ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                                                            >
                                                                                {f}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="flex gap-4">
                                                                <div className="w-full space-y-2">
                                                                    <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Qtd</label>
                                                                    <div className="flex items-center bg-white/10 rounded-lg overflow-hidden border border-white/10">
                                                                        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-2 hover:bg-white/10"><span className="material-symbols-outlined text-xs">remove</span></button>
                                                                        <span className="flex-1 text-center text-xs font-bold">{qty}</span>
                                                                        <button onClick={() => setQty(q => q + 1)} className="p-2 hover:bg-white/10"><span className="material-symbols-outlined text-xs">add</span></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => handleConfirmAdd(e, product)}
                                                                className="w-full bg-blue-600 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all font-bold"
                                                            >
                                                                Confirmar Pedido
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="mt-6 flex items-center justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                                            <button
                                                                onClick={(e) => handleStartConfig(e, product)}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform"
                                                            >
                                                                Adicionar
                                                            </button>
                                                            <div className="size-10 rounded-full bg-white text-slate-900 flex items-center justify-center">
                                                                <span className="material-symbols-outlined">arrow_forward</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            </section>


            <footer className="bg-blue-600 py-10 text-white text-center">
                <p className="opacity-80 text-sm font-medium">© 2024 ILL & DISTRIBUIDORA LTDA. Todos os direitos reservados.</p>
                <button onClick={onGoToAdminLogin} className="text-[10px] opacity-60 uppercase tracking-widest hover:opacity-100 mt-2">Administração</button>
            </footer>
        </div>
    );
};

export default Catalog;
