import { useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { OficioType } from "../types/oficio";
import { useDownloadOficioPdf } from "../hooks/queries/useOficios";
import { toast, ToastContainer } from "react-toastify";

interface DownloadPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  oficio: OficioType;
}

export default function DownloadPdfModal({
  isOpen,
  onClose,
  oficio,
}: DownloadPdfModalProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const useDownload = useDownloadOficioPdf();

  if (!oficio) return null;

  const destinatarios = Array.isArray(oficio.destination_contact)
    ? oficio.destination_contact
    : [oficio.destination_contact];
  const handleDownload = async () => {
    try {
      const blob = await useDownload.mutateAsync({ id: oficio.messages[0].id });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `oficio-${oficio.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download iniciado.");
    } catch (error) {
      toast.error("Erro ao baixar o PDF.");
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Selecionar Destinatário"
      maxWidth="max-w-2xl"
    >
      <ToastContainer />
      <div className="space-y-6">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {destinatarios.map((dest: any) => {
            const selected = selectedId === dest.id;

            return (
              <button
                key={dest.id}
                onClick={() => setSelectedId(dest.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{dest.name}</p>

                    <p className="text-sm text-slate-500 mt-1">{dest.type}</p>

                    <p className="text-xs text-slate-400 mt-2">{dest.doc}</p>
                  </div>

                  {selected && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            disabled={!selectedId}
            icon={<Download className="w-4 h-4" />}
            onClick={() => {
              if (!selectedId) return;

              handleDownload();
              // onClose();
            }}
          >
            Baixar PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
}
