import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface ContatoResponsibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  responsible: any;
  onSave: (responsible: any) => void;
}

export function ContatoResponsibleModal({ isOpen, onClose, responsible, onSave }: ContatoResponsibleModalProps) {
  const [currentResponsible, setCurrentResponsible] = useState<any>(responsible || {
    id: Date.now(), departamento: '', nome: '', cargo: '', tratamento: '', email: ''
  });

  // Keep in sync with props changes
  React.useEffect(() => {
    if (isOpen) {
      setCurrentResponsible(responsible || { id: Date.now(), departamento: '', nome: '', cargo: '', tratamento: '', email: '' });
    }
  }, [isOpen, responsible]);

  const handleSave = () => {
    onSave(currentResponsible);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {responsible ? 'Editar Responsável' : 'Novo Responsável'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome <span className="text-rose-500">*</span></label>
              <Input 
                type="text" 
                value={currentResponsible.nome || ''}
                onChange={e => setCurrentResponsible({...currentResponsible, nome: e.target.value})}
                placeholder="Nome completo"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <Input 
                type="email" 
                value={currentResponsible.email || ''}
                onChange={e => setCurrentResponsible({...currentResponsible, email: e.target.value})}
                placeholder="E-mail do responsável"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tratamento <span className="text-rose-500">*</span></label>
              <Input 
                type="text" 
                value={currentResponsible.tratamento || ''}
                onChange={e => setCurrentResponsible({...currentResponsible, tratamento: e.target.value})}
                placeholder="Ex: Sr., Sra., Dr."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cargo / Posição <span className="text-rose-500">*</span></label>
              <Input 
                type="text" 
                value={currentResponsible.cargo || ''}
                onChange={e => setCurrentResponsible({...currentResponsible, cargo: e.target.value})}
                placeholder="Ex: Diretor, Gerente"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
              <Input 
                type="text" 
                value={currentResponsible.departamento || ''}
                onChange={e => setCurrentResponsible({...currentResponsible, departamento: e.target.value})}
                placeholder="Ex: Financeiro, RH"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Responsável
          </Button>
        </div>
      </div>
    </div>
  );
}
