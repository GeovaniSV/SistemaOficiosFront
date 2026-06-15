import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Save,
  Edit,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { Select } from "./ui/Select";
import { UsuarioDeleteModal } from "./UsuarioDeleteModal";
import {
  useUsuarios,
  useCreateUsuario,
  useUpdateUsuario,
  useDesativarUsuario,
  useReativarUsuario,
  Usuario,
} from "../hooks/useUsuarios";

interface UsuarioForm {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  role: string;
  password: string;
}

const FORM_VAZIO: UsuarioForm = {
  name: "",
  email: "",
  cpf: "",
  role: "Usuário Padrão",
  password: "",
};

export default function Usuarios() {
  const navigate = useNavigate();

  // UI
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [view, setView] = useState<"list" | "form">("list");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  // Form
  const [formData, setFormData] = useState<UsuarioForm>(FORM_VAZIO);
  const [isExistingUser, setIsExistingUser] = useState(false);

  // Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Usuario | null>(null);

  // Hooks react-query
  const { data: usuarios = [], isLoading } = useUsuarios();
  const createUsuario = useCreateUsuario();
  const updateUsuario = useUpdateUsuario();
  const desativarUsuario = useDesativarUsuario();
  const reativarUsuario = useReativarUsuario();

  const saving = createUsuario.isPending || updateUsuario.isPending;

  // Filtro local
  const usuariosFiltrados = usuarios.filter((user) => {
    const bateNome = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const bateEmail = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const bateStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Ativo" && user.is_active) ||
      (statusFilter === "Inativo" && !user.is_active);
    return (bateNome || bateEmail) && bateStatus;
  });

  // Paginação local
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(usuariosFiltrados.length / itemsPerPage);
  const paginatedUsuarios = usuariosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const abrirNovoUsuario = () => {
    setFormData(FORM_VAZIO);
    setIsExistingUser(false);
    setView("form");
    setActiveMenuId(null);
  };

  const abrirEdicao = () => {
    const user = usuarios.find((u) => u.id === activeMenuId);
    if (!user) return;
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      cpf: user.cpf || "",
      role: user.roles?.[0]?.name || "Usuário Padrão",
      password: "",
    });
    setIsExistingUser(true);
    setView("form");
    setActiveMenuId(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isExistingUser && formData.id) {
        await updateUsuario.mutateAsync({
          id: formData.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          ...(formData.password ? { password: formData.password } : {}),
        });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        if (!formData.password) {
          toast.error("A senha é obrigatória para novos usuários.");
          return;
        }
        await createUsuario.mutateAsync({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          role: formData.role,
          password: formData.password,
        });
        toast.success("Usuário criado com sucesso!");
      }
      setView("list");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao salvar usuário.");
    }
  };

  const abrirModalDesativar = (user: Usuario) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const handleConfirmarDesativar = async () => {
    if (!userToDelete) return;
    try {
      await desativarUsuario.mutateAsync(userToDelete.id);
      toast.success("Usuário desativado com sucesso!");
    } catch {
      toast.error("Erro ao desativar usuário.");
    } finally {
      setUserToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleToggleStatus = (user: Usuario) => {
    if (user.is_active) {
      abrirModalDesativar(user);
    } else {
      reativarUsuario.mutateAsync(user.id)
        .then(() => toast.success("Usuário reativado com sucesso!"))
        .catch(() => toast.error("Erro ao reativar usuário."));
      setActiveMenuId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex" onClick={() => setActiveMenuId(null)}>
      <Sidebar
        currentView="usuarios"
        onNavigate={(v) => navigate(`/${v}`)}
        onLogout={() => navigate("/login")}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onNavigate={(v) => navigate(`/${v}`)}
        />

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">

          {/* Lista */}
          {view === "list" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Usuários</h1>
                  <p className="text-sm text-slate-500 mt-1">Gerencie os usuários ativos e inativos do sistema.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button onClick={abrirNovoUsuario}>
                    <Plus className="w-4 h-4 mr-2" /> Novo Usuário
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <Input
                      icon={<Search className="w-4 h-4" />}
                      placeholder="Buscar por nome ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="Todos">Todos os Status</option>
                      <option value="Ativo">Ativos</option>
                      <option value="Inativo">Inativos</option>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                      <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                  ) : (
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 font-medium">Usuário</th>
                          <th className="px-6 py-4 font-medium">Papel</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium">Último Acesso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {paginatedUsuarios.map((user) => (
                          <tr
                            key={user.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === user.id ? null : user.id);
                              setMenuPosition({ x: e.clientX, y: e.clientY });
                            }}
                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${activeMenuId === user.id ? "bg-slate-50" : ""}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-medium text-slate-900">{user.name}</span>
                                <span className="text-slate-500 text-xs mt-0.5">{user.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{user.roles?.[0]?.name || "—"}</td>
                            <td className="px-6 py-4">
                              <Badge variant={user.is_active ? "success" : "secondary"}>
                                {user.is_active
                                  ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ativo</>
                                  : <><XCircle className="w-3.5 h-3.5 mr-1" /> Inativo</>
                                }
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                              {user.last_login
                                ? new Date(user.last_login).toLocaleDateString("pt-BR")
                                : "Nunca"}
                            </td>
                          </tr>
                        ))}
                        {paginatedUsuarios.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                              Nenhum usuário encontrado.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                    <span className="text-sm text-slate-500">Total: {usuariosFiltrados.length} usuários</span>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="icon" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                      </Button>
                      <span className="text-sm font-medium text-slate-700 mx-2">Página {currentPage} de {totalPages}</span>
                      <Button variant="secondary" size="icon" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Formulário */}
          {view === "form" && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-slate-200 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setView("list")} className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-lg font-bold text-slate-900">
                  {isExistingUser ? "Editar Usuário" : "Novo Usuário"}
                </h2>
              </div>

              <form onSubmit={handleSalvar} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nome Completo <span className="text-rose-500">*</span>
                    </label>
                    <Input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      E-mail <span className="text-rose-500">*</span>
                    </label>
                    <Input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                    <Input
                      type="text"
                      disabled={isExistingUser}
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                    />
                    {isExistingUser && <p className="text-xs text-slate-500 mt-1">O CPF não pode ser alterado após o cadastro.</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Papel <span className="text-rose-500">*</span>
                    </label>
                    <Select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                      <option value="Administrador">Administrador</option>
                      <option value="Usuário Padrão">Usuário Padrão</option>
                      <option value="Visualizador">Visualizador</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Senha{" "}
                      {!isExistingUser
                        ? <span className="text-rose-500">*</span>
                        : <span className="text-slate-400 font-normal">(deixe em branco para não alterar)</span>
                      }
                    </label>
                    <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" minLength={8} />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isExistingUser ? "Atualizar Usuário" : "Criar Usuário"}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Menu de contexto */}
      {activeMenuId && menuPosition && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/20 sm:bg-transparent" onClick={() => setActiveMenuId(null)} />
          <div
            className="hidden sm:block fixed z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[180px] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={{ top: Math.min(menuPosition.y, window.innerHeight - 150), left: Math.min(menuPosition.x, window.innerWidth - 200) }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={abrirEdicao} className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors w-full text-left">
              <Edit className="w-4 h-4 mr-3" /> Editar Usuário
            </button>
            {(() => {
              const user = usuarios.find((u) => u.id === activeMenuId);
              if (!user) return null;
              return user.is_active ? (
                <button onClick={() => abrirModalDesativar(user)} className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition-colors w-full text-left">
                  <XCircle className="w-4 h-4 mr-3" /> Desativar
                </button>
              ) : (
                <button onClick={() => handleToggleStatus(user)} className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors w-full text-left">
                  <CheckCircle2 className="w-4 h-4 mr-3" /> Reativar
                </button>
              );
            })()}
          </div>
        </>
      )}

      {/* Modal desativar */}
      <UsuarioDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setUserToDelete(null); }}
        onConfirm={handleConfirmarDesativar}
        title="Desativar Usuário"
        description={`Tem certeza que deseja desativar "${userToDelete?.name}"? O usuário perderá acesso ao sistema, mas poderá ser reativado depois.`}
      />
    </div>
  );
}
