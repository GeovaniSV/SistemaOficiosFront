import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialMockContatos } from '../components/Contatos';
import { oficiosList } from '../data/mockOficios';
import { mockTemplates } from '../data/mockTemplates';
import { Oficio } from '../types/oficio';

const initialMockUsers = [
  { id: 1, name: 'Ana Silva', email: 'ana.silva@exemplo.com', cpf: '111.111.111-11', role: 'Administrador', cargo: 'Presidente', status: 'Ativo', lastLogin: '10 Mar 2026' },
  { id: 2, name: 'Carlos Oliveira', email: 'carlos.o@exemplo.com', cpf: '222.222.222-22', role: 'Usuário', cargo: 'Coordenador(a)', status: 'Ativo', lastLogin: '12 Mar 2026' },
  { id: 3, name: 'Mariana Costa', email: 'mariana.c@exemplo.com', cpf: '333.333.333-33', role: 'Usuário', cargo: 'Secretário(a)', status: 'Inativo', lastLogin: '01 Fev 2026' },
  { id: 4, name: 'Roberto Santos', email: 'roberto.s@exemplo.com', cpf: '444.444.444-44', role: 'Gestor', cargo: 'Vice-Presidente', status: 'Ativo', lastLogin: '11 Mar 2026' },
  { id: 5, name: 'Juliana Lima', email: 'juliana.l@exemplo.com', cpf: '555.555.555-55', role: 'Usuário', cargo: 'Presidente de Comissão', status: 'Ativo', lastLogin: '09 Mar 2026' },
];

const initialMockCargos = [
  { id: 1, name: 'Presidente', description: 'Presidente da organização', status: 'ativo' },
  { id: 2, name: 'Vice-Presidente', description: 'Vice-Presidente da organização', status: 'ativo' },
  { id: 3, name: 'Secretário(a)', description: 'Secretário(a) geral', status: 'ativo' },
  { id: 4, name: 'Coordenador(a)', description: 'Coordenador(a) de área', status: 'ativo' },
  { id: 5, name: 'Presidente de Comissão', description: 'Presidente de comissão específica', status: 'ativo' },
];

const initialMockRoles = [
  { 
    id: 1, 
    name: 'Administrador', 
    description: 'Acesso total ao sistema',
    permissions: {
      oficios: { ver: true, criar: true, editar: true, excluir: true },
      usuarios: { ver: true, criar: true, editar: true, excluir: true },
      contatos: { ver: true, criar: true, editar: true, excluir: true },
      templates: { ver: true, criar: true, editar: true, excluir: true },
      configuracoes: { acessar: true }
    }
  },
  { 
    id: 2, 
    name: 'Usuário Padrão', 
    description: 'Acesso básico para criação e visualização',
    permissions: {
      oficios: { ver: true, criar: true, editar: false, excluir: false },
      usuarios: { ver: false, criar: false, editar: false, excluir: false },
      contatos: { ver: true, criar: true, editar: false, excluir: false },
      templates: { ver: true, criar: false, editar: false, excluir: false },
      configuracoes: { acessar: false }
    }
  },
  { 
    id: 3, 
    name: 'Visualizador', 
    description: 'Apenas visualização de registros',
    permissions: {
      oficios: { ver: true, criar: false, editar: false, excluir: false },
      usuarios: { ver: false, criar: false, editar: false, excluir: false },
      contatos: { ver: true, criar: false, editar: false, excluir: false },
      templates: { ver: true, criar: false, editar: false, excluir: false },
      configuracoes: { acessar: false }
    }
  },
];

interface AppState {
  oficios: Oficio[];
  contatos: any[];
  templates: any[];
  usuarios: any[];
  cargos: any[];
  papeis: any[];

  // Actions
  addOficio: (oficio: Omit<Oficio, 'id' | 'date' | 'time' | 'status'>) => void;
  addOficioRecebido: (oficio: Omit<Oficio, 'id' | 'date' | 'time'>) => void;
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
      oficios: oficiosList,
      contatos: initialMockContatos,
      templates: mockTemplates,
      usuarios: initialMockUsers,
      cargos: initialMockCargos,
      papeis: initialMockRoles,

      addOficio: (oficioData) => set((state) => {
        const dateObj = new Date();
        const newId = `OF-${dateObj.getFullYear()}/${String(state.oficios.length + 1).padStart(3, '0')}`;
        
        const newOficio: Oficio = {
          ...oficioData,
          id: newId,
          status: 'Pendente',
          date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' de ', ' ').replace('.', ''),
          time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };

        return {
          oficios: [newOficio, ...state.oficios]
        };
      }),

      addOficioRecebido: (oficioData) => set((state) => {
        const dateObj = new Date();
        const newId = `REB-${dateObj.getFullYear()}/${String(state.oficios.filter(o => o.type === 'recebido').length + 1).padStart(3, '0')}`;
        
        const newOficio: Oficio = {
          ...oficioData,
          id: newId,
          type: 'recebido',
          date: dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(' de ', ' ').replace('.', ''),
          time: dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };

        return {
          oficios: [newOficio, ...state.oficios]
        };
      }),

      updateOficio: (id, oficioData) => set((state) => ({
        oficios: state.oficios.map(oficio =>
          oficio.id === id ? { ...oficio, ...oficioData, status: 'Pendente' } : oficio
        )
      })),

      updateOficioStatus: (id, status, rejectionInfo) => set((state) => ({
        oficios: state.oficios.map(oficio => 
          oficio.id === id 
            ? { ...oficio, status, rejectionInfo: rejectionInfo || oficio.rejectionInfo }
            : oficio
        )
      })),

      addContato: (contato) => set((state) => ({
        contatos: [...state.contatos, { ...contato, id: Date.now() }]
      })),

      updateContato: (id, updatedContato) => set((state) => ({
        contatos: state.contatos.map(c => c.id === id ? { ...c, ...updatedContato } : c)
      })),

      deleteContato: (id) => set((state) => ({
        contatos: state.contatos.filter(c => c.id !== id)
      })),

      addTemplate: (template) => set((state) => ({
        templates: [...state.templates, { ...template, id: Date.now() }]
      })),

      updateTemplate: (id, updatedTemplate) => set((state) => ({
        templates: state.templates.map(t => t.id === id ? { ...t, ...updatedTemplate } : t)
      })),

      addUsuario: (usuario) => set((state) => ({
        usuarios: [...state.usuarios, { ...usuario, id: Date.now() }]
      })),

      updateUsuario: (id, updatedUsuario) => set((state) => ({
        usuarios: state.usuarios.map(u => u.id === id ? { ...u, ...updatedUsuario } : u)
      })),

      addCargo: (cargo) => set((state) => ({
        cargos: [...state.cargos, { ...cargo, id: Date.now() }]
      })),

      updateCargo: (id, updatedCargo) => set((state) => ({
        cargos: state.cargos.map(c => c.id === id ? { ...c, ...updatedCargo } : c)
      })),

      addPapel: (papel) => set((state) => ({
        papeis: [...state.papeis, { ...papel, id: Date.now() }]
      })),

      updatePapel: (id, updatedPapel) => set((state) => ({
        papeis: state.papeis.map(p => p.id === id ? { ...p, ...updatedPapel } : p)
      })),
    }),
    {
      name: 'app-storage', // key in localStorage
    }
  )
);
