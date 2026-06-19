export interface Destinatario {
  id: string;
  name: string;
  subArea: string;
  responsibleName: string;
  type: string;
}

export interface OficioType {
  id: string | null;
  number: string;
  author: {
    id: number;
    cpf: string;
    email: string;
    name: string;
    is_active: boolean;
    is_dev: boolean;
    position_id: number;
  };
  author_id: number;
  content: string;
  department: string;
  destination_contact: {
    address_id: number;
    doc: string;
    id: number;
    name: string;
    type: string;
  }[];
  priority: string;
  responsibles: {
    contact_id: number;
    department: string;
    email: string;
    name: string;
    position: string;
    treatment: string;
  }[];
  status: string;
  subject: string;
  created_at: string;
  rejection_infos?: {
    REJECTED?: RejectionType[];
  };
}

export interface PaginatedOficiosType {
  paginatedOficios: {
    id: string | null;
    author: {
      id: number;
      cpf: string;
      email: string;
      name: string;
      is_active: boolean;
      is_dev: boolean;
      position_id: number;
    };
    author_id: number;
    content: string;
    department: string;
    destination_contact: {
      address_id: number;
      doc: string;
      id: number;
      name: string;
      type: string;
    };
    priority: string;
    responsible: {
      contact_id: number;
      department: string;
      email: string;
      name: string;
      position: string;
      treatment: string;
    }[];
    status: string;
    subject: string;
    created_at: string;
  }[];
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  setMenuPosition: (pos: { x: number; y: number }) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export interface RejectionType {
  author: {
    id: number;
    name: string;
    email: string;
    cpf: string;
    position_id: number;
  };
  author_id: number;
  created_at: string;
  id: number;
  oficio_id: number;
  reason: string;
  type: string;
  updated_at: string;
}
