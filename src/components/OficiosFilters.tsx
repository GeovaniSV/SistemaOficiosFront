import React, { useEffect } from "react";
import { Search, Filter, Building2, User, Tag, Plus } from "lucide-react";
import { UseOficiosFilters } from "../hooks/queries/OficiosFilter";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { useContatos } from "../hooks/queries/useContatos";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";

interface OficiosFiltersProps {
  filters: UseOficiosFilters;
  setFilters: (filters: UseOficiosFilters) => void;
  destinatarioSearch: string;
  setDestinatarioSearch: (search: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  selectedDestinatario: any;
  setSelectedDestinatario: (destinatario: any) => void;
}

export function OficiosFilters({
  filters,
  setFilters,
  destinatarioSearch,
  setDestinatarioSearch,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedDestinatario,
  setSelectedDestinatario,
}: OficiosFiltersProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex">
          {" "}
          <Filter className="w-5 h-5 text-slate-400 mr-2" />
          <h2 className="text-sm font-semibold text-slate-700">
            Filtros de Busca
          </h2>
        </div>

        <Button
          className="cursor-pointer"
          onClick={() => navigate("/oficios/criar")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Ofício
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="space-y-1.5 lg:col-span-2">
          <label className="block text-xs font-medium text-slate-700">
            Busca Geral
          </label>
          <div className="relative">
            <Input
              icon={<Search className="w-4 h-4" />}
              type="text"
              value={filters.generalSearch}
              onChange={(e) =>
                setFilters({ ...filters, generalSearch: e.target.value })
              }
              placeholder="Buscar por número ou assunto..."
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Status
          </label>
          <Select
            icon={<Tag className="w-4 h-4" />}
            value={filters.statusFilter}
            onChange={(e) =>
              setFilters({ ...filters, statusFilter: e.target.value })
            }
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="enviado">Enviado</option>
            <option value="rascunho">Rascunho</option>
            <option value="rejeitado">Rejeitado</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Autor
          </label>
          <div className="relative">
            <Input
              icon={<Search className="w-4 h-4" />}
              type="text"
              value={filters.authorFilter}
              onChange={(e) =>
                setFilters({ ...filters, authorFilter: e.target.value })
              }
              placeholder="Buscar por autor..."
            />
          </div>
        </div>

        {/* <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Origem / Tipo
          </label>
          <Select
            icon={<Layers className="w-4 h-4" />}
            value={filters.origemFilter || ""}
            onChange={(e) =>
              setFilters({ ...filters, origemFilter: e.target.value })
            }
          >
            <option value="">Todas</option>
            <option value="interno">Gerado Interno</option>
            <option value="recebido">Recebido Externo</option>
          </Select>
        </div> */}

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">
            Data
          </label>
          <Input
            type="date"
            value={filters.dateFilter}
            onChange={(e) =>
              setFilters({ ...filters, dateFilter: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default OficiosFilters;
