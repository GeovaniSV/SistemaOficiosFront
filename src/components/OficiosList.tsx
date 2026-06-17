import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Oficio } from "../types/oficio";
import { formatOficioNumber } from "../utils/formatters";
import { STATUS_DOT_STYLES } from "../constants/oficios";
import { StatusBadge } from "./ui/StatusBadge";
import { Button } from "./ui/Button";

interface OficiosListProps {
  paginatedOficios: {
    id: number | null;
    author: {
      id: number;
      cpf: string;
      email: string;
      name: string;
      is_active: boolean;
      is_dev: boolean;
      position_id: number;
    };
    author_id: number;
    content: string;
    department: string;
    destination_contact: {
      address_id: number;
      doc: string;
      id: number;
      name: string;
      type: string;
    };
    priority: string;
    responsible: {
      contact_id: number;
      department: string;
      email: string;
      name: string;
      position: string;
      treatment: string;
    }[];
    status: string;
    subject: string;
    created_at: string;
  }[];
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
  setMenuPosition: (pos: { x: number; y: number }) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export function OficiosList({
  paginatedOficios,
  activeMenuId,
  setActiveMenuId,
  setMenuPosition,
  currentPage,
  setCurrentPage,
  totalPages,
}: OficiosListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Número</th>
              <th className="px-6 py-4 font-medium">Assunto</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">
                Destinatário / Remetente
              </th>
              <th className="px-6 py-4 font-medium hidden lg:table-cell">
                Autor
              </th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">
                Data
              </th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedOficios.length > 0 ? (
              paginatedOficios.map((oficio) => (
                <tr
                  key={oficio.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(
                      activeMenuId === oficio.id ? null : oficio.id,
                    );
                    setMenuPosition({ x: e.clientX, y: e.clientY });
                  }}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer group ${activeMenuId === oficio.id ? "bg-slate-50" : ""}`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap items-center">
                    <div className="flex items-center  justify-center ">
                      {oficio.id ?? "-"}
                    </div>
                  </td>
                  <td>{oficio.subject}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex flex-col">
                      {oficio.destination_contact.name ?? "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 hidden md:table-cell">
                    {oficio.author.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span>
                        {format(new Date(oficio.created_at), "dd/MM/yyy")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <StatusBadge status={oficio.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  Nenhum ofício encontrado com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
          <span className="text-sm text-slate-500 text-center sm:text-left">
            Página{" "}
            <span className="font-medium text-slate-900">{currentPage}</span> de{" "}
            <span className="font-medium text-slate-900">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </Button>
            <span className="text-sm font-medium text-slate-700 mx-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="secondary"
              size="icon"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
