
import React, { useState } from 'react';
import { View, Product, CartItem, User, Order } from './types';
import { MOCK_PRODUCTS } from './constants';
import Catalog from './views/Catalog';
import ProductDetail from './views/ProductDetail';
import AdminDashboard from './views/AdminDashboard';
import Cart from './views/Cart';
import Profile from './views/Profile';
import AdminLogin from './views/AdminLogin';
import { supabase } from './supabaseClient';
import { useEffect, useCallback } from 'react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('CATALOG');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const savedScrollY = React.useRef<number>(0);

  const navigateTo = useCallback((view: View, product?: Product) => {
    if (product) setSelectedProduct(product);
    setCurrentView(view);
    // Ao ir para o catálogo (voltando), não reseta o scroll
    if (view !== 'CATALOG') {
      window.scrollTo(0, 0);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const { data: ordersData, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:profiles(*),
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error.message);
    } else {
      const mappedOrders = (ordersData as any[]).map(order => ({
        ...order,
        user: order.user ? {
          name: order.user.name,
          role: order.user.role,
          companyName: order.user.company_name,
          cnpj: order.user.cnpj,
          email: order.user.email,
          phone: order.user.phone,
          businessCategory: order.user.business_category,
          address: order.user.address,
          avatar: order.user.avatar_url
        } : null
      }));
      setOrders(mappedOrders as Order[]);
    }
  }, []);

  const handleAuthUser = useCallback(async (session: any) => {
    if (!session?.user) return;

    const meta = session.user.user_metadata;
    const isMasterAdmin = session.user.email === 'ismaellucio2018@gmail.com';

    // 1. Prepare initial data from metadata
    const initialUser: User = {
      name: meta?.name || session.user.email?.split('@')[0] || '',
      role: isMasterAdmin ? 'ADMIN' : (meta?.role || 'USER'),
      companyName: isMasterAdmin ? 'ILL & DISTRIBUIDORA LTDA' : meta?.company_name,
      cnpj: meta?.cnpj,
      email: session.user.email,
      phone: meta?.phone,
      businessCategory: meta?.business_category,
      address: meta?.address,
      avatar: meta?.avatar_url
    };

    // 2. Fetch or create profile from DB BEFORE updating local state
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    let finalUser = initialUser;

    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{
          id: session.user.id,
          name: initialUser.name,
          company_name: initialUser.companyName,
          email: initialUser.email,
          role: initialUser.role,
          cnpj: initialUser.cnpj,
          phone: initialUser.phone,
          business_category: initialUser.businessCategory,
          address: initialUser.address
        }])
        .select()
        .single();

      if (!insertError && newProfile) {
        finalUser = {
          ...initialUser,
          companyName: isMasterAdmin ? 'ILL & DISTRIBUIDORA LTDA' : (newProfile.company_name || initialUser.companyName),
          role: isMasterAdmin ? 'ADMIN' : (newProfile.role || 'USER')
        };
      }
    } else {
      // 2.2 Check if profile needs update (sync metadata to DB)
      const needsUpdate = (
        (initialUser.cnpj && !profile.cnpj) ||
        (initialUser.phone && !profile.phone) ||
        (initialUser.businessCategory && !profile.business_category) ||
        (initialUser.address && !profile.address)
      );

      if (needsUpdate) {
        await supabase
          .from('profiles')
          .update({
            cnpj: profile.cnpj || initialUser.cnpj,
            phone: profile.phone || initialUser.phone,
            business_category: profile.business_category || initialUser.businessCategory,
            address: profile.address || initialUser.address
          })
          .eq('id', session.user.id);
      }

      finalUser = {
        ...initialUser,
        name: profile.name || initialUser.name,
        role: isMasterAdmin ? 'ADMIN' : (profile.role || initialUser.role),
        companyName: isMasterAdmin ? 'ILL & DISTRIBUIDORA LTDA' : (profile.company_name || initialUser.companyName),
        cnpj: profile.cnpj || initialUser.cnpj,
        email: profile.email || initialUser.email,
        phone: profile.phone || initialUser.phone,
        businessCategory: profile.business_category || initialUser.businessCategory,
        address: profile.address || initialUser.address,
        avatar: profile.avatar_url || initialUser.avatar
      };
    }

    // 3. Atomic state update
    setUser(finalUser);

    // 4. Fetch side data if admin
    if (finalUser.role === 'ADMIN') {
      await fetchOrders();
    }
  }, [fetchOrders]);

  // 1. Initial State Sync & Auth Listeners
  useEffect(() => {
    const initApp = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          supabase.from('products').select('*').neq('status', 'Excluído'),
          supabase.from('categories').select('name, order_index').order('order_index', { ascending: true })
        ]);
        if (prodRes.data) setProducts(prodRes.data);
        if (catRes.data) setCategories(catRes.data.map((c: any) => c.name).filter((n: string) => n !== 'Arquivados'));

        const { data: { session } } = await supabase.auth.getSession();
        if (session) await handleAuthUser(session);
      } catch (err) {
        console.error('App init error:', err);
      }
    };

    initApp();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED')) {
        handleAuthUser(session);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        navigateTo('LOGIN');
      }
    });

    return () => authSub.unsubscribe();
  }, [handleAuthUser, navigateTo]); // Run only on mount

  // 2. Real-time Orders Subscription (Admin Only)
  useEffect(() => {
    if (user?.role !== 'ADMIN') return;

    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.role, fetchOrders]); // Re-subscribe if role changes

  // Auto-redirect when user is logged in and on a login-related view
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        if (currentView === 'ADMIN_LOGIN') {
          navigateTo('ADMIN');
        }
      } else {
        if (currentView === 'ADMIN') {
          navigateTo('CATALOG');
        }
      }
    }
  }, [user, currentView, navigateTo]);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) {
      alert('Erro ao atualizar status do pedido: ' + error.message);
    } else {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };


  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setToast({ message: `${item.product.name} adicionado ao carrinho!`, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };
  const handleAdminLogin = async (data: any) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      alert('Erro no login admin: ' + error.message);
    }
    // Redirection is now handled by the auto-redirect useEffect
  };

  const handleRegister = async (data: any) => {
    // Cadastro de clientes removido
  };

  const handleLogout = async () => {
    // 1. Clear local state immediately for instant feedback
    setUser(null);
    navigateTo('LOGIN');

    // 2. Clear from sessionStorage/localStorage just in case
    localStorage.clear();
    sessionStorage.clear();

    try {
      // 3. Attempt network sign-out in the background
      await supabase.auth.signOut();
      alert('Sessão encerrada com sucesso!');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { error } = await supabase.from('products').insert([product]);
      if (error) {
        alert('Erro ao adicionar produto: ' + error.message);
      } else {
        // Refresh products
        const { data } = await supabase.from('products').select('*').neq('status', 'Excluído');
        if (data) setProducts(data);
      }
    } catch (err: any) {
      alert('Erro inesperado ao adicionar produto: ' + err.message);
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    const { error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', updatedProduct.id);

    if (error) {
      alert('Erro ao editar produto: ' + error.message);
    } else {
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .update({ status: 'Excluído' })
      .eq('id', productId);

    if (error) {
      alert('Erro ao excluir produto: ' + error.message);
    } else {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleAddCategory = async (name: string) => {
    if (name.trim().toLowerCase() === 'arquivados') {
      alert('Este nome é reservado para o sistema.');
      return;
    }

    try {
      const { error } = await supabase.from('categories').insert([{ name }]);

      if (error) {
        console.error('Erro ao adicionar categoria:', error);
        alert('Erro ao criar categoria: ' + error.message);
        return;
      }

      // Refresh Categories
      const { data } = await supabase.from('categories').select('name');
      if (data) {
        setCategories(data.map(c => c.name).filter(n => n !== 'Arquivados'));
      }
    } catch (err: any) {
      alert('Erro inesperado: ' + (err.message || err));
    }
  };

  const handleEditCategory = async (oldName: string, newName: string) => {
    const { error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('name', oldName);

    if (error) {
      alert('Erro ao editar categoria: ' + error.message);
    } else {
      // Refresh local state from database to ensure sync
      const { data: catData } = await supabase.from('categories').select('name');
      if (catData) setCategories(catData.map(c => c.name));

      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData) setProducts(prodData);
    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    let finalError = null;

    // Tenta excluir a categoria diretamente
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('name', categoryToDelete);

    if (error && error.message.includes('violates foreign key constraint')) {
      // Se houver conflito de FK, significa que há produtos que foram vendidos.
      // 1. Cria a categoria oculta se não existir (ignora erro se já existir)
      await supabase.from('categories').insert([{ name: 'Arquivados' }]);

      // 2. Move os produtos da categoria para a categoria oculta e exclui logicamente
      await supabase.from('products')
        .update({ category: 'Arquivados', status: 'Excluído' })
        .eq('category', categoryToDelete);

      // 3. Tenta deletar a categoria original novamente agora que está vazia
      const { error: retryError } = await supabase
        .from('categories')
        .delete()
        .eq('name', categoryToDelete);

      if (retryError) finalError = retryError;
    } else if (error) {
      finalError = error;
    }

    if (finalError) {
      alert('Erro ao excluir categoria: ' + finalError.message);
    } else {
      // Atualiza estado local removendo 'Arquivados' da visão
      const { data: catData } = await supabase.from('categories').select('name');
      if (catData) setCategories(catData.map(c => c.name).filter(n => n !== 'Arquivados'));

      // Filtra produtos e os que foram para Arquivados saem da visão
      setProducts(products.filter(p => p.category !== categoryToDelete));
    }
  };

  const handleReorderCategories = async (orderedNames: string[]) => {
    // Salva order_index para cada categoria em paralelo
    const updates = orderedNames.map((name, index) =>
      supabase.from('categories').update({ order_index: index }).eq('name', name)
    );
    await Promise.all(updates);
    // Atualiza o estado local com a nova ordem (sem refetch)
    setCategories(orderedNames);
  };

  const handleCheckout = async (items: CartItem[], address: string, subtotal: number, total: number) => {
    let orderIdPreview = Math.random().toString(36).substring(2, 6).toUpperCase();

    // Se houver um usuário logado (geralmente ADM testando ou futuro), tentamos salvar no banco
    if (user) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([{
            user_id: session.user.id,
            total_amount: total,
            status: 'Pendente',
            delivery_address: address
          }])
          .select()
          .single();

        if (!orderError && order) {
          orderIdPreview = order.id.substring(0, 4).toUpperCase();
          const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price_at_time: item.product.price,
            selected_flavor: item.selectedFlavor
          }));
          await supabase.from('order_items').insert(orderItems);
        }
      }
    }

    // 3. Build WhatsApp Message & Notify
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    let message = `🚀 *Pedido Nº ${orderIdPreview}* \n`;
    message += `feito em ${dateStr} ${timeStr}\n \n`;
    message += `------ ITENS DO PEDIDO ------\n`;

    items.forEach(item => {
      message += ` *${item.quantity} x ${item.product.name.toUpperCase()}*`;
      if (item.selectedFlavor) {
        message += ` - ${item.selectedFlavor}`;
      }
      if (item.crates) {
        message += ` - Fardo(s): ${item.crates}`;
      }
      message += ` ${item.quantity} x R$ ${item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} = R$ ${(item.quantity * item.product.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    });

    message += `\n -----------------------------\n \n`;
    message += `*Subtotal:* R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    message += ` *Taxa de entrega:* Grátis\n`;
    message += ` *Valor final:* R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
    message += ` 💲 *Forma de pagamento* A Combinar: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5527996531969?text=${encodedMessage}`, '_blank');

    setCart([]);
    navigateTo('CATALOG');
  };

  const handleUpdateProfile = async (file: File | null) => {
    if (!user) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let avatar_url = user.avatar;

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        alert('Erro ao enviar imagem: ' + uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      avatar_url = publicUrl;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        avatar_url,
        name: user.name,
        email: user.email,
        company_name: user.companyName,
        cnpj: user.cnpj,
        phone: user.phone,
        business_category: user.businessCategory,
        address: user.address
      });

    if (updateError) {
      alert('Erro ao atualizar perfil na tabela: ' + updateError.message);
      return;
    }

    // Also update Auth Metadata for faster initial load
    const { error: authError } = await supabase.auth.updateUser({
      data: { avatar_url }
    });

    if (authError) {
      console.warn('Erro ao atualizar metadata do auth:', authError.message);
    }

    setUser(prev => prev ? { ...prev, avatar: avatar_url || '' } : null);
    alert('Perfil atualizado com sucesso!');
  };

  const handleProductClick = (product: Product) => {
    savedScrollY.current = window.scrollY;
    navigateTo('PRODUCT_DETAIL', product);
  };

  return (
    <div className="font-sans text-slate-900 text-slate-900">
      {/* {currentView === 'LOGIN' && <Login onLogin={handleLogin} onRegister={() => navigateTo('REGISTRATION')} />} */}
      {currentView === 'CATALOG' && (
        <Catalog
          user={user}
          products={products}
          categories={categories}
          onGoToCart={() => navigateTo('CART')}
          onProductClick={handleProductClick}
          onGoToProfile={() => navigateTo('PROFILE')}
          onGoToAdminLogin={() => navigateTo('ADMIN_LOGIN')}
          cartCount={cart.length}
          onAddToCart={addToCart}
          restoreScrollY={savedScrollY.current}
        />
      )}
      {currentView === 'PRODUCT_DETAIL' && selectedProduct && (
        <ProductDetail product={selectedProduct} user={user} onAddToCart={addToCart} onBack={() => navigateTo('CATALOG')} />
      )}
      {currentView === 'ADMIN' && (
        <AdminDashboard
          products={products}
          categories={categories}
          orders={orders}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onReorderCategories={handleReorderCategories}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onGoToCatalog={() => navigateTo('CATALOG')}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'ADMIN_LOGIN' && <AdminLogin onLogin={handleAdminLogin} onBack={() => navigateTo('CATALOG')} />}
      {currentView === 'PROFILE' && user && (
        <Profile user={user} onBack={() => navigateTo('CATALOG')} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} />
      )}
      {currentView === 'CART' && (
        <Cart
          items={cart}
          user={user}
          onBack={() => navigateTo('CATALOG')}
          onRemove={(index) => setCart(prev => prev.filter((_, i) => i !== index))}
          onCheckout={handleCheckout}
        />
      )}



      {/* Floating Buttons - Global */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-[100]">
        <button
          onClick={() => navigateTo('CART')}
          className="relative bg-blue-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
        >
          <span className="material-symbols-outlined text-2xl">shopping_cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-900 text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {cart.length}
            </span>
          )}
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-bold py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none">
            Carrinho
          </span>
        </button>
        <button
          className="bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
          onClick={() => window.open('https://wa.me/5527996531969', '_blank')}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.877 1.215 3.076.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="absolute right-full mr-4 bg-[#25D366] text-white text-[10px] font-bold py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest pointer-events-none">
            WhatsApp
          </span>
        </button>
      </div>

      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/10 z-[200] animate-bounce-subtle flex items-center gap-3">
          <span className="material-symbols-outlined text-green-400">check_circle</span>
          <span className="text-sm font-bold uppercase tracking-widest">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default App;
