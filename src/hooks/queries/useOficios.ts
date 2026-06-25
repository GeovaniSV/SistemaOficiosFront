// src/hooks/queries/useOficios.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { OficioType, PaginatedOficiosType } from "@/src/types/oficio";

export function useOficios(page: number = 1) {
  return useQuery({
    queryKey: ["oficios", page],
    queryFn: () =>
      api.get(`/api/oficios?page=${page}`).then((res) => res.data.data),
  });
}

export function useOficio(id: number, p0?: { enabled: boolean }) {
  return useQuery<OficioType>({
    queryKey: ["oficio", id],
    queryFn: () =>
      api.get(`/api/oficios/${id}`).then((res) => res.data.data ?? res.data),
    enabled: p0?.enabled ?? (!!id && !isNaN(id)),
  });
}

// POST
export function useAddOficio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (oficio: any) => {
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
    mutationFn: ({ id, oficio }: { id: number; oficio: any }) =>
      api.put(`/api/oficios/${id}`, oficio),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["oficios"] }),
  });
}

export function useReviewOficio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      api.post(`/api/oficios/${id}/review`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["oficios"] }),
  });
}

export function useSendOficio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number }) => api.post(`/api/oficios/${id}/send`),
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

// useOficios.ts (query)
export function useDownloadOficioPdf() {
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const response = await api.get(`/api/messages/${id}/pdf`, {
        responseType: "blob", // importante para arquivos binários
      });
      return response.data;
    },
  });
}
