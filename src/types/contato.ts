export type ContatoType = {
  id?: number;
  name: string;
  type: string;
  doc: string;
  address: {
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  responsibles: {
    id?: number;
    name: string;
    email: string;
    position: string;
    department: string;
    treatment?: string;
  }[];
  is_active: boolean;
};
