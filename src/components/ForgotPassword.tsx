import React, { useState } from 'react';
import { Mail, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
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

          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Recuperar senha</h2>
              <p className="mt-2 text-sm text-slate-500">
                Digite seu email e enviaremos instruções para redefinir sua senha.
              </p>

              <div className="mt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors sm:text-sm"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    Enviar instruções
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="text-center sm:text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mx-auto sm:mx-0 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Email enviado!</h2>
              <p className="mt-2 text-sm text-slate-500">
                Enviamos um link de recuperação para <span className="font-medium text-slate-900">{email}</span>. Verifique sua caixa de entrada e a pasta de spam.
              </p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={onBackToLogin}
              className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </button>
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
