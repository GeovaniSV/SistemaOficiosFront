import React, { useState } from 'react';
import { Search, Plus, Building2, User, Edit, ArrowLeft, Save, CheckCircle2, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { ContatoResponsibleModal } from './ContatoResponsibleModal';
import { ContatoDeleteModal } from './ContatoDeleteModal';
import { useAppStore } from '../store/useAppStore';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';

export const initialMockContatos = [
  { 
    id: 1, name: 'Prefeitura Municipal', email: 'contato@prefeitura.gov.br', type: 'PJ', phone: '(11) 9999-9999', document: '00.000.000/0001-00', cep: '00000-000', logradouro: 'Praça da Matriz', numero: '1', bairro: 'Centro', cidade: 'São Paulo', estado: 'SP', 
    responsibles: [
      { id: 1, departamento: 'Gabinete do Prefeito', nome: 'Prefeito João', cargo: 'Prefeito', tratamento: 'Excelentíssimo' },
      { id: 2, departamento: 'Secretaria de Saúde', nome: '', cargo: 'Secretário(a) de Saúde', tratamento: 'Ilmo(a)' },
      { id: 3, departamento: 'Secretaria de Educação', nome: 'Maria Santos', cargo: 'Secretária de Educação', tratamento: 'Ilma(a)' }
    ] 
  },
  { 
    id: 2, name: 'Câmara Municipal', email: 'contato@camara.gov.br', type: 'PJ', phone: '(11) 8888-8888', document: '111.222.333-44', cep: '11111-111', logradouro: 'Rua das Flores', numero: '123', bairro: 'Jardim Primavera', cidade: 'Campinas', estado: 'SP', 
    responsibles: [
      { id: 1, departamento: 'Presidência', nome: '', cargo: 'Presidente da Câmara', tratamento: 'Excelentíssimo' },
      { id: 2, departamento: 'Gabinete 01', nome: 'Carlos Oliveira', cargo: 'Vereador', tratamento: 'Ilmo' }
    ] 
  },
  {
    id: 3, name: 'Ministério da Educação (MEC)', email: 'gabinete@mec.gov.br', type: 'PJ', phone: '(61) 2022-8000', document: '00.394.445/0001-85', cep: '70047-900', logradouro: 'Esplanada dos Ministérios', numero: 'Bl L', bairro: 'Zona Cívico-Administrativa', cidade: 'Brasília', estado: 'DF',
    responsibles: [
      { id: 1, departamento: 'Gabinete do Ministro', nome: 'Camilo Santana', cargo: 'Ministro da Educação', tratamento: 'Excelentíssimo Senhor' },
      { id: 2, departamento: 'Secretaria de Educação Superior', nome: '', cargo: 'Secretário de Educação Superior', tratamento: 'Ilustríssimo Senhor' }
    ]
  },
  {
    id: 4, name: 'Tribunal de Justiça do Estado', email: 'presidencia@tjsp.jus.br', type: 'PJ', phone: '(11) 3117-2200', document: '51.174.001/0001-93', cep: '01008-010', logradouro: 'Praça da Sé', numero: 'S/N', bairro: 'Sé', cidade: 'São Paulo', estado: 'SP',
    responsibles: [
      { id: 1, departamento: 'Presidência', nome: '', cargo: 'Desembargador Presidente', tratamento: 'Excelentíssimo Senhor Desembargador' },
      { id: 2, departamento: 'Diretoria do Fórum', nome: 'Dr. João da Silva', cargo: 'Juiz Diretor do Fórum', tratamento: 'Meritíssimo Juiz' }
    ]
  },
  {
    id: 5, name: 'Dr. Roberto Alves', email: 'roberto.alves@advocacia.com.br', type: 'PF', phone: '(11) 98765-4321', document: '123.456.789-00', cep: '01310-100', logradouro: 'Av. Paulista', numero: '1000', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP',
    responsibles: [
      { id: 1, departamento: '', nome: 'Roberto Alves', cargo: 'Advogado', tratamento: 'Doutor' }
    ]
  },
  {
    id: 6, name: 'Hospital das Clínicas', email: 'diretoria@hc.fm.usp.br', type: 'PJ', phone: '(11) 2661-0000', document: '60.444.444/0001-22', cep: '05403-000', logradouro: 'Av. Dr. Enéas Carvalho de Aguiar', numero: '255', bairro: 'Cerqueira César', cidade: 'São Paulo', estado: 'SP',
    responsibles: [
      { id: 1, departamento: 'Diretoria Geral', nome: '', cargo: 'Diretor Geral', tratamento: 'Ilustríssimo Senhor' },
      { id: 2, departamento: 'Unidade de Terapia Intensiva', nome: 'Dra. Ana Paula', cargo: 'Chefe da UTI', tratamento: 'Doutora' }
    ]
  },
  {
    id: 7, name: 'Universidade Federal de São Paulo (UNIFESP)', email: 'reitoria@unifesp.br', type: 'PJ', phone: '(11) 3393-8400', document: '60.453.032/0001-74', cep: '04024-002', logradouro: 'Rua Sena Madureira', numero: '1500', bairro: 'Vila Clementino', cidade: 'São Paulo', estado: 'SP',
    responsibles: [
      { id: 1, departamento: 'Reitoria', nome: '', cargo: 'Reitor(a)', tratamento: 'Magnífico(a) Reitor(a)' },
      { id: 2, departamento: 'Pró-Reitoria de Extensão', nome: '', cargo: 'Pró-Reitor de Extensão', tratamento: 'Ilustríssimo Senhor' }
    ]
  },
  {
    id: 8, name: 'Profa. Maria Silva', email: 'maria.silva@universidade.edu.br', type: 'PF', phone: '(21) 97777-8888', document: '987.654.321-11', cep: '22290-240', logradouro: 'Av. Pasteur', numero: '250', bairro: 'Urca', cidade: 'Rio de Janeiro', estado: 'RJ',
    responsibles: [
      { id: 1, departamento: '', nome: 'Maria Silva', cargo: 'Professora Titular', tratamento: 'Professora Doutora' }
    ]
  },
  {
    id: 9, name: 'Polícia Militar do Estado', email: 'comando@pm.sp.gov.br', type: 'PJ', phone: '(11) 3327-7000', document: '04.266.388/0001-43', cep: '01139-001', logradouro: 'Praça Coronel Fernando Prestes', numero: '115', bairro: 'Bom Retiro', cidade: 'São Paulo', estado: 'SP',
    responsibles: [
      { id: 1, departamento: 'Comando Geral', nome: '', cargo: 'Comandante Geral', tratamento: 'Excelentíssimo Senhor Comandante' },
      { id: 2, departamento: 'Estado Maior', nome: 'Cel. Marcos', cargo: 'Chefe do Estado Maior', tratamento: 'Ilustríssimo Senhor Coronel' }
    ]
  },
  {
    id: 10, name: 'Sindicato dos Trabalhadores (SINDITRAB)', email: 'presidencia@sinditrab.org.br', type: 'PJ', phone: '(31) 3222-1111', document: '17.333.222/0001-55', cep: '30140-071', logradouro: 'Av. Afonso Pena', numero: '1500', bairro: 'Centro', cidade: 'Belo Horizonte', estado: 'MG',
    responsibles: [
      { id: 1, departamento: 'Presidência', nome: 'Antônio Carlos', cargo: 'Presidente', tratamento: 'Senhor' },
      { id: 2, departamento: 'Diretoria Financeira', nome: '', cargo: 'Diretor Financeiro', tratamento: 'Senhor' }
    ]
  },
  {
    id: 11, name: 'Eng. Carlos Eduardo', email: 'carlos.eduardo@engenharia.com', type: 'PF', phone: '(41) 96666-5555', document: '456.789.123-22', cep: '80020-310', logradouro: 'Rua XV de Novembro', numero: '500', bairro: 'Centro', cidade: 'Curitiba', estado: 'PR',
    responsibles: [
      { id: 1, departamento: '', nome: 'Carlos Eduardo', cargo: 'Engenheiro Civil', tratamento: 'Senhor Engenheiro' }
    ]
  },
  {
    id: 12, name: 'Ministério Público Estadual', email: 'pgj@mpsp.mp.br', type: 'PJ', phone: '(11) 3119-9000', document: '01.468.760/0001-90', cep: '01002-040', logradouro: 'Rua Riachuelo', numero: '115', bairro: 'Sé', cidade: 'São Paulo', estado: 'SP',
    responsibles: [
      { id: 1, departamento: 'Procuradoria-Geral de Justiça', nome: '', cargo: 'Procurador-Geral de Justiça', tratamento: 'Excelentíssimo Senhor Procurador-Geral' },
      { id: 2, departamento: 'Promotoria de Justiça Criminal', nome: 'Dra. Beatriz', cargo: 'Promotora de Justiça', tratamento: 'Excelentíssima Senhora Promotora' }
    ]
  },
  {
    id: 13, name: 'Assembleia Legislativa do Estado (ALESP)', email: 'contato@al.sp.gov.br', type: 'PJ', phone: '(11) 3886-6000', document: '45.985.632/0001-08', cep: '04001-900', logradouro: 'Av. Pedro Álvares Cabral', numero: '201', bairro: 'Ibirapuera', cidade: 'São Paulo', estado: 'SP',
    responsibles: Array.from({ length: 25 }, (_, i) => ({
      id: 100 + i,
      departamento: `Gabinete ${String(i + 1).padStart(2, '0')}`,
      nome: `Deputado(a) Estadual ${i + 1}`,
      cargo: 'Deputado(a) Estadual',
      tratamento: 'Excelentíssimo(a) Senhor(a)'
    }))
  }
];

export default function Contatos({ 
  onLogout, 
  onNavigate 
}: { 
  onLogout: () => void;
  onNavigate: (view: string) => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const contatos = useAppStore(state => state.contatos);
  const oficios = useAppStore(state => state.oficios);
  const addContato = useAppStore(state => state.addContato);
  const updateContato = useAppStore(state => state.updateContato);
  
  const [view, setView] = useState<'list' | 'form'>('list');
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number, y: number } | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isExistingContact, setIsExistingContact] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);
  const [currentResponsible, setCurrentResponsible] = useState<any>(null);
  const [responsiblePage, setResponsiblePage] = useState(1);
  const responsiblesPerPage = 5;

  const handleOpenResponsibleModal = (responsible?: any) => {
    if (responsible) {
      setCurrentResponsible(responsible);
    } else {
      setCurrentResponsible({ id: Date.now(), departamento: '', nome: '', cargo: '', tratamento: '' });
    }
    setIsResponsibleModalOpen(true);
  };

  const handleDeleteResponsible = (id: number) => {
    const newResponsibles = (formData.responsibles || []).filter((r: any) => r.id !== id);
    setFormData({ ...formData, responsibles: newResponsibles });
    
    const totalPages = Math.ceil(newResponsibles.length / responsiblesPerPage);
    if (responsiblePage > totalPages && totalPages > 0) {
      setResponsiblePage(totalPages);
    }
  };

  const filteredContatos = contatos.filter(contato => 
    contato.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredContatos.length / itemsPerPage);
  const paginatedContatos = filteredContatos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when searching
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleNewContact = () => {
    setFormData({ 
      name: '', type: 'PF', document: '', 
      cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '',
      responsibles: [], active: true
    });
    setIsExistingContact(false);
    setView('form');
    setActiveMenuId(null);
  };

  const handleEditContact = () => {
    const contato = contatos.find(c => c.id === activeMenuId);
    if (contato) {
      setFormData({ ...contato });
      setIsExistingContact(true);
      setView('form');
      setActiveMenuId(null);
    }
  };

  const handleToggleStatus = (id: number) => {
    const contato = contatos.find(c => c.id === id);
    if (contato) {
      updateContato(id, { ...contato, active: contato.active === false ? true : false });
      setToastMessage(`Contato ${contato.active === false ? 'reativado' : 'inativado'} com sucesso.`);
      setTimeout(() => setToastMessage(''), 3000);
      setActiveMenuId(null);
    }
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.name.trim()) {
      setToastMessage('O campo Nome Completo é obrigatório.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (!formData.responsibles || formData.responsibles.length === 0) {
      setToastMessage('É necessário adicionar pelo menos um responsável.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (isExistingContact) {
      updateContato(formData.id, formData);
      setToastMessage('Contato atualizado com sucesso!');
    } else {
      addContato(formData);
      setToastMessage('Contato salvo com sucesso!');
    }
    
    setTimeout(() => {
      setToastMessage('');
      setView('list');
    }, 2000);
  };

  const onSaveResponsibleModal = (responsible: any) => {
    if (!responsible.nome || !responsible.nome.trim() || !responsible.tratamento || !responsible.tratamento.trim() || !responsible.cargo || !responsible.cargo.trim()) {
      setToastMessage('Os campos Nome, Tratamento e Cargo/Posição são obrigatórios.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    const existingIndex = (formData.responsibles || []).findIndex((r: any) => r.id === responsible.id);
    let newResponsibles = [...(formData.responsibles || [])];
    
    if (existingIndex >= 0) {
      newResponsibles[existingIndex] = responsible;
    } else {
      newResponsibles.push(responsible);
    }

    setFormData({ ...formData, responsibles: newResponsibles });
    setIsResponsibleModalOpen(false);
    setToastMessage('Responsável salvo com sucesso!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentView="contatos" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {view === 'list' && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contatos</h1>
                  <p className="text-sm text-slate-500 mt-1">Gerencie os contatos para envio de ofícios.</p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <Button onClick={handleNewContact}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Contato
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <Input
                      icon={<Search className="w-4 h-4" />}
                      placeholder="Buscar por nome ou e-mail..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 font-medium">Nome</th>
                        <th className="px-6 py-4 font-medium">Tipo</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {paginatedContatos.map((contato) => (
                        <tr 
                          key={contato.id} 
                          className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${activeMenuId === contato.id ? 'bg-emerald-50/50' : ''}`}
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuPosition({ x: e.clientX, y: rect.bottom });
                            setActiveMenuId(contato.id);
                          }}
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900">{contato.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={contato.type === 'PJ' ? 'info' : 'secondary'}>
                              {contato.type === 'PJ' ? (
                                <Building2 className="w-3.5 h-3.5 mr-1" />
                              ) : (
                                <User className="w-3.5 h-3.5 mr-1" />
                              )}
                              {contato.type === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={contato.active !== false ? 'success' : 'secondary'}>
                              {contato.active !== false ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {paginatedContatos.length === 0 && (
                        <tr>
                          <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                            Nenhum contato encontrado.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {filteredContatos.length > itemsPerPage && (
                  <div className="px-4 sm:px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
                    <span className="text-sm text-slate-500 text-center sm:text-left">
                      Mostrando <span className="font-medium text-slate-900">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredContatos.length)}</span> de <span className="font-medium text-slate-900">{filteredContatos.length}</span> resultados
                    </span>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="secondary"
                        size="icon"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-500" />
                      </Button>
                      <span className="text-sm font-medium text-slate-700 px-2">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button 
                        variant="secondary"
                        size="icon"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {view === 'form' && formData && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setView('list');
                      setActiveMenuId(null);
                    }}
                    className="rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <h2 className="text-lg font-bold text-slate-900">
                    {isExistingContact ? 'Editar Contato' : 'Novo Contato'}
                  </h2>
                </div>
              </div>
              <form onSubmit={handleSaveContact} className="p-6 space-y-8">
                {/* Status and Tipo */}
                <div className="flex flex-col md:flex-row items-start justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-900">Status do Contato</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Define se o contato está disponível para uso</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.active !== false}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 peer-disabled:bg-emerald-400"></div>
                    <span className="ml-3 text-sm font-medium text-slate-700">
                      {formData.active !== false ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Dados Gerais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-12">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Contato</label>
                      <div className={`flex p-1 bg-slate-100 rounded-xl w-fit ${isExistingContact ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        <button
                          type="button"
                          onClick={() => !isExistingContact && setFormData({...formData, type: 'PF'})}
                          disabled={isExistingContact}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            formData.type === 'PF' 
                              ? 'bg-white text-emerald-700 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700'
                          } ${isExistingContact ? 'cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Pessoa Física (PF)
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => !isExistingContact && setFormData({...formData, type: 'PJ'})}
                          disabled={isExistingContact}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            formData.type === 'PJ' 
                              ? 'bg-white text-blue-700 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700'
                          } ${isExistingContact ? 'cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-2" />
                            Pessoa Jurídica (PJ)
                          </div>
                        </button>
                      </div>
                      {isExistingContact && (
                        <p className="text-xs text-slate-500 mt-2">
                          O tipo de contato não pode ser alterado após o cadastro.
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {formData.type === 'PJ' ? 'CNPJ' : 'CPF'}
                      </label>
                      <Input 
                        type="text" 
                        value={formData.document}
                        onChange={e => setFormData({...formData, document: e.target.value})}
                        placeholder={formData.type === 'PJ' ? '00.000.000/0001-00' : '000.000.000-00'}
                      />
                    </div>
                    
                    <div className="md:col-span-8">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        {formData.type === 'PJ' ? 'Razão Social' : 'Nome Completo'} <span className="text-rose-500">*</span>
                      </label>
                      <Input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                      <Input 
                        type="text" 
                        value={formData.cep || ''}
                        onChange={e => setFormData({...formData, cep: e.target.value})}
                        placeholder="00000-000"
                      />
                    </div>
                    <div className="md:col-span-7">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Logradouro</label>
                      <Input 
                        type="text" 
                        value={formData.logradouro || ''}
                        onChange={e => setFormData({...formData, logradouro: e.target.value})}
                        placeholder="Rua, Avenida, etc."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Número</label>
                      <Input 
                        type="text" 
                        value={formData.numero || ''}
                        onChange={e => setFormData({...formData, numero: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
                      <Input 
                        type="text" 
                        value={formData.bairro || ''}
                        onChange={e => setFormData({...formData, bairro: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                      <Input 
                        type="text" 
                        value={formData.cidade || ''}
                        onChange={e => setFormData({...formData, cidade: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                      <Input 
                        type="text" 
                        value={formData.estado || ''}
                        onChange={e => setFormData({...formData, estado: e.target.value})}
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
                            <th className="px-4 py-3 font-medium text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {(formData.responsibles || [])
                            .slice((responsiblePage - 1) * responsiblesPerPage, responsiblePage * responsiblesPerPage)
                            .map((resp: any) => (
                            <tr key={resp.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 text-slate-600">{resp.tratamento || '-'}</td>
                              <td className="px-4 py-3 font-medium text-slate-900">{resp.nome}</td>
                              <td className="px-4 py-3 text-slate-600">{resp.email || '-'}</td>
                              <td className="px-4 py-3 text-slate-600">{resp.cargo || '-'}</td>
                              <td className="px-4 py-3 text-slate-600">{resp.departamento || '-'}</td>
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
                          {(!formData.responsibles || formData.responsibles.length === 0) && (
                            <tr>
                              <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Nenhum responsável adicionado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    {formData.responsibles && formData.responsibles.length > responsiblesPerPage && (
                      <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                        <span className="text-xs text-slate-500">
                          Mostrando {((responsiblePage - 1) * responsiblesPerPage) + 1} a {Math.min(responsiblePage * responsiblesPerPage, formData.responsibles.length)} de {formData.responsibles.length}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setResponsiblePage(Math.max(1, responsiblePage - 1))}
                            disabled={responsiblePage === 1}
                            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setResponsiblePage(Math.min(Math.ceil(formData.responsibles.length / responsiblesPerPage), responsiblePage + 1))}
                            disabled={responsiblePage === Math.ceil(formData.responsibles.length / responsiblesPerPage)}
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
            </div>
          )}
        </main>
      </div>

      {/* Context Menu */}
      {activeMenuId && menuPosition && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/20 sm:bg-transparent transition-opacity" onClick={() => setActiveMenuId(null)} />
          
          {/* Desktop Context Menu */}
          <div 
            className="hidden sm:block fixed z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[180px] overflow-hidden animate-in fade-in zoom-in-95 duration-100"
            style={{ 
              top: Math.min(menuPosition.y, window.innerHeight - 150), 
              left: Math.min(menuPosition.x, window.innerWidth - 200) 
            }}
          >
            <div className="flex flex-col">
              <button
                onClick={handleEditContact}
                className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors w-full text-left"
              >
                <Edit className="w-4 h-4 mr-3" />
                Editar Contato
              </button>
            </div>
          </div>

          {/* Mobile Bottom Sheet Context Menu */}
          <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 pb-safe animate-in slide-in-from-bottom-full duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-4" />
            <div className="px-4 pb-6">
              {(() => {
                const activeContact = contatos.find(c => c.id === activeMenuId);
                if (!activeContact) return null;

                return (
                  <div className="flex flex-col space-y-2">
                    <div className="mb-2 px-2">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Opções do Contato</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{activeContact.name}</p>
                    </div>
                    
                    <button
                      onClick={handleEditContact}
                      className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors w-full text-left"
                    >
                      <Edit className="w-5 h-5 mr-3 text-slate-400" />
                      Editar Contato
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      {/* Modal de Responsável */}
      <ContatoResponsibleModal
        isOpen={isResponsibleModalOpen}
        onClose={() => setIsResponsibleModalOpen(false)}
        responsible={currentResponsible}
        onSave={onSaveResponsibleModal}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mr-3" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
