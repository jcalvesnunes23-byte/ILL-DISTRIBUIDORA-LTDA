import React, { useState } from 'react';

interface AdminLoginProps {
    onLogin: (data: any) => void;
    onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100 relative overflow-hidden">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 text-slate-400 hover:text-primary transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>

                <div className="flex flex-col items-center mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <svg className="size-10 text-primary" fill="currentColor" viewBox="0 0 48 48">
                            <path d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" />
                        </svg>
                        <h1 className="text-xl font-extrabold tracking-tighter uppercase text-slate-900 leading-none">ILL &<br />DISTRIBUIDORA</h1>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">Acesso Administrativo</h2>
                    <p className="text-slate-400 text-sm">Bem-vindo ao portal de gestão</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">E-mail do Administrador</label>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all text-slate-800 placeholder:text-slate-300"
                                placeholder="exemplo@tata.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Senha de Acesso</label>
                            <button type="button" className="text-xs font-bold text-primary hover:underline">Esqueceu a senha?</button>
                        </div>
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-primary/30 transition-all text-slate-800 placeholder:text-slate-300"
                                placeholder="Digite sua senha"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-1">
                        <input type="checkbox" id="remember" className="size-4 rounded border-slate-200 text-primary focus:ring-primary/20" />
                        <label htmlFor="remember" className="text-sm text-slate-500 font-medium cursor-pointer">Lembrar dispositivo</label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:scale-[1.02] active:scale-[0.98] shadow-primary/20'}`}
                    >
                        {isLoading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">refresh</span>
                                Autenticando...
                            </>
                        ) : 'Entrar no Painel'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-slate-300 text-lg">verified_user</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Conexão Segura SSL 256-BIT</span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
