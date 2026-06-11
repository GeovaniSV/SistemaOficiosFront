import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Oficio } from "../types/oficio";
import { api } from "../services/api";

interface AppState {
  oficios: Oficio[];
  contatos: any[];
  templates: any[];
  usuarios: any[];
  cargos: any[];
  papeis: any[];

  // Actions
  addOficio: (oficio: Omit<Oficio, "id" | "date" | "time" | "status">) => void;
  addOficioRecebido: (oficio: Omit<Oficio, "id" | "date" | "time">) => void;
  updateOficio: (id: string, oficioData: Partial<Oficio>) => void;
  updateOficioStatus: (id: string, status: string, rejectionInfo?: any) => void;

  addContato: (contato: any) => void;
  deleteContato: (id: number) => void;
  updateContato: (id: number, contato: any) => void;

  addTemplate: (template: any) => void;
  updateTemplate: (id: number, template: any) => void;

  addUsuario: (usuario: any) => void;
  updateUsuario: (id: number, usuario: any) => void;

  addCargo: (cargo: any) => void;
  updateCargo: (id: number, cargo: any) => void;

  addPapel: (papel: any) => void;
  updatePapel: (id: number, papel: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      oficios: [],
      contatos: [],
      templates: [],
      usuarios: [],
      cargos: [],
      papeis: [],

      fetchContatos: async () => {
        const res = await api.get("/api/contatos");
        set({ contatos: res.data });
      },

      fetchTemplates: async () => {
        const res = await api.get("/api/templates");
        set({ templates: res.data });
      },

      addOficio: (oficioData) =>
        set((state) => {
          const dateObj = new Date();
          const newId = `OF-${dateObj.getFullYear()}/${String(state.oficios.length + 1).padStart(3, "0")}`;

          const newOficio: Oficio = {
            ...oficioData,
            id: newId,
            status: "Pendente",
            date: dateObj
              .toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(" de ", " ")
              .replace(".", ""),
            time: dateObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          };

          return {
            oficios: [newOficio, ...state.oficios],
          };
        }),

      addOficioRecebido: (oficioData) =>
        set((state) => {
          const dateObj = new Date();
          const newId = `REB-${dateObj.getFullYear()}/${String(state.oficios.filter((o) => o.type === "recebido").length + 1).padStart(3, "0")}`;

          const newOficio: Oficio = {
            ...oficioData,
            id: newId,
            type: "recebido",
            date: dateObj
              .toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(" de ", " ")
              .replace(".", ""),
            time: dateObj.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
          };

          return {
            oficios: [newOficio, ...state.oficios],
          };
        }),

      updateOficio: (id, oficioData) =>
        set((state) => ({
          oficios: state.oficios.map((oficio) =>
            oficio.id === id
              ? { ...oficio, ...oficioData, status: "Pendente" }
              : oficio,
          ),
        })),

      updateOficioStatus: (id, status, rejectionInfo) =>
        set((state) => ({
          oficios: state.oficios.map((oficio) =>
            oficio.id === id
              ? {
                  ...oficio,
                  status,
                  rejectionInfo: rejectionInfo || oficio.rejectionInfo,
                }
              : oficio,
          ),
        })),

      addContato: (contato) =>
        set((state) => ({
          contatos: [...state.contatos, { ...contato, id: Date.now() }],
        })),

      updateContato: (id, updatedContato) =>
        set((state) => ({
          contatos: state.contatos.map((c) =>
            c.id === id ? { ...c, ...updatedContato } : c,
          ),
        })),

      deleteContato: (id) =>
        set((state) => ({
          contatos: state.contatos.filter((c) => c.id !== id),
        })),

      addTemplate: (template) =>
        set((state) => ({
          templates: [...state.templates, { ...template, id: Date.now() }],
        })),

      updateTemplate: (id, updatedTemplate) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updatedTemplate } : t,
          ),
        })),

      addUsuario: (usuario) =>
        set((state) => ({
          usuarios: [...state.usuarios, { ...usuario, id: Date.now() }],
        })),

      updateUsuario: (id, updatedUsuario) =>
        set((state) => ({
          usuarios: state.usuarios.map((u) =>
            u.id === id ? { ...u, ...updatedUsuario } : u,
          ),
        })),

      addCargo: (cargo) =>
        set((state) => ({
          cargos: [...state.cargos, { ...cargo, id: Date.now() }],
        })),

      updateCargo: (id, updatedCargo) =>
        set((state) => ({
          cargos: state.cargos.map((c) =>
            c.id === id ? { ...c, ...updatedCargo } : c,
          ),
        })),

      addPapel: (papel) =>
        set((state) => ({
          papeis: [...state.papeis, { ...papel, id: Date.now() }],
        })),

      updatePapel: (id, updatedPapel) =>
        set((state) => ({
          papeis: state.papeis.map((p) =>
            p.id === id ? { ...p, ...updatedPapel } : p,
          ),
        })),
    }),
    {
      name: "app-storage", // key in localStorage
    },
  ),
);
