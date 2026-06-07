import React, { useState } from 'react';
import { Search, Plus, ArrowLeft, Save, Edit, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';
import { useAppStore } from '../store/useAppStore';

export default function Cargos({ 
  onLogout, 
  onNavigate 
}: { 
  onLogout: () => void;
  onNavigate: (view: string) => void;
}) {
  const { cargos, addCargo, updateCargo } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isExistingCargo, setIsExistingCargo] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCargos = cargos.filter(cargo => 
    cargo.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cargo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCargos.length / itemsPerPage);
  const paginatedCargos = filteredCargos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleNewCargo = () => {
    setFormData({ name: '', description: '', status: 'ativo' });
    setIsExistingCargo(false);
    setView('form');
    setActiveMenuId(null);
  };

  const handleEditCargo = () => {
    const cargo = cargos.find(c => c.id === activeMenuId);
    if (cargo) {
      setFormData({ ...cargo });
      setIsExistingCargo(true);
      setView('form');
      setActiveMenuId(null);
    }
  };

  const handleSaveCargo = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isExistingCargo) {
      updateCargo(formData.id, formData);
    } else {
      const newCargo = { ...formData };
      addCargo(newCargo);
      const createdCargo = { ...newCargo, id: Date.now() };
      setFormData(createdCargo);
      setIsExistingCargo(true);
    }
    
    setToastMessage('Cargo salvo com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentView="cargos" 
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
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cargos</h1>
                  <p className="text-sm text-slate-500 mt-1">Gerencie os cargos do sistema.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button onClick={handleNewCargo}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Cargo
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <Input 
                      icon={<Search className="w-4 h-4" />}
                      placeholder="Buscar cargos por nome ou descrição..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">Nome</th>
                        <th className="px-6 py-4 font-medium">Descrição</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paginatedCargos.map((cargo) => (
                        <tr 
                          key={cargo.id} 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === cargo.id ? null : cargo.id);
                            setMenuPosition({ x: e.clientX, y: e.clientY });
                          }}
                          className={`hover:bg-slate-50 transition-colors cursor-pointer group ${activeMenuId === cargo.id ? 'bg-slate-50' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{cargo.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{cargo.description}</td>
                          <td className="px-6 py-4">
                            <Badge variant={cargo.status === 'ativo' ? 'success' : 'secondary'}>
                              {cargo.status === 'ativo' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                              )}
                              {cargo.status === 'ativo' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {filteredCargos.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                            Nenhum cargo encontrado com os filtros atuais.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {filteredCargos.length > itemsPerPage && (
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <span className="text-sm text-slate-500">
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredCargos.length)} de {filteredCargos.length} registros
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
                  <h2 className="text-lg font-bold text-slate-900">
                    {isExistingCargo ? 'Editar Cargo' : 'Novo Cargo'}
                  </h2>
                </div>
              </div>

              <form onSubmit={handleSaveCargo} className="p-6 space-y-6">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Status do Cargo</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Define se o cargo está ativo no sistema</p>
                  </div>
                  <label className={`relative inline-flex items-center ${!isExistingCargo ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.status !== 'inativo'}
                      disabled={!isExistingCargo}
                      onChange={(e) => setFormData({...formData, status: e.target.checked ? 'ativo' : 'inativo'})}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:bg-emerald-400"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700">
                      {formData.status !== 'inativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Cargo <span className="text-rose-500">*</span></label>
                    <Input 
                      type="text" 
                      required
                      disabled={isExistingCargo}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: Presidente"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Descrição <span className="text-rose-500">*</span></label>
                    <textarea 
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                      placeholder="Descreva as responsabilidades deste cargo..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Cargo
                  </Button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Context Menu */}
      {activeMenuId && menuPosition && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/20 sm:bg-transparent transition-opacity" onClick={() => setActiveMenuId(null)} />
          
          {/* Desktop Context Menu */}
          <div 
            className="hidden sm:block fixed z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[180px] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={{ 
              top: Math.min(menuPosition.y, window.innerHeight - 150), 
              left: Math.min(menuPosition.x, window.innerWidth - 200) 
            }}
          >
            <div className="flex flex-col">
              <button
                onClick={handleEditCargo}
                className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors w-full text-left"
              >
                <Edit className="w-4 h-4 mr-3" />
                Editar Cargo
              </button>
            </div>
          </div>

          {/* Mobile Bottom Sheet Context Menu */}
          <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 pb-safe animate-in slide-in-from-bottom-full duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4" />
            <div className="px-4 pb-6">
              {(() => {
                const activeCargo = cargos.find(c => c.id === activeMenuId);
                if (!activeCargo) return null;

                return (
                  <div className="flex flex-col space-y-2">
                    <div className="mb-2 px-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Opções do Cargo</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{activeCargo.name}</p>
                    </div>
                    
                    <button
                      onClick={handleEditCargo}
                      className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors w-full text-left"
                    >
                      <Edit className="w-5 h-5 mr-3 text-slate-400" />
                      Editar Cargo
                    </button>
                  </div>
                );
              })()}
            </div>
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
  );
}
