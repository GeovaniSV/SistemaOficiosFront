import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, CheckCircle2, Info, FileText } from 'lucide-react';

export default function Header({ onMenuClick, onNavigate }: { onMenuClick?: () => void, onNavigate?: (view: string) => void }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mockNotifications = [
    { id: 1, title: 'Ofício Pendente', message: 'O ofício OF-2026/001 aguarda sua aprovação.', time: 'Há 10 min', unread: true, type: 'pending' },
    { id: 2, title: 'Ofício Pendente', message: 'O ofício OF-2026/006 aguarda sua aprovação.', time: 'Há 1 hora', unread: true, type: 'pending' },
    { id: 3, title: 'Ofício Pendente', message: 'O ofício OF-2026/009 aguarda sua aprovação.', time: 'Há 3 horas', unread: false, type: 'pending' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    localStorage.setItem('oficiosInitialFilter', 'pendente');
    if (onNavigate) {
      onNavigate('oficios');
    }
    window.dispatchEvent(new Event('oficiosFilterChanged'));
    setIsNotificationsOpen(false);
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {isNotificationsOpen && (
            <div className="fixed top-[72px] left-4 right-4 sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 sm:origin-top-right">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Notificações</h3>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">2 novas</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={handleNotificationClick}
                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 ${notif.unread ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="mt-0.5">
                      <FileText className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${notif.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                    </div>
                    {notif.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 text-center">
                <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                  Marcar todas como lidas
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div 
          className="flex items-center space-x-3 border-l border-slate-200 pl-4 ml-2 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors"
          onClick={() => onNavigate && onNavigate('meuPerfil')}
        >
          <img
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
            src="https://picsum.photos/seed/user/100/100"
            alt="User avatar"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700">João Silva</p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
}
