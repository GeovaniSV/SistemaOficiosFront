export interface RejectionInfo {
  reason: string;
  date: string;
  author: string;
  type: string;
}

export type OficioType = 'interno' | 'recebido';

export interface Oficio {
  id: string; // System number
  type?: OficioType;
  subject: string;
  department: string;
  author: string;
  date: string;
  time: string;
  status: string;
  destinatarios: string[]; // For internal: who receives it. For external: maybe not used, but kept for compat
  rejectionInfo?: RejectionInfo;
  conteudo?: string;
  // External oficio fields
  externalNumber?: string;
  sender?: string; // Quem mandou
  description?: string;
  fileData?: string; // Base64 of PDF
  fileName?: string;
}

export interface Destinatario {
  id: string;
  name: string;
  subArea: string;
  responsibleName: string;
  type: string;
}
