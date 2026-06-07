import React, { SetStateAction } from 'react';
import { Eye, Info, Download, Edit2, FileCheck } from 'lucide-react';
import { Oficio } from '../types/oficio';

interface OficiosContextMenuProps {
  activeMenuId: string | null;
  menuPosition: { x: number, y: number } | null;
  setActiveMenuId: (id: string | null) => void;
  getOficioById: (id: string) => Oficio | undefined;
  setPreviewOficio: (oficio: Oficio) => void;
  setInfoOficio: (oficio: Oficio) => void;
  setEvaluatingOficio: (oficio: Oficio) => void;
  setToastMessage: (msg: string) => void;
  onNavigate: (view: string) => void;
}

export function OficiosContextMenu({
  activeMenuId,
  menuPosition,
  setActiveMenuId,
  getOficioById,
  setPreviewOficio,
  setInfoOficio,
  setEvaluatingOficio,
  setToastMessage,
  onNavigate
}: OficiosContextMenuProps) {
  if (!activeMenuId || !menuPosition) return null;

  const activeOficio = getOficioById(activeMenuId);
  if (!activeOficio) return null;

  const showVisualizar = true;
  const showEditar = activeOficio.status === 'Pendente' || activeOficio.status === 'Rascunho' || activeOficio.status === 'Devolvido';
  const showAvaliar = activeOficio.status === 'Pendente';
  const showDownload = activeOficio.status === 'Aprovado';
  const showInformacoes = activeOficio.status === 'Rejeitado' || activeOficio.status === 'Devolvido';

  return (
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
          {showVisualizar && (
            <button
              onClick={() => {
                setPreviewOficio(activeOficio);
                setActiveMenuId(null);
              }}
              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors w-full text-left"
            >
              <Eye className="w-4 h-4 mr-3" />
              Visualizar
            </button>
          )}
          {showInformacoes && (
            <button
              onClick={() => {
                setInfoOficio(activeOficio);
                setActiveMenuId(null);
              }}
              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors w-full text-left"
            >
              <Info className="w-4 h-4 mr-3" />
              Informações
            </button>
          )}
          {showDownload && (
            <button
              onClick={() => {
                setToastMessage(`Download do PDF iniciado para o ofício ${activeOficio.id}`);
                setTimeout(() => setToastMessage(''), 3000);
                setActiveMenuId(null);
              }}
              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors w-full text-left"
            >
              <Download className="w-4 h-4 mr-3" />
              Baixar PDF
            </button>
          )}
          {showEditar && (
            <button
              onClick={() => {
                localStorage.setItem('editOficioId', activeOficio.id);
                if (activeOficio.rejectionInfo) {
                  localStorage.setItem('editOficioRejectionInfo', JSON.stringify(activeOficio.rejectionInfo));
                } else {
                  localStorage.removeItem('editOficioRejectionInfo');
                }
                onNavigate('novoOficio');
                setActiveMenuId(null);
              }}
              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors w-full text-left"
            >
              <Edit2 className="w-4 h-4 mr-3" />
              Editar
            </button>
          )}
          {showAvaliar && (
            <button
              onClick={() => {
                setEvaluatingOficio(activeOficio);
                setActiveMenuId(null);
              }}
              className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors w-full text-left"
            >
              <FileCheck className="w-4 h-4 mr-3" />
              Avaliar
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sheet Context Menu */}
      <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 pb-safe animate-in slide-in-from-bottom-full duration-200">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4" />
        <div className="px-4 pb-6">
          <div className="flex flex-col space-y-2">
            <div className="mb-2 px-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Opções do Ofício</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{activeOficio.id} - {activeOficio.subject}</p>
            </div>
            
            {showVisualizar && (
              <button
                onClick={() => {
                  setPreviewOficio(activeOficio);
                  setActiveMenuId(null);
                }}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-xl active:bg-blue-100 transition-colors w-full"
              >
                <Eye className="w-5 h-5 mr-2" />
                Visualizar Ofício
              </button>
            )}
            {showInformacoes && (
              <button
                onClick={() => {
                  setInfoOficio(activeOficio);
                  setActiveMenuId(null);
                }}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-red-700 bg-red-50 border border-red-100 rounded-xl active:bg-red-100 transition-colors w-full"
              >
                <Info className="w-5 h-5 mr-2" />
                Informações da Rejeição
              </button>
            )}
            {showDownload && (
              <button
                onClick={() => {
                  setToastMessage(`Download do PDF iniciado para o ofício ${activeOficio.id}`);
                  setTimeout(() => setToastMessage(''), 3000);
                  setActiveMenuId(null);
                }}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl active:bg-emerald-100 transition-colors w-full"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar PDF
              </button>
            )}
            {showEditar && (
              <button
                onClick={() => {
                  if (activeOficio.rejectionInfo) {
                    localStorage.setItem('editOficioRejectionInfo', JSON.stringify(activeOficio.rejectionInfo));
                  } else {
                    localStorage.removeItem('editOficioRejectionInfo');
                  }
                  onNavigate('novoOficio');
                  setActiveMenuId(null);
                }}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl active:bg-emerald-100 transition-colors w-full"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Editar Ofício
              </button>
            )}
            {showAvaliar && (
              <button
                onClick={() => {
                  setEvaluatingOficio(activeOficio);
                  setActiveMenuId(null);
                }}
                className="flex items-center justify-center px-4 py-3 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-100 rounded-xl active:bg-amber-100 transition-colors w-full"
              >
                <FileCheck className="w-5 h-5 mr-2" />
                Avaliar Ofício
              </button>
            )}
            <button
              onClick={() => setActiveMenuId(null)}
              className="flex items-center justify-center px-4 py-3 mt-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl active:bg-slate-50 transition-colors w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
