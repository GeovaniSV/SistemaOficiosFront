/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Oficios from './components/Oficios';
import NovoOficio from './components/NovoOficio';
import Usuarios from './components/Usuarios';
import Contatos from './components/Contatos';
import Templates from './components/Templates';
import Configuracoes from './components/Configuracoes';
import Papeis from './components/Papeis';
import Cargos from './components/Cargos';
import MeuPerfil from './components/MeuPerfil';
import Validacao from './components/Validacao';
import ArquivarOficio from './components/ArquivarOficio';

type ViewState = 'login' | 'forgotPassword' | 'oficios' | 'novoOficio' | 'arquivarOficio' | 'usuarios' | 'contatos' | 'templates' | 'configuracoes' | 'papeis' | 'cargos' | 'meuPerfil' | 'validacao';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('login');

  useEffect(() => {
    if (window.location.pathname.startsWith('/validacao/')) {
      setCurrentView('validacao');
    } else if (window.location.pathname.startsWith('/oficios/')) {
      setCurrentView('oficios');
    }
  }, []);

  return (
    <>
      {currentView === 'validacao' && (
        <Validacao />
      )}
      {currentView === 'oficios' && (
        <Oficios 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'novoOficio' && (
        <NovoOficio 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'arquivarOficio' && (
        <ArquivarOficio 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'usuarios' && (
        <Usuarios 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'papeis' && (
        <Papeis 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'cargos' && (
        <Cargos 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'contatos' && (
        <Contatos 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'templates' && (
        <Templates 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'configuracoes' && (
        <Configuracoes 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'meuPerfil' && (
        <MeuPerfil 
          onLogout={() => setCurrentView('login')} 
          onNavigate={setCurrentView} 
        />
      )}
      {currentView === 'login' && (
        <Login 
          onLogin={() => setCurrentView('oficios')} 
          onForgotPassword={() => setCurrentView('forgotPassword')} 
        />
      )}
      {currentView === 'forgotPassword' && (
        <ForgotPassword onBackToLogin={() => setCurrentView('login')} />
      )}
    </>
  );
}
