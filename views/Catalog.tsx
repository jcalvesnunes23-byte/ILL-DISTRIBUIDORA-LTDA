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

            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[85vh] pt-16 md:pt-20 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 z-0 bg-[#0a0a2e]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%25'%3E%3Cdefs%3E%3Cpattern id='topography' width='600' height='600' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 150 Q 75 160 150 150 T 300 150 T 450 150 T 600 150 M0 300 Q 75 310 150 300 T 300 300 T 450 300 T 600 300 M0 450 Q 75 460 150 450 T 300 450 T 450 450 T 600 450' fill='none' stroke='white' stroke-opacity='0.1' stroke-width='1'/%3E%3Cpath d='M0 75 Q 75 85 150 75 T 300 75 T 450 75 T 600 75 M0 225 Q 75 235 150 225 T 300 225 T 450 225 T 600 225 M0 375 Q 75 385 150 375 T 300 375 T 450 375 T 600 375 M0 525 Q 75 535 150 525 T 300 525 T 450 525 T 600 525' fill='none' stroke='white' stroke-opacity='0.05' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23topography)' /%3E%3C/svg%3E")`,
                        backgroundAttachment: 'fixed'
                    }}
                >
                </div>
                <div className="relative z-20 text-center max-w-5xl px-4 md:px-6">

                    <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 md:mb-12 tracking-tight uppercase">
                        FAÇA O SEU <br />PEDIDO DA <span className="text-blue-600 font-black">ILL & <br />DISTRIBUIDORA</span>
                    </h1>
                    <button
                        onClick={scrollToCatalog}
                        className="bg-blue-600 text-white hover:bg-blue-700 px-6 md:px-12 py-3 md:py-5 rounded-lg font-bold text-sm md:text-lg transition-all uppercase tracking-wider shadow-lg active:scale-95"
                    >
                        Ver Catálogo
                    </button>
                </div>
            </section>

            {/* Product Section */}
            <section ref={catalogRef} className="py-12 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">

                <div className="mb-16 max-w-2xl mx-auto relative group ai-glow-container">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">search</span>
                    <input
                        className="w-full pl-12 pr-6 py-4 bg-transparent border-none outline-none transition-all font-light tracking-wide text-slate-700"
                        placeholder="O que você está procurando?"
                    />
                </div>

                {/* Product Sections by Category */}
                <div className="space-y-24">
                    {categories.map(category => {
                        const categoryProducts = products.filter(p => p.category === category);
                        if (categoryProducts.length === 0) return null;

                        return (
                            <section key={category}>
                                <div className="flex items-center gap-4 mb-12 reveal">
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter text-center px-4">
                                        {category}
                                    </h3>
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </div>

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
