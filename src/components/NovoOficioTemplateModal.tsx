import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface NovoOficioTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (content: string) => void;
}

export function NovoOficioTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate
}: NovoOficioTemplateModalProps) {
  const [templateSearch, setTemplateSearch] = useState('');
  const templates = useAppStore(state => state.templates);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">Selecionar Template</h3>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Input
              type="text"
              icon={<Search className="w-5 h-5" />}
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              placeholder="Buscar templates por título..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {templates
              .filter((t: any) => t.title.toLowerCase().includes(templateSearch.toLowerCase()))
              .map((template: any) => (
                <div 
                  key={template.id}
                  className="border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors cursor-pointer group"
                  onClick={() => onSelectTemplate(template.content)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{template.title}</h4>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      Usar este
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{template.content}</p>
                </div>
              ))}
            {templates.filter((t: any) => t.title.toLowerCase().includes(templateSearch.toLowerCase())).length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 text-sm">Nenhum template encontrado com "{templateSearch}".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
