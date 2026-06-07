import React, { useState } from 'react';
import { Search, Plus, CheckCircle2, ArrowLeft, Save, Edit, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useAppStore } from '../store/useAppStore';

const defaultPermissions = {
  oficios: { ver: false, criar: false, editar: false, excluir: false },
  usuarios: { ver: false, criar: false, editar: false, excluir: false },
  contatos: { ver: false, criar: false, editar: false, excluir: false },
  templates: { ver: false, criar: false, editar: false, excluir: false },
  configuracoes: { acessar: false }
};

export default function Papeis({ 
  onLogout, 
  onNavigate 
}: { 
  onLogout: () => void;
  onNavigate: (view: string) => void;
}) {
  const { papeis, addPapel, updatePapel } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isExistingRole, setIsExistingRole] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredRoles = papeis.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleNewRole = () => {
    setFormData({ name: '', description: '', status: 'Ativo', permissions: JSON.parse(JSON.stringify(defaultPermissions)) });
    setIsExistingRole(false);
    setView('form');
    setActiveMenuId(null);
  };

  const handleEditRole = () => {
    const role = papeis.find(r => r.id === activeMenuId);
    if (role) {
      setFormData(JSON.parse(JSON.stringify(role)));
      setIsExistingRole(true);
      setView('form');
      setActiveMenuId(null);
    }
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isExistingRole) {
      updatePapel(formData.id, formData);
    } else {
      const newRole = { ...formData };
      addPapel(newRole);
      const createdRole = { ...newRole, id: Date.now() };
      setFormData(createdRole);
      setIsExistingRole(true);
    }
    
    setToastMessage('Papel salvo com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handlePermissionChange = (module: string, action: string, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: {
          ...formData.permissions[module],
          [action]: checked
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentView="papeis" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {view === 'list' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Papéis e Permissões</h1>
                  <p className="text-sm text-slate-500 mt-1">Gerencie os papéis de acesso e suas permissões no sistema.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button onClick={handleNewRole}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Papel
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <Input
                      icon={<Search className="w-4 h-4" />}
                      placeholder="Buscar papéis por nome ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">Nome do Papel</th>
                        <th className="px-6 py-4 font-medium">Descrição</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paginatedRoles.map((role) => (
                        <tr 
                          key={role.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === role.id ? null : role.id);
                            setMenuPosition({ x: e.clientX, y: e.clientY });
                          }}
                          className={`hover:bg-slate-50 transition-colors cursor-pointer group ${activeMenuId === role.id ? 'bg-slate-50' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{role.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{role.description}</td>
                        </tr>
                      ))}
                      {filteredRoles.length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                            Nenhum papel encontrado com os filtros atuais.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredRoles.length > itemsPerPage && (
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <span className="text-sm text-slate-500">
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredRoles.length)} de {filteredRoles.length} registros
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                      </Button>
                      <span className="text-sm font-medium text-slate-700 mx-2">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {view === 'form' && formData && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setView('list');
                      setActiveMenuId(null);
                    }}
                    className="rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {isExistingRole ? 'Editar Papel' : 'Novo Papel'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      {isExistingRole ? 'Atualize as informações e permissões do papel.' : 'Preencha os dados e defina as permissões do novo papel.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <form onSubmit={handleSaveRole} className="space-y-8">
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Status do Papel</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Define se o papel está ativo no sistema</p>
                    </div>
                    <label className={`relative inline-flex items-center ${!isExistingRole ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.status !== 'Inativo'}
                        disabled={!isExistingRole}
                        onChange={(e) => setFormData({...formData, status: e.target.checked ? 'Ativo' : 'Inativo'})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:bg-emerald-400"></div>
                      <span className="ml-3 text-sm font-medium text-slate-700">
                        {formData.status !== 'Inativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Papel <span className="text-rose-500">*</span></label>
                      <Input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ex: Editor de Ofícios"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Descrição <span className="text-rose-500">*</span></label>
                      <Input 
                        type="text" 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Ex: Pode criar e editar ofícios, mas não pode gerenciar usuários."
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                      Permissões do Sistema
                    </h3>
                    
                    <div className="space-y-6">
                      {/* Ofícios Permissions */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-medium text-slate-900 mb-3">Ofícios</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.oficios.ver}
                              onChange={(e) => handlePermissionChange('oficios', 'ver', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Visualizar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.oficios.criar}
                              onChange={(e) => handlePermissionChange('oficios', 'criar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Criar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.oficios.editar}
                              onChange={(e) => handlePermissionChange('oficios', 'editar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Editar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.oficios.excluir}
                              onChange={(e) => handlePermissionChange('oficios', 'excluir', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Excluir</span>
                          </label>
                        </div>
                      </div>

                      {/* Contatos Permissions */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-medium text-slate-900 mb-3">Contatos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.contatos.ver}
                              onChange={(e) => handlePermissionChange('contatos', 'ver', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Visualizar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.contatos.criar}
                              onChange={(e) => handlePermissionChange('contatos', 'criar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Criar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.contatos.editar}
                              onChange={(e) => handlePermissionChange('contatos', 'editar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Editar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.contatos.excluir}
                              onChange={(e) => handlePermissionChange('contatos', 'excluir', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Excluir</span>
                          </label>
                        </div>
                      </div>

                      {/* Usuários Permissions */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-medium text-slate-900 mb-3">Usuários</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.usuarios?.ver || false}
                              onChange={(e) => handlePermissionChange('usuarios', 'ver', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Visualizar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.usuarios?.criar || false}
                              onChange={(e) => handlePermissionChange('usuarios', 'criar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Criar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.usuarios?.editar || false}
                              onChange={(e) => handlePermissionChange('usuarios', 'editar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Editar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.usuarios?.excluir || false}
                              onChange={(e) => handlePermissionChange('usuarios', 'excluir', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Excluir</span>
                          </label>
                        </div>
                      </div>

                      {/* Templates Permissions */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-medium text-slate-900 mb-3">Templates de Ofício</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.templates?.ver || false}
                              onChange={(e) => handlePermissionChange('templates', 'ver', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Visualizar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.templates?.criar || false}
                              onChange={(e) => handlePermissionChange('templates', 'criar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Criar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.templates?.editar || false}
                              onChange={(e) => handlePermissionChange('templates', 'editar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Editar</span>
                          </label>
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.templates?.excluir || false}
                              onChange={(e) => handlePermissionChange('templates', 'excluir', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Excluir</span>
                          </label>
                        </div>
                      </div>

                      {/* Configurações Permissions */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="font-medium text-slate-900 mb-3">Configurações do Sistema</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={formData.permissions.configuracoes.acessar}
                              onChange={(e) => handlePermissionChange('configuracoes', 'acessar', e.target.checked)}
                              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                            />
                            <span className="text-sm text-slate-700">Acessar e modificar configurações globais</span>
                          </label>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-slate-200">
                    <button 
                      type="button"
                      onClick={() => {
                        setView('list');
                        setActiveMenuId(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors mr-3"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Papel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>

        {/* Context Menu */}
        {activeMenuId && menuPosition && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setActiveMenuId(null)}
            />
            <div 
              className="fixed z-50 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-in fade-in zoom-in-95"
              style={{ 
                top: Math.min(menuPosition.y, window.innerHeight - 100), 
                left: Math.min(menuPosition.x - 180, window.innerWidth - 200) 
              }}
            >
              <button
                onClick={handleEditRole}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Papel
              </button>
            </div>
          </>
        )}

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
