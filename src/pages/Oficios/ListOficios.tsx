import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  useOficioFilter,
  UseOficiosFilters,
} from "../../hooks/queries/OficiosFilter";
import { OficioPreviewModal } from "../../components/OficioPreviewModal";
import { OficioEvaluationModal } from "../../components/OficioEvaluationModal";
import { OficioInfoModal } from "../../components/OficioInfoModal";
import { OficiosFilters } from "../../components/OficiosFilters";
import { OficiosList } from "../../components/OficiosList";
import { OficiosContextMenu } from "../../components/OficiosContextMenu";
import { CheckCircle2 } from "lucide-react";
import DownloadPdfModal from "@/src/components/DownloadPdfModal";
import { OficioType } from "@/src/types/oficio";

export function ListOficios() {
  const navigate = useNavigate();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadOficio, setDownloadOficio] = useState<any>();
  const [destinatarioSearch, setDestinatarioSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDestinatario, setSelectedDestinatario] = useState<any>(null);
  const [previewOficio, setPreviewOficio] = useState<any>(null);
  const [evaluatingOficio, setEvaluatingOficio] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [infoOficio, setInfoOficio] = useState<any>(null);

  const {
    oficios,
    setOficios,
    updateOficioStatus,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedOficios,
    getOficioById,
  } = useOficioFilter(10);

  const handleClosePreview = () => {
    setPreviewOficio(null);
  };

  return (
    <>
      <OficiosFilters
        filters={filters}
        setFilters={setFilters}
        destinatarioSearch={destinatarioSearch}
        setDestinatarioSearch={setDestinatarioSearch}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        selectedDestinatario={selectedDestinatario}
        setSelectedDestinatario={setSelectedDestinatario}
      />

      <OficiosList
        paginatedOficios={paginatedOficios}
        activeMenuId={activeMenuId}
        setActiveMenuId={setActiveMenuId}
        setMenuPosition={setMenuPosition}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <OficioPreviewModal
        isOpen={!!previewOficio}
        onClose={handleClosePreview}
        oficio={previewOficio}
      />

      <OficiosContextMenu
        setDownloadOficio={setDownloadOficio}
        setIsDownloadModalOpen={setIsDownloadModalOpen}
        activeMenuId={activeMenuId}
        menuPosition={menuPosition}
        setActiveMenuId={setActiveMenuId}
        getOficioById={getOficioById}
        setPreviewOficio={setPreviewOficio}
        setInfoOficio={setInfoOficio}
        setEvaluatingOficio={setEvaluatingOficio}
        setToastMessage={setToastMessage}
      />

      <OficioEvaluationModal
        isOpen={!!evaluatingOficio}
        onClose={() => setEvaluatingOficio(null)}
        oficio={evaluatingOficio}
        onApprove={(id, sendViaEmail) => {
          updateOficioStatus(id, "Aprovado");
          setToastMessage(
            sendViaEmail
              ? `Ofício ${id} assinado, aprovado e enviado por e-mail com sucesso.`
              : `Ofício ${id} assinado e aprovado com sucesso.`,
          );
          setTimeout(() => setToastMessage(""), 3000);
          setEvaluatingOficio(null);
        }}
        onReject={(id, reason, type) => {
          updateOficioStatus(
            id,
            type === "devolver" ? "Devolvido" : "Rejeitado",
            {
              reason: reason,
              date: new Date().toLocaleString("pt-BR"),
              author: "Usuário Atual",
              type: type,
            },
          );
          setToastMessage(
            `Ofício ${id} ${type === "devolver" ? "devolvido" : "rejeitado"} com sucesso.`,
          );
          setTimeout(() => setToastMessage(""), 3000);
          setEvaluatingOficio(null);
        }}
      />

      <DownloadPdfModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        oficio={downloadOficio}
      />

      <OficioInfoModal
        isOpen={infoOficio ? true : false}
        onClose={() => setInfoOficio(null)}
        oficio={infoOficio}
      />

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </>
  );
}

export default ListOficios;
