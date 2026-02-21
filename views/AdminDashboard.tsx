import React, { useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Order, Product } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


interface AdminDashboardProps {
  products: Product[];
  categories: string[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onEditProduct: (product: Product) => void;
  onAddCategory: (category: string) => Promise<void>;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (category: string) => void;
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onGoToCatalog: () => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  orders,
  onAddProduct,
  onEditProduct,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onUpdateOrderStatus,
  onGoToCatalog,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'ORDERS'>('PRODUCTS');
  const [showAddCategory, setShowAddCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // State for adding product
  const [showAddProduct, setShowAddProduct] = React.useState<string | null>(null); // holds category name
  const [newProductName, setNewProductName] = React.useState('');
  const [newProductPrice, setNewProductPrice] = React.useState('');
  const [newProductImage, setNewProductImage] = React.useState('');
  const [newProductFlavors, setNewProductFlavors] = React.useState('');
  const [newProductDescription, setNewProductDescription] = React.useState('');
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);

  // State for editing product
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [editProductName, setEditProductName] = React.useState('');
  const [editProductPrice, setEditProductPrice] = React.useState('');
  const [editProductImage, setEditProductImage] = React.useState('');
  const [editProductFlavors, setEditProductFlavors] = React.useState('');
  const [editProductDescription, setEditProductDescription] = React.useState('');
  const [isGeneratingAIEdit, setIsGeneratingAIEdit] = React.useState(false);

  // State for editing category
  const [editingCategory, setEditingCategory] = React.useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = React.useState('');

  const handleCreateCategory = async (categoryName: string) => {
    if (categoryName.trim()) {
      await onAddCategory(categoryName);
      setNewCategory('');
      setShowAddCategory(false);
    } else {
      alert('Por favor, digite um nome para a categoria.');
    }
  };

  const handleUpdateCategory = (oldName: string, newName: string) => {
    if (oldName && newName.trim()) {
      onEditCategory(oldName, newName);
      setEditingCategory(null);
      setEditedCategoryName('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploadEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAIDescription = () => {
    if (!newProductName) {
      alert('Digite o nome do produto primeiro para gerar a descrição.');
      return;
    }

    setIsGeneratingAI(true);

    // Simulate AI delay
    setTimeout(() => {
      const templates = [
        `Descubra a excelência do ${newProductName}. Um produto ILL & DISTRIBUIDORA LTDA selecionado para transformar seu dia em um momento de puro prazer. Ideal para quem não abre mão de qualidade.`,
        `${newProductName} da ILL & DISTRIBUIDORA LTDA: a combinação perfeita de qualidade e sofisticação. Trazendo até você o melhor do mercado. Experimente essa exclusividade!`,
        `Chegou o ${newProductName}, mais uma estrela da ILL & DISTRIBUIDORA LTDA! Um produto incrível, perfeito para qualquer momento. Sinta a qualidade em cada detalhe.`,
        `Para os clientes exigentes, apresentamos o ${newProductName}. Com a qualidade garantida ILL & DISTRIBUIDORA LTDA, esse produto traz excelência para você. Você vai se surpreender!`
      ];

      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      setNewProductDescription(randomTemplate);
      setIsGeneratingAI(false);
    }, 1500);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProductName && newProductPrice && showAddProduct) {
      const newProduct: Omit<Product, 'id'> = {
        name: newProductName,
        category: showAddProduct,
        price: parseFloat(newProductPrice),
        flavors: newProductFlavors ? newProductFlavors.split(',').map(f => f.trim()) : [],
        status: 'Ativo',
        image: newProductImage || 'https://via.placeholder.com/150',
        description: newProductDescription || 'Produto exclusivo ILL & DISTRIBUIDORA LTDA.'
      };
      onAddProduct(newProduct);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductImage('');
      setNewProductFlavors('');
      setNewProductDescription('');
      setShowAddProduct(null);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editProductName && editProductPrice) {
      const updatedProduct: Product = {
        ...editingProduct,
        name: editProductName,
        price: parseFloat(editProductPrice),
        flavors: editProductFlavors ? editProductFlavors.split(',').map(f => f.trim()) : [],
        image: editProductImage,
        description: editProductDescription
      };
      onEditProduct(updatedProduct);
      setEditingProduct(null);
    }
  };

  const generateAIDescriptionEdit = () => {
    if (!editProductName) {
      alert('Digite o nome do produto primeiro.');
      return;
    }
    setIsGeneratingAIEdit(true);
    setTimeout(() => {
      const templates = [
        `Descubra a excelência do ${editProductName}. Um produto ILL & DISTRIBUIDORA LTDA selecionado para transformar seu dia em um momento de puro prazer. Ideal para quem não abre mão de qualidade.`,
        `${editProductName} da ILL & DISTRIBUIDORA LTDA: a combinação perfeita de qualidade e sofisticação. Trazendo até você o melhor do mercado. Experimente essa exclusividade!`,
      ];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      setEditProductDescription(randomTemplate);
      setIsGeneratingAIEdit(false);
    }, 1500);
  };

  const generateOrderPDF = (order: Order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ILL & DISTRIBUIDORA', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const date = new Date(order.created_at).toLocaleString('pt-BR');
    doc.text(`PEDIDO ID: #${order.id.slice(-6).toUpperCase()}`, 20, 30);
    doc.text(`DATA: ${date}`, pageWidth - 20, 30, { align: 'right' });

    // Client Info
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text('DADOS DO CLIENTE', 20, 55);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 60, pageWidth - 20, 60);

    doc.setFontSize(11);
    doc.text(`Empresa: ${order.user?.companyName || order.user?.name || 'Cliente'}`, 20, 70);
    doc.text(`CNPJ/CPF: ${order.user?.cnpj || 'Não informado'}`, 20, 78);
    doc.text(`Telefone: ${order.user?.phone || 'Não informado'}`, 20, 86);
    doc.text(`Endereço: ${order.delivery_address || 'Retirada no local'}`, 20, 94);

    // Items Table
    doc.text('ITENS DO PEDIDO', 20, 110);

    const tableData = order.items.map(item => [
      item.product.name,
      item.selected_flavor || 'Padrão',
      item.quantity,
      `R$ ${item.price_at_time.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      `R$ ${(item.quantity * item.price_at_time).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);

    autoTable(doc, {
      startY: 115,
      head: [['Produto', 'Sabor/Tipo', 'Qtd', 'Preço Un.', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Total
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL DO PEDIDO: R$ ${order.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, pageWidth - 20, finalY + 10, { align: 'right' });

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('Documento gerado automaticamente pelo Sistema ILL & Distribuidora', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

    doc.save(`Pedido_${order.user?.companyName || 'Cliente'}_${order.id.slice(-6)}.pdf`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`w-72 bg-[#0F172A] text-white fixed inset-y-0 left-0 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col p-10 gap-6">
          <button
            onClick={onGoToCatalog}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors group self-start"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-xs font-bold uppercase tracking-widest">Voltar para Loja</span>
          </button>

          <div className="flex items-center gap-4">
            <svg className="size-10 text-primary shadow-lg shadow-primary/20" fill="currentColor" viewBox="0 0 48 48">
              <path d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" />
            </svg>
            <h1 className="text-xl font-extrabold tracking-tighter uppercase leading-none">ILL &<br />DISTRIBUIDORA</h1>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-4">
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`w-full flex items-center gap-4 px-5 py-4 transition-all rounded-2xl group ${activeTab === 'PRODUCTS' ? 'text-white bg-primary/20 border-r-4 border-primary' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${activeTab === 'PRODUCTS' ? 'text-primary fill-1' : ''}`}>inventory_2</span>
            <span className={`font-bold tracking-wide ${activeTab === 'PRODUCTS' ? '' : 'font-semibold'}`}>Produtos</span>
          </button>
          <button
            onClick={() => setActiveTab('ORDERS')}
            className={`w-full flex items-center gap-4 px-5 py-4 transition-all rounded-2xl group ${activeTab === 'ORDERS' ? 'text-white bg-primary/20 border-r-4 border-primary' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${activeTab === 'ORDERS' ? 'text-primary fill-1' : ''}`}>shopping_bag</span>
            <span className={`font-bold tracking-wide ${activeTab === 'ORDERS' ? '' : 'font-semibold'}`}>Pedidos</span>
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-white hover:bg-white/5 transition-all rounded-2xl group">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">dashboard</span>
            <span className="font-semibold tracking-wide">Dashboard</span>
          </button>
        </nav>

        <div className="p-6 mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all rounded-2xl group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">logout</span>
            <span className="font-bold tracking-wide uppercase text-xs">Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
        <header className="h-16 md:h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-12 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'PRODUCTS' ? 'Gerenciamento de Produtos' : 'Controle de Pedidos'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'PRODUCTS' && (
              <button
                onClick={() => setShowAddCategory(true)}
                className="bg-slate-900 text-white px-3 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm md:text-base">view_column</span> <span className="hidden sm:inline">Nova Categoria</span>
              </button>
            )}
          </div>
        </header>

        {/* Vertical Layout Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
          {activeTab === 'PRODUCTS' ? (
            <>
              {categories.map(category => (
                <div key={category} className="w-full flex flex-col shrink-0 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* Category Header */}
                  <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{category}</h3>
                      <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">
                        {products.filter(p => p.category === category).length} itens
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setEditedCategoryName(category);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Editar Categoria">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Tem certeza que deseja excluir a categoria "${category}"?`)) {
                            onDeleteCategory(category);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Excluir Categoria">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <div className="h-6 w-px bg-slate-200 mx-2"></div>
                      <button
                        onClick={() => setShowAddProduct(category)}
                        className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:border-primary hover:text-primary transition-all flex items-center gap-2 icon-button-sm shadow-sm"
                      >
                        <span className="material-symbols-outlined text-base">add</span> Adicionar Produto
                      </button>
                    </div>
                  </div>

                  {/* Products Grid for this Category */}
                  <div className={`p-8 ${products.filter(p => p.category === category).length > 0 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex justify-center items-center py-12'}`}>
                    {products.filter(p => p.category === category).length > 0 ? (
                      products.filter(p => p.category === category).map(product => (
                        <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col">
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-slate-100">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <span className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${product.status === 'Ativo' ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'}`}>
                              {product.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-800 leading-tight mb-1">{product.name}</h4>
                          <p className="text-xs text-slate-400 mb-3 line-clamp-2 min-h-[2.5em]">{product.description}</p>
                          <div className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 p-2 rounded-lg text-center">
                            Sabores: <span className="text-slate-900">{product.flavors.join(', ')}</span>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                            <span className="font-black text-slate-900 text-lg">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setEditProductName(product.name);
                                setEditProductPrice(product.price.toString());
                                setEditProductImage(product.image);
                                setEditProductFlavors(product.flavors.join(', '));
                                setEditProductDescription(product.description);
                              }}
                              className="size-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
                        <p className="text-xs font-bold uppercase tracking-wider">Nenhum produto nesta categoria</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="flex flex-col items-center justify-center text-slate-400 py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-6xl mb-4 opacity-20">view_column</span>
                  <p className="font-medium text-lg">Nenhuma categoria criada</p>
                  <p className="text-sm">Clique em "Nova Categoria" para começar</p>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              {orders.filter(o => o.status !== 'Entregue').length > 0 ? (
                orders.filter(o => o.status !== 'Entregue').map(order => (
                  <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={order.user?.avatar || 'https://picsum.photos/seed/client/100/100'}
                            alt={order.user?.companyName || 'Cliente'}
                            className="size-16 rounded-2xl object-cover border-2 border-slate-100"
                          />
                          <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{order.user?.companyName || order.user?.name || 'Cliente Desconhecido'}</h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{order.id.slice(-6).toUpperCase()}</span>
                              <span className="size-1 bg-slate-300 rounded-full"></span>
                              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                {new Date(order.created_at).toLocaleString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Itens do Pedido</label>
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                                <div className="flex items-center gap-3">
                                  <span className="font-black text-primary bg-primary/10 size-6 rounded flex items-center justify-center text-[10px]">{item.quantity}x</span>
                                  <span className="font-bold text-slate-700">{item.product.name}</span>
                                  <span className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded uppercase">{item.selected_flavor || 'Padrão'}</span>
                                </div>
                                <span className="font-black text-slate-900">R$ {(item.quantity * item.price_at_time).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resumo e Entrega</label>
                          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                            <div className="flex justify-between items-center text-white/60">
                              <span className="text-[10px] font-bold uppercase tracking-widest">Total a Pagar</span>
                              <span className="text-xl font-black text-white">R$ {order.total_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="h-px bg-white/10 w-full"></div>
                            <div className="flex gap-3">
                              <span className="material-symbols-outlined text-amber-400">location_on</span>
                              <p className="text-xs leading-relaxed text-white/80">{order.delivery_address || 'Retirada no local registrada pelo cliente.'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-48 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-4 md:p-6 flex flex-row md:flex-col gap-3 justify-center">
                      <button
                        onClick={() => generateOrderPDF(order)}
                        className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl hover:border-primary hover:text-primary transition-all group shadow-sm"
                      >
                        <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">picture_as_pdf</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Gerar PDF</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Marcar este pedido como entregue? Ele sairá da lista principal.')) {
                            onUpdateOrderStatus(order.id, 'Entregue');
                          }
                        }}
                        className="w-full flex flex-col items-center justify-center gap-2 p-4 bg-green-500 text-white border border-green-600 rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Entregue</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                  <div className="size-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl opacity-20">shopping_bag</span>
                  </div>
                  <p className="font-black text-xl text-slate-800 uppercase tracking-tight mb-2">Sem pedidos pendentes</p>
                  <p className="text-sm font-medium">Tudo em dia! Novos pedidos aparecerão aqui automaticamente.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="h-12 bg-white border-t border-slate-200 flex items-center justify-center px-8 shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">© 2026 ILL & DISTRIBUIDORA LTDA.</p>
        </footer>

        {/* Modal: Add Category */}
        {showAddCategory && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Nova Categoria</h3>
              <div className="space-y-6">
                <input
                  autoFocus
                  type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={async e => {
                    if (e.key === 'Enter') {
                      await handleCreateCategory(newCategory);
                    }
                  }}
                  placeholder="Nome da categoria (ex: Perfumes)"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="flex-1 py-3 text-slate-500 font-bold uppercase tracking-wider hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      console.log('Botão Criar clicado diretamente');
                      await handleCreateCategory(newCategory);
                    }}
                    className="flex-1 py-3 bg-primary text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors"
                  >
                    Criar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Edit Category */}
        {editingCategory && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Editar Categoria</h3>
              <div className="space-y-6">
                <input
                  autoFocus
                  type="text"
                  value={editedCategoryName}
                  onChange={e => setEditedCategoryName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && editingCategory) {
                      handleUpdateCategory(editingCategory, editedCategoryName);
                    }
                  }}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditingCategory(null)} className="flex-1 py-3 text-slate-500 font-bold uppercase tracking-wider hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                  <button
                    type="button"
                    onClick={() => {
                      if (editingCategory) handleUpdateCategory(editingCategory, editedCategoryName);
                    }}
                    className="flex-1 py-3 bg-primary text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Product */}
        {showAddProduct && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Novo Produto</h3>
              <p className="text-sm text-slate-500 mb-6">Adicionando em: <span className="font-bold text-primary">{showAddProduct}</span></p>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nome do Produto</label>
                  <input
                    autoFocus
                    type="text"
                    value={newProductName}
                    onChange={e => setNewProductName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Preço (R$)</label>
                    <input
                      type="number"
                      value={newProductPrice}
                      onChange={e => setNewProductPrice(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Sabores (separe por vírgula)</label>
                    <input
                      type="text"
                      value={newProductFlavors}
                      onChange={e => setNewProductFlavors(e.target.value)}
                      placeholder="Ex: Chocolate, Morango"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Descrição</label>
                    <button
                      type="button"
                      onClick={generateAIDescription}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingAI ? (
                        <span className="animate-pulse">Gerando...</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">auto_awesome</span> Gerar com IA
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={newProductDescription}
                    onChange={e => setNewProductDescription(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-medium min-h-[120px] resize-none text-sm leading-relaxed"
                    placeholder="Digite a descrição ou use a IA para gerar..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block mb-2">Imagem do Produto</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden">
                    {newProductImage ? (
                      <img src={newProductImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">cloud_upload</span>
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Clique para enviar</span> ou arraste</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {newProductImage && (
                    <button type="button" onClick={() => setNewProductImage('')} className="text-xs text-red-500 font-bold uppercase tracking-wider mt-2 hover:underline">Remover imagem</button>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddProduct(null)} className="flex-1 py-3 text-slate-500 font-bold uppercase tracking-wider hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors">Adicionar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Product */}
        {editingProduct && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Editar Produto</h3>
              <p className="text-sm text-slate-500 mb-6">Editando: <span className="font-bold text-primary">{editingProduct.name}</span></p>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nome do Produto</label>
                  <input
                    autoFocus
                    type="text"
                    value={editProductName}
                    onChange={e => setEditProductName(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Preço (R$)</label>
                    <input
                      type="number"
                      value={editProductPrice}
                      onChange={e => setEditProductPrice(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Sabores (separe por vírgula)</label>
                    <input
                      type="text"
                      value={editProductFlavors}
                      onChange={e => setEditProductFlavors(e.target.value)}
                      placeholder="Ex: Chocolate, Morango"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Descrição</label>
                    <button
                      type="button"
                      onClick={generateAIDescriptionEdit}
                      disabled={isGeneratingAIEdit}
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingAIEdit ? (
                        <span className="animate-pulse">Gerando...</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">auto_awesome</span> Gerar com IA
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={editProductDescription}
                    onChange={e => setEditProductDescription(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-medium min-h-[120px] resize-none text-sm leading-relaxed"
                    placeholder="Digite a descrição ou use a IA para gerar..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block mb-2">Imagem do Produto</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden">
                    {editProductImage ? (
                      <img src={editProductImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-3xl text-slate-400 mb-2">cloud_upload</span>
                        <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Clique para enviar</span> ou arraste</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUploadEdit} />
                  </label>
                  {editProductImage && (
                    <button type="button" onClick={() => setEditProductImage('')} className="text-xs text-red-500 font-bold uppercase tracking-wider mt-2 hover:underline">Remover imagem</button>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 py-3 text-slate-500 font-bold uppercase tracking-wider hover:bg-slate-50 rounded-xl transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-colors">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
