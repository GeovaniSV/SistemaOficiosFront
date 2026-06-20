import React from "react";
import { User } from "lucide-react";
import { Modal } from "./ui/Modal";
import { OficioType, RejectionType } from "../types/oficio";
import { useOficio } from "../hooks/queries/useOficios";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";

interface OficioInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  oficio: OficioType | null;
}

export function OficioInfoModal({
  isOpen,
  onClose,
  oficio,
}: OficioInfoModalProps) {
  const navigate = useNavigate();
  const { data: oficioSecond, isLoading } = useOficio(Number(oficio?.id), {
    enabled: !!oficio?.id,
  });
  if (!oficio || oficio.status !== "REJECTED") return null;

  // const handleEdit = () => {
  //   onClose();
  //   navigate(`/oficios/${oficio.id}`);
  // };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Informações da Rejeição">
      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
            Ofício
          </h4>
          <p className="text-sm font-medium text-slate-900">
            {oficio.id} - {oficio.subject}
          </p>
        </div>
        {isLoading ? (
          <>
            <div>Carregando...</div>
          </>
        ) : (
          oficioSecond!.rejection_infos!.REJECTED!.map(
            (rejection: RejectionType) => (
              <React.Fragment key={rejection.id}>
                <div className="grid grid-cols-2 gap-4" key={rejection.id}>
                  <div>
                    <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Rejeitado por
                    </h4>
                    <p className="text-sm text-slate-900 flex items-center">
                      <User className="w-4 h-4 mr-1.5 text-slate-400" />
                      {rejection.author.name || "Sistema"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Data e Hora
                    </h4>
                    <p className="text-sm text-slate-900">
                      {new Date(rejection.created_at).toLocaleDateString(
                        "pt-BR",
                      )}{" "}
                      {new Date(rejection.created_at).toLocaleTimeString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Motivo
                  </h4>
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm whitespace-pre-wrap leading-relaxed">
                    {rejection.reason}
                  </div>
                </div>
              </React.Fragment>
            ),
          )
        )}
        <div className="pt-2 flex gap-5">
          {/* <Button className="w-full" onClick={handleEdit}>
            Editar
          </Button> */}

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
