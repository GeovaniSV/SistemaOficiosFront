import React from 'react';
import { Trash2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface UsuarioDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function UsuarioDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Excluir Usuário',
  description = 'Tem certeza que deseja excluir este usuário? Esta ação não poderá ser desfeita.'
}: UsuarioDeleteModalProps) {
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
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Excluir
          </Button>
        </div>
      </div>
    </Modal>
  );
}
