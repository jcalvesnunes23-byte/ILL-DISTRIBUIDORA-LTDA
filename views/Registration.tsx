
import React, { useState } from 'react';
import { User } from '../types';

interface RegistrationProps {
  onBack: () => void;
  onRegister: (data: any) => void;
}

const Registration: React.FC<RegistrationProps> = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    email: '',
    phone: '',
    businessCategory: 'Varejo',
    address: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onRegister({
        name: formData.companyName,
        ...formData
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col">
      <header className="flex items-center justify-between bg-primary px-4 md:px-10 py-4 sticky top-0 z-50 shadow-sm text-white">
        <button onClick={onBack} className="rounded-lg h-10 w-10 bg-white/10 hover:bg-white/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center justify-center gap-1 md:gap-2 flex-grow mx-2 min-w-0">
          <svg className="size-5 md:size-6 shrink-0" fill="currentColor" viewBox="0 0 48 48">
            <path d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" />
          </svg>
          <h1 className="text-sm md:text-xl font-extrabold tracking-tighter uppercase truncate">ILL & DISTRIBUIDORA</h1>
        </div>
        <div className="w-10 shrink-0"></div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 md:py-12">
        <div className="w-full max-w-[560px]">
          <div className="mb-6 md:mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">Junte-se à Rede</h2>
            <p className="text-slate-500 text-sm md:text-base">Cadastre sua empresa para acessar o catálogo B2B da ILL & DISTRIBUIDORA</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-primary/10 p-8 md:p-10">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Nome da Empresa</label>
                <input
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Nome oficial registrado"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">CNPJ</label>
                <input
                  required
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="00.000.000/0001-00"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">E-mail de Contato</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="corporativo@empresa.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-900">Telefone</label>
                  <input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 focus:ring-1 focus:ring-primary outline-none"
                    placeholder="+55 (11) 90000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Categoria do Negócio</label>
                <select
                  value={formData.businessCategory}
                  onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                  className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 focus:ring-1 focus:ring-primary outline-none appearance-none"
                >
                  <option>Varejo</option>
                  <option>Distribuidora</option>
                  <option>Indústria</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Senha</label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Defina uma senha"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">Endereço de Entrega</label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-24 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Rua, Número, Bairro, Cidade - UF"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-14 text-white font-bold rounded-lg shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-primary/20'}`}
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">sync</span>
                    Processando...
                  </>
                ) : 'Solicitar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-6 px-10 text-center">
        <p className="text-xs text-slate-500 font-medium">© 2024 ILL & DISTRIBUIDORA LTDA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Registration;
