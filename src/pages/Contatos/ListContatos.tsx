import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContatos } from "../../hooks/queries/useContatos";
import { ContatoType } from "@/src/types/contato";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Search,
  User,
} from "lucide-react";
import { Input } from "@/src/components/ui/Input";

function ContatosListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: contatos = [], isLoading, isError, error } = useContatos();
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const filteredContatos = contatos.filter((contato: ContatoType) =>
    contato.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredContatos.length / itemsPerPage);
  const paginatedContatos = filteredContatos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  console.log(contatos);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleEditContact = (contato: number) => {
    const foundContato = contatos.find((c: ContatoType) => c.id === contato);
    if (foundContato) {
      setActiveMenuId(null);
      navigate(`/contatos/${contato}`);
    }
  };

  return (
    <>
      {" "}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Contatos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie os contatos para envio de ofícios.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            className="cursor-pointer"
            onClick={() => navigate("/contatos/criar")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <Input
              icon={<Search className="w-4 h-4" />}
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {!isError ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Nome</th>
                  <th className="px-6 py-4 font-medium">Tipo</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedContatos.map((contato: ContatoType) => (
                  <tr
                    key={contato.id}
                    className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${activeMenuId === contato.id ? "bg-emerald-50/50" : ""}`}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuPosition({ x: e.clientX, y: rect.bottom });
                      setActiveMenuId(contato.id!);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {contato.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={contato.type === "PJ" ? "info" : "secondary"}
                      >
                        {contato.type === "PJ" ? (
                          <Building2 className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <User className="w-3.5 h-3.5 mr-1" />
                        )}
                        {contato.type === "PJ"
                          ? "Pessoa Jurídica"
                          : "Pessoa Física"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          contato.is_active !== false ? "success" : "secondary"
                        }
                      >
                        {contato.is_active !== false ? "Ativo" : "Inativo"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {paginatedContatos.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-8 text-center text-slate-500"
                    >
                      Nenhum contato encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <tr>
            <td colSpan={5} className="px-6 py-8 text-center text-rose-500">
              <p className="inline-flex items-center gap-2">
                <AlertTriangle size={18} />
                {(error as any)?.response?.status === 403
                  ? "Você não tem permissão para visualizar os contatos."
                  : "Erro ao carregar papéis da API."}
              </p>
            </td>
          </tr>
        )}

        {/* Pagination */}
        {filteredContatos.length > itemsPerPage && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
            <span className="text-sm text-slate-500 text-center sm:text-left">
              Mostrando{" "}
              <span className="font-medium text-slate-900">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              a{" "}
              <span className="font-medium text-slate-900">
                {Math.min(currentPage * itemsPerPage, filteredContatos.length)}
              </span>{" "}
              de{" "}
              <span className="font-medium text-slate-900">
                {filteredContatos.length}
              </span>{" "}
              resultados
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </Button>
              <span className="text-sm font-medium text-slate-700 px-2">
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
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </div>
        )}

        {activeMenuId && menuPosition && (
          <>
            <div
              className="fixed inset-0 z-40 bg-slate-900/20 sm:bg-transparent transition-opacity"
              onClick={() => setActiveMenuId(null)}
            />

            {/* Desktop Context Menu */}
            <div
              className="hidden sm:block fixed z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[180px] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
              style={{
                top: Math.min(menuPosition.y, window.innerHeight - 150),
                left: Math.min(menuPosition.x, window.innerWidth - 200),
              }}
            >
              <div className="flex flex-col">
                <button
                  onClick={() => handleEditContact(activeMenuId)}
                  className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors w-full text-left"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Editar Contato
                </button>
              </div>
            </div>

            {/* Mobile Bottom Sheet Context Menu */}
            <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 pb-safe animate-in slide-in-from-bottom-full duration-200">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4" />
              <div className="px-4 pb-6">
                {(() => {
                  const activeContact = contatos.find(
                    (c: ContatoType) => c.id === activeMenuId,
                  );
                  if (!activeContact) return null;

                  return (
                    <div className="flex flex-col space-y-2">
                      <div className="mb-2 px-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Opções do Contato
                        </p>
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {activeContact.name}
                        </p>
                      </div>

                      <button
                        onClick={() => handleEditContact(activeContact)}
                        className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors w-full text-left"
                      >
                        <Edit className="w-5 h-5 mr-3 text-slate-400" />
                        Editar Contato
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default ContatosListPage;
