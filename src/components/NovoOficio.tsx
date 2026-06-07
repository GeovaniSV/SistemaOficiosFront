import React, { useState } from 'react';
import { ArrowLeft, Save, Send, Paperclip, Info, Search, Plus, Building2, User, X, FileText, Eye, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { DocumentHeader, DocumentFooter } from './DocumentTemplate';
import { useAppStore } from '../store/useAppStore';
import { RecipientSelector } from './RecipientSelector';
import { NovoOficioTemplateModal } from './NovoOficioTemplateModal';
import { NovoOficioPreviewModal } from './NovoOficioPreviewModal';
import { OficioEditor } from './OficioEditor';

export default function NovoOficio({ 
  onLogout, 
  onNavigate 
}: { 
  onLogout: () => void;
  onNavigate: (view: string) => void;
}) {
  const [destinatarioSearch, setDestinatarioSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDestinatarios, setSelectedDestinatarios] = useState<any[]>([]);
  const [selectedResponsibleIds, setSelectedResponsibleIds] = useState<string[]>([]);
  const [expandedRecipientId, setExpandedRecipientId] = useState<number | null>(null);
  const [conteudo, setConteudo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [rejectionInfo, setRejectionInfo] = useState<any>(null);

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const contatos = useAppStore(state => state.contatos);
  const addOficio = useAppStore(state => state.addOficio);
  const updateOficio = useAppStore(state => state.updateOficio);
  const globalOficios = useAppStore(state => state.oficios);

  React.useEffect(() => {
    const editId = localStorage.getItem('editOficioId');
    if (editId) {
      const existingOficio = globalOficios.find(o => o.id === editId);
      if (existingOficio) {
        setAssunto(existingOficio.subject || '');
        setConteudo(existingOficio.conteudo || '');
        
        // Reconstruct selectedDestinatarios based on existingOficio.destinatarios strings
        if (existingOficio.destinatarios && existingOficio.destinatarios.length > 0) {
          const matchedDestinatarios = existingOficio.destinatarios.map(destName => {
             return contatos.find(c => c.name === destName);
          }).filter(Boolean);
          
          if (matchedDestinatarios.length > 0) {
            setSelectedDestinatarios(matchedDestinatarios);

            // Also select first responsible of each if any exists
            const respIds: string[] = [];
            matchedDestinatarios.forEach(dest => {
               if (dest.responsibles && dest.responsibles.length > 0) {
                  respIds.push(dest.responsibles[0].id.toString());
               }
            });
            setSelectedResponsibleIds(respIds);
          }
        }
      }
    }

    const info = localStorage.getItem('editOficioRejectionInfo');
    if (info) {
      try {
        setRejectionInfo(JSON.parse(info));
      } catch (e) {
        console.error('Failed to parse rejection info', e);
      }
    }
  }, []);

  const handleSubmit = () => {
    if (selectedDestinatarios.length === 0) {
      setToastType('error');
      setToastMessage('Por favor, selecione pelo menos um destinatário.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    if (selectedResponsibleIds.length === 0) {
      setToastType('error');
      setToastMessage('Por favor, selecione pelo menos um responsável.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    if (!assunto.trim()) {
      setToastType('error');
      setToastMessage('Por favor, preencha o assunto.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    if (!conteudo.trim()) {
      setToastType('error');
      setToastMessage('Por favor, preencha o conteúdo do ofício.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    
    setToastType('success');
    setToastMessage('Ofício submetido à aprovação com sucesso!');
    
    const editId = localStorage.getItem('editOficioId');
    const oficioData = {
      subject: assunto,
      conteudo: conteudo,
      department: 'Seu Departamento', // Can be dynamic later
      author: 'Seu Nome / Autor',
      destinatarios: selectedDestinatarios.map(d => d.name)
    };

    if (editId) {
      updateOficio(editId, oficioData);
      localStorage.removeItem('editOficioId');
    } else {
      // Create actual item in store
      addOficio(oficioData);
    }

    localStorage.removeItem('editOficioRejectionInfo');
    setTimeout(() => {
      setToastMessage('');
      onNavigate('oficios');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentView="oficios" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <button 
                  onClick={() => {
                    localStorage.removeItem('editOficioRejectionInfo');
                    onNavigate('oficios');
                  }}
                  className="mr-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Criar Novo Ofício</h1>
                  <p className="text-sm text-slate-500 mt-1">Preencha os dados abaixo para redigir o documento.</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center space-x-3">
                <Button 
                  variant="secondary"
                  onClick={() => {
                    localStorage.removeItem('editOficioRejectionInfo');
                    onNavigate('oficios');
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="outline"
                  icon={<Save className="w-4 h-4" />}
                >
                  Salvar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  icon={<Send className="w-4 h-4" />}
                >
                  Submeter
                </Button>
              </div>
            </div>

            {/* Form Content */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8 space-y-8">
                
                {/* Rejection Info Alert */}
                {rejectionInfo && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
                    <div className="flex items-start">
                      <Info className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-orange-800 mb-1">
                          Ofício Devolvido para Ajustes
                        </h3>
                        <p className="text-sm text-orange-700 mb-3">
                          Este ofício foi devolvido por <strong>{rejectionInfo.author}</strong> em {rejectionInfo.date}. Por favor, faça as correções necessárias e submeta novamente.
                        </p>
                        <div className="bg-white/60 rounded-lg p-3 border border-orange-100">
                          <p className="text-xs font-semibold text-orange-800 uppercase tracking-wider mb-1">Motivo da Devolução:</p>
                          <p className="text-sm text-orange-900 whitespace-pre-wrap">{rejectionInfo.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Alert */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    O número do ofício será gerado automaticamente após sua aprovação.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="assunto">
                      Assunto <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      id="assunto"
                      type="text"
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      placeholder="Ex: Solicitação de Equipamentos de TI"
                    />
                  </div>

                  <RecipientSelector 
                    destinatarioSearch={destinatarioSearch}
                    setDestinatarioSearch={setDestinatarioSearch}
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                    selectedDestinatarios={selectedDestinatarios}
                    setSelectedDestinatarios={setSelectedDestinatarios}
                    selectedResponsibleIds={selectedResponsibleIds}
                    setSelectedResponsibleIds={setSelectedResponsibleIds}
                    expandedRecipientId={expandedRecipientId}
                    setExpandedRecipientId={setExpandedRecipientId}
                    initialMockContatos={contatos}
                  />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="prioridade">
                      Prioridade <span className="text-rose-500">*</span>
                    </label>
                    <Select
                      id="prioridade"
                      required
                    >
                      <option value="normal">Normal</option>
                      <option value="baixa">Baixa</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </Select>
                  </div>

                  <OficioEditor 
                    conteudo={conteudo}
                    setConteudo={setConteudo}
                    onPreviewOpen={() => setIsPreviewModalOpen(true)}
                    onTemplateOpen={() => setIsTemplateModalOpen(true)}
                  />

                </div>
              </div>
              
              {/* Mobile Actions (Visible only on small screens) */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 sm:hidden flex flex-col space-y-3">
                <Button 
                  onClick={handleSubmit}
                  className="w-full justify-center"
                  icon={<Send className="w-4 h-4" />}
                >
                  Submeter
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-center"
                  icon={<Save className="w-4 h-4" />}
                >
                  Salvar
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => onNavigate('oficios')}
                  className="w-full justify-center"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Template Selection Modal */}
      <NovoOficioTemplateModal 
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(content) => {
          setConteudo(content);
          setIsTemplateModalOpen(false);
        }}
      />

      {/* Preview Modal */}
      <NovoOficioPreviewModal 
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        selectedResponsibleIds={selectedResponsibleIds}
        selectedDestinatarios={selectedDestinatarios}
        assunto={assunto}
        conteudo={conteudo}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5 ${
          toastType === 'success' ? 'bg-slate-900' : 'bg-rose-600'
        }`}>
          {toastType === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" />
          ) : (
            <Info className="w-5 h-5 text-white mr-3" />
          )}
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
