import { useState } from 'react';
import { FileText, LayoutDashboard, Users, Settings, LogOut, X, ChevronDown, ChevronRight, UserPlus } from 'lucide-react';

const navigation = [
  { name: 'Ofícios', id: 'oficios', icon: FileText },
  { name: 'Contatos', id: 'contatos', icon: Users },
  { 
    name: 'Cadastro', 
    id: 'cadastro', 
    icon: UserPlus,
    children: [
      { name: 'Usuários', id: 'usuarios' },
      { name: 'Papéis', id: 'papeis' },
      { name: 'Cargos', id: 'cargos' },
      { name: 'Template de Ofício', id: 'templates' }
    ]
  },
  { name: 'Configurações', id: 'configuracoes', icon: Settings },
];

export default function Sidebar({ 
  currentView, 
  onNavigate, 
  onLogout,
  isOpen,
  onClose
}: { 
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    cadastro: currentView === 'usuarios' || currentView === 'templates' || currentView === 'papeis' || currentView === 'cargos'
  });

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col h-screen ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 mr-3">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">OfícioPro</span>
          </div>
          {isOpen && (
            <button onClick={onClose} className="md:hidden p-2 -mr-2 text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        <div>
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Principal</p>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isCurrent = currentView === item.id;
              const hasChildren = !!item.children;
              const isExpanded = expandedMenus[item.id];
              const isChildActive = hasChildren && item.children?.some(child => child.id === currentView);

              return (
                <div key={item.name} className="flex flex-col">
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleMenu(item.id);
                      } else {
                        onNavigate(item.id);
                        if (onClose) onClose();
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group ${
                      isCurrent || isChildActive
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className={`mr-3 h-[18px] w-[18px] transition-colors ${isCurrent || isChildActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      {item.name}
                    </div>
                    {hasChildren && (
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-slate-400' : 'text-slate-300 group-hover:text-slate-400'}`} />
                    )}
                  </button>
                  
                  {hasChildren && (
                    <div 
                      className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-64 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="ml-5 pl-4 border-l border-slate-100 space-y-1 py-1 relative">
                        {item.children?.map(child => {
                          const isChildCurrent = currentView === child.id;
                          return (
                            <button
                              key={child.name}
                              onClick={() => {
                                onNavigate(child.id);
                                if (onClose) onClose();
                              }}
                              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group ${
                                isChildCurrent
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              <div className={`absolute -left-[3px] w-1.5 h-1.5 rounded-full transition-colors ${
                                isChildCurrent ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-slate-300'
                              }`} />
                              {child.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={onLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 cursor-pointer group"
        >
          <LogOut className="mr-3 h-[18px] w-[18px] text-slate-400 group-hover:text-slate-600 transition-colors" />
          Sair
        </button>
      </div>
      </div>
    </>
  );
}
