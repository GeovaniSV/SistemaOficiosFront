import React from 'react';
import { User } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Oficio } from '../types/oficio';

interface OficioInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  oficio: Oficio | null;
}

export function OficioInfoModal({ isOpen, onClose, oficio }: OficioInfoModalProps) {
  if (!oficio || oficio.status !== 'Rejeitado') return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Informações da Rejeição">
      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Ofício</h4>
          <p className="text-sm font-medium text-slate-900">{oficio.id} - {oficio.subject}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Rejeitado por</h4>
            <p className="text-sm text-slate-900 flex items-center">
              <User className="w-4 h-4 mr-1.5 text-slate-400" />
              {oficio.rejectionInfo?.author || 'Sistema'}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Data e Hora</h4>
            <p className="text-sm text-slate-900">{oficio.rejectionInfo?.date}</p>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Motivo</h4>
          <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm whitespace-pre-wrap leading-relaxed">
            {oficio.rejectionInfo?.reason}
          </div>
        </div>
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
