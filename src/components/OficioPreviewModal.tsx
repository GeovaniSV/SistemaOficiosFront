import React, { useState } from 'react';
import { ShieldCheck, QrCode } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Oficio } from '../types/oficio';
import { formatOficioNumber } from '../utils/formatters';
import { DocumentHeader, DocumentFooter } from './DocumentTemplate';

interface OficioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  oficio: Oficio | null;
}

export function OficioPreviewModal({ isOpen, onClose, oficio }: OficioPreviewModalProps) {
  const [selectedDestinatarioIndex, setSelectedDestinatarioIndex] = useState(0);

  // Reset index when modal opens with a new oficio
  React.useEffect(() => {
    if (isOpen) {
      setSelectedDestinatarioIndex(0);
    }
  }, [isOpen, oficio]);

  if (!oficio) return null;

  const isRecebido = oficio.type === 'recebido';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isRecebido ? "Visualização de Documento Arquivado" : "Pré-visualização do Ofício"}
      maxWidth="max-w-4xl"
    >
      <div className="bg-slate-50 -mx-6 -mt-6">
        <div className="p-4 sm:p-8 overflow-y-auto">
          {oficio.destinatarios && oficio.destinatarios.length > 1 && !isRecebido && (
            <div className="mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Visualizar versão para o destinatário:
              </label>
              <select
                value={selectedDestinatarioIndex}
                onChange={(e) => setSelectedDestinatarioIndex(Number(e.target.value))}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm transition-colors"
              >
                {oficio.destinatarios.map((dest: string, index: number) => (
                  <option key={index} value={index}>{dest}</option>
                ))}
              </select>
            </div>
          )}
          
          {isRecebido && oficio.fileData ? (
            <div className="bg-white border text-center border-slate-200 shadow-sm aspect-video flex items-center justify-center relative overflow-hidden h-[700px]">
                <object data={oficio.fileData} type="application/pdf" width="100%" height="100%">
                  <p>Parece que o seu navegador não suporta PDFs renderizados inline. <a href={oficio.fileData} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Clique aqui para bater o download</a>.</p>
                </object>
            </div>
          ) : (
            <React.Fragment>
              <div className="bg-white border border-slate-200 shadow-sm min-h-[600px] p-6 sm:p-10 flex flex-col relative w-full max-w-3xl mx-auto">
                {/* Vertical Signature Info */}
                {oficio.status === 'Aprovado' && (
                  <div 
                    className="absolute right-3 top-10 bottom-10 flex items-center justify-center text-[10px] text-slate-400"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    Documento assinado digitalmente por Reginaldo Monteiro de Oliveira, Presidente, em {oficio.date}. Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855. Valide em oficiopro.com.br/validacao com o código: A8F9-B2C4-E7D1-55XQ
                  </div>
                )}
              <DocumentHeader />
              
              {/* Content */}
              <div className="flex-1">
                <div className="text-right mb-8">
                  <p className="text-slate-700 font-medium">{formatOficioNumber(oficio.id)}</p>
                  <p className="text-slate-500">{oficio.date}</p>
                </div>
                <div className="mb-8">
                  <p className="font-bold text-slate-900">Assunto: {oficio.subject}</p>
                </div>
                <div className="space-y-4 text-slate-700 text-justify leading-relaxed">
                  <p>A Sua Excelência o(a) Senhor(a)<br/>
                  <strong>{oficio.destinatarios?.[selectedDestinatarioIndex] || 'Destinatário não informado'}</strong></p>
                  <p>Prezado(a) Senhor(a),</p>
                  <div dangerouslySetInnerHTML={{ __html: oficio.conteudo ? oficio.conteudo : `
                    <p>Cumprimentando-o cordialmente, sirvo-me do presente para encaminhar as informações referentes ao assunto em epígrafe, conforme solicitado por este departamento de ${oficio.department}.</p>
                    <p>Ressaltamos que o conteúdo completo deste ofício será redigido pelo usuário durante a edição. Esta é apenas uma visualização prévia da estrutura do documento.</p>
                    <p>Sendo o que havia para o momento, renovo protestos de elevada estima e distinta consideração.</p>
                  ` }} />
                </div>
                <div className="mt-16 text-center">
                  <p className="font-bold text-slate-900">{oficio.author}</p>
                  <p className="text-slate-500">{oficio.department}</p>
                </div>
              </div>

              <DocumentFooter />
            </div>

            {/* Signature Page (Only for Approved Documents) */}
            {oficio.status === 'Aprovado' && (
              <div className="bg-white border border-slate-200 shadow-sm min-h-[600px] p-6 sm:p-10 flex flex-col mt-8">
                <div className="border-b-2 border-slate-800 pb-4 mb-8 text-center">
                  <h2 className="text-lg sm:text-xl font-bold uppercase">PROTOCOLO DE ASSINATURA ELETRÔNICA</h2>
                  <p className="text-xs sm:text-sm text-slate-500">Documento assinado digitalmente conforme MP nº 2.200-2/2001</p>
                </div>
                
                <div className="flex-1 space-y-8">
                  <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-4">Informações do Documento</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Identificação</p>
                      <p className="font-medium text-slate-900">{formatOficioNumber(oficio.id)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Assunto</p>
                      <p className="font-medium text-slate-900">{oficio.subject}</p>
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <p className="text-slate-500">Código Hash (SHA-256)</p>
                      <p className="font-mono text-xs text-slate-900 break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-4">Signatários</h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-slate-900">Reginaldo Monteiro de Oliveira</p>
                        <p className="text-sm text-slate-600">Presidente</p>
                        <div className="mt-3 space-y-1 text-xs text-slate-500">
                          <p><span className="font-medium">Data/Hora:</span> {oficio.date} às {oficio.time} (Horário de Brasília)</p>
                          <p><span className="font-medium">Autenticação:</span> Senha de Sistema</p>
                        </div>
                      </div>
                      <div className="text-emerald-600 flex flex-row sm:flex-col items-center gap-2 sm:gap-0">
                        <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 sm:mb-1" />
                        <span className="text-xs font-bold uppercase">Assinado</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-4">Verificação de Autenticidade</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    A autenticidade deste documento e de suas assinaturas pode ser verificada acessando o portal de validação através do link abaixo:
                  </p>
                  <div className="mt-4 p-4 bg-slate-100 rounded-lg flex items-center justify-between">
                    <div>
                      <a href="#" className="text-blue-600 hover:underline text-sm font-medium break-all block mb-2">
                        https://oficiopro.com.br/validacao
                      </a>
                      <p className="text-sm text-slate-700">
                        Informe o seguinte código: <span className="font-mono font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-900 tracking-widest ml-1">A8F9-B2C4-E7D1-55XQ</span>
                      </p>
                    </div>
                    <QrCode className="w-12 h-12 text-slate-800 ml-4 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
            )}
            </React.Fragment>
          )}
        </div>
      </div>
    </Modal>
  );
}
