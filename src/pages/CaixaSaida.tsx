// src/pages/EmailLogs/EmailLogsPage.tsx
import { useState } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { useWorkerLogs } from "../hooks/queries/useLogs";

const CODE_LABELS: Record<string, { label: string; icon: any }> = {
  EMAIL_SENT: { label: "E-mail enviado", icon: Mail },
  EMAIL_FAILED: { label: "Falha no envio", icon: Mail },
  PDF_UPLOADED: { label: "PDF gerado", icon: FileText },
};

const STATUS_CONFIG: Record<
  number,
  { label: string; classes: string; icon: any }
> = {
  1: {
    label: "Sucesso",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  0: {
    label: "Falhou",
    classes: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

export default function EmailLogsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data, isLoading, refetch, isFetching } = useWorkerLogs(currentPage);

  const logs = data?.data ?? [];
  const totalPages = data?.last_page ?? 1;

  const filteredLogs = logs.filter((log: any) => {
    const matchesSearch =
      search === "" ||
      log.message?.toLowerCase().includes(search.toLowerCase()) ||
      log.correlation_id?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "" || log.status.toString() === statusFilter;
    const matchesCode = codeFilter === "" || log.code === codeFilter;

    return matchesSearch && matchesStatus && matchesCode;
  });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Caixa de Saída
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Acompanhe o histórico de processamento de e-mails e documentos.
            </p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Buscar
            </label>
            <Input
              icon={<Search className="w-4 h-4" />}
              type="text"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              placeholder="Buscar por mensagem ou ID..."
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Tipo de Evento
            </label>
            <Select
              value={codeFilter}
              onChange={(e: any) => setCodeFilter(e.target.value)}
            >
              <option value="">Todos os Eventos</option>
              <option value="EMAIL_SENT">E-mail enviado</option>
              <option value="EMAIL_FAILED">Falha no envio</option>
              <option value="PDF_UPLOADED">PDF gerado</option>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Status
            </label>
            <Select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="1">Sucesso</option>
              <option value="0">Falhou</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-200">
          {/* Cabeçalho */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 text-xs font-medium text-slate-500 uppercase">
            <div className="col-span-1"></div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Evento</div>
            <div className="col-span-4">Code</div>
            <div className="col-span-3">Data/Hora</div>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center text-slate-500">
              Carregando registros...
            </div>
          ) : filteredLogs.length > 0 ? (
            filteredLogs.map((log: any) => {
              const statusConfig =
                STATUS_CONFIG[log.status] ?? STATUS_CONFIG[0];
              const StatusIcon = statusConfig.icon;
              const codeConfig = CODE_LABELS[log.code] ?? {
                label: log.code,
                icon: Mail,
              };
              const EventIcon = codeConfig.icon;
              const isExpanded = expandedId === log.id;

              return (
                <div key={log.id}>
                  {/* Linha clicável */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(log.id)}
                    className="w-full text-left grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 hover:bg-slate-50 transition-colors items-center"
                  >
                    <div className="hidden sm:flex col-span-1 items-center justify-center">
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.classes}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 text-slate-700">
                      <span className="font-medium text-sm">
                        {log.event_type}
                      </span>
                    </div>
                    <div className="col-span-4 text-sm text-slate-600 truncate flex items-center gap-2">
                      {log.status && (
                        <EventIcon className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      {codeConfig.label}
                    </div>
                    <div className="col-span-3 text-sm text-slate-500">
                      {new Date(log.created_at).toLocaleString("pt-BR")}
                    </div>
                  </button>

                  {/* Conteúdo expandido */}
                  {isExpanded && (
                    <div className="px-6 pb-5 pt-1 bg-slate-50/50 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            ID
                          </p>
                          <p className="text-slate-900">{log.id}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Correlation ID
                          </p>
                          <p className="text-slate-900 font-mono text-xs break-all">
                            {log.correlation_id || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Código
                          </p>
                          <p className="text-slate-900 font-mono text-xs">
                            {log.code}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Fila
                          </p>
                          <p className="text-slate-900">{log.queue_name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Usuário
                          </p>
                          <p className="text-slate-900">{log.user_id}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Tentativa
                          </p>
                          <p className="text-slate-900">
                            {log.metadata?.attempt ?? "-"}
                          </p>
                        </div>
                        <div className="sm:col-span-3">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Mensagem
                          </p>
                          <pre className="bg-white border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-700 overflow-x-auto">
                            {JSON.stringify(log.message, null, 2)}
                          </pre>
                        </div>
                        <div className="sm:col-span-3">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                            Metadata Completa
                          </p>
                          <pre className="bg-white border border-slate-200 rounded-lg p-3 text-xs font-mono text-slate-700 overflow-x-auto">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-6 py-12 text-center text-slate-500">
              Nenhum registro encontrado com os filtros selecionados.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
            <span className="text-sm text-slate-500">
              Página{" "}
              <span className="font-medium text-slate-900">{currentPage}</span>{" "}
              de{" "}
              <span className="font-medium text-slate-900">{totalPages}</span>
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
      </div>
    </div>
  );
}
