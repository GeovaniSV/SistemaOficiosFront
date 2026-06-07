import React, { useState } from 'react';
import { Plus, Search, Edit2, X, Save, FileText, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { useAppStore } from '../store/useAppStore';

export default function Templates({ 
  onLogout, 
  onNavigate 
}: { 
  onLogout: () => void;
  onNavigate: (view: string) => void;
}) {
  const { templates, addTemplate, updateTemplate } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    content: '',
    status: 'ativo'
  });

  const handleNewTemplate = () => {
    setFormData({ id: 0, title: '', content: '', status: 'ativo' });
    setView('form');
  };

  const handleEditTemplate = (template: any) => {
    setFormData({ ...template });
    setView('form');
    setActiveMenuId(null);
  };

  const handleSaveTemplate = () => {
    if (!formData.title.trim() || !formData.content.trim()) return;

    if (formData.id === 0) {
      addTemplate(formData);
      setToastMessage('Template criado com sucesso!');
    } else {
      updateTemplate(formData.id, formData);
      setToastMessage('Template atualizado com sucesso!');
    }

    setTimeout(() => setToastMessage(''), 3000);
    setView('list');
  };

  const filteredTemplates = templates.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex" onClick={() => setActiveMenuId(null)}>
      <Sidebar 
        currentView="templates" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {view === 'list' ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Templates de Ofício</h1>
                  <p className="text-sm text-slate-500 mt-1">Gerencie os modelos de ofício disponíveis para uso.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button onClick={handleNewTemplate} icon={<Plus className="w-4 h-4" />}>
                    Novo Template
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      icon={<Search className="w-4 h-4" />}
                      placeholder="Buscar templates por título..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">Título do Template</th>
                        <th className="px-6 py-4 font-medium">Prévia do Conteúdo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paginatedTemplates.length > 0 ? (
                        paginatedTemplates.map((template) => (
                          <tr 
                            key={template.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === template.id ? null : template.id);
                              setMenuPosition({ x: e.clientX, y: e.clientY });
                            }}
                            className={`hover:bg-slate-50 transition-colors cursor-pointer group ${activeMenuId === template.id ? 'bg-slate-50' : ''}`}
                          >
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {template.title}
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              <span className="line-clamp-1">{template.content}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                            Nenhum template encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredTemplates.length > itemsPerPage && (
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <span className="text-sm text-slate-500">
                      Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredTemplates.length)} de {filteredTemplates.length} registros
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2"
                        icon={<ChevronLeft className="w-5 h-5" />}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="secondary"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2"
                        icon={<ChevronRight className="w-5 h-5" />}
                      />
                    </div>
                  </div>
                )}
              </div>

              {activeMenuId && menuPosition && (
                <div 
                  className="fixed z-50 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-in fade-in zoom-in-95 duration-100"
                  style={{ top: menuPosition.y, left: menuPosition.x }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => handleEditTemplate(templates.find(t => t.id === activeMenuId))}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2 text-slate-400" />
                    Editar Template
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      setView('list');
                      setActiveMenuId(null);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-bold text-slate-900">
                    {formData.id === 0 ? 'Novo Template' : 'Editar Template'}
                  </h2>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveTemplate(); }} className="p-6 space-y-8">
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Status do Template</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Define se o template está disponível para uso</p>
                    </div>
                    <label className={`relative inline-flex items-center ${formData.id === 0 ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.status !== 'inativo'}
                        disabled={formData.id === 0}
                        onChange={(e) => setFormData({...formData, status: e.target.checked ? 'ativo' : 'inativo'})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:bg-emerald-400"></div>
                      <span className="ml-3 text-sm font-medium text-slate-700">
                        {formData.status !== 'inativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Informações do Template</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Nome do Template <span className="text-rose-500">*</span>
                      </label>
                      <Input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Ex: Solicitação de Material"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Conteúdo do Ofício <span className="text-rose-500">*</span></h3>
                    
                    <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center space-x-2 overflow-x-auto">
                        <button type="button" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors" title="Negrito">
                          <span className="font-bold">B</span>
                        </button>
                        <button type="button" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors" title="Itálico">
                          <span className="italic font-serif">I</span>
                        </button>
                        <button type="button" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors" title="Sublinhado">
                          <span className="underline">U</span>
                        </button>
                        <div className="w-px h-4 bg-slate-300 mx-1"></div>
                        <button type="button" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors text-sm" title="Alinhar à Esquerda">
                          Esquerda
                        </button>
                        <button type="button" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors text-sm" title="Centralizar">
                          Centro
                        </button>
                        <button type="button" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors text-sm" title="Alinhar à Direita">
                          Direita
                        </button>
                        <button type="button" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors text-sm" title="Justificar">
                          Justificar
                        </button>
                      </div>
                      <Textarea
                        id="conteudo"
                        rows={16}
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="block w-full px-4 py-3 bg-white text-slate-900 border-0 focus-visible:ring-0 placeholder-slate-400 focus:outline-none sm:text-sm resize-y rounded-t-none"
                        placeholder="Escreva o conteúdo do template aqui..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                    <Button 
                      variant="secondary"
                      onClick={() => setView('list')} 
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                    >
                      Salvar Template
                    </Button>
                  </div>
                </form>
              </div>
          )}
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
