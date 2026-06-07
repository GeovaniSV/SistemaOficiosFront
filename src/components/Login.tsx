import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

export default function Login({ onLogin, onForgotPassword }: { onLogin: () => void, onForgotPassword: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">OfícioPro</span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Bem-vindo de volta</h2>
          <p className="mt-2 text-sm text-slate-500">
            Acesse sua conta para gerenciar seus ofícios.
          </p>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  icon={<Mail className="w-4 h-4 text-slate-400" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700" htmlFor="password">Senha</label>
                  <button 
                    type="button" 
                    onClick={onForgotPassword}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  icon={<Lock className="w-4 h-4 text-slate-400" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
              >
                Entrar no sistema
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Office background"
        />
        <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
      </div>
    </div>
  );
}
