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
import ContatosListPage from "./pages/Contatos/ContatosListPage.tsx";
import ContatosEditPage from "./pages/Contatos/ContatosEditPage.tsx";
import ContatosCreatePage from "./pages/Contatos/ContatoCreatePage.tsx";
import AppLayout from "./AppLayout.tsx";

const router = createBrowserRouter([
  { path: "*", element: <Navigate to="/login" /> },
  { path: "/login", element: <Login /> },
  { path: "/oficios", element: <Oficios /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/contatos/", element: <ContatosListPage /> },
      { path: "/contatos/:id", element: <ContatosEditPage /> },
      { path: "/contatos/criar", element: <ContatosCreatePage /> },
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
