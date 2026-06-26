import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Key, FileCheck } from "lucide-react";
import { OficioType } from "../types/oficio";
import { DocumentHeader, DocumentFooter } from "./DocumentTemplate";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useReviewOficio, useSendOficio } from "../hooks/queries/useOficios";
import { toast } from "react-toastify";

interface OficioEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  oficio: OficioType | null;
  onApprove: (
    id: string,
    sendViaEmail: boolean,
    passwordOrToken?: string,
  ) => void;
  onReject: (id: string, reason: string, type: "devolver" | "rejeitar") => void;
}

export const PRIORITY_STYLES: Record<string, string> = {
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  MEDIUM: "bg-emerald-50 text-emerald-700 border-emerald-200",
  LOW: "bg-slate-100 text-slate-700 border-slate-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
};

const hashPriority: Record<string, string> = {
  HIGH: "Alta",
  MEDIUM: "Normal",
  LOW: "Baixa",
  URGENT: "Urgente",
};

export function OficioEvaluationModal({
  isOpen,
  onClose,
  oficio,
  onApprove,
  onReject,
}: OficioEvaluationModalProps) {
  const [evaluationAction, setEvaluationAction] = useState<
    "approve" | "reject"
  >("approve");
  const [rejectType, setRejectType] = useState<"devolver" | "rejeitar">(
    "devolver",
  );
  const [destinationContact, setDestinationContact] = useState<any>();
  const [authStep, setAuthStep] = useState<"password" | "token">("password");
  const [authPassword, setAuthPassword] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [sendViaEmail, setSendViaEmail] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const reviewOficio = useReviewOficio();
  const sendOficio = useSendOficio();

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setEvaluationAction("approve");
      setRejectType("devolver");
      setAuthStep("password");
      setAuthPassword("");
      setAuthToken("");
      setSendViaEmail(false);
      setRejectionReason("");
      setDestinationContact(oficio?.destination_contact);
    }
  }, [isOpen, oficio]);

  if (!isOpen || !oficio) return null;

  const responsible = oficio.responsibles.find((r) => {
    return r.contact_id === oficio.destination_contact_id;
  });

  const destination = Array.isArray(oficio.destination_contact)
    ? oficio.destination_contact.find((d) => {
        return d.id === oficio.destination_contact_id;
      })
    : oficio.destination_contact;

  const handleApprove = async () => {
    const payload = {
      id: Number(oficio.id),
      payload: {
        status: "APPROVED",
        subject: oficio.subject,
        priority: oficio.priority,
        content: oficio.content,
        department: oficio.department,
      },
    };
    await reviewOficio.mutateAsync(payload);

    if (sendViaEmail) {
      await sendOficio.mutateAsync({ id: Number(oficio.id!) });
    }
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason) {
      toast.error("Falha no login. Verifique suas credenciais.");
      return;
    }
    const payload = {
      id: Number(oficio.id),
      payload: {
        status: "REJECTED",
        subject: oficio.subject,
        priority: oficio.priority,
        content: oficio.content,
        department: oficio.department,
        reason: rejectionReason,
      },
    };
    reviewOficio.mutateAsync(payload);
    onClose();
  };

  return (
    <>
      {/* Evaluation Drawer Backdrop / Document Preview */}
      <div className="fixed inset-0 z-50 right-0 bg-slate-100/95 backdrop-blur-sm animate-in fade-in duration-200 flex">
        {/* Left side: Document Preview */}
        <div
          className="flex-1 documento overflow-y-auto  p-4 sm:p-8 flex flex-col items-center"
          onClick={onClose}
        >
          {/* Informações Separadas */}
          <div
            className="bg-white rounded-xl shadow-md border border-slate-200 w-full max-w-3xl p-6 mb-6 cursor-default mt-4 sm:mt-8 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Informações do Ofício
            </h3>
            <div className="grid grid-cols-4">
              <div className="">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                  Destinatários
                </p>
                <div className="flex flex-wrap gap-2">
                  {responsible ? (
                    <span
                      key={responsible.id}
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {responsible.name}
                      <br></br>({destination?.name})
                    </span>
                  ) : destination ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {destination.name}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-500">
                      Nenhum destinatário
                    </span>
                  )}
                </div>
              </div>

              <div className="">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Criado por
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {oficio.author.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Prioridade
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[oficio.priority]}`}
                >
                  {hashPriority[oficio.priority]}
                </span>
              </div>

              <div className="">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Data
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {new Date(oficio.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

          {/* Documento (Igual ao Visualizar) */}
          <div
            className="bg-white border border-slate-200 shadow-xl max-w-3xl w-[794px] h-[1123px] p-10 flex flex-col cursor-default mb-12 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <DocumentHeader />

            {/* Content */}
            <div className="flex flex-col flex-1">
              <div className="text-right mb-8">
                <p className="text-slate-700 font-medium">{oficio.number}</p>
                <p className="text-slate-500">
                  {new Date(oficio.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="mb-8">
                <p className="font-bold text-slate-900">
                  Assunto: {oficio.subject}
                </p>
              </div>
              <div className="mb-8">
                <p>{responsible?.treatment}</p>
                <p className="font-bold text-slate-900">
                  {responsible?.position} {responsible?.name} (
                  {destination?.type === "PJ" && destination.name})
                </p>
              </div>
              <div className="space-y-4 text-slate-700 text-justify leading-relaxed flex-1">
                {oficio.content}
              </div>
              <div className="mt-16 text-center ">
                <p className="font-bold text-slate-900">{oficio.author.name}</p>
                <p className="text-slate-500">{oficio.author.position_id}</p>
              </div>
            </div>

            <DocumentFooter />
          </div>
        </div>

        {/* Evaluation Drawer */}
        <div className="w-full max-w-md bg-white shadow-2xl sm:rounded-l-2xl flex flex-col animate-in slide-in-from-right duration-300 shrink-0">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 sm:rounded-tl-2xl">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Avaliação de Ofício
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">{oficio.number}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-900 mb-1">
                Assunto do Documento
              </h4>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {oficio.subject}
              </p>
            </div>

            {/* Action Selector (Tabs) */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
              <button
                onClick={() => setEvaluationAction("approve")}
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
                  evaluationAction === "approve"
                    ? "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 mr-2 ${evaluationAction === "approve" ? "text-emerald-500" : "text-slate-400"}`}
                />
                Aprovar
              </button>
              <button
                onClick={() => setEvaluationAction("reject")}
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
                  evaluationAction === "reject"
                    ? "bg-white text-red-700 shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <X
                  className={`w-4 h-4 mr-2 ${evaluationAction === "reject" ? "text-red-500" : "text-slate-400"}`}
                />
                Rejeitar
              </button>
            </div>

            {/* Forms */}
            {evaluationAction === "approve" ? (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-emerald-900 mb-1">
                        Assinatura Digital
                      </h4>
                      <p className="text-sm text-emerald-700"></p>
                    </div>
                  </div>
                </div>

                {authStep === "password" ? (
                  <div className="space-y-4">
                    <label className="flex items-center mt-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendViaEmail}
                        onChange={(e) => setSendViaEmail(e.target.checked)}
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-slate-600">
                        Enviar ofício por e-mail após aprovação
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-medium text-slate-700">
                          Token de Autenticação{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <button
                          onClick={() => setAuthStep("password")}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Voltar para Senha
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">
                        Insira o código de 6 dígitos gerado pelo seu aplicativo
                        autenticador.
                      </p>
                      <Input
                        type="text"
                        value={authToken}
                        onChange={(e) =>
                          setAuthToken(
                            e.target.value.replace(/\D/g, "").slice(0, 6),
                          )
                        }
                        className="text-center tracking-[0.5em] text-lg font-mono py-3"
                        placeholder="000000"
                        maxLength={6}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex space-x-4 mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rejectType"
                      value="devolver"
                      checked={rejectType === "devolver"}
                      onChange={() => setRejectType("devolver")}
                      className="w-4 h-4 text-amber-600 border-slate-300 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700">
                      Devolver para Ajustes
                    </span>
                  </label>
                </div>

                <div
                  className={`border rounded-xl p-4 mb-6 ${rejectType === "devolver" ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100"}`}
                >
                  <p
                    className={`text-sm ${rejectType === "devolver" ? "text-amber-800" : "text-red-800"}`}
                  >
                    {rejectType === "devolver"
                      ? "O ofício será devolvido ao autor para que ele faça os ajustes necessários."
                      : "O ofício será rejeitado definitivamente e não poderá ser editado. A justificativa ficará registrada no histórico."}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Motivo / Justificativa{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={5}
                    className={`w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 resize-none ${rejectType === "devolver" ? "focus:ring-amber-500/20 focus:border-amber-500" : "focus:ring-red-500/20 focus:border-red-500"}`}
                    placeholder="Descreva detalhadamente o motivo..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 bg-slate-50 sm:rounded-bl-2xl">
            <div className="flex space-x-3">
              <Button variant="secondary" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              {evaluationAction === "approve" ? (
                <Button
                  onClick={handleApprove}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Assinar e Aprovar
                </Button>
              ) : (
                <Button
                  onClick={handleReject}
                  className={`flex-1 ${rejectType === "devolver" ? "bg-amber-600 hover:bg-amber-700" : "bg-red-600 hover:bg-red-700"}`}
                  disabled={!rejectionReason}
                >
                  {rejectType === "devolver"
                    ? "Devolver Ofício"
                    : "Rejeitar Ofício"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
