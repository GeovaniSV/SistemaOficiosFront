import React, { useEffect, useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { DocumentHeader, DocumentFooter } from './DocumentTemplate';

export default function Validacao() {
  const [codigo, setCodigo] = useState('');

  useEffect(() => {
    // Extract code from URL path
    const path = window.location.pathname;
    const match = path.match(/\/validacao\/(.+)/);
    if (match && match[1]) {
      setCodigo(match[1]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Validação de Documento</h1>
        <p className="mt-2 text-slate-600">
          Este é um documento autêntico gerado pelo sistema.
        </p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
          <span className="text-sm text-slate-500 mr-2">Código de Validação:</span>
          <span className="font-mono font-bold text-slate-900">{codigo || 'Carregando...'}</span>
        </div>
      </div>

      {/* Documento */}
      <div className="bg-white border border-slate-200 shadow-xl w-full max-w-3xl min-h-[800px] p-10 flex flex-col">
        <DocumentHeader />
        
        {/* Content */}
        <div className="flex-1">
          <div className="text-right mb-8">
            <p className="text-slate-700 font-medium">OF-2026/010</p>
            <p className="text-slate-500">03 Mar 2026</p>
          </div>
          <div className="mb-8">
            <p className="font-bold text-slate-900">Assunto: Reunião de Alinhamento</p>
          </div>
          <div className="space-y-4 text-slate-700 text-justify leading-relaxed">
            <p>Prezado(a) Senhor(a),</p>
            <p>Cumprimentando-o cordialmente, sirvo-me do presente para encaminhar as informações referentes ao assunto em epígrafe, conforme solicitado por este departamento de Diretoria.</p>
            <p>Ressaltamos que o conteúdo completo deste ofício será redigido pelo usuário durante a edição. Esta é apenas uma visualização prévia da estrutura do documento.</p>
            <p>Sendo o que havia para o momento, renovo protestos de elevada estima e distinta consideração.</p>
          </div>
          <div className="mt-16 text-center">
            <p className="font-bold text-slate-900">João Silva</p>
            <p className="text-slate-500">Diretoria</p>
          </div>

          {/* Assinaturas */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 text-center">Assinaturas Eletrônicas</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start justify-between">
                <div>
                  <p className="font-bold text-slate-900">Reginaldo Monteiro de Oliveira</p>
                  <p className="text-sm text-slate-600">Presidente</p>
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <p><span className="font-medium">Data/Hora:</span> 03 Mar 2026 às 14:00:00 (Horário de Brasília)</p>
                    <p><span className="font-medium">Autenticação:</span> Senha de Sistema</p>
                  </div>
                </div>
                <div className="text-emerald-600 flex flex-col items-center">
                  <ShieldCheck className="w-8 h-8 mb-1" />
                  <span className="text-xs font-bold uppercase">Assinado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DocumentFooter />
      </div>
    </div>
  );
}
