import React, { useState } from 'react';
import { FileText, CheckCircle2, Clock, Send, Plus, MoreVertical, ArrowRight } from 'lucide-react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppStore } from '../store/useAppStore';

const statusStyles: Record<string, string> = {
  'Pendente': 'bg-amber-50 text-amber-700 border-amber-200',
  'Aprovado': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Enviado': 'bg-blue-50 text-blue-700 border-blue-200',
  'Rascunho': 'bg-slate-100 text-slate-700 border-slate-200',
};

const statusDotStyles: Record<string, string> = {
  'Pendente': 'bg-amber-500',
  'Aprovado': 'bg-emerald-500',
  'Enviado': 'bg-blue-500',
  'Rascunho': 'bg-slate-400',
};

const formatOficioNumber = (id: string) => {
  const format = localStorage.getItem('formatoNumeracao') || 'SEQUENCIAL/ANO';
  const match = id.match(/OF-(\d{4})\/(\d{3})/);
  if (match) {
    const ano = match[1];
    const seq = match[2];
    if (format === 'ANO-SEQUENCIAL') return `${ano}-${seq}`;
    if (format === 'SEQUENCIAL') return seq;
    return `${seq}/${ano}`;
  }
  return id;
};

export default function Dashboard({ 
  onLogout, 
  onNavigate 
}: { 
  onLogout: () => void;
  onNavigate: (view: string) => void;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const globalOficios = useAppStore(state => state.oficios);

  // Dynamic stats
  const pendentes = globalOficios.filter(o => o.status === 'Pendente').length;
  const aprovados = globalOficios.filter(o => o.status === 'Aprovado').length;
  const enviados = globalOficios.filter(o => o.status === 'Enviado').length;

  const stats = [
    { name: 'Total de Ofícios', value: globalOficios.length.toString(), icon: FileText, change: '+12%', changeType: 'positive' },
    { name: 'Aguardando Assinatura', value: pendentes.toString(), icon: Clock, change: '-2%', changeType: 'negative' },
    { name: 'Enviados (Mês)', value: enviados.toString(), icon: Send, change: '+24%', changeType: 'positive' },
    { name: 'Aprovados', value: aprovados.toString(), icon: CheckCircle2, change: '+8%', changeType: 'positive' },
  ];

  // Pick top 5 most recent
  const recentOficios = globalOficios.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <Sidebar 
        currentView="dashboard" 
        onNavigate={onNavigate} 
        onLogout={onLogout} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} onNavigate={onNavigate} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-1">Visão geral do sistema de ofícios.</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => {
                  localStorage.removeItem('editOficioId');
                  localStorage.removeItem('editOficioRejectionInfo');
                  onNavigate('novoOficio');
                }}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Ofício
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <stat.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    stat.changeType === 'positive' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-500">{stat.name}</h3>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-slate-200">
              <h2 className="text-base font-semibold text-slate-900">Ofícios Recentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Número</th>
                    <th className="px-6 py-4 font-medium">Assunto</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Departamento</th>
                    <th className="px-6 py-4 font-medium hidden sm:table-cell">Data</th>
                    <th className="px-6 py-4 font-medium hidden sm:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentOficios.map((oficio) => (
                    <tr key={oficio.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 sm:hidden ${statusDotStyles[oficio.status]}`} title={oficio.status}></span>
                          {oficio.status === 'Aprovado' ? formatOficioNumber(oficio.id) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{oficio.subject}</td>
                      <td className="px-6 py-4 text-slate-500 hidden md:table-cell">{oficio.department}</td>
                      <td className="px-6 py-4 text-slate-500 hidden sm:table-cell">{oficio.date}</td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[oficio.status]}`}>
                          {oficio.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-center">
              <button 
                onClick={() => onNavigate('oficios')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex items-center"
              >
                Ver todos os ofícios
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
