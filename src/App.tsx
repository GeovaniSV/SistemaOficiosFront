/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Oficios from "./components/Oficios";
import NovoOficio from "./components/NovoOficio";
import Usuarios from "./components/Usuarios";
import Contatos from "./components/Contatos";
import Templates from "./components/Templates";
import Configuracoes from "./components/Configuracoes";
import Papeis from "./components/Papeis";
import Cargos from "./components/Cargos";
import MeuPerfil from "./components/MeuPerfil";
import Validacao from "./components/Validacao";
import ArquivarOficio from "./components/ArquivarOficio";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/validacao/:token" element={<Validacao />} />

        {/* Rotas protegidas */}
        <Route path="/oficios" element={<Oficios />} />
        <Route path="/oficios/novo" element={<NovoOficio />} />
        <Route path="/oficios/arquivar" element={<ArquivarOficio />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/contatos" element={<Contatos />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/papeis" element={<Papeis />} />
        <Route path="/cargos" element={<Cargos />} />
        <Route path="/meu-perfil" element={<MeuPerfil />} />
        {/* ... */}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
