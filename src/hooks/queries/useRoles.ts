import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

function adaptRole(apiRole: any) {
  return {
    id: apiRole.id,
    name: apiRole.name,
    description: apiRole.description ?? "",
    status: apiRole.status ?? "Ativo",
    permissions: (apiRole.permissions ?? []).map((p: any) => p.name),
  };
}

// GET
export function useRoles() {
  return useQuery({
    queryKey: ["papeis"],
    queryFn: () =>
      api.get("/api/roles").then((res) => {
        const data = res.data.data ?? res.data;
        return data.map(adaptRole);
      }),
  });
}

// POST
export function useAddRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      name: string;
      description: string;
      status: string;
      permissions: string[];
    }) => api.post("/api/roles", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["papeis"] }),
  });
}

// PUT
export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      name: string;
      description: string;
      status: string;
      permissions: string[];
    }) => api.put(`/api/roles/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["papeis"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
