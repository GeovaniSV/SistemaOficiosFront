import React, { useState, useRef, useEffect } from 'react';
import { Save, Building2, FileText, CheckCircle2, X, Upload, Search, Mail } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { useAppStore } from '../store/useAppStore';

export default function Configuracoes({ 
  onNavigate, 
  onLogout 
}: { 
  onNavigate: (view: string) => void;
  onLogout: () => void;
}) {
  const { usuarios } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('organizacao');
  const [cityInput, setCityInput] = useState('');
  const [assinanteInput, setAssinanteInput] = useState('');
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchingUser(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [orgData, setOrgData] = useState({
    nome: 'OAB MT 6º subseção - Sinop',
    telefone: '(00) 0000-0000',
    cep: '',
    logradouro: '',
    numero: '',
    cidade: 'Sinop',
    estado: 'MT',
    cidadesSubsecao: ['Sinop'] as string[],
    logo: null as string | null
  });

  const [oficiosData, setOficiosData] = useState({
    formatoNumeracao: localStorage.getItem('formatoNumeracao') || 'SEQUENCIAL/ANO',
    regraAssinatura: 'UM_USUARIO',
    assinantes: [] as any[],
    cabecalho: localStorage.getItem('oficioCabecalho') || 'Ordem dos Advogados do Brasil\nSeccional Mato Grosso\n6ª Subseção - Sinop',
    rodape: localStorage.getItem('oficioRodape') || 'OAB Mato Grosso 6ª subseção - Sinop'
  });

  const [emailData, setEmailData] = useState({
    servidorSmtp: '',
    porta: '587',
    usuario: '',
    senha: '',
    senhaConfigurada: false,
    remetenteNome: '',
    remetenteEmail: '',
    usarSsl: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailData.senha) {
      setEmailData(prev => ({ ...prev, senhaConfigurada: true, senha: '' }));
    }

    setToastMessage('Configurações salvas com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddCity = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newCity = cityInput.trim();
      if (newCity && !orgData.cidadesSubsecao.includes(newCity)) {
        setOrgData({
          ...orgData,
          cidadesSubsecao: [...orgData.cidadesSubsecao, newCity]
        });
      }
      setCityInput('');
    }
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setOrgData({
      ...orgData,
      cidadesSubsecao: orgData.cidadesSubsecao.filter(city => city !== cityToRemove)
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrgData({ ...orgData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAssinante = (user: any) => {
    if (oficiosData.regraAssinatura === 'UM_USUARIO') {
      setOficiosData({ ...oficiosData, assinantes: [user] });
    } else {
      if (!oficiosData.assinantes.find(a => a.id === user.id)) {
        setOficiosData({
          ...oficiosData,
          assinantes: [...oficiosData.assinantes, user]
        });
      }
    }
    setAssinanteInput('');
    setIsSearchingUser(false);
  };

  const handleRemoveAssinante = (idToRemove: string) => {
    setOficiosData({
      ...oficiosData,
      assinantes: oficiosData.assinantes.filter(a => a.id !== idToRemove)
    });
  };

  const handleRegraAssinaturaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaRegra = e.target.value;
    setOficiosData({
      ...oficiosData,
      regraAssinatura: novaRegra,
      // Se mudar para UM_USUARIO e tiver mais de um, mantém só o primeiro
      assinantes: novaRegra === 'UM_USUARIO' && oficiosData.assinantes.length > 1 
        ? [oficiosData.assinantes[0]] 
        : oficiosData.assinantes
    });
  };

  const filteredUsers = usuarios.filter(user => 
    user.name.toLowerCase().includes(assinanteInput.toLowerCase()) ||
    user.cargo.toLowerCase().includes(assinanteInput.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentView="configuracoes" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configurações</h1>
              <p className="text-sm text-slate-500 mt-1">Gerencie suas preferências, perfil e dados da organização.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Tabs Sidebar */}
              <div className="w-full md:w-64 shrink-0">
                <nav className="flex flex-col space-y-1">
                  <button
                    onClick={() => setActiveTab('organizacao')}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === 'organizacao' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mr-3 ${activeTab === 'organizacao' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    Organização
                  </button>
                  <button
                    onClick={() => setActiveTab('oficios')}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === 'oficios' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <FileText className={`w-5 h-5 mr-3 ${activeTab === 'oficios' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    Ofícios
                  </button>
                  <button
                    onClick={() => setActiveTab('email')}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      activeTab === 'email' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Mail className={`w-5 h-5 mr-3 ${activeTab === 'email' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    Servidor de E-mail
                  </button>
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-8">
                    
                    {activeTab === 'organizacao' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Dados da Organização</h3>
                          <p className="text-sm text-slate-500 mt-1">Informações que aparecerão nos cabeçalhos dos ofícios.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-12 flex items-center gap-6 pb-6 border-b border-slate-100">
                            <div className="shrink-0">
                              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 overflow-hidden relative group">
                                {orgData.logo ? (
                                  <>
                                    <img src={orgData.logo} alt="Logo da Organização" className="w-full h-full object-contain" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <label className="cursor-pointer text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-md hover:bg-black/70 transition-colors">
                                        Trocar
                                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                      </label>
                                    </div>
                                  </>
                                ) : (
                                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                                    <Upload className="w-6 h-6 mb-1" />
                                    <span className="text-[10px] font-medium text-center px-2">Upload Logo</span>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                  </label>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-slate-900">Logo da Organização</h4>
                              <p className="text-xs text-slate-500 mt-1 max-w-md">
                                Esta imagem será exibida no cabeçalho dos ofícios gerados. Recomendamos uma imagem com fundo transparente (PNG) e tamanho máximo de 2MB.
                              </p>
                              {orgData.logo && (
                                <button 
                                  type="button"
                                  onClick={() => setOrgData({...orgData, logo: null})}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium mt-2"
                                >
                                  Remover logo
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-8">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Instituição</label>
                            <Input 
                              type="text" 
                              value={orgData.nome}
                              disabled
                            />
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                            <Input 
                              type="text" 
                              value={orgData.telefone}
                              onChange={(e) => setOrgData({...orgData, telefone: e.target.value})}
                            />
                          </div>
                          
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                            <Input 
                              type="text" 
                              value={orgData.cep}
                              onChange={(e) => setOrgData({...orgData, cep: e.target.value})}
                            />
                          </div>
                          <div className="md:col-span-7">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Logradouro</label>
                            <Input 
                              type="text" 
                              value={orgData.logradouro}
                              onChange={(e) => setOrgData({...orgData, logradouro: e.target.value})}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Número</label>
                            <Input 
                              type="text" 
                              value={orgData.numero}
                              onChange={(e) => setOrgData({...orgData, numero: e.target.value})}
                            />
                          </div>

                          <div className="md:col-span-8">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                            <Input 
                              type="text" 
                              value={orgData.cidade}
                              onChange={(e) => setOrgData({...orgData, cidade: e.target.value})}
                            />
                          </div>
                          <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                            <Input 
                              type="text" 
                              value={orgData.estado}
                              onChange={(e) => setOrgData({...orgData, estado: e.target.value})}
                            />
                          </div>

                          <div className="md:col-span-12">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cidades da subseção</label>
                            <div className="p-2 bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors min-h-[42px] flex flex-wrap gap-2">
                              {orgData.cidadesSubsecao.map(city => (
                                <span key={city} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-emerald-100 text-emerald-800">
                                  {city}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCity(city)}
                                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-emerald-600 hover:bg-emerald-200 hover:text-emerald-900 focus:outline-none"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </span>
                              ))}
                              <Input
                                type="text"
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                onKeyDown={handleAddCity}
                                placeholder={orgData.cidadesSubsecao.length === 0 ? "Digite o nome da cidade e pressione Enter..." : "Adicionar cidade..."}
                                className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-slate-900 placeholder-slate-400 border-0 focus-visible:ring-0 shadow-none px-0 py-0 min-h-0 h-auto"
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Pressione Enter para adicionar uma cidade à lista.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'oficios' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Configurações de Ofícios</h3>
                          <p className="text-sm text-slate-500 mt-1">Defina o formato de numeração e as regras de assinatura.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-12 pt-4 border-t border-slate-100">
                            <h4 className="text-md font-semibold text-slate-900 mb-4">Aparência do Ofício (Pré-visualização e Impressão)</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                              <div className="md:col-span-12">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cabeçalho</label>
                                <Textarea 
                                  rows={4}
                                  value={oficiosData.cabecalho}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setOficiosData({...oficiosData, cabecalho: value});
                                    localStorage.setItem('oficioCabecalho', value);
                                  }}
                                  placeholder="Ex: Ordem dos Advogados do Brasil&#10;Seccional Mato Grosso&#10;6ª Subseção - Sinop"
                                />
                                <p className="text-xs text-slate-500 mt-1">Este texto aparecerá no topo de todos os ofícios gerados.</p>
                              </div>

                              <div className="md:col-span-12">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Rodapé</label>
                                <Textarea 
                                  rows={2}
                                  value={oficiosData.rodape}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    setOficiosData({...oficiosData, rodape: value});
                                    localStorage.setItem('oficioRodape', value);
                                  }}
                                  placeholder="Ex: OAB Mato Grosso 6ª subseção - Sinop"
                                />
                                <p className="text-xs text-slate-500 mt-1">Este texto aparecerá na parte inferior de todos os ofícios gerados.</p>
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-12 pt-4 border-t border-slate-100">
                            <h4 className="text-md font-semibold text-slate-900 mb-4">Regras de Assinatura</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                              <div className="md:col-span-6">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Exigência de Assinaturas</label>
                                <Select 
                                  value={oficiosData.regraAssinatura}
                                  onChange={handleRegraAssinaturaChange}
                                >
                                  <option value="UM_USUARIO">Aprovação por um usuário</option>
                                  <option value="MULTIPLOS_USUARIOS">Aprovação por múltiplos usuários</option>
                                </Select>
                              </div>

                              <div className="md:col-span-12 relative" ref={searchRef}>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Pessoas/Cargos Autorizados a Assinar</label>
                                <div className="p-2 bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors min-h-[42px] flex flex-wrap gap-2">
                                  {oficiosData.assinantes.map(assinante => (
                                    <span key={assinante.id} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                                      {assinante.name} ({assinante.cargo})
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveAssinante(assinante.id)}
                                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-900 focus:outline-none"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </span>
                                  ))}
                                  {!(oficiosData.regraAssinatura === 'UM_USUARIO' && oficiosData.assinantes.length > 0) && (
                                    <div className="flex-1 min-w-[200px] relative flex items-center">
                                      <Search className="w-4 h-4 text-slate-400 absolute left-2" />
                                      <Input
                                        type="text"
                                        value={assinanteInput}
                                        onChange={(e) => {
                                          setAssinanteInput(e.target.value);
                                          setIsSearchingUser(true);
                                        }}
                                        onFocus={() => setIsSearchingUser(true)}
                                        placeholder="Buscar usuário cadastrado..."
                                        className="w-full pl-8 pr-3 py-1 outline-none bg-transparent text-sm text-slate-900 placeholder-slate-400 border-0 focus-visible:ring-0 shadow-none min-h-0 h-auto"
                                      />
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                  {oficiosData.regraAssinatura === 'UM_USUARIO' 
                                    ? "Selecione apenas um usuário para assinar os ofícios." 
                                    : "Busque e selecione os usuários que poderão assinar os ofícios."}
                                </p>

                                {isSearchingUser && (
                                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {filteredUsers.length > 0 ? (
                                      <ul className="py-1">
                                        {filteredUsers.map(user => (
                                          <li 
                                            key={user.id}
                                            onClick={() => handleAddAssinante(user)}
                                            className={`px-4 py-2 text-sm cursor-pointer hover:bg-emerald-50 flex flex-col ${
                                              oficiosData.assinantes.some(a => a.id === user.id) ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                          >
                                            <span className="font-medium text-slate-900">{user.name}</span>
                                            <span className="text-xs text-slate-500">{user.cargo}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                        Nenhum usuário encontrado.
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'email' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">Servidor de E-mail (SMTP)</h3>
                          <p className="text-sm text-slate-500 mt-1">Configure as credenciais do servidor SMTP para o envio de e-mails pelo sistema.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className="md:col-span-8">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Servidor SMTP</label>
                            <Input 
                              type="text" 
                              value={emailData.servidorSmtp}
                              onChange={(e) => setEmailData({...emailData, servidorSmtp: e.target.value})}
                              placeholder="ex: smtp.gmail.com"
                            />
                          </div>

                          <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Porta</label>
                            <Input 
                              type="text" 
                              value={emailData.porta}
                              onChange={(e) => setEmailData({...emailData, porta: e.target.value})}
                              placeholder="ex: 587"
                            />
                          </div>

                          <div className="md:col-span-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Usuário</label>
                            <Input 
                              type="text" 
                              value={emailData.usuario}
                              onChange={(e) => setEmailData({...emailData, usuario: e.target.value})}
                              placeholder="ex: contato@suaorganizacao.com"
                            />
                          </div>

                          <div className="md:col-span-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                            <Input 
                              type="password" 
                              value={emailData.senha}
                              onChange={(e) => setEmailData({...emailData, senha: e.target.value})}
                              placeholder={emailData.senhaConfigurada ? "•••••••• (Senha configurada)" : "••••••••"}
                            />
                            {emailData.senhaConfigurada && !emailData.senha && (
                              <p className="text-xs text-slate-500 mt-1">Preencha apenas se desejar alterar a senha atual.</p>
                            )}
                          </div>

                          <div className="md:col-span-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Remetente</label>
                            <Input 
                              type="text" 
                              value={emailData.remetenteNome}
                              onChange={(e) => setEmailData({...emailData, remetenteNome: e.target.value})}
                              placeholder="ex: Sistema OAB"
                            />
                          </div>

                          <div className="md:col-span-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail do Remetente</label>
                            <Input 
                              type="email" 
                              value={emailData.remetenteEmail}
                              onChange={(e) => setEmailData({...emailData, remetenteEmail: e.target.value})}
                              placeholder="ex: nao-responda@suaorganizacao.com"
                            />
                          </div>

                          <div className="md:col-span-12">
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={emailData.usarSsl}
                                onChange={(e) => setEmailData({...emailData, usarSsl: e.target.checked})}
                                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                              />
                              <span className="text-sm font-medium text-slate-700">Usar conexão segura (SSL/TLS)</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-6 border-t border-slate-200">
                      <Button type="submit" icon={<Save className="w-4 h-4" />}>
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" />
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
