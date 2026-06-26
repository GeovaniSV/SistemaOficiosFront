import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

export function useProfile() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () =>
      api.get(`/api/auth/me`).then((res) => res.data.data ?? res.data),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/api/auth/logout`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["user", "me"] }),
  });
}

function adaptUsuario(apiUser: any) {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    cpf: apiUser.cpf ?? "",
    role: apiUser.roles?.[0]?.name ?? "",
    cargo: apiUser.position?.name ?? "",
    position_id: apiUser.position_id ?? null,
    status: apiUser.is_active ? "Ativo" : "Inativo",
    lastLogin: apiUser.last_login
      ? new Date(apiUser.last_login).toLocaleString("pt-BR")
      : "Nunca",
  };
}

// GET
export function useUsuarios() {
  return useQuery({
    queryKey: ["usuarios"],
    queryFn: () =>
      api.get("/api/users").then((res) => {
        const data = res.data.data ?? res.data;
        return data.map(adaptUsuario);
      }),
  });
}

// POST
export function useAddUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      name: string;
      email: string;
      password: string;
      cpf?: string;
      role?: string;
      position_id?: number;
    }) => api.post("/api/users", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

// PUT
export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      name?: string;
      email?: string;
      cpf?: string;
      role?: string;
      position_id?: number;
    }) => api.put(`/api/users/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

// DELETE (soft delete -> is_active = false)
export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/users/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}

// PATCH restore (-> is_active = true)
export function useRestoreUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch(`/api/users/${id}/restore`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["usuarios"] }),
  });
}
