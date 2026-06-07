import React from 'react';
import { Search, Filter, Building2, User, Tag, Layers, CalendarDays } from 'lucide-react';
import { mockDestinatarios } from '../data/mockOficios';
import { UseOficiosFilters } from '../hooks/useOficios';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

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
  setSelectedDestinatario
}: OficiosFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-slate-400 mr-2" />
        <h2 className="text-sm font-semibold text-slate-700">Filtros de Busca</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="space-y-1.5 lg:col-span-2">
          <label className="block text-xs font-medium text-slate-700">Busca Geral</label>
          <div className="relative">
            <Input
              icon={<Search className="w-4 h-4" />}
              type="text"
              value={filters.generalSearch}
              onChange={(e) => setFilters({...filters, generalSearch: e.target.value})}
              placeholder="Buscar por número ou assunto..."
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Destinatário</label>
          <div className="relative">
            <Input
              icon={<Search className="w-4 h-4" />}
              type="text"
              value={selectedDestinatario ? `${selectedDestinatario.responsibleName} (${selectedDestinatario.name})` : destinatarioSearch}
              onChange={(e) => {
                setDestinatarioSearch(e.target.value);
                setSelectedDestinatario(null);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              placeholder="Filtrar por destinatário..."
              autoComplete="off"
            />
            
            {/* Dropdown de Destinatários */}
            {isDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                <ul className="max-h-60 overflow-y-auto py-1">
                  {mockDestinatarios.filter(d => 
                    d.name.toLowerCase().includes(destinatarioSearch.toLowerCase()) || 
                    (d.subArea && d.subArea.toLowerCase().includes(destinatarioSearch.toLowerCase())) ||
                    d.responsibleName.toLowerCase().includes(destinatarioSearch.toLowerCase())
                  ).map((dest: any) => (
                    <li 
                      key={dest.id}
                      onClick={() => {
                        setSelectedDestinatario(dest);
                        setDestinatarioSearch('');
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center">
                        {dest.type === 'PJ' ? (
                          <Building2 className="h-4 w-4 text-slate-400 mr-3 group-hover:text-emerald-500" />
                        ) : (
                          <User className="h-4 w-4 text-slate-400 mr-3 group-hover:text-emerald-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-900">{dest.responsibleName}</p>
                          <p className="text-xs text-slate-500">{dest.name}{dest.subArea ? ` - ${dest.subArea}` : ''}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {dest.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Status</label>
          <Select 
            icon={<Tag className="w-4 h-4" />}
            value={filters.statusFilter}
            onChange={(e) => setFilters({...filters, statusFilter: e.target.value})}
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="enviado">Enviado</option>
            <option value="rascunho">Rascunho</option>
            <option value="devolvido">Devolvido</option>
            <option value="rejeitado">Rejeitado</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Autor</label>
          <div className="relative">
            <Input
              icon={<Search className="w-4 h-4" />}
              type="text"
              value={filters.authorFilter}
              onChange={(e) => setFilters({...filters, authorFilter: e.target.value})}
              placeholder="Buscar por autor..."
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Origem / Tipo</label>
          <Select 
            icon={<Layers className="w-4 h-4" />}
            value={filters.origemFilter || ''}
            onChange={(e) => setFilters({...filters, origemFilter: e.target.value})}
          >
            <option value="">Todas</option>
            <option value="interno">Gerado Interno</option>
            <option value="recebido">Recebido Externo</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-700">Data</label>
          <Input
            type="date"
            value={filters.dateFilter}
            onChange={(e) => setFilters({...filters, dateFilter: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
}
