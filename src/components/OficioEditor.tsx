import React from 'react';
import { Eye, FileText } from 'lucide-react';

interface OficioEditorProps {
  conteudo: string;
  setConteudo: (value: string) => void;
  onPreviewOpen: () => void;
  onTemplateOpen: () => void;
}

export function OficioEditor({
  conteudo,
  setConteudo,
  onPreviewOpen,
  onTemplateOpen
}: OficioEditorProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700" htmlFor="conteudo">
          Conteúdo do Ofício <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={onPreviewOpen}
            disabled={!conteudo.trim()}
            className={`text-xs font-medium flex items-center px-2.5 py-1.5 rounded-lg transition-colors ${
              !conteudo.trim() 
                ? 'text-slate-400 bg-slate-100 cursor-not-allowed' 
                : 'text-blue-600 hover:text-blue-700 bg-blue-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Visualizar
          </button>
          <button 
            type="button"
            onClick={onTemplateOpen}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center bg-emerald-50 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            Usar Template
          </button>
        </div>
      </div>
      <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-colors">
        {/* Simple Toolbar Placeholder */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center space-x-2">
          <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded transition-colors font-bold">B</button>
          <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded transition-colors italic">I</button>
          <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded transition-colors underline">U</button>
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded transition-colors text-sm">H1</button>
          <button className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 rounded transition-colors text-sm">H2</button>
        </div>
        <textarea
          id="conteudo"
          rows={12}
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className="block w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 focus:outline-none sm:text-sm resize-y"
          placeholder="Escreva o conteúdo do ofício aqui..."
        ></textarea>
      </div>
    </div>
  );
}
