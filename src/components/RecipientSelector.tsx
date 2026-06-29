import React, { useEffect, useState } from "react";
import {
  Search,
  Building2,
  User,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "./ui/Input";

interface Responsible {
  id: number;
  name: string;
  position: string;
  department: string;
  treatment: string;
}

interface RecipientSelectorProps {
  destinatarioSearch: string;
  setDestinatarioSearch: (search: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  selectedDestinatarios: any[];
  setSelectedDestinatarios: React.Dispatch<React.SetStateAction<any[]>>;
  selectedResponsibles: any[];
  setSelectedResponsibles: React.Dispatch<React.SetStateAction<any[]>>;
  expandedRecipientId: number | null;
  setExpandedRecipientId: (id: number | null) => void;
  contatos: any[];
}

export function RecipientSelector({
  destinatarioSearch,
  setDestinatarioSearch,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedDestinatarios,
  setSelectedDestinatarios,
  selectedResponsibles,
  setSelectedResponsibles,
  expandedRecipientId,
  setExpandedRecipientId,
  contatos,
}: RecipientSelectorProps) {
  const [responsibleSearch, setResponsibleSearch] = useState<
    Record<number, string>
  >({});

  return (
    <div className="space-y-4 md:col-span-2">
      <div className="relative">
        <label
          className="text-sm font-medium text-slate-700"
          htmlFor="destinatario"
        >
          Destinatário <span className="text-rose-500">*</span>
        </label>
        <div className="relative mt-2">
          <Input
            id="destinatario"
            type="text"
            icon={<Search className="w-4 h-4 text-slate-400" />}
            value={destinatarioSearch}
            onChange={(e) => {
              setDestinatarioSearch(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            placeholder="Buscar destinatário (PF/PJ)..."
            autoComplete="off"
          />
        </div>

        {/* Dropdown de Destinatários */}
        {isDropdownOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            <ul className="max-h-60 overflow-y-auto py-1">
              {contatos
                .filter(
                  (d) =>
                    d.active !== false &&
                    d.name
                      .toLowerCase()
                      .includes(destinatarioSearch.toLowerCase()) &&
                    !selectedDestinatarios.some(
                      (selected) => selected.id === d.id,
                    ),
                )
                .map((dest) => (
                  <li
                    key={dest.id}
                    onClick={() => {
                      if (
                        !selectedDestinatarios.find((d) => d.id === dest.id)
                      ) {
                        setSelectedDestinatarios((prev) => [...prev, dest]);
                        if (dest.responsibles && dest.responsibles.length > 0) {
                          setSelectedResponsibles((prev) => [
                            ...prev,
                            dest.responsibles[0],
                          ]);
                        }
                      }
                      setDestinatarioSearch("");
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center">
                      {dest.type === "PJ" ? (
                        <Building2 className="h-4 w-4 text-slate-400 mr-3 group-hover:text-emerald-500" />
                      ) : (
                        <User className="h-4 w-4 text-slate-400 mr-3 group-hover:text-emerald-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {dest.name}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {dest.type}
                    </span>
                  </li>
                ))}
              {contatos.filter(
                (d) =>
                  d.active !== false &&
                  d.name
                    .toLowerCase()
                    .includes(destinatarioSearch.toLowerCase()) &&
                  !selectedDestinatarios.some(
                    (selected) => selected.id === d.id,
                  ),
              ).length === 0 && (
                <li className="px-4 py-3 text-sm text-slate-500 text-center">
                  Nenhum destinatário encontrado. Cadastre em Contatos.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Selected Destinatarios */}
      {selectedDestinatarios.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 flex items-center">
              Destinatários Selecionados{" "}
              <span className="text-rose-500 ml-1">*</span>
              <span className="bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-xs ml-2 font-semibold">
                {selectedDestinatarios.length}
              </span>
            </label>
            <button
              type="button"
              onClick={() => {
                setSelectedDestinatarios([]);
                setSelectedResponsibles([]);
              }}
              className="text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors"
            >
              Limpar todos
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar divide-y divide-slate-100">
              {selectedDestinatarios.map((dest) => {
                const isExpanded = expandedRecipientId === dest.id;
                const selectedCount =
                  dest.responsibles?.filter((r: any) =>
                    selectedResponsibles.some(
                      (selected) => selected.id === r.id,
                    ),
                  ).length || 0;

                return (
                  <div key={dest.id} className="flex flex-col">
                    {/* Row Header */}
                    <div
                      className={`flex items-center justify-between p-3 hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? "bg-slate-50" : ""}`}
                      onClick={() =>
                        setExpandedRecipientId(isExpanded ? null : dest.id)
                      }
                    >
                      <div className="flex items-center flex-1 min-w-0 pr-4">
                        {dest.type === "PJ" ? (
                          <Building2 className="h-4 w-4 text-emerald-600 mr-3 flex-shrink-0" />
                        ) : (
                          <User className="h-4 w-4 text-emerald-600 mr-3 flex-shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {dest.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {dest.responsibles && dest.responsibles.length > 0 && (
                          <div className="p-1 text-slate-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDestinatarios((prev) =>
                              prev.filter((d) => d.id !== dest.id),
                            );
                            const respIds =
                              dest.responsibles?.map((r: any) => `${r}`) || [];
                            setSelectedResponsibles((prev) =>
                              prev.filter((id) => !respIds.includes(id)),
                            );
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content (Responsibles) */}
                    {isExpanded &&
                      dest.responsibles &&
                      dest.responsibles.length > 0 && (
                        <div className="px-10 pb-4 pt-3 bg-slate-50 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-slate-500">
                              Responsáveis disponíveis:
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const allResponsibles = dest.responsibles;
                                const allSelected = allResponsibles.every(
                                  (resp: any) =>
                                    selectedResponsibles.some(
                                      (selected) => selected.id === resp.id,
                                    ),
                                );

                                if (allSelected) {
                                  setSelectedResponsibles((prev) =>
                                    prev.filter(
                                      (id) => !allResponsibles.includes(id),
                                    ),
                                  );
                                } else {
                                  setSelectedResponsibles((prev) =>
                                    Array.from(
                                      new Set([...prev, ...allResponsibles]),
                                    ),
                                  );
                                }
                              }}
                              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                              {dest.responsibles.every((r: any) =>
                                selectedResponsibles.includes(
                                  `${dest.id}-${r}`,
                                ),
                              )
                                ? "Desselecionar todos"
                                : "Selecionar todos"}
                            </button>
                          </div>
                          {dest.responsibles.length > 10 && (
                            <div className="mb-3 relative">
                              <Input
                                type="text"
                                icon={
                                  <Search className="w-4 h-4 text-slate-400" />
                                }
                                value={responsibleSearch[dest.id] || ""}
                                onChange={(e) =>
                                  setResponsibleSearch((prev) => ({
                                    ...prev,
                                    [dest.id]: e.target.value,
                                  }))
                                }
                                placeholder="Buscar responsável..."
                              />
                            </div>
                          )}
                          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {dest.responsibles
                              .filter((resp: any) => {
                                const search = (
                                  responsibleSearch[dest.id] || ""
                                ).toLowerCase();
                                if (!search) return true;
                                const searchStr =
                                  `${resp.name || ""} ${resp.department || ""} ${resp.position || ""}`.toLowerCase();
                                return searchStr.includes(search);
                              })
                              .map((resp: any) => (
                                <label
                                  key={resp.id}
                                  className="flex items-start space-x-3 cursor-pointer group/label"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedResponsibles.some(
                                      (selected) => selected.id === resp.id,
                                    )}
                                    onChange={(e) => {
                                      const compositeId = `${resp.id}`;
                                      if (e.target.checked) {
                                        setSelectedResponsibles([resp]);
                                      } else {
                                        setSelectedResponsibles((prev) =>
                                          prev.filter(
                                            (selected) =>
                                              selected.id !== resp.id,
                                          ),
                                        );
                                      }
                                    }}
                                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="text-sm text-slate-700 group-hover/label:text-slate-900 transition-colors">
                                    {resp.department ? (
                                      <span className="font-medium">
                                        {resp.department}
                                      </span>
                                    ) : null}
                                    {resp.department &&
                                    (resp.name || resp.position)
                                      ? " - "
                                      : ""}
                                    {resp.name || resp.position}
                                  </span>
                                </label>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
