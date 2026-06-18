import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

import Login from "./components/Login.tsx";
import Oficios from "./components/Oficios.tsx";
import ListContatos from "./pages/Contatos/ListContatos.tsx";
import EditContato from "./pages/Contatos/EditContato.tsx";
import CreateContato from "./pages/Contatos/CreateContato.tsx";
import AppLayout from "./AppLayout.tsx";
import CreateOficios from "./pages/Oficios/CreateOficios.tsx";
import ListOficios from "./pages/Oficios/ListOficios.tsx";
import MeuPerfil from "./pages/Users/ProfilePage.tsx";
import EditOficios from "./pages/Oficios/EditOficios.tsx";

const router = createBrowserRouter([
  { path: "*", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  // { path: "/oficios", element: <Oficios /> },
  {
    element: <AppLayout />,
    children: [
      //Contatos
      { path: "/contatos/", element: <ListContatos /> },
      { path: "/contatos/:id", element: <EditContato /> },
      { path: "/contatos/criar", element: <CreateContato /> },

      //Oficios
      { path: "/oficios", element: <ListOficios /> },
      { path: "/oficios/criar", element: <CreateOficios /> },
      { path: "/oficios/:id", element: <EditOficios /> },

      //Users
      { path: "/perfil", element: <MeuPerfil /> },
    ],
  },
]);

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
