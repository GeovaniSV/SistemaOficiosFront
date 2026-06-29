import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

function adaptCargo(apiPosition: any) {
  return {
    id: apiPosition.id,
    name: apiPosition.name,
    description: apiPosition.description ?? "",
    status: apiPosition.is_active ? "ativo" : "inativo",
  };
}

// GET
export function useCargos() {
  return useQuery({
    queryKey: ["cargos"],
    queryFn: () =>
      api.get("/api/positions").then((res) => {
        const data = res.data.data ?? res.data;
        return data.map(adaptCargo);
      }),
  });
}

export function useCargoByID(id: number) {
  return useQuery({
    queryKey: ["cargo", id],
    queryFn: () =>
      api.get(`/api/positions/${id}`).then((res) => {
        const data = res.data.data ?? res.data;

        return adaptCargo(data);
      }),
  });
}

// POST
export function useAddCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cargo: {
      name: string;
      description?: string;
      is_active?: boolean;
    }) => api.post("/api/positions", cargo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cargos"] }),
  });
}

// PUT
export function useUpdateCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      name?: string;
      description?: string;
      is_active?: boolean;
    }) => api.put(`/api/positions/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cargos"] }),
  });
}

// DELETE
export function useDeleteCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/positions/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cargos"] }),
  });
}
