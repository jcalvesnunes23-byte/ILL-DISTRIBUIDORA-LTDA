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
                                    <div className="flex flex-col gap-4">
                                        {categoryProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                onClick={() => onProductClick(product)}
                                                className="group relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow reveal"
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
                                                            <h4 className="text-sm sm:text-base font-bold uppercase tracking-tight text-slate-800 line-clamp-2 leading-tight mb-1">{product.name}</h4>
                                                            <p className="text-xs text-slate-500 line-clamp-2 leading-snug">
                                                                {product.description || 'Descrição não informada. Produto de altíssima qualidade ILL & DISTRIBUIDORA.'}
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <p className="text-sm sm:text-base font-black text-slate-900">
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


            <footer className="bg-blue-600 py-10 text-white text-center">
                <p className="opacity-80 text-sm font-medium">© 2024 ILL & DISTRIBUIDORA LTDA. Todos os direitos reservados.</p>
                <button onClick={onGoToAdminLogin} className="text-[10px] opacity-60 uppercase tracking-widest hover:opacity-100 mt-2">Administração</button>
            </footer>
        </div>
    );
};

export default Catalog;
