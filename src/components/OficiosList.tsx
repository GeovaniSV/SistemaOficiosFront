import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Oficio } from '../types/oficio';
import { formatOficioNumber } from '../utils/formatters';
import { STATUS_DOT_STYLES } from '../constants/oficios';
import { StatusBadge } from './ui/StatusBadge';
import { Button } from './ui/Button';

interface OficiosListProps {
  paginatedOficios: Oficio[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  setMenuPosition: (pos: { x: number, y: number }) => void;
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
  totalPages
}: OficiosListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Número</th>
              <th className="px-6 py-4 font-medium">Origem</th>
              <th className="px-6 py-4 font-medium">Assunto</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">Destinatário / Remetente</th>
              <th className="px-6 py-4 font-medium hidden lg:table-cell">Autor</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">Data</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {paginatedOficios.length > 0 ? (
              paginatedOficios.map((oficio) => (
                <tr 
                  key={oficio.id} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === oficio.id ? null : oficio.id);
                    setMenuPosition({ x: e.clientX, y: e.clientY });
                  }}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer group ${activeMenuId === oficio.id ? 'bg-slate-50' : ''}`}
                >
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 sm:hidden ${STATUS_DOT_STYLES[oficio.status]}`} title={oficio.status}></span>
                      {oficio.type === 'recebido' 
                        ? (oficio.externalNumber ? oficio.externalNumber : oficio.id) 
                        : (oficio.status === 'Aprovado' ? formatOficioNumber(oficio.id) : '-')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {oficio.type === 'recebido' ? (
                      <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Recebido Externo</span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">Gerado Interno</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex flex-col">
                      <span>{oficio.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 hidden md:table-cell">
                    {oficio.type === 'recebido' 
                      ? oficio.sender 
                      : (oficio.destinatarios && oficio.destinatarios.length > 1 
                        ? `${oficio.destinatarios[0]}, ${oficio.destinatarios[1].split(' ')[0]}...` 
                        : (oficio.destinatarios?.[0] || '-'))}
                  </td>
                  <td className="px-6 py-4 text-slate-500 hidden lg:table-cell">{oficio.author}</td>
                  <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span>{oficio.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    {oficio.type === 'recebido' ? (
                      <span className="text-slate-400 font-medium">-</span>
                    ) : (
                      <StatusBadge status={oficio.status} />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
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
            Página <span className="font-medium text-slate-900">{currentPage}</span> de <span className="font-medium text-slate-900">{totalPages}</span>
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
