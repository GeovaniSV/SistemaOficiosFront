// src/hooks/queries/useOficios.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

export function useOficios() {
  return useQuery({
    queryKey: ["oficios"],
    queryFn: () =>
      api.get("/api/oficios").then((res) => res.data.data ?? res.data),
  });
}

export function useOficio(id: number) {
  return useQuery({
    queryKey: ["oficio"],
    queryFn: () =>
      api.get(`/api/oficios/${id}`).then((res) => res.data.data ?? res.data),
  });
}

// POST
export function useAddOficio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (oficio: any) => {
      console.log(oficio);
      return api.post("/api/oficios", oficio);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["oficios"] }),
  });
}

export function useUpdateOficioStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, rejectionInfo }: any) =>
      api.patch(`/api/oficios/${id}/status`, { status, rejectionInfo }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["oficios"] }),
  });
}

// PUT
export function useUpdateOficio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...oficio }: any) =>
      api.put(`/api/oficios/${id}`, oficio),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["oficios"] }),
  });
}

// DELETE
export function useDeleteOficio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/oficios/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["oficios"] }),
  });
}
