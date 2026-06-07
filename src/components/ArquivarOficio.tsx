import React, { useState, useRef } from 'react';
import { ArrowLeft, Save, Upload, FileText, X, CheckCircle2, Search, Building2, User } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { useAppStore } from '../store/useAppStore';
import { mockDestinatarios } from '../data/mockOficios';

export default function ArquivarOficio({ 
  onLogout, 
  onNavigate 
}: { 
  onLogout: () => void;
  onNavigate: (view: string) => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const addOficioRecebido = useAppStore(state => state.addOficioRecebido);
  const contatos = useAppStore(state => state.contatos);
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    externalNumber: '',
  });

  const [senderSearch, setSenderSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSender, setSelectedSender] = useState<any>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, envie apenas arquivos PDF.');
        return;
      }
      setPdfFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const senderName = selectedSender ? `${selectedSender.responsibleName} (${selectedSender.name}${selectedSender.subArea ? ` - ${selectedSender.subArea}` : ''})` : senderSearch;

    if (!senderName || !formData.subject || !pdfFile) {
      alert('Preencha quem enviou, o assunto e anexe o arquivo PDF.');
      return;
    }

    addOficioRecebido({
      subject: formData.subject,
      department: 'Arquivamento',
      author: 'Seu Nome / Autor', // Pode ser ajustado conforme a sessão
      status: 'Aprovado', // Ofícios recebidos já vêm finalizados/aprovados geralmente
      destinatarios: [],
      // external specific fields
      externalNumber: formData.externalNumber,
      sender: senderName,
      description: formData.description,
      fileData: pdfBase64,
      fileName: pdfFile.name,
    });

    setToastMessage('Ofício arquivado com sucesso!');
    setTimeout(() => {
      setToastMessage('');
      onNavigate('oficios');
    }, 2000);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentView="oficios" 
        onNavigate={onNavigate} 
        onLogout={onLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto w-full relative">
          {toastMessage && (
            <div className="fixed top-4 right-4 z-50 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-lg shadow-lg flex items-center animate-in fade-in slide-in-from-top-4">
              <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-500" />
              <div className="font-medium">{toastMessage}</div>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <button 
                  onClick={() => onNavigate('oficios')}
                  className="mr-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Arquivar Ofício Externo</h1>
                  <p className="text-sm text-slate-500 mt-1">Registre um ofício recebido de outra instituição.</p>
                </div>
              </div>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar e Arquivar
              </Button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Instituição / Remetente <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      icon={<Search className="w-4 h-4" />}
                      placeholder="Buscar Instituição/Remetente..."
                      autoComplete="off"
                      value={selectedSender ? `${selectedSender.responsibleName} (${selectedSender.name}${selectedSender.subArea ? ` - ${selectedSender.subArea}` : ''})` : senderSearch}
                      onChange={(e) => {
                        setSenderSearch(e.target.value);
                        setSelectedSender(null);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                    />
                    {isDropdownOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                        <ul className="max-h-60 overflow-y-auto py-1">
                          {mockDestinatarios.filter(c => 
                            (!selectedSender || selectedSender.id !== c.id) &&
                            (c.name.toLowerCase().includes(senderSearch.toLowerCase()) || 
                             (c.subArea && c.subArea.toLowerCase().includes(senderSearch.toLowerCase())) ||
                             (c.responsibleName && c.responsibleName.toLowerCase().includes(senderSearch.toLowerCase())))
                          ).map((contato: any) => (
                            <li 
                              key={contato.id}
                              onClick={() => {
                                setSelectedSender(contato);
                                setSenderSearch('');
                                setIsDropdownOpen(false);
                              }}
                              className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center">
                                {contato.type === 'PJ' ? (
                                  <Building2 className="h-4 w-4 text-slate-400 mr-3 group-hover:text-emerald-500" />
                                ) : (
                                  <User className="h-4 w-4 text-slate-400 mr-3 group-hover:text-emerald-500" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{contato.responsibleName}</p>
                                  <p className="text-xs text-slate-500">{contato.name}{contato.subArea ? ` - ${contato.subArea}` : ''}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {contato.type}
                              </span>
                            </li>
                          ))}
                          {mockDestinatarios.filter(c => 
                            (!selectedSender || selectedSender.id !== c.id) &&
                            (c.name.toLowerCase().includes(senderSearch.toLowerCase()) || 
                             (c.subArea && c.subArea.toLowerCase().includes(senderSearch.toLowerCase())) ||
                             (c.responsibleName && c.responsibleName.toLowerCase().includes(senderSearch.toLowerCase())))
                          ).length === 0 && (
                            <li className="px-4 py-8 text-center text-sm text-slate-500">
                              Nenhum remetente encontrado. Você pode manter o texto livre digitado.
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Assunto Principal <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="Ex: Convite para evento solidário"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Número do Ofício (Opcional)
                    </label>
                    <Input 
                      placeholder="Ex: 042/2026"
                      value={formData.externalNumber}
                      onChange={(e) => setFormData({...formData, externalNumber: e.target.value})}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Breve Descrição
                    </label>
                    <Textarea 
                      rows={3}
                      placeholder="Adicione observações adicionais sobre o ofício recebido..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-lg font-medium text-slate-900 mb-4">Arquivo Digital (PDF)</h4>
                  
                  {!pdfFile ? (
                    <div 
                      className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <h5 className="font-medium text-slate-900 mb-1">Clique para fazer upload</h5>
                      <p className="text-sm text-slate-500">Selecione o arquivo PDF escaneado ou original</p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{pdfFile.name}</p>
                          <p className="text-sm text-slate-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null);
                          setPdfBase64('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
