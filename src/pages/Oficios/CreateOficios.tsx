import { ChangeEventHandler, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContatos } from "@/src/hooks/queries/useContatos";
import { useAddOficio, useUpdateOficio } from "@/src/hooks/queries/useOficios";
import { ArrowLeft, Save, Send, Info, CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { RecipientSelector } from "@/src/components/RecipientSelector";
import { Select } from "@/src/components/ui/Select";
import { OficioEditor } from "@/src/components/OficioEditor";
import { NovoOficioPreviewModal } from "@/src/components/NovoOficioPreviewModal";
import { NovoOficioTemplateModal } from "@/src/components/NovoOficioTemplateModal";

const PriorityHash: Record<string, string> = {
  normal: "MEDIUM",
  baixa: "LOW",
  alta: "HIGH",
  urgente: "URGENT",
};

function CreateOficios() {
  const navigate = useNavigate();
  const [destinatarioSearch, setDestinatarioSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDestinatarios, setSelectedDestinatarios] = useState<any[]>([]);
  const [selectedResponsibleIds, setSelectedResponsibleIds] = useState<
    string[]
  >([]);
  const [expandedRecipientId, setExpandedRecipientId] = useState<number | null>(
    null,
  );
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    priority: "normal",
    content: "",
    destination_contact_id: "",
    responsible_ids: [] as string[],
  });

  const addOficio = useAddOficio();

  console.log("Destinatários: ", selectedDestinatarios);
  // console.log("Responsibles: ", selectedResponsibleIds);

  const [rejectionInfo, setRejectionInfo] = useState<any>(null);

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const { data: contatos = [], isLoading } = useContatos();

  const handleSubmit = () => {
    console.log(formData.priority);
    const payload = {
      ...formData,
      content: content,
      responsible_ids: selectedResponsibleIds,
      destination_contact_id: selectedDestinatarios[0]?.id,
      priority: PriorityHash[formData.priority],
    };

    if (!payload.destination_contact_id) {
      setToastType("error");
      setToastMessage("Por favor, selecione pelo menos um destinatário.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    if (!payload.responsible_ids) {
      setToastType("error");
      setToastMessage("Por favor, selecione pelo menos um responsável.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    if (!payload.subject) {
      setToastType("error");
      setToastMessage("Por favor, preencha o assunto.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }
    if (!payload.content.trim()) {
      setToastType("error");
      setToastMessage("Por favor, preencha o conteúdo do ofício.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    // if (!formData.department.trim()) {
    //   setToastType("error");
    //   setToastMessage("Por favor, selecione um contato do destinatário.");
    //   setTimeout(() => setToastMessage(""), 3000);
    //   return;
    // }

    setToastType("success");
    setToastMessage("Ofício submetido à aprovação com sucesso!");

    console.log(payload);
    addOficio.mutate(payload);
    setTimeout(() => {
      setToastMessage("");
      // navigate("/oficios");
    }, 2000);
  };

  return (
    <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => {
                localStorage.removeItem("editOficioRejectionInfo");
                navigate("/oficios");
              }}
              className="mr-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Criar Novo Ofício
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Preencha os dados abaixo para redigir o documento.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                navigate("/oficios");
              }}
            >
              Cancelar
            </Button>
            <Button variant="outline" icon={<Save className="w-4 h-4" />}>
              Salvar
            </Button>
            <Button onClick={handleSubmit} icon={<Send className="w-4 h-4" />}>
              Submeter
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 space-y-8">
            {/* Rejection Info Alert */}
            {rejectionInfo && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-orange-800 mb-1">
                      Ofício Devolvido para Ajustes
                    </h3>
                    <p className="text-sm text-orange-700 mb-3">
                      Este ofício foi devolvido por{" "}
                      <strong>{rejectionInfo.author}</strong> em{" "}
                      {rejectionInfo.date}. Por favor, faça as correções
                      necessárias e submeta novamente.
                    </p>
                    <div className="bg-white/60 rounded-lg p-3 border border-orange-100">
                      <p className="text-xs font-semibold text-orange-800 uppercase tracking-wider mb-1">
                        Motivo da Devolução:
                      </p>
                      <p className="text-sm text-orange-900 whitespace-pre-wrap">
                        {rejectionInfo.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Info Alert */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                O número do ofício será gerado automaticamente após sua
                aprovação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="assunto"
                >
                  Assunto <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="assunto"
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Ex: Solicitação de Equipamentos de TI"
                />
              </div>

              <RecipientSelector
                destinatarioSearch={destinatarioSearch}
                setDestinatarioSearch={setDestinatarioSearch}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                selectedDestinatarios={selectedDestinatarios}
                setSelectedDestinatarios={setSelectedDestinatarios}
                selectedResponsibleIds={selectedResponsibleIds}
                setSelectedResponsibleIds={setSelectedResponsibleIds}
                expandedRecipientId={expandedRecipientId}
                setExpandedRecipientId={setExpandedRecipientId}
                contatos={contatos}
              />

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor="prioridade"
                >
                  Prioridade <span className="text-rose-500">*</span>
                </label>
                <Select
                  id="prioridade"
                  required
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                >
                  <option value="normal">Normal</option>
                  <option value="baixa">Baixa</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </Select>
              </div>

              <OficioEditor
                conteudo={content}
                setConteudo={setContent}
                onPreviewOpen={() => setIsPreviewModalOpen(true)}
                onTemplateOpen={() => setIsTemplateModalOpen(true)}
              />
            </div>
          </div>

          {/* Mobile Actions (Visible only on small screens) */}
          <div className="p-6 bg-slate-50 border-t border-slate-200 sm:hidden flex flex-col space-y-3">
            <Button
              onClick={handleSubmit}
              className="w-full justify-center"
              icon={<Send className="w-4 h-4" />}
            >
              Submeter
            </Button>
            <Button
              variant="outline"
              className="w-full justify-center"
              icon={<Save className="w-4 h-4" />}
            >
              Salvar
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/oficios")}
              className="w-full justify-center"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      <NovoOficioTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={(content) => {
          setContent(content);
          setIsTemplateModalOpen(false);
        }}
      />

      {/* Preview Modal */}
      <NovoOficioPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        selectedResponsibleIds={selectedResponsibleIds}
        selectedDestinatarios={selectedDestinatarios}
        assunto={formData.subject}
        conteudo={content}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5 ${
            toastType === "success" ? "bg-slate-900" : "bg-rose-600"
          }`}
        >
          {toastType === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" />
          ) : (
            <Info className="w-5 h-5 text-white mr-3" />
          )}
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </main>
  );
}

export default CreateOficios;
