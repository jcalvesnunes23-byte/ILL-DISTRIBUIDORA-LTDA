import React, { useState, useEffect } from 'react';
import { CartItem, User } from '../types';

interface CartProps {
  items: CartItem[];
  user: User | null;
  onBack: () => void;
  onRemove: (index: number) => void;
  onCheckout: (items: CartItem[], address: string, subtotal: number, total: number) => Promise<void>;
}

const Cart: React.FC<CartProps> = ({ items, user, onBack, onRemove, onCheckout }) => {
  const [address, setAddress] = useState(user?.address || '');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (user?.address && !address) {
      setAddress(user.address);
    }
  }, [user]);

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const total = subtotal;

  const handleSendOrder = async () => {
    if (!address.trim()) {
      alert('Por favor, informe o endereço de entrega.');
      return;
    }

    if (items.length === 0) {
      alert('Seu carrinho está vazio.');
      return;
    }

    setIsCheckingOut(true);
    try {
      await onCheckout(items, address, subtotal, total);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light text-slate-900">
      <header className="sticky top-0 z-50 w-full bg-primary text-white shadow-md">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2">
              <span className="material-symbols-outlined font-bold">shopping_bag</span>
              <h1 className="text-base md:text-xl font-extrabold tracking-tighter uppercase leading-none">ILL & DISTRIBUIDORA</h1>
            </button>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <img alt="User" className="size-7 md:size-8 rounded-full border-2 border-white/20" src={user?.avatar || "https://picsum.photos/seed/user/100/100"} />
            <span className="text-xs md:text-sm font-medium hidden sm:block">{user?.companyName || user?.name || 'Empresa Cadastrada'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6 md:mb-10 tracking-tight">Seu Carrinho</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-2 space-y-10">
            {items.length === 0 ? (
              <div className="bg-white p-20 rounded-xl text-center shadow-sm border border-slate-100">
                <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">shopping_cart_off</span>
                <p className="text-slate-400 font-medium">Seu carrinho está vazio.</p>
                <button onClick={onBack} className="mt-6 text-primary font-bold hover:underline">Explorar Catálogo</button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-32 h-40 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img alt={item.product.name} className="w-full h-full object-cover" src={item.product.image} />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold">{item.product.name}</h3>
                          <p className="text-sm font-semibold text-primary mt-2">Qtd: {item.quantity} unidades</p>
                          {item.selectedFlavor && <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Sabor: {item.selectedFlavor}</p>}
                          {item.crates ? <p className="text-xs text-accent-gold font-bold uppercase tracking-wider">Fardo(s): {item.crates}</p> : null}
                        </div>
                        <button onClick={() => onRemove(idx)} className="text-slate-400 hover:text-red-500">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black">R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold hover:underline">
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Continuar Comprando
                </button>
              </div>
            )}

            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
                <h3 className="text-xl font-extrabold">Endereço de Entrega</h3>
              </div>
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Informe o Local de Entrega</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-4 text-slate-700 focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px]"
                    placeholder="Ex: Av. Paulista, 1000, Apt 12 - São Paulo, SP"
                  />
                  {!address && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 italic">Campo obrigatório para envio</p>}
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden p-8">
              <h3 className="text-xl font-extrabold mb-6 border-b pb-4">Resumo do Pedido</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-bold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Frete</span>
                  <span className="text-green-600 font-bold text-xs uppercase">Grátis</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-baseline">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-primary">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <button
                onClick={handleSendOrder}
                className={`w-full font-black py-4 rounded-lg shadow-lg uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${!address.trim() || items.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 text-white'}`}
                disabled={!address.trim() || items.length === 0}
              >
                Enviar o Pedido <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 border-t bg-primary py-4 px-6 text-white text-center">
        <p className="text-sm font-medium opacity-80">© 2026 ILL & DISTRIBUIDORA LTDA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Cart;
