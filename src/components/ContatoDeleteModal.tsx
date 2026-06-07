import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from './ui/Modal';

interface ContatoDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function ContatoDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Excluir Contato',
  description = 'Tem certeza que deseja excluir este contato? Esta ação não poderá ser desfeita.'
}: ContatoDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="p-1">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-rose-600" />
        </div>
        <p className="text-sm text-slate-600 mb-6">
          {description}
        </p>
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </Modal>
  );
}
