import { ContatoType } from "../../types/contato";
import { useState } from "react";
import { useAddContato } from "../../hooks/queries/useContatos";
import { Button } from "@/src/components/ui/Button";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Save,
  Trash2,
  User,
} from "lucide-react";
import { Input } from "@/src/components/ui/Input";
import { ContatoResponsibleModal } from "@/src/components/ContatoResponsibleModal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";

function ContatoCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContatoType>({
    id: 0,
    name: "",
    type: "PF",
    doc: "",
    address: {
      cep: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    responsibles: [],
    active: true,
    is_active: true,
  });

  const addContato = useAddContato();

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.doc) {
      formData.type === "PF"
        ? toast.error("Necessário preencher o campo CPF.")
        : toast.error("Necessário preencher o campo CNPJ.");

      return;
    }

    if (!formData.name || !formData.name) {
      formData.type === "PF"
        ? toast.error("Necessário preencher o campo Nome Completo.")
        : toast.error("Necessário preencher o campo Razão Social.");
      return;
    }

    if (!formData.address.cep) {
      toast.error("Necessário preencher o campo CEP.");
      return;
    }

    if (!formData.address.logradouro) {
      toast.error("Necessário preencher o campo Logradouro.");
      return;
    }

    if (!formData.address.numero) {
      toast.error("Necessário preencher o campo Número.");
      return;
    }

    if (!formData.address.bairro) {
      toast.error("Necessário preencher o campo Bairro.");
      return;
    }

    if (!formData.address.cidade) {
      toast.error("Necessário preencher o campo Cidade.");
      return;
    }

    if (!formData.address.estado) {
      toast.error("Necessário preencher o campo Estado.");
      return;
    }

    if (!formData.responsibles || formData.responsibles.length === 0) {
      toast.error("Necessário adicionar pelo menos um responsável.");
      return;
    }

    try {
      await addContato.mutateAsync(formData);
      toast.success("Contato criado com sucesso!");
      // navigate("/contatos");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.errors) {
          const httpErrorHash: Record<string, string> = {
            "The doc has already been taken.":
              formData.type === "PJ"
                ? "CNPJ já registrado"
                : "CPF já registrado",
            "The address.cep field must be 8 characters.":
              "Informe um CEP válido",
            "CNPJ inválido.": "Informe um CNPJ válido",
            "The responsibles.0.email field must be a valid email address.":
              "Informe um email válido para o responsável",
          };
          for (const [errorKey, errors] of Object.entries(
            error.response.data.errors as [string, string[]][],
          )) {
            errors.forEach((err: any) => {
              toast.error(`${errorKey}: ${httpErrorHash[err]}`);
            });
          }
        }
      }
    }
  };

  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [currentResponsible, setCurrentResponsible] = useState<any>(null);
  const [responsiblePage, setResponsiblePage] = useState(1);
  const responsiblesPerPage = 5;

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
      toast.error(
        "Os campos Nome, Tratamento e Cargo/Posição são obrigatórios.",
      );

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
    toast.success("Responsável salvo com sucesso!");
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-bold text-slate-900">Novo Contato</h2>
          </div>
        </div>
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
              <div className="md:col-span-12">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Contato
                </label>
                <div className={`flex p-1 bg-slate-100 rounded-xl w-fit `}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "PF" })}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      formData.type === "PF"
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }  ""}`}
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Pessoa Física (PF)
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "PJ" })}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      formData.type === "PJ"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    } ""}`}
                  >
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Pessoa Jurídica (PJ)
                    </div>
                  </button>
                </div>
              </div>

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
                      address: { ...formData.address, numero: e.target.value },
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
                      address: { ...formData.address, bairro: e.target.value },
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
                      address: { ...formData.address, cidade: e.target.value },
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
                      address: { ...formData.address, estado: e.target.value },
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
                            formData.responsibles.length / responsiblesPerPage,
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
        {/* Modal de Responsável */}
        <ContatoResponsibleModal
          isOpen={isResponsibleModalOpen}
          onClose={() => setIsResponsibleModalOpen(false)}
          responsible={currentResponsible}
          onSave={onSaveResponsibleModal}
        />

        {/* Toast Notification */}
        <ToastContainer />
      </div>
    </>
  );
}

export default ContatoCreatePage;
