import React from 'react';

export function DocumentHeader() {
  const cabecalhoText = localStorage.getItem('oficioCabecalho') || 'Ordem dos Advogados do Brasil\nSeccional Mato Grosso\n6ª Subseção - Sinop';
  const lines = cabecalhoText.split('\n');

  return (
    <div className="flex flex-col items-center justify-center border-b-2 border-slate-800 pb-6 mb-8 text-center">
      {/* Logo */}
      <img 
        src="https://www.oabsinop.com.br/images/logo-oabsinop-40anos.png" 
        alt="Logo OAB" 
        className="w-16 h-16 mb-4 object-contain"
        referrerPolicy="no-referrer"
      />
      {lines.map((line, index) => {
        if (index === 0) {
          return <h1 key={index} className="text-lg font-bold text-slate-900 uppercase tracking-wide">{line}</h1>;
        } else if (index === 1) {
          return <h2 key={index} className="text-base font-semibold text-slate-800 uppercase mt-1">{line}</h2>;
        } else {
          return <h3 key={index} className="text-sm font-medium text-slate-700 uppercase mt-1">{line}</h3>;
        }
      })}
    </div>
  );
}

export function DocumentFooter() {
  const rodapeText = localStorage.getItem('oficioRodape') || 'OAB Mato Grosso 6ª subseção - Sinop';
  const lines = rodapeText.split('\n');

  return (
    <div className="border-t border-slate-800 pt-6 mt-12 flex flex-col items-center text-center text-xs text-slate-600 leading-relaxed">
      <img 
        src="https://www.oabsinop.com.br/images/logo-oabsinop-40anos.png" 
        alt="Logo OAB" 
        className="w-12 h-12 mb-3 object-contain"
        referrerPolicy="no-referrer"
      />
      {lines.map((line, index) => (
        <p key={index} className="font-bold uppercase text-slate-800 text-sm">{line}</p>
      ))}
    </div>
  );
}
