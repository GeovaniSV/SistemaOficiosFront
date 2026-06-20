import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  User,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useContato, useUpdateContato } from "../../hooks/queries/useContatos";
import { data, useNavigate, useParams } from "react-router-dom";
import { ContatoType } from "../../types/contato";
import { ContatoResponsibleModal } from "@/src/components/ContatoResponsibleModal";

function ContatosEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: contato, isLoading } = useContato(Number(id));
  const updateContato = useUpdateContato();

  const [formData, setFormData] = useState<ContatoType | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [currentResponsible, setCurrentResponsible] = useState<any>(null);
  const [responsiblePage, setResponsiblePage] = useState(1);
  const responsiblesPerPage = 5;

  useEffect(() => {
    if (contato) {
      setFormData(contato);
    }
  }, [contato]);

  if (!formData) return <div>Carregando...</div>;

  const handleToggleStatus = (id: number) => {
    if (contato) {
      updateContato.mutate({
        ...contato,
        active: contato.active === false ? true : false,
      });
      setToastMessage(
        `Contato ${contato.active === false ? "reativado" : "inativado"} com sucesso.`,
      );
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.name) {
      setToastMessage("O campo Nome Completo é obrigatório.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    if (!formData.responsibles || formData.responsibles.length === 0) {
      setToastMessage("É necessário adicionar pelo menos um responsável.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    updateContato.mutate(formData);
    setToastMessage("Contato salvo com sucesso!");

    navigate("/contatos");

    setTimeout(() => {
      setToastMessage("");
    }, 2000);
  };

  const handleOpenResponsibleModal = (responsible?: any) => {
    if (responsible) {
      setCurrentResponsible(responsible);
    } else {
      setCurrentResponsible({
        id: Date.now(),
        department: "",
        name: "",
        position: "",
        treatment: "",
      });
    }
    setIsResponsibleModalOpen(true);
  };

  const handleDeleteResponsible = (id: number) => {
    const newResponsibles = (formData.responsibles || []).filter(
      (r: any) => r.id !== id,
    );
    setFormData({ ...formData, responsibles: newResponsibles });

    const totalPages = Math.ceil(newResponsibles.length / responsiblesPerPage);
    if (responsiblePage > totalPages && totalPages > 0) {
      setResponsiblePage(totalPages);
    }
  };

  const onSaveResponsibleModal = (responsible: any) => {
    if (
      !responsible.name ||
      !responsible.name ||
      !responsible.treatment ||
      !responsible.treatment ||
      !responsible.position ||
      !responsible.position
    ) {
      setToastMessage(
        "Os campos Nome, Tratamento e Cargo/Posição são obrigatórios.",
      );
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    const existingIndex = (formData.responsibles || []).findIndex(
      (r: any) => r.id === responsible.id,
    );
    let newResponsibles = [...(formData.responsibles || [])];

    if (existingIndex >= 0) {
      newResponsibles[existingIndex] = responsible;
    } else {
      newResponsibles.push(responsible);
    }

    setFormData({ ...formData, responsibles: newResponsibles });
    setIsResponsibleModalOpen(false);
    setToastMessage("Responsável salvo com sucesso!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <main>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/contatos")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-bold text-slate-900"></h2>
          </div>
        </div>

        {!isLoading ? (
          <form onSubmit={handleSaveContact} className="p-6 space-y-8">
            {/* Status and Tipo */}
            <div className="flex flex-col md:flex-row items-start justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 gap-4">
              <div>
                <h4 className="text-sm font-medium text-slate-900">
                  Status do Contato
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define se o contato está disponível para uso
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.active !== false}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:bg-emerald-400"></div>
                <span className="ml-3 text-sm font-medium text-slate-700">
                  {formData.active !== false ? "Ativo" : "Inativo"}
                </span>
              </label>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">
                Dados Gerais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {formData.type === "PJ" ? "CNPJ" : "CPF"}
                  </label>
                  <Input
                    type="text"
                    value={formData.doc}
                    onChange={(e) =>
                      setFormData({ ...formData, doc: e.target.value })
                    }
                    placeholder={
                      formData.type === "PJ"
                        ? "00.000.000/0001-00"
                        : "000.000.000-00"
                    }
                  />
                </div>

                <div className="md:col-span-8">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {formData.type === "PJ" ? "Razão Social" : "Nome Completo"}{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">
                Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CEP
                  </label>
                  <Input
                    type="text"
                    value={formData.address.cep || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, cep: e.target.value },
                      })
                    }
                    placeholder="00000-000"
                  />
                </div>
                <div className="md:col-span-7">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Logradouro
                  </label>
                  <Input
                    type="text"
                    value={formData.address.logradouro || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          logradouro: e.target.value,
                        },
                      })
                    }
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Número
                  </label>
                  <Input
                    type="text"
                    value={formData.address.numero || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          numero: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bairro
                  </label>
                  <Input
                    type="text"
                    value={formData.address.bairro || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          bairro: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cidade
                  </label>
                  <Input
                    type="text"
                    value={formData.address.cidade || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          cidade: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Estado
                  </label>
                  <Input
                    type="text"
                    value={formData.address.estado || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          estado: e.target.value,
                        },
                      })
                    }
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            {/* Responsáveis */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Responsáveis
                </h3>
                <button
                  type="button"
                  onClick={() => handleOpenResponsibleModal()}
                  className="inline-flex items-center px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-medium rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Adicionar Responsável
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-medium">Tratamento</th>
                        <th className="px-4 py-3 font-medium">Nome</th>
                        <th className="px-4 py-3 font-medium">E-mail</th>
                        <th className="px-4 py-3 font-medium">Cargo</th>
                        <th className="px-4 py-3 font-medium">Departamento</th>
                        <th className="px-4 py-3 font-medium text-right">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {(formData.responsibles || [])
                        .slice(
                          (responsiblePage - 1) * responsiblesPerPage,
                          responsiblePage * responsiblesPerPage,
                        )
                        .map((resp: any) => (
                          <tr
                            key={resp.id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-4 py-3 text-slate-600">
                              {resp.treatment || "-"}
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {resp.name}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {resp.email || "-"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {resp.position || "-"}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {resp.department || "-"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => handleOpenResponsibleModal(resp)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors mr-1"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteResponsible(resp.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      {(!formData.responsibles ||
                        formData.responsibles.length === 0) && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-slate-500"
                          >
                            Nenhum responsável adicionado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {formData.responsibles &&
                  formData.responsibles.length > responsiblesPerPage && (
                    <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                      <span className="text-xs text-slate-500">
                        Mostrando{" "}
                        {(responsiblePage - 1) * responsiblesPerPage + 1} a{" "}
                        {Math.min(
                          responsiblePage * responsiblesPerPage,
                          formData.responsibles.length,
                        )}{" "}
                        de {formData.responsibles.length}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            setResponsiblePage(Math.max(1, responsiblePage - 1))
                          }
                          disabled={responsiblePage === 1}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setResponsiblePage(
                              Math.min(
                                Math.ceil(
                                  formData.responsibles.length /
                                    responsiblesPerPage,
                                ),
                                responsiblePage + 1,
                              ),
                            )
                          }
                          disabled={
                            responsiblePage ===
                            Math.ceil(
                              formData.responsibles.length /
                                responsiblesPerPage,
                            )
                          }
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Salvar Contato
              </Button>
            </div>
          </form>
        ) : (
          <div>Carregando...</div>
        )}

        {/* Modal de Responsável */}
        <ContatoResponsibleModal
          isOpen={isResponsibleModalOpen}
          onClose={() => setIsResponsibleModalOpen(false)}
          responsible={currentResponsible}
          onSave={onSaveResponsibleModal}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" />
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default ContatosEditPage;
