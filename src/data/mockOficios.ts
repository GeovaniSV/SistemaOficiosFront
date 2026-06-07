import { Oficio, Destinatario } from '../types/oficio';
import { initialMockContatos } from '../components/Contatos';

export const mockDestinatarios: Destinatario[] = initialMockContatos.flatMap(contato => 
  (contato.responsibles || []).map(resp => ({
    id: `${contato.id}-${resp.id}`,
    name: contato.name,
    subArea: resp.departamento,
    responsibleName: resp.nome || resp.cargo,
    type: contato.type
  }))
);

export const oficiosList: Oficio[] = [
  { id: 'OF-2026/001', subject: 'Solicitação de Equipamentos', department: 'TI', author: 'Ana Costa', date: '12 Mar 2026', time: '14:30:00', status: 'Pendente', destinatarios: ['Prefeito João (Prefeitura Municipal)'] },
  { id: 'OF-2026/002', subject: 'Relatório Trimestral', department: 'Financeiro', author: 'Carlos Mendes', date: '11 Mar 2026', time: '09:15:22', status: 'Aprovado', destinatarios: ['Secretária de Educação (Prefeitura Municipal)'] },
  { id: 'OF-2026/003', subject: 'Atualização de Políticas', department: 'RH', author: 'Mariana Silva', date: '10 Mar 2026', time: '16:45:10', status: 'Aprovado', destinatarios: ['Carlos Oliveira (Câmara Municipal)'] },
  { id: 'OF-2026/004', subject: 'Manutenção Predial', department: 'Infraestrutura', author: 'Roberto Alves', date: '09 Mar 2026', time: '11:20:05', status: 'Aprovado', destinatarios: ['Prefeito João (Prefeitura Municipal)', 'Carlos Oliveira (Câmara Municipal)'] },
  { id: 'OF-2026/005', subject: 'Convite para Evento', department: 'Comunicação', author: 'Julia Santos', date: '08 Mar 2026', time: '15:10:30', status: 'Rascunho', destinatarios: ['Camilo Santana (Ministério da Educação (MEC))'] },
  { id: 'OF-2026/006', subject: 'Renovação de Contrato', department: 'Jurídico', author: 'Fernando Lima', date: '07 Mar 2026', time: '10:05:45', status: 'Pendente', destinatarios: ['Dr. João da Silva (Tribunal de Justiça do Estado)'] },
  { id: 'OF-2026/007', subject: 'Aprovação de Orçamento', department: 'Diretoria', author: 'João Silva', date: '06 Mar 2026', time: '13:50:12', status: 'Aprovado', destinatarios: ['Roberto Alves (Dr. Roberto Alves)'] },
  { id: 'OF-2026/008', subject: 'Pedido de Férias', department: 'RH', author: 'Lucas Pereira', date: '05 Mar 2026', time: '08:40:55', status: 'Aprovado', destinatarios: ['Diretor Geral (Hospital das Clínicas)'] },
  { id: 'OF-2026/009', subject: 'Compra de Materiais', department: 'Compras', author: 'Fernanda Lima', date: '04 Mar 2026', time: '10:15:00', status: 'Pendente', destinatarios: ['Reitor(a) (Universidade Federal de São Paulo (UNIFESP))'] },
  { id: 'OF-2026/010', subject: 'Reunião de Alinhamento', department: 'Diretoria', author: 'João Silva', date: '03 Mar 2026', time: '14:00:00', status: 'Aprovado', destinatarios: ['Maria Silva (Profa. Maria Silva)'] },
  { id: 'OF-2026/011', subject: 'Treinamento de Equipe', department: 'RH', author: 'Mariana Silva', date: '02 Mar 2026', time: '09:30:00', status: 'Aprovado', destinatarios: ['Comandante Geral (Polícia Militar do Estado)', 'Cel. Marcos (Polícia Militar do Estado)'] },
  { id: 'OF-2026/012', subject: 'Manutenção de Servidores', department: 'TI', author: 'Ana Costa', date: '01 Mar 2026', time: '23:00:00', status: 'Aprovado', destinatarios: ['Antônio Carlos (Sindicato dos Trabalhadores (SINDITRAB))'] },
];
