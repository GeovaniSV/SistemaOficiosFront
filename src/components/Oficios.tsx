import React, { useState, useRef, useEffect } from 'react';
import { Plus, CheckCircle2, ChevronDown, FileText, Upload } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/Button';

import { useOficios } from '../hooks/useOficios';
import { useUrlSync } from '../hooks/useUrlSync';
import { OficioPreviewModal } from './OficioPreviewModal';
import { OficioEvaluationModal } from './OficioEvaluationModal';
import { OficioInfoModal } from './OficioInfoModal';
import { OficiosFilters } from './OficiosFilters';
import { OficiosList } from './OficiosList';
import { OficiosContextMenu } from './OficiosContextMenu';

export default function Oficios({ 
  onLogout, 
  onNavigate 
}: { 
  onLogout: () => void;
  onNavigate: (view: string) => void;
}) {
  const [destinatarioSearch, setDestinatarioSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDestinatario, setSelectedDestinatario] = useState<any>(null);

  const {
    oficios,
    setOficios,
    updateOficioStatus,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedOficios,
    getOficioById
  } = useOficios(10);

  const [urlOficioId, setUrlOficioId] = useUrlSync('/oficios/');

  const [previewOficio, setPreviewOficio] = useState<any>(null);
  const [evaluatingOficio, setEvaluatingOficio] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [infoOficio, setInfoOficio] = useState<any>(null);
  
  const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
  const newMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (newMenuRef.current && !newMenuRef.current.contains(event.target as Node)) {
        setIsNewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (urlOficioId) {
      const oficio = getOficioById(urlOficioId);
      if (oficio) {
        setPreviewOficio(oficio);
      }
    }
  }, [urlOficioId, getOficioById]);

  const handleClosePreview = () => {
    setPreviewOficio(null);
    setUrlOficioId(null);
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
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ofícios</h1>
              <p className="text-sm text-slate-500 mt-1">Gerencie, filtre e crie novos ofícios.</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="relative" ref={newMenuRef}>
                <Button 
                  onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Ofício
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isNewMenuOpen ? 'rotate-180' : ''}`} />
                </Button>
                
                {isNewMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        localStorage.removeItem('editOficioId');
                        localStorage.removeItem('editOficioRejectionInfo');
                        onNavigate('novoOficio');
                        setIsNewMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex items-center border-b border-slate-100"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <FileText className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">Criar Ofício Interno</div>
                        <div className="text-xs text-slate-500 mt-0.5">Gerar no sistema</div>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('arquivarOficio');
                        setIsNewMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 transition-colors flex items-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                         <Upload className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">Arquivar Ofício Externo</div>
                        <div className="text-xs text-slate-500 mt-0.5">Recebido de fora (PDF)</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <OficiosFilters
            filters={filters}
            setFilters={setFilters}
            destinatarioSearch={destinatarioSearch}
            setDestinatarioSearch={setDestinatarioSearch}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            selectedDestinatario={selectedDestinatario}
            setSelectedDestinatario={setSelectedDestinatario}
          />

          {/* Table Section */}
          <OficiosList
            paginatedOficios={paginatedOficios}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            setMenuPosition={setMenuPosition}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </main>
      </div>

      {/* Preview Modal */}
      <OficioPreviewModal
        isOpen={!!previewOficio}
        onClose={handleClosePreview}
        oficio={previewOficio}
      />

      {/* Context Menu */}
      <OficiosContextMenu
        activeMenuId={activeMenuId}
        menuPosition={menuPosition}
        setActiveMenuId={setActiveMenuId}
        getOficioById={getOficioById}
        setPreviewOficio={setPreviewOficio}
        setInfoOficio={setInfoOficio}
        setEvaluatingOficio={setEvaluatingOficio}
        setToastMessage={setToastMessage}
        onNavigate={onNavigate}
      />

      {/* OficioEvaluationModal */}
      <OficioEvaluationModal
        isOpen={!!evaluatingOficio}
        onClose={() => setEvaluatingOficio(null)}
        oficio={evaluatingOficio}
        onApprove={(id, sendViaEmail) => {
          updateOficioStatus(id, 'Aprovado');
          setToastMessage(sendViaEmail 
            ? `Ofício ${id} assinado, aprovado e enviado por e-mail com sucesso.`
            : `Ofício ${id} assinado e aprovado com sucesso.`
          );
          setTimeout(() => setToastMessage(''), 3000);
          setEvaluatingOficio(null);
        }}
        onReject={(id, reason, type) => {
          updateOficioStatus(id, type === 'devolver' ? 'Devolvido' : 'Rejeitado', {
            reason: reason,
            date: new Date().toLocaleString('pt-BR'),
            author: 'Usuário Atual',
            type: type
          });
          setToastMessage(`Ofício ${id} ${type === 'devolver' ? 'devolvido' : 'rejeitado'} com sucesso.`);
          setTimeout(() => setToastMessage(''), 3000);
          setEvaluatingOficio(null);
        }}
      />



      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Info Modal */}
      <OficioInfoModal
        isOpen={!!infoOficio}
        onClose={() => setInfoOficio(null)}
        oficio={infoOficio}
      />
    </div>
  );
}
