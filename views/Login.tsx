
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (data: any) => void;
  onRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onLogin({ email, password });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header/Banner Area */}
        <div className="relative h-32 bg-primary/5 flex items-center justify-center">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-4xl">corporate_fare</span>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4 text-primary">
              <svg className="size-6 md:size-8" fill="currentColor" viewBox="0 0 48 48">
                <path d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" />
              </svg>
              <h1 className="text-lg md:text-xl font-extrabold tracking-tighter uppercase whitespace-nowrap">ILL & DISTRIBUIDORA</h1>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Acesso ao Catálogo</h2>
            <p className="text-slate-500 text-sm mt-2">Bem-vindo à ILL & DISTRIBUIDORA</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">E-mail</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">mail</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="exemplo@empresa.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-700">Senha</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Esqueceu a senha?</button>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">lock</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/30" />
              <span className="text-sm font-medium text-slate-600">Lembrar dispositivo</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-bold py-4 rounded-lg shadow-lg uppercase tracking-widest transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-primary/20'}`}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Autenticando...
                </>
              ) : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Ainda não tem cadastro? <button onClick={onRegister} className="text-primary font-bold hover:underline">Cadastre sua empresa</button>
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="text-[10px] uppercase font-bold tracking-widest">Conexão Segura SSL 256-bit</span>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 w-full bg-primary py-3 px-6 text-white text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-2 max-w-7xl mx-auto">
          <p className="text-xs md:text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            Catálogo ILL & DISTRIBUIDORA LTDA
          </p>
          <span className="hidden md:block opacity-40">|</span>
          <p className="text-[10px] md:text-xs opacity-60">© 2024 ILL & DISTRIBUIDORA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
