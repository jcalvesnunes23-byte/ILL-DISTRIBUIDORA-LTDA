
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
    user: User;
    onBack: () => void;
    onUpdateProfile: (file: File | null) => Promise<void>;
    onLogout: () => Promise<void>;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onUpdateProfile, onLogout }) => {
    const [profileImage, setProfileImage] = useState(user.avatar || 'https://via.placeholder.com/150');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Sync local state with prop when it changes
    React.useEffect(() => {
        if (user.avatar && !selectedFile) {
            setProfileImage(user.avatar);
        }
    }, [user.avatar, selectedFile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Limit to 2MB to ensure fast uploads
            if (file.size > 2 * 1024 * 1024) {
                alert('A imagem é muito grande! Por favor, escolha uma imagem de até 2MB para garantir um carregamento rápido.');
                return;
            }

            setSelectedFile(file);

            // Use createObjectURL instead of FileReader for better performance
            const objectUrl = URL.createObjectURL(file);
            setProfileImage(objectUrl);

            // Clean up the object URL when component unmounts or image changes
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onUpdateProfile(selectedFile);
            setSelectedFile(null); // Reset after successful save
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="flex items-center justify-between bg-blue-600 px-6 md:px-10 py-4 sticky top-0 z-50 shadow-sm text-white">
                <button onClick={onBack} className="rounded-lg h-10 w-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-xl font-extrabold tracking-tighter uppercase">Meu Perfil</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Cover/Header */}
                    <div className="h-32 bg-blue-600/10 flex items-center justify-center relative">
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                            <div className="relative group">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Logo';
                                    }}
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <span className="material-symbols-outlined text-white">photo_camera</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-10 px-8 md:px-12">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-slate-900">{user.companyName}</h2>
                            <p className="text-slate-500 font-medium">{user.businessCategory}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome da Empresa</label>
                                <div className="h-12 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 font-medium">
                                    {user.companyName}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CNPJ</label>
                                <div className="h-12 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 font-medium">
                                    {user.cnpj}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-mail Corporativo</label>
                                <div className="h-12 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 font-medium">
                                    {user.email}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telefone</label>
                                <div className="h-12 flex items-center px-4 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 font-medium">
                                    {user.phone}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col gap-6">
                            {selectedFile && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full bg-blue-600 text-white h-14 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">refresh</span>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">save</span>
                                            Salvar Alterações
                                        </>
                                    )}
                                </button>
                            )}

                            <button
                                onClick={onLogout}
                                className="w-full bg-white text-red-600 border-2 border-red-100 h-14 rounded-xl font-bold uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 duration-100"
                            >
                                <span className="material-symbols-outlined">logout</span>
                                Sair da Conta
                            </button>

                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                                <span className="material-symbols-outlined text-blue-500 text-2xl">info</span>
                                <p className="text-sm text-blue-700 font-medium">
                                    Os dados desta empresa foram validados e não podem ser alterados diretamente pelo portal. Para modificações contratuais, entre em contato com o suporte.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-100 py-6 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">ILL & DISTRIBUIDORA LTDA - Gestão de Parceiros</p>
            </footer>
        </div>
    );
};

export default Profile;
