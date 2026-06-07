import React, { useState, useRef } from 'react';
import { Camera, Save, ArrowLeft, Lock, User, Mail, Shield, Briefcase } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function MeuPerfil({ onLogout, onNavigate }: { onLogout: () => void, onNavigate: (view: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    role: 'Administrador',
    cargo: 'Presidente',
    photoUrl: 'https://picsum.photos/seed/user/100/100'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('Perfil atualizado com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToastMessage('As senhas não coincidem!');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    setToastMessage('Senha alterada com sucesso!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentView="meuPerfil" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="mr-4 p-2 rounded-full hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Meu Perfil</h1>
                <p className="text-sm text-slate-500 mt-1">Gerencie suas informações pessoais e configurações de conta.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info Card */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Informações da Conta</h2>
                    <p className="text-sm text-slate-500 mt-1">Atualize seus dados básicos.</p>
                  </div>
                  <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                      <div className="relative group">
                        <img 
                          src={profileData.photoUrl} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                        />
                        <button 
                          type="button"
                          onClick={handlePhotoClick}
                          className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full shadow-md hover:bg-emerald-700 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handlePhotoChange} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                          <Input 
                            type="text" 
                            icon={<User className="w-4 h-4 text-slate-400" />}
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                          <Input 
                            type="email" 
                            icon={<Mail className="w-4 h-4 text-slate-400" />}
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <Button 
                        type="submit" 
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Password Change Card */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">Segurança</h2>
                    <p className="text-sm text-slate-500 mt-1">Altere sua senha de acesso.</p>
                  </div>
                  <form onSubmit={handleSavePassword} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Senha Atual <span className="text-rose-500">*</span></label>
                      <Input 
                        type="password" 
                        required
                        icon={<Lock className="w-4 h-4 text-slate-400" />}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha <span className="text-rose-500">*</span></label>
                        <Input 
                          type="password" 
                          required
                          icon={<Lock className="w-4 h-4 text-slate-400" />}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nova Senha <span className="text-rose-500">*</span></label>
                        <Input 
                          type="password" 
                          required
                          icon={<Lock className="w-4 h-4 text-slate-400" />}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <Button 
                        type="submit" 
                        className="bg-slate-900 hover:bg-slate-800"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Atualizar Senha
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Shield className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold">Nível de Acesso</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-4">
                    Seu papel atual no sistema define quais recursos você pode acessar e modificar.
                  </p>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/5">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Papel Atual</span>
                    <span className="font-medium text-emerald-400">{profileData.role}</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 border border-white/5 mt-4">
                    <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Cargo Atual</span>
                    <span className="font-medium text-emerald-400">{profileData.cargo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
