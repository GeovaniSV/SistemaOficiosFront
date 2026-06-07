import React from 'react';
import { X } from 'lucide-react';
import { DocumentHeader, DocumentFooter } from './DocumentTemplate';

interface NovoOficioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedResponsibleIds: string[];
  selectedDestinatarios: any[];
  assunto: string;
  conteudo: string;
}

export function NovoOficioPreviewModal({
  isOpen,
  onClose,
  selectedResponsibleIds,
  selectedDestinatarios,
  assunto,
  conteudo
}: NovoOficioPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Pré-visualização do Ofício</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
          {selectedResponsibleIds.length > 1 && (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-start">
              <div className="flex-1">
                <p className="font-medium text-sm">Geração em Lote</p>
                <p className="text-sm mt-1">
                  Serão gerados <strong>{selectedResponsibleIds.length} ofícios individuais</strong> (um para cada responsável selecionado). 
                  Abaixo está a prévia do primeiro ofício.
                </p>
              </div>
            </div>
          )}
          
          <div className="bg-white border border-slate-200 shadow-sm min-h-[600px] p-10 flex flex-col">
            <DocumentHeader />
            
            {/* Content */}
            <div className="flex-1">
              <div className="text-right mb-8">
                <p className="text-slate-700 font-medium">Ofício nº [Gerado ao salvar]</p>
                <p className="text-slate-500">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>

              {/* Destinatário */}
              <div className="mb-8">
                {selectedDestinatarios.length > 0 ? (
                  (() => {
                    // Find the first selected responsible
                    let firstDest = null;
                    let firstResp = null;
                    
                    for (const dest of selectedDestinatarios) {
                      const selectedRespsForDest = dest.responsibles?.filter((r: any) => selectedResponsibleIds.includes(`${dest.id}-${r.id}`)) || [];
                      if (selectedRespsForDest.length > 0) {
                        firstDest = dest;
                        firstResp = selectedRespsForDest[0];
                        break;
                      }
                    }

                    if (firstDest && firstResp) {
                      return (
                        <div>
                          <p className="text-slate-900">
                            A {firstDest.name}
                            {firstResp.departamento ? ` - ${firstResp.departamento}` : ''}
                          </p>
                          <p className="font-bold text-slate-900">
                            {firstResp.tratamento ? `${firstResp.tratamento} ` : ''}
                            {firstResp.cargo ? `${firstResp.cargo} ` : ''}
                            {firstResp.nome ? firstResp.nome : ''}
                          </p>
                        </div>
                      );
                    } else if (selectedDestinatarios.length > 0) {
                       // Fallback if no responsibles selected but destinatario is
                       return (
                         <div>
                           <p className="text-slate-900">A {selectedDestinatarios[0].name}</p>
                         </div>
                       );
                    }
                    return null;
                  })()
                ) : (
                  <>
                    <p className="text-slate-900">A Sua Excelência o(a) Senhor(a)</p>
                    <p className="font-bold text-slate-900">[Destinatário não selecionado]</p>
                  </>
                )}
              </div>

              <div className="mb-8">
                <p className="font-bold text-slate-900">Assunto: {assunto || '[Assunto não preenchido]'}</p>
              </div>
              <div className="space-y-4 text-slate-700 text-justify leading-relaxed whitespace-pre-wrap">
                {conteudo || '[Conteúdo não preenchido]'}
              </div>
              <div className="mt-16 text-center">
                <p className="font-bold text-slate-900">Seu Nome / Autor</p>
                <p className="text-slate-500">Seu Departamento</p>
              </div>
            </div>

            <DocumentFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
