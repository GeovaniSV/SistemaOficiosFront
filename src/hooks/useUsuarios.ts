import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Usuario {
  id: number;
  name: string;
  email: string;
  cpf: string | null;
  is_active: boolean;
  last_login: string | null;
  roles: { name: string }[];
}

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// GET 
export function useUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: () =>
      api
        .get("/api/users", { headers: getHeaders() })
        .then((res) => res.data.data ?? res.data),
  });
}

// GET - 
export function useUsuario(id: number) {
  return useQuery<Usuario>({
    queryKey: ["usuario", id],
    queryFn: () =>
      api
        .get(`/api/users/${id}`, { headers: getHeaders() })
        .then((res) => res.data.data ?? res.data),
  });
}

// POST 
export function useCreateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (usuario: {
      name: string;
      email: string;
      cpf: string;
      role: string;
      password: string;
    }) => api.post("/api/users", usuario, { headers: getHeaders() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

// PUT 
export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...usuario
    }: {
      id: number;
      name: string;
      email: string;
      role: string;
      password?: string;
    }) => api.put(`/api/users/${id}`, usuario, { headers: getHeaders() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

// DELETE 
export function useDesativarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/api/users/${id}`, { headers: getHeaders() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

// PATCH - 
export function useReativarUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.patch(`/api/users/${id}/restore`, {}, { headers: getHeaders() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}
